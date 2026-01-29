import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function PropertiesPage() {
  const supabase = await createClient();

  // ✅ Auth-critical guard
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    redirect('/login');
  }

  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      neighborhood,
      address,
      status,
      photo_url,
      price_amount,
      price_monthly,
      price_unit,
      created_at
    `)
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false });

  const { data: agent } = await supabase
    .from('agents')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const firstName = agent?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Realtor';

  const statusLabel = (status: string | null | undefined) => {
    if (status === 'active') return 'Activa';
    if (status === 'inactive') return 'Inactiva';
    if (status === 'draft') return 'Borrador';
    return 'Borrador';
  };

  const statusClasses = (status: string | null | undefined) => {
    if (status === 'active') return 'bg-green-500 text-white';
    if (status === 'inactive') return 'bg-red-600 text-white';
    return 'bg-gray-800 text-white';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ... el resto queda igual ... */}
    </div>
  );
}
