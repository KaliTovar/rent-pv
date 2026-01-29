'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { imageUploadSchema, getFirstZodError } from '@/lib/validation/schemas';
import { log, debug, error as logError } from '@/lib/logger';

type Photo = {
  id: string;
  photo_url: string | null;
  storage_path: string | null;
  bucket_id: string | null;
  display_order: number;
};

export default function PhotoManager({
  propertyId,
  initialPhotos,
}: {
  propertyId: string;
  initialPhotos?: Photo[];
}) {
  const supabase = createClient();
  const router = useRouter();

  const [photos, setPhotos] = useState<Photo[]>(initialPhotos ?? []);
  const [uploading, setUploading] = useState(false);

  // Dev-only log
  log('PhotoManager loaded', { propertyId });

  const photosForUI = useMemo(() => {
    return (photos ?? []).map((p) => {
      const bucket = p.bucket_id ?? 'property-images';

      // ✅ nunca llamar getPublicUrl con null/undefined
      const url = p.storage_path
        ? supabase.storage.from(bucket).getPublicUrl(p.storage_path).data.publicUrl
        : p.photo_url ?? '';

      return { ...p, url };
    });
  }, [photos, supabase]);

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

      // 0) Guardrail: propertyId debe existir
      if (!propertyId) {
        throw new Error('propertyId es undefined (bug de routing/padre)');
      }

      // 1) User real (auth server)
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const user = userData?.user;
      if (!user) throw new Error('No autenticado');

      debug('user.id', user.id);
      debug('propertyId', propertyId);

      // 2) Pre-check ownership (si esto falla, RLS fallará sí o sí)
      const { data: propertyCheck, error: propErr } = await supabase
        .from('properties')
        .select('id, agent_id, status')
        .eq('id', propertyId)
        .single();

      if (propErr) throw propErr;

      debug('propertyCheck', propertyCheck);

      if (!propertyCheck) throw new Error('No existe la propiedad (propertyCheck null)');
      if (propertyCheck.agent_id !== user.id) {
        throw new Error(`No eres dueño. agent_id=${propertyCheck.agent_id} user.id=${user.id}`);
      }

      // 3) Upload a Storage
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      const bucketId = 'property-images';
      const storagePath = `${user.id}/${propertyId}/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from(bucketId)
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (uploadErr) throw uploadErr;

      // 4) Insert a DB
      const nextOrder =
        photos.length === 0 ? 1 : Math.max(...photos.map((p) => p.display_order)) + 1;

      const payload = {
        property_id: propertyId,
        storage_path: storagePath,
        bucket_id: bucketId,
        photo_url: null as string | null, // ✅ ahora permitido por SQL (DROP NOT NULL)
        display_order: nextOrder,
      };

      debug('insert payload', payload);

      const { data: newPhoto, error: insertErr } = await supabase
        .from('property_photos')
        .insert(payload)
        .select('id, photo_url, storage_path, bucket_id, display_order')
        .single();

      if (insertErr) {
        logError('Insert error:', insertErr);
        // rollback storage si insert falla
        await supabase.storage.from(bucketId).remove([storagePath]);
        throw insertErr;
      }

      if (!newPhoto) throw new Error('No se pudo crear el registro de foto.');

      setPhotos((prev) => [...prev, newPhoto]);
      router.refresh();
    } catch (err) {
      logError(err);
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
      const bucket = photo.bucket_id ?? 'property-images';

      if (photo.storage_path) {
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

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      router.refresh();
    } catch (err) {
      logError(err);
      alert('Error al eliminar imagen: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Fotos de la Propiedad</h3>
      <div className="text-xs text-gray-500">propertyId: {propertyId || '(vacío)'}</div>

      <div className="grid grid-cols-3 gap-4">
        {photosForUI.map((photo) => (
          <div key={photo.id} className="relative group">
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

            <button
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
    </div>
  );
}
