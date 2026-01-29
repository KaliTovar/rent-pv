'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { propertySchema, getFirstZodError, getZodFieldErrors } from '@/lib/validation/schemas';

type Property = {
  id: string;
  agent_id: string;

  title: string;
  description: string | null;

  // legacy
  price_monthly: number | null;

  // new
  price_amount: number | null;
  price_unit: 'monthly' | 'nightly' | null;

  bedrooms: number | null;
  bathrooms: number | null;
  square_meters: number | null;

  max_guests: number | null;

  available_from: string | null; // date (YYYY-MM-DD)
  available_to: string | null; // date (YYYY-MM-DD)
  availability_notes: string | null;

  address: string | null;
  neighborhood: string | null;
  furnished: boolean | null;
  pets_allowed: boolean | null;

  status: string | null;
};

interface PropertyFormProps {
  agentId: string;
  propertyId?: string;
  initialProperty?: Partial<Property>;
}

export default function PropertyForm({ agentId, propertyId, initialProperty }: PropertyFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const isEdit = Boolean(propertyId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',

    // ✅ nuevo modelo de precio
    price_amount: '',
    price_unit: 'monthly' as 'monthly' | 'nightly',

    bedrooms: '',
    bathrooms: '',
    square_meters: '',

    max_guests: '',

    available_from: '',
    available_to: '',
    availability_notes: '',

    address: '',
    neighborhood: '',
    furnished: false,
    pets_allowed: false,

    status: 'draft',
  });

  // Hydrate en modo edición
  useEffect(() => {
    if (!isEdit || !initialProperty) return;

    // fallback: si no existe price_amount/unit todavía, usa legacy price_monthly
    const resolvedAmount =
      initialProperty.price_amount ??
      (initialProperty.price_monthly !== null && initialProperty.price_monthly !== undefined
        ? initialProperty.price_monthly
        : null);

    const resolvedUnit = (initialProperty.price_unit as 'monthly' | 'nightly' | null) ?? 'monthly';

    setFormData({
      title: initialProperty.title ?? '',
      description: initialProperty.description ?? '',

      price_amount: resolvedAmount !== null && resolvedAmount !== undefined ? String(resolvedAmount) : '',
      price_unit: resolvedUnit,

      bedrooms:
        initialProperty.bedrooms !== null && initialProperty.bedrooms !== undefined
          ? String(initialProperty.bedrooms)
          : '',
      bathrooms:
        initialProperty.bathrooms !== null && initialProperty.bathrooms !== undefined
          ? String(initialProperty.bathrooms)
          : '',
      square_meters:
        initialProperty.square_meters !== null && initialProperty.square_meters !== undefined
          ? String(initialProperty.square_meters)
          : '',

      max_guests:
        initialProperty.max_guests !== null && initialProperty.max_guests !== undefined
          ? String(initialProperty.max_guests)
          : '',

      available_from: initialProperty.available_from ?? '',
      available_to: initialProperty.available_to ?? '',
      availability_notes: initialProperty.availability_notes ?? '',

      address: initialProperty.address ?? '',
      neighborhood: initialProperty.neighborhood ?? '',
      furnished: Boolean(initialProperty.furnished),
      pets_allowed: Boolean(initialProperty.pets_allowed),

      status: (initialProperty.status as string) ?? 'draft',
    });
  }, [isEdit, initialProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    // Validate with Zod before submitting
    const parsed = propertySchema.safeParse(formData);
    if (!parsed.success) {
      setFieldErrors(getZodFieldErrors(parsed.error));
      setError(getFirstZodError(parsed.error));
      setLoading(false);
      return;
    }

    try {
      const validData = parsed.data;

      // Build payload from validated data
      const payload = {
        agent_id: agentId,
        title: validData.title,
        description: validData.description || null,

        price_amount: validData.price_amount ?? null,
        price_unit: validData.price_unit,

        // legacy: solo llenamos price_monthly si es mensual
        price_monthly: validData.price_unit === 'monthly' ? (validData.price_amount ?? null) : null,

        bedrooms: validData.bedrooms ?? null,
        bathrooms: validData.bathrooms ?? null,
        square_meters: validData.square_meters ?? null,

        max_guests: validData.max_guests ?? null,

        available_from: validData.available_from || null,
        available_to: validData.available_to || null,
        availability_notes: validData.availability_notes || null,

        address: validData.address || null,
        neighborhood: validData.neighborhood || null,

        furnished: validData.furnished,
        pets_allowed: validData.pets_allowed,

        status: validData.status,
      };

      if (isEdit && propertyId) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', propertyId);

        if (updateError) throw updateError;

        router.push('/dashboard/properties'); // ✅ vuelve a Mis Propiedades
        router.refresh();
        return;
      }

      const { data: inserted, error: insertError } = await supabase
        .from('properties')
        .insert([payload])
        .select('id')
        .single();

      if (insertError) throw insertError;
      if (!inserted?.id) throw new Error('No se pudo crear la propiedad.');

      // ✅ flujo: crear -> editar (para agregar fotos)
      router.push(`/dashboard/properties/${inserted.id}/edit`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || (isEdit ? 'Error al guardar cambios' : 'Error al crear la propiedad'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Editar propiedad' : 'Nueva propiedad'}
          </h2>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Estatus</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="draft">Borrador</option>
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </select>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-2">
              Título del anuncio *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Hermoso departamento en Marina Vallarta"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu propiedad, amenidades, ubicación..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-5 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Características</h3>

          {/* ✅ Precio con selector mensual/noche */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label
                htmlFor="price_amount"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Precio
              </label>
              <input
                type="number"
                id="price_amount"
                name="price_amount"
                min="0"
                value={formData.price_amount}
                onChange={handleChange}
                placeholder="15000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Frecuencia
              </label>
              <select
                name="price_unit"
                value={formData.price_unit}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="monthly">Por mes</option>
                <option value="nightly">Por noche</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-600 mb-2">
                Recámaras
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                min="0"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-600 mb-2">
                Baños
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                min="0"
                step="0.5"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="square_meters"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Metros cuadrados
              </label>
              <input
                type="number"
                id="square_meters"
                name="square_meters"
                min="0"
                value={formData.square_meters}
                onChange={handleChange}
                placeholder="80"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* ✅ Max guests */}
            <div>
              <label
                htmlFor="max_guests"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Máx. huéspedes
              </label>
              <input
                type="number"
                id="max_guests"
                name="max_guests"
                min="1"
                value={formData.max_guests}
                onChange={handleChange}
                placeholder="6"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* ✅ Disponibilidad simple (rango + notas) */}
          <div className="pt-2 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Disponibilidad</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="available_from"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Disponible desde
                </label>
                <input
                  type="date"
                  id="available_from"
                  name="available_from"
                  value={formData.available_from}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="available_to"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Disponible hasta
                </label>
                <input
                  type="date"
                  id="available_to"
                  name="available_to"
                  value={formData.available_to}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="availability_notes"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Notas de disponibilidad (opcional)
              </label>
              <textarea
                id="availability_notes"
                name="availability_notes"
                rows={2}
                value={formData.availability_notes}
                onChange={handleChange}
                placeholder='Ej: "Disponible del 20 Ene 2026 al 20 Ene 2027. Consultar fechas exactas con el agente."'
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-2">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Calle, número, etc."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="neighborhood"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Colonia / Zona
              </label>
              <input
                type="text"
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="Ej: Marina Vallarta"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} />
              Amueblada
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="pets_allowed"
                checked={formData.pets_allowed}
                onChange={handleChange}
              />
              Mascotas permitidas
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear y continuar'}
          </button>
        </div>
      </div>
    </form>
  );
}
