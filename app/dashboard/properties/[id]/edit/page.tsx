import { redirect } from 'next/navigation';
import EditPropertyClient from './EditPropertyClient';
import PropertyForm from '../../new/PropertyForm';
import { createClient as createServerClient } from '@/lib/supabase/server';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const { data: property, error } = await supabase
    .from('properties')
    .select(
      `
      *,
      property_photos (
        id,
        photo_url,
        storage_path,
        bucket_id,
        display_order
      )
    `
    )
    .eq('id', id)
    .order('display_order', { referencedTable: 'property_photos', ascending: true })
    .single();

  if (error || !property) {
    return <div className="p-6">No se encontró la propiedad.</div>;
  }

  // Seguridad: solo el agente dueño puede editar
  if (property.agent_id !== session.user.id) {
    return <div className="p-6">No tienes permisos para editar esta propiedad.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <PropertyForm agentId={session.user.id} propertyId={property.id} initialProperty={property} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <EditPropertyClient initialProperty={property} />
      </div>
    </div>
  );
}

