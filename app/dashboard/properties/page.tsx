import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function PropertiesPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: properties, error } = await supabase
    .from('properties')
    .select('*') // usamos photo_url directamente (Opción A)
    .eq('agent_id', session.user.id)
    .order('created_at', { ascending: false });

  const { data: agent } = await supabase
    .from('agents')
    .select('full_name')
    .eq('id', session.user.id)
    .single();

  const firstName = agent?.full_name?.split(' ')[0] || 'Realtor';

  const statusLabel = (status: string | null | undefined) => {
    if (status === 'active') return 'Activa';
    if (status === 'inactive') return 'Inactiva';
    if (status === 'draft') return 'Borrador';
    return 'Borrador';
  };

  const statusClasses = (status: string | null | undefined) => {
    if (status === 'active') return 'bg-green-500 text-white';
    if (status === 'inactive') return 'bg-red-600 text-white'; // ✅ rojo
    return 'bg-gray-800 text-white'; // draft/otro
  };  

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {properties && properties.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Propiedades</h1>
            <Link
              href="/dashboard/properties/new"
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nueva propiedad
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto mt-8 px-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error.message}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!properties || properties.length === 0 ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-6 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Bienvenido, {firstName}
                </h1>
                <p className="text-lg text-gray-600 mb-8">Comienza a publicar propiedades</p>

                <Link
                  href="/dashboard/properties/new"
                  className="flex items-center justify-between w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Crear nueva propiedad</p>
                      <p className="text-sm text-gray-500">Completa en ~5 minutos</p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Conecta con inquilinos en Puerto Vallarta
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Grid de propiedades */
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/dashboard/properties/${property.id}/edit`} // ✅ siempre ir al editor
                className="group"
              >
                <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-3">
                  {property.photo_url ? (
                    <Image src={property.photo_url} alt={property.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-lg shadow-sm ${statusClasses(
                        property.status
                      )}`}
                    >
                      {statusLabel(property.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-1">
                    {property.neighborhood || property.address || 'Puerto Vallarta'}
                  </p>

                  {(() => {
                        const amount =
                          property.price_amount ?? property.price_monthly ?? null

                        const unit =
                          property.price_unit ?? 'monthly'

                        const unitLabel = unit === 'nightly' ? 'MXN/noche' : 'MXN/mes'

                        return (
                          <div className="flex items-baseline gap-1 pt-1">
                            <span className="text-lg font-bold text-gray-900">
                              {amount !== null ? `$${Number(amount).toLocaleString()}` : '—'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {unitLabel}
                            </span>
                          </div>
                        )
                      })()}

                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
