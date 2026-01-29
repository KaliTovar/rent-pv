import { z } from 'zod'

/**
 * Zod validation schemas for RentPV
 * Use safeParse() on BOTH client and server before any DB/auth operations.
 */

// ---------- helpers ----------
const emptyToNull = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => {
    if (typeof v === 'string' && v.trim() === '') return null
    return v
  }, schema)

const optionalString = (max: number, label: string) =>
  z.preprocess((v) => {
    if (typeof v === 'string') {
      const t = v.trim()
      return t === '' ? undefined : t
    }
    return v
  }, z.string().max(max, `${label} demasiado largo`).optional())

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')

// ---------- auth ----------
export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email es requerido').email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(128),
})

export const signupSchema = z.object({
  email: z.string().trim().min(1, 'Email es requerido').email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(128),
  fullName: z.string().trim().min(1, 'Nombre completo es requerido').max(100),
  phone: z.string().trim().max(20, 'Teléfono demasiado largo').optional(),
  company: z.string().trim().max(100, 'Nombre de empresa demasiado largo').optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>

// ---------- properties ----------
export const propertySchema = z
  .object({
    title: z.string().trim().min(1, 'Título es requerido').max(200),

    description: optionalString(5000, 'Descripción'),

    // numeric fields: accept input strings and convert
    price_amount: emptyToNull(z.coerce.number().min(0).max(100000000)).optional(),
    price_unit: z.enum(['monthly', 'nightly']).default('monthly'),

    bedrooms: emptyToNull(z.coerce.number().int().min(0).max(50)).optional(),
    bathrooms: emptyToNull(z.coerce.number().min(0).max(50)).optional(),
    square_meters: emptyToNull(z.coerce.number().int().min(0).max(100000)).optional(),
    max_guests: emptyToNull(z.coerce.number().int().min(1).max(100)).optional(),

    available_from: emptyToNull(isoDate).optional(),
    available_to: emptyToNull(isoDate).optional(),
    availability_notes: optionalString(1000, 'Notas'),

    address: optionalString(300, 'Dirección'),
    neighborhood: optionalString(100, 'Zona'),

    furnished: z.coerce.boolean().default(false),
    pets_allowed: z.coerce.boolean().default(false),

    status: z.enum(['draft', 'active', 'inactive']).default('draft'),
  })
  .superRefine((data, ctx) => {
    if (data.available_from && data.available_to) {
      if (data.available_from > data.available_to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['available_to'],
          message: 'La fecha final debe ser posterior a la fecha inicial',
        })
      }
    }
  })

export type PropertyInput = z.infer<typeof propertySchema>

// ---------- upload ----------
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const imageUploadSchema = z.object({
  size: z.coerce.number().max(MAX_IMAGE_SIZE, 'El archivo es demasiado grande. Máximo 10MB.'),
  type: z
    .string()
    .refine(
      (t) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(t),
      'Tipo de archivo no permitido. Use JPG, PNG o WebP.'
    ),
})

export type ImageUploadInput = z.infer<typeof imageUploadSchema>

// ---------- error helpers ----------
export function getFirstZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Error de validación'
}

export function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (!fieldErrors[path]) fieldErrors[path] = issue.message
  }
  return fieldErrors
}
