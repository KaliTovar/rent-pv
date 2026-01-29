'use client'

export default function InquiryForm({
  property,
}: {
  property: { id: string; title: string; slug: string }
}) {
  return (
    <div className="border rounded p-4">
      <p className="text-sm text-gray-600">
        Form placeholder for: <b>{property.slug}</b>
      </p>
    </div>
  )
}
