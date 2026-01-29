import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inquirySchema } from '@/lib/validation/inquiry'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = inquirySchema.safeParse(body)
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? 'Error de validación'
      return NextResponse.json(
        { ok: false, error: first, fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1) Fetch property by id and ensure active
    const { data: property, error: propErr } = await supabase
      .from('properties')
      .select('id, agent_id, status, title, slug')
      .eq('id', parsed.data.property_id)
      .single()

    if (propErr || !property) {
      return NextResponse.json({ ok: false, error: 'Propiedad no encontrada' }, { status: 404 })
    }

    if (property.status !== 'active') {
      return NextResponse.json({ ok: false, error: 'Propiedad no disponible' }, { status: 400 })
    }

    // 2) Insert inquiry (agent_id derived from property)
    const insertPayload = {
      property_id: property.id,
      agent_id: property.agent_id,

      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      contact_preference: parsed.data.contact_preference,
      best_contact_time: parsed.data.best_contact_time ?? null,

      intention: parsed.data.intention,

      move_in_date: parsed.data.move_in_date ?? null,
      check_in: parsed.data.check_in ?? null,
      check_out: parsed.data.check_out ?? null,
      duration_preference: parsed.data.duration_preference ?? null,
      occupants: parsed.data.occupants ?? null,
      pets: parsed.data.pets ?? null,
      pets_notes: parsed.data.pets_notes ?? null,
      budget_hint: parsed.data.budget_hint ?? null,
      notes: parsed.data.notes ?? null,
    }

    const { data: inquiry, error: insErr } = await supabase
      .from('inquiries')
      .insert(insertPayload)
      .select('id, created_at')
      .single()

    if (insErr) throw insErr

    // Notificaciones (email/WhatsApp) las conectamos en el siguiente paso.
    return NextResponse.json({ ok: true, inquiry }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error interno' }, { status: 500 })
  }
}
