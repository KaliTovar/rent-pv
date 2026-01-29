import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch agent profile
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', session.user.id)
    .single()

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">RentPV</h1>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {agent?.full_name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">{agent?.email}</p>
            <p className="text-xs text-blue-600 mt-1 capitalize">
              Plan: {agent?.subscription_tier}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/dashboard/properties"
              className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              🏠 Mis Propiedades
            </Link>
            <Link
              href="/dashboard/leads"
              className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              📧 Leads
            </Link>
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              ⚙️ Configuración
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <form action={handleSignOut}>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                🚪 Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
