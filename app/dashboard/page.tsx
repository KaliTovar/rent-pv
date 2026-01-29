import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // ✅ Auth-critical: no confíes en session cookies
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  const { data: agent } = await supabase
    .from('agents')
    .select('full_name') // ✅ evita select('*') si no lo necesitas
    .eq('id', user.id)
    .single()

  const displayName = agent?.full_name || user.email?.split('@')[0] || 'Agente'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Dashboard
      </h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Bienvenido, {displayName}
        </h2>
        <p className="text-gray-600">
          Gestiona tus propiedades y leads desde aquí.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/properties"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Mis Propiedades
          </h3>
          <p className="text-gray-600 text-sm">
            Ver y gestionar tu catálogo de propiedades
          </p>
        </Link>

        <Link
          href="/dashboard/leads"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Leads
          </h3>
          <p className="text-gray-600 text-sm">
            Ver contactos y solicitudes recibidas
          </p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Configuración
          </h3>
          <p className="text-gray-600 text-sm">
            Editar perfil y preferencias
          </p>
        </Link>
      </div>
    </div>
  )
}

