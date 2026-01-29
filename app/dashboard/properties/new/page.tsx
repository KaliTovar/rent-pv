import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PropertyForm from './PropertyForm'

export default async function NewPropertyPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Nueva Propiedad
          </h1>
          <p className="text-gray-600">
            Completa la información de tu propiedad para publicarla
          </p>
        </div>

        {/* Formulario */}
        <PropertyForm agentId={session.user.id} />
      </div>
    </div>
  )
}
