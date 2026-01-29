'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { imageUploadSchema, getFirstZodError } from '@/lib/validation/schemas';
import { warn, error as logError } from '@/lib/logger';

type Photo = {
  id: string;
  photo_url: string | null;
  storage_path: string | null;
  bucket_id: string | null;
  display_order: number;
};

type Property = {
  id: string;
  property_photos?: Photo[];
};

export default function EditPropertyClient({
  initialProperty,
}: {
  initialProperty: Property;
}) {
  const supabase = createClient();
  const router = useRouter();

  const propertyId = initialProperty?.id;

  const [photos, setPhotos] = useState<Photo[]>(
    (initialProperty?.property_photos ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
  );
  const [uploading, setUploading] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const resolvePhotoUrl = (photo: Photo) => {
    if (photo.photo_url) return photo.photo_url;

    if (!photo.storage_path) return '';
    const bucket = photo.bucket_id ?? 'property-images';
    const { data } = supabase.storage.from(bucket).getPublicUrl(photo.storage_path);
    return data?.publicUrl ?? '';
  };

  const photosForUI = useMemo(() => {
    return (photos ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => ({
        ...p,
        url: resolvePhotoUrl(p),
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  const getCoverUrl = (photo: Photo) => {
    if (photo.photo_url) return photo.photo_url;
    return resolvePhotoUrl(photo);
  };

  const setCoverToFirstPhoto = async (nextPhotos: Photo[]) => {
    const sorted = nextPhotos.slice().sort((a, b) => a.display_order - b.display_order);
    const first = sorted[0];

    const coverUrl = first ? getCoverUrl(first) : null;
    const finalCover = coverUrl && coverUrl.length > 0 ? coverUrl : null;

    const { error: coverErr } = await supabase
      .from('properties')
      .update({ photo_url: finalCover })
      .eq('id', propertyId);

    if (coverErr) {
      warn('[EditPropertyClient] No se pudo actualizar portada:', coverErr);
    }
  };

  // ✅ UPDATED: avoid UPSERT to prevent RLS "new row violates" errors
  const normalizeOrderAndPersist = async (nextPhotosRaw: Photo[]) => {
    const normalized = nextPhotosRaw.map((p, idx) => ({
      ...p,
      display_order: idx + 1,
    }));

    const results = await Promise.all(
      normalized.map((p) =>
        supabase
          .from('property_photos')
          .update({ display_order: p.display_order })
          .eq('id', p.id)
      )
    );

    const firstErr = results.find((r) => r.error)?.error;
    if (firstErr) throw firstErr;

    await setCoverToFirstPhoto(normalized);

    setPhotos(normalized);
    router.refresh();
  };

  const handleMakeCover = async (photoId: string) => {
    if (uploading) return;

    try {
      setUploading(true);

      const ordered = photosForUI.slice().sort((a, b) => a.display_order - b.display_order);
      const idx = ordered.findIndex((p) => p.id === photoId);
      if (idx === -1) return;

      const [picked] = ordered.splice(idx, 1);
      ordered.unshift(picked);

      await normalizeOrderAndPersist(ordered);
    } catch (err) {
      logError('[EditPropertyClient] make cover error:', err);
      alert('Error al cambiar portada: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading) return;
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];

    try {
      // Validate file before upload
      const fileValidation = imageUploadSchema.safeParse({ size: file.size, type: file.type });
      if (!fileValidation.success) {
        throw new Error(getFirstZodError(fileValidation.error));
      }

      if (!propertyId) throw new Error('propertyId vacío (initialProperty.id no llegó)');

      const { data, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!data?.user) throw new Error('No autenticado');

      const fileName = `${crypto.randomUUID()}-${file.name}`;
      const bucketId = 'property-images';
      const storagePath = `${data.user.id}/${propertyId}/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from(bucketId)
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from(bucketId).getPublicUrl(storagePath);
      const publicUrl = pub?.publicUrl ?? null;

      const nextOrder =
        photos.length === 0 ? 1 : Math.max(...photos.map((p) => p.display_order)) + 1;

      const { data: newPhoto, error: insertErr } = await supabase
        .from('property_photos')
        .insert({
          property_id: propertyId,
          storage_path: storagePath,
          bucket_id: bucketId,
          photo_url: publicUrl,
          display_order: nextOrder,
        })
        .select('id, photo_url, storage_path, bucket_id, display_order')
        .single();

      if (insertErr) {
        await supabase.storage.from(bucketId).remove([storagePath]);
        throw insertErr;
      }

      if (!newPhoto) throw new Error('No se pudo crear el registro de foto.');

      const nextPhotos = [...photos, newPhoto].sort((a, b) => a.display_order - b.display_order);
      setPhotos(nextPhotos);

      if (nextOrder === 1) {
        await setCoverToFirstPhoto(nextPhotos);
      }

      router.refresh();
    } catch (err) {
      logError('[EditPropertyClient] upload error:', err);
      alert('Error al subir imagen: ' + (err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (photo: Photo) => {
    if (uploading) return;
    if (!confirm('¿Eliminar esta foto?')) return;

    setUploading(true);
    try {
      if (!propertyId) throw new Error('propertyId vacío.');

      if (photo.storage_path) {
        const bucket = photo.bucket_id ?? 'property-images';
        const { error: storageErr } = await supabase.storage
          .from(bucket)
          .remove([photo.storage_path]);

        if (storageErr) throw storageErr;
      }

      const { error: dbErr } = await supabase
        .from('property_photos')
        .delete()
        .eq('id', photo.id);

      if (dbErr) throw dbErr;

      const remaining = photos
        .filter((p) => p.id !== photo.id)
        .sort((a, b) => a.display_order - b.display_order);

      if (remaining.length === 0) {
        setPhotos([]);
        await setCoverToFirstPhoto([]);
        router.refresh();
      } else {
        await normalizeOrderAndPersist(remaining);
      }
    } catch (err) {
      logError('[EditPropertyClient] delete error:', err);
      alert('Error al eliminar imagen: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const onDragStart = (id: string) => setDraggingId(id);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;

    try {
      setUploading(true);

      const current = photosForUI.slice();
      const fromIdx = current.findIndex((p) => p.id === draggingId);
      const toIdx = current.findIndex((p) => p.id === targetId);

      if (fromIdx === -1 || toIdx === -1) return;

      const moved = current.splice(fromIdx, 1)[0];
      current.splice(toIdx, 0, moved);

      await normalizeOrderAndPersist(current);
    } catch (err) {
      logError('[EditPropertyClient] reorder error:', err);
      alert('Error al reordenar: ' + (err as Error).message);
    } finally {
      setUploading(false);
      setDraggingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Fotos de la Propiedad</h3>
      <div className="text-xs text-gray-500">propertyId: {propertyId}</div>

      <div className="grid grid-cols-3 gap-4">
        {photosForUI.map((photo) => (
          <div
            key={photo.id}
            className="relative group"
            draggable
            onDragStart={() => onDragStart(photo.id)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(photo.id)}
            title="Arrastra para reordenar"
          >
            {photo.url ? (
              <Image
                src={photo.url}
                alt="Foto propiedad"
                width={300}
                height={200}
                className="rounded object-cover w-full h-48"
              />
            ) : (
              <div className="rounded w-full h-48 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                URL inválida
              </div>
            )}

            {photo.display_order === 1 && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Portada
              </div>
            )}

            {photo.display_order !== 1 && (
              <button
                type="button"
                onClick={() => handleMakeCover(photo.id)}
                disabled={uploading}
                className="absolute bottom-2 left-2 bg-white/90 text-gray-900 text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
              >
                Hacer portada
              </button>
            )}

            <button
              type="button"
              onClick={() => handleDelete(photo)}
              disabled={uploading}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <label className="block">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <div className="border-2 border-dashed rounded p-8 text-center cursor-pointer hover:bg-gray-50">
          {uploading ? 'Procesando…' : '📸 Subir nueva foto'}
        </div>
      </label>

      <p className="text-xs text-gray-500">
        Tip: Arrastra una foto para reordenar. La foto con orden #1 siempre será la portada.
      </p>
    </div>
  );
}
