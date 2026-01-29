import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')

export const inquirySchema = z
  .object({
    property_id: z.string().uuid('Propiedad inválida'),

    intention: z.enum(['long_term', 'short_term', 'schedule_visit', 'info_only'], {
      required_error: 'Selecciona una intención',
    }),

    full_name: z.string().trim().min(1, 'Nombre es requerido').max(100),
    phone: z.string().trim().min(6, 'Teléfono es requerido').max(30),
    email: z.string().trim().email('Email inválido'),

    contact_preference: z.enum(['whatsapp', 'call', 'email']).default('whatsapp'),
    best_contact_time: z.string().trim().max(50).optional(),

    move_in_date: z.preprocess((v) => (v === '' ? null : v), isoDate.nullable().optional()),
    check_in: z.preprocess((v) => (v === '' ? null : v), isoDate.nullable().optional()),
    check_out: z.preprocess((v) => (v === '' ? null : v), isoDate.nullable().optional()),

    duration_preference: z.string().trim().max(50).optional(),

    occupants: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? null : v),
      z.coerce.number().int().min(1, 'Ocupación debe ser al menos 1').nullable().optional()
    ),

    pets: z.coerce.boolean().optional(),
    pets_notes: z.string().trim().max(200).optional(),
    budget_hint: z.string().trim().max(80).optional(),
    notes: z.string().trim().max(2000).optional(),

    consent: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar ser contactado' }) }),
  })
  .superRefine((data, ctx) => {
    // date ordering for short_term
    if (data.check_in && data.check_out && data.check_in > data.check_out) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['check_out'],
        message: 'La fecha final debe ser posterior a la fecha inicial',
      })
    }
  })

export type InquiryInput = z.infer<typeof inquirySchema>
