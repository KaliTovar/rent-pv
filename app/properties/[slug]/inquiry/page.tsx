import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import InquiryForm from './InquiryForm'

export default async function InquiryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()

  const { slug } = await params

  const { data: property, error } = await supabase
    .from('properties')
    .select('id,title,slug,status')
    .eq('slug', slug)
    .single()

  if (error || !property) notFound()
  if (property.status !== 'active') notFound()

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Contactar sobre</h1>
      <p className="text-gray-600 mb-6">{property.title}</p>

      <InquiryForm
        property={{
          id: property.id,
          title: property.title,
          slug: property.slug,
        }}
      />
    </div>
  )
}
