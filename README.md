# Point2PV — Business Plan & Technical Roadmap

**Tagline:** Rentas modernas. Decisiones inteligentes.

**Vision:** Convertirse en la plataforma líder de rentas residenciales en Puerto Vallarta, con expansión planificada a destinos turísticos clave de México (Nayarit, Los Cabos, Tulum).

**Mission:** Proveer a propietarios y agentes una herramienta moderna, transparente y eficiente para listar, promover y rentar propiedades, mientras ofrecemos a inquilinos una experiencia de búsqueda superior con datos de mercado en tiempo real.

---

## Tabla de Contenidos

1. [Contexto de Mercado](#contexto-de-mercado)
2. [Modelo de Negocio](#modelo-de-negocio)
3. [Arquitectura Técnica](#arquitectura-técnica)
4. [Roadmap de Producto](#roadmap-de-producto)
5. [Estrategia de Marca](#estrategia-de-marca)
6. [Proyección Financiera](#proyección-financiera)
7. [Go-to-Market Strategy](#go-to-market-strategy)
8. [Expansión Geográfica](#expansión-geográfica)

---

## Contexto de Mercado

### Oportunidad

**Point2Homes abandonó México en mayo 2024**, dejando un vacío en el mercado de plataformas modernas de listados inmobiliarios. Competencia local (Vivanuncios, Inmuebles24) tiene UX anticuada y poca innovación técnica.

**Puerto Vallarta** específicamente:
- ~350K población + área metropolitana
- Alto flujo de expatriados (US/Canadá) buscando rentas largas
- Mercado de rentas vacacionales fragmentado (Airbnb, VRBO, agentes locales)
- Demanda creciente de "digital nomads" post-pandemia
- Carencia de data transparente sobre precios de mercado

### Competencia Directa

| Plataforma | Fortalezas | Debilidades |
|------------|------------|-------------|
| Vivanuncios | Tráfico alto, inventario amplio | UI obsoleta, poca moderación, anuncios invasivos |
| Inmuebles24 | Presencia regional | Modelo freemium débil, poca innovación |
| Airbnb/VRBO | Dominio en corto plazo | No sirven rentas largas, fees altos (14-17%) |
| Agentes locales | Conocimiento de mercado | Sin plataforma centralizada, procesos manuales |

### Ventaja Competitiva

**Point2PV** se diferencia por:

1. **Tech-first**: Stack moderno (Next.js + Supabase) permite features que competencia no puede replicar rápido
2. **Bilingüe nativo**: Experiencia perfecta en inglés y español
3. **Data transparency**: Analytics de mercado en tiempo real (precios/m², días en mercado, tasas de ocupación)
4. **Modelo de pricing justo**: Suscripción predecible vs. comisiones ocultas
5. **Mobile-first**: Diseño responsive real, no adaptación forzada

---

## Modelo de Negocio

### Revenue Streams

#### 1. Suscripciones SaaS (Principal)

| Plan | Precio | Límites | Target |
|------|--------|---------|--------|
| **Básico** | Gratis | 1 propiedad, 5 fotos | Propietario casual, validación |
| **Premium** | $49 USD/mes | Ilimitadas, 20 fotos, destacados, analytics | Agente individual (3-10 propiedades) |
| **Elite** | $99 USD/mes | Ilimitadas, 50 fotos, virtual tours, API access | Brokerage/Property Manager (10+) |

**Justificación de precios:**
- **Competitivo vs. Airbnb**: Airbnb cobra 3% host + 14% guest = ~17% total. Para renta $1,500/mes, eso es $255. Premium a $49/mes = ahorro de $206/mes.
- **Premium vs. punto de dolor**: Agente con 5 propiedades factura ~$10K/mes en comisiones. $49 es 0.5% de revenue, imperceptible.
- **Elite justificado**: Virtual tours cuestan $150-300 si contratas externo. Incluirlo en $99/mes = ROI en 1 mes.

#### 2. Featured Listings (Secundario)

- $25 USD/mes por propiedad destacada en resultados de búsqueda
- Targeting geográfico (ej: solo zona Conchas Chinas)
- Estimación: 20% de usuarios Premium usan esto = $10/usuario adicional

#### 3. Servicios Premium (Fase 2)

- Verificación de propiedad: $25 USD (fotos profesionales, confirmación legal)
- Background check inquilinos: $15 USD
- Generación de contrato: $50 USD
- Property management referral: 10% revenue share

#### 4. Data Products (Fase 3, Moat de datos)

- Reportes de mercado mensuales: $50 USD
- API de pricing data: $500 USD/mes (para developers/PMs)
- Análisis comparativo (CMA): $25 USD/reporte

---

### Proyección Financiera Año 1

#### Gastos Operativos Mensuales

**Infraestructura:**
- Vercel Pro: $20
- Supabase Pro: $25
- Cloudinary: $50
- Google Maps API: $100
- Stripe fees: variable (2.9% + $0.30)
- Domain + SSL: $5
- **Subtotal: ~$200/mes**

**Marketing:**
- Google Ads (local): $500/mes
- Meta Ads (expats): $300/mes
- SEO content: $400/mes
- **Subtotal: $1,200/mes**

**Operaciones:**
- VA verificación/soporte: $600/mes
- Legal/contabilidad: $200/mes
- **Subtotal: $800/mes**

**Total mensual: $2,200 USD**

#### Ingresos Proyectados (Conservador)

**Q1 (Meses 1-3): Validación**
- 5 Premium: $245/mes
- 1 Elite: $99/mes
- MRR: $344

**Q2 (Meses 4-6): Tracción**
- 15 Premium: $735/mes
- 3 Elite: $297/mes
- MRR: $1,032

**Q3-Q4 (Meses 7-12): Agentes entran**
- 40 Premium: $1,960/mes
- 8 Elite: $792/mes
- 5 Featured listings: $125/mes
- MRR: $2,877

**Break-even: Mes 5**
**Ganancia neta Año 1: ~$18,000 USD**
**ARR: $34,524**

---

## Arquitectura Técnica

### Stack Tecnológico
```
Frontend:    Next.js 14+ (App Router)
Backend:     Next.js API Routes + Supabase Functions
Database:    PostgreSQL (Supabase)
Auth:        Supabase Auth
Storage:     Supabase Storage (fotos/videos)
Payments:    Stripe Billing
Hosting:     Vercel
CDN:         Cloudinary (optimización imágenes)
Analytics:   Vercel Analytics + Supabase Realtime
Search:      PostgreSQL Full-Text Search (tsvector)
Maps:        Google Maps JavaScript API
```

### Schemas de Base de Datos (Core)

**agents**
- `id` (UUID, PK, = auth.users.id)
- `full_name` (text)
- `email` (text, unique)
- `phone` (text)
- `bio` (text)
- `photo_url` (text)
- `created_at` (timestamptz)

**subscriptions**
- `id` (UUID, PK)
- `agent_id` (UUID, FK → agents)
- `stripe_customer_id` (text, unique)
- `stripe_subscription_id` (text, unique)
- `plan_tier` (enum: free, premium, elite)
- `status` (enum: active, canceled, past_due, trialing)
- `current_period_start/end` (timestamptz)
- `cancel_at_period_end` (boolean)

**plan_limits**
- `plan_tier` (enum, PK)
- `max_properties` (int)
- `max_photos_per_property` (int)
- `can_feature_listings` (bool)
- `can_use_analytics` (bool)
- `can_use_virtual_tours` (bool)
- `monthly_price_usd` (int, centavos)

**properties**
- `id` (UUID, PK)
- `agent_id` (UUID, FK → agents)
- `slug` (text, unique, SEO-friendly)
- `status` (enum: draft, published, archived)
- `title` (text)
- `description` (text)
- `neighborhood` (text)
- `address` (text)
- `latitude/longitude` (decimal, para maps)
- `bedrooms/bathrooms` (int)
- `square_meters` (int)
- `max_guests` (int)
- `furnished` (bool)
- `pets_allowed` (bool)
- `available_from/to` (date)
- `price_amount` (decimal)
- `price_unit` (enum: monthly, nightly)
- `price_monthly` (decimal, normalized)
- `photo_url` (text, thumbnail)
- `search_vector` (tsvector, full-text search)
- `created_at/updated_at` (timestamptz)

**property_photos**
- `id` (UUID, PK)
- `property_id` (UUID, FK → properties)
- `photo_url` (text)
- `storage_path` (text)
- `display_order` (int)
- `created_at` (timestamptz)

**property_inquiries** (Lead capture)
- `id` (UUID, PK)
- `property_id` (UUID, FK → properties)
- `agent_id` (UUID, FK → agents)
- `name/email/phone` (text)
- `message` (text)
- `source` (text: contact_form, whatsapp, phone)
- `created_at` (timestamptz)

### Seguridad (RLS)

**Políticas Row Level Security:**
```sql
-- agents: solo pueden ver/editar su propio perfil
CREATE POLICY "Users can view own profile"
  ON agents FOR SELECT
  USING (auth.uid() = id);

-- properties: agentes solo ven sus propiedades en dashboard
CREATE POLICY "Agents can view own properties"
  ON properties FOR SELECT
  USING (auth.uid() = agent_id);

-- properties: público solo ve published
CREATE POLICY "Public can view published properties"
  ON properties FOR SELECT
  USING (status = 'published');

-- property_photos: upload solo en carpeta propia
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND 
              (storage.foldername(name))[1] = auth.uid()::text);

-- property_photos: lectura pública
CREATE POLICY "Public can view property photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');
```

---

## Roadmap de Producto

### MVP Actual (50% completo)

✅ **Implementado:**
- Autenticación (Supabase Auth)
- CRUD propiedades (dashboard privado)
- Sistema de fotos con display_order
- Página pública por slug
- RLS en Storage
- Multi-tenant por agent_id

❌ **Faltante para monetizar:**
- Stripe Billing integration
- Enforcement de límites por plan
- Status workflow (draft/published/archived)
- Búsqueda + filtros funcionales
- Lead capture system
- Analytics dashboard
- Paginación
- Email notifications

---

### Fase 1: Monetización Core (Semanas 1-3)

**Objetivo:** Poder cobrar y entregar valor diferenciado

**Sprint 1.1 — Stripe Billing (Semana 1)**
- [ ] Crear productos en Stripe Dashboard (Premium $49, Elite $99)
- [ ] Migrations: `subscriptions`, `plan_limits`
- [ ] API Routes:
  - `POST /api/stripe/checkout` (crear session)
  - `POST /api/stripe/webhook` (manejar eventos)
  - `POST /api/stripe/portal` (customer portal)
- [ ] Página `/pricing` con cards interactivos
- [ ] Página `/dashboard/billing` con status actual

**Sprint 1.2 — Enforcement de Límites (Semana 1-2)**
- [ ] Helpers: `getAgentLimits()`, `canCreateProperty()`, `canAddPhoto()`
- [ ] Guard en `/dashboard/properties/new` (bloquea si límite alcanzado)
- [ ] Guard en upload de fotos (backend validation)
- [ ] UI: mostrar "X/Y propiedades usadas" con CTA a upgrade
- [ ] UI: disable botón "Nueva Propiedad" si límite alcanzado

**Sprint 1.3 — Status Workflow (Semana 2)**
- [ ] Migration: `ALTER TABLE properties` con enum status
- [ ] RLS: solo `published` visible públicamente
- [ ] UI: toggle Publicar/Despublicar en dashboard
- [ ] Validation: no permitir publish si faltan datos críticos (título, precio, foto)
- [ ] Badge visual: Draft (gris), Published (verde), Archived (rojo)

**Criterio de éxito Fase 1:**
- Poder crear cuenta gratuita
- Poder suscribirse a Premium/Elite vía Stripe
- Límites efectivamente bloqueados
- Propiedades draft no aparecen en búsqueda pública

---

### Fase 2: Conversión y Captación (Semanas 3-4)

**Objetivo:** Capturar leads y convertir visitantes en clientes de pago

**Sprint 2.1 — Lead Capture (Semana 3)**
- [ ] Migration: tabla `property_inquiries`
- [ ] Server Action: `submitInquiry()`
- [ ] Component: `<ContactForm>` en página pública
- [ ] Dashboard: `/dashboard/inquiries` (listado de leads recibidos)
- [ ] Email notification: enviar a agente cuando recibe inquiry
- [ ] Tracking: source field (contact_form, whatsapp_click, phone_click)

**Sprint 2.2 — Pricing Page + Onboarding (Semana 3)**
- [ ] Página `/pricing` pública con comparación de planes
- [ ] Highlight del plan recomendado (Premium)
- [ ] FAQ section (responder objeciones comunes)
- [ ] Testimonials (cuando tengamos)
- [ ] CTA: "Comenzar gratis" → `/signup`
- [ ] Post-signup: redirect a `/dashboard/properties/new` con tooltip

**Sprint 2.3 — Analytics Básico (Semana 4)**
- [ ] Dashboard widget: vistas por propiedad (Supabase Realtime + custom events)
- [ ] Dashboard widget: inquiries por mes (gráfica)
- [ ] Dashboard widget: comparación de precio vs. mercado (media del neighborhood)
- [ ] Restricción: solo visible en Premium/Elite

**Criterio de éxito Fase 2:**
- Lead capture funciona end-to-end
- Email notifications llegan
- Pricing page convierte >5% de visitantes a signup
- Analytics dashboard muestra datos reales

---

### Fase 3: Búsqueda y Descubribilidad (Semanas 4-5)

**Objetivo:** Hacer inventario descubrible y útil para inquilinos

**Sprint 3.1 — Full-Text Search (Semana 4)**
- [ ] Migration: agregar columna `search_vector` (tsvector generated)
- [ ] Índice GIN en `search_vector`
- [ ] API Route: `GET /api/search?q=...`
- [ ] UI: barra de búsqueda en homepage
- [ ] Highlighting de términos en resultados
- [ ] Paginación (20 resultados por página)

**Sprint 3.2 — Filtros Básicos (Semana 5)**
- [ ] Índices en: `price_monthly`, `bedrooms`, `neighborhood`, `furnished`, `pets_allowed`
- [ ] UI: sidebar de filtros con:
  - Rango de precio (slider)
  - # recámaras (radio buttons)
  - Barrio (dropdown, cargado dinámicamente)
  - Amueblado (checkbox)
  - Acepta mascotas (checkbox)
- [ ] Query builder: combinar filtros + search
- [ ] URL persistence: `?q=...&minPrice=...&bedrooms=...`
- [ ] Clear filters button

**Sprint 3.3 — Ordenamiento (Semana 5)**
- [ ] Opciones: Más recientes, Precio (bajo-alto), Precio (alto-bajo), Relevancia
- [ ] Default: Relevancia si hay query, Más recientes si no

**Criterio de éxito Fase 3:**
- Búsqueda encuentra propiedades relevantes
- Filtros reducen resultados correctamente
- Performance <500ms en búsqueda con 1000+ propiedades
- UX intuitiva (sin confusión)

---

### Fase 4: Polish & Optimización (Semanas 6-8)

**Sprint 4.1 — SEO**
- [ ] Metadata dinámico por página (title, description, og:image)
- [ ] Sitemap.xml generado automáticamente
- [ ] robots.txt optimizado
- [ ] Schema.org markup (Product, RealEstateAgent)
- [ ] Canonical URLs
- [ ] Blog: 5 posts iniciales ("Guía renta larga PV", "Mejores colonias", etc.)

**Sprint 4.2 — Performance**
- [ ] Image optimization: Cloudinary auto-transform
- [ ] Lazy loading de fotos
- [ ] Infinite scroll en listados (vs. pagination)
- [ ] Caching: revalidate static pages cada 1hr
- [ ] Database query optimization (explain analyze)

**Sprint 4.3 — Mobile UX**
- [ ] Touch-friendly filters (drawer en mobile)
- [ ] Swipeable photo galleries
- [ ] Click-to-call / click-to-WhatsApp buttons
- [ ] Bottom sheet para contact form
- [ ] PWA manifest (installable)

**Criterio de éxito Fase 4:**
- Lighthouse score >90 en todos los aspectos
- Tiempo de carga <2s en 3G
- SEO: aparecer en top 10 para "rentas puerto vallarta"

---

## Estrategia de Marca

### Naming System: Point2[Destino]

**Marca lanzamiento:** **Point2PV** (Puerto Vallarta)

**Expansión futura:**
- Point2Nayarit
- Point2LosCabos
- Point2Tulum
- Point2PlayaDelCarmen
- Point2Cancún

**Lógica:**
- "Point2" = "apunta a", "dirígete a" (semánticamente poderoso)
- SEO: "Point2PV rentals" tiene cero competencia
- Escalable: mismo logo, solo cambia texto del destino
- Inspirado en modelo Vallarta Adventures → Cabo Adventures

---

### Identidad Visual

**Paleta de color:**
```css
/* Primary */
--navy:        #001F3F  /* Profesional, confiable, oceánico */
--sunset:      #FF6B35  /* Energía, vacaciones, tropicalidad */

/* Neutrals */
--white:       #FFFFFF
--background:  #FAFAFA
--text:        #1F2937
--text-muted:  #6B7280
--border:      #E5E7EB
```

**Tipografía:**
- Display: Montserrat Bold (moderna, geométrica)
- Body: Inter (legibilidad, profesional)

**Logo concept:**
```
┌────────────────────────┐
│   Point2               │  ← Navy, Montserrat Bold 24px
│      PV                │  ← Sunset Orange, Montserrat Regular 20px
│   [location pin]       │  ← Pin minimalista con techo de palapa
└────────────────────────┘
```

**Tagline:** "Rentas modernas. Decisiones inteligentes."

**Aplicación de color por destino:**

| Destino | Primary | Accent |
|---------|---------|--------|
| Point2PV | Navy #001F3F | Sunset Orange #FF6B35 |
| Point2Nayarit | Navy #001F3F | Coral #FF7F50 |
| Point2LosCabos | Navy #001F3F | Desert Gold #D4A574 |
| Point2Tulum | Navy #001F3F | Jungle Green #2D5F3F |

**Lógica:** Navy unifica marca. Accent color localiza destino.

---

### Diferenciadores Clave (Messaging)

1. **"Analytics de mercado en tiempo real"**
   - Precio promedio por m² actualizado diariamente
   - Días promedio en mercado
   - Comparación automática vs. propiedades similares

2. **"Bilingüe desde el ADN"**
   - No es traducción automática
   - Content creado nativamente en inglés y español
   - Soporte en ambos idiomas

3. **"Transparencia total en precios"**
   - No hay sorpresas
   - Suscripción fija, no comisiones ocultas
   - Breakdown de costos visible (renta + utilities + fees)

4. **"Tecnología que funciona"**
   - Mobile-first (no "responsive como afterthought")
   - Búsqueda inteligente
   - Notificaciones en tiempo real

---

## Go-to-Market Strategy

### Pre-Launch (4 semanas antes)

**Semana -4 a -3: Landing Page + Waitlist**
- Landing page simple con:
  - Hero: "La primera plataforma moderna de rentas en Puerto Vallarta"
  - 3 value props con iconos
  - Email capture: "Sé de los primeros en listar gratis"
  - CTA secundario: "¿Eres agente? Agenda demo"
- Tráfico inicial:
  - Posts en grupos Facebook expats (PV Talk, PV Expats, 30K+ miembros)
  - LinkedIn outreach a brokers de PV
  - Google Ads hyperlocal ($10/día): "Renta tu casa Vallarta"
- **Meta: 100 emails en waitlist**

**Semana -2 a -1: Propiedades Semilla**
- Outreach directo a:
  - 3 colegas Coldwell Banker con rentas
  - 5 propietarios directos (FB groups "casa en renta Vallarta")
  - 2 property managers pequeños
- Oferta:
  - Listado gratis por 6 meses
  - Featured placement garantizado
  - Feedback directo en desarrollo
- **Meta: 10 propiedades listadas antes de launch**

---

### Launch Público (Mes 1)

**Semana 1: Soft Launch**
- Email a waitlist: "Ya estamos live 🎉"
- Press release a medios locales:
  - Vallarta Daily News
  - Vallarta Tribune
  - PV Mirror
- Partnership con 1-2 influencers locales (tour de propiedades + promo)
- Ads agresivos ($1,500 budget):
  - Google Ads: "rentas puerto vallarta", "apartments PV"
  - Meta Ads: target expats 30-55 años, interés en "real estate investing"

**Semana 2-4: Iteration + Feedback Loop**
- Daily standup con early adopters
- Fix bugs críticos en <24hr
- Agregar features rápidos que pidan (ej: WhatsApp button)
- Publicar case study: "Cómo [Agente X] rentó 3 propiedades en 2 semanas con Point2PV"

**Meta Mes 1:**
- 50 propiedades activas
- 500 usuarios registrados
- 10 suscripciones de pago ($500 MRR)
- Aparecer en primera página Google para "rentas vallarta"

---

### Meses 2-6: Growth Loop

**Content Marketing:**
- 2 blog posts/semana sobre:
  - Guías de barrios ("Zona Romántica vs. Versalles: dónde vivir")
  - Tips de renta ("Checklist antes de firmar contrato")
  - Data reports ("Estado del mercado de rentas Q1 2025")
- Guest posts en blogs de expats
- YouTube: tours de propiedades destacadas

**Partnerships:**
- Cross-promo con:
  - Servicios de mudanza
  - Tiendas de muebles
  - Utilities setup (CFE, Telmex)
  - Administradoras de condos
- Revenue share: 10% de referrals

**Community Building:**
- Grupo privado de Facebook para propietarios
- Webinar mensual: "Office hours con Point2PV"
- Spotlight semanal de propiedad en Instagram

**Meta Mes 6:**
- 200 propiedades activas
- 30 suscripciones de pago ($1,500 MRR)
- Break-even operativo

---

## Expansión Geográfica

### Criterio de Expansión

**Solo expandir cuando Point2PV alcanza:**
- ✅ 200+ propiedades activas
- ✅ 30+ suscripciones de pago
- ✅ $5K+ MRR
- ✅ 80% de procesos automatizados (no requiere tiempo completo)
- ✅ NPS >50

**Regla de 3x:** Nuevo destino no puede consumir >33% de recursos (tiempo/dinero).

---

### Secuencia de Expansión

**Destino 2: Point2Nayarit (Meses 12-18)**
- **Rationale:** Adyacencia geográfica (puedo servir personalmente), mercado similar
- **Strategy:** Mismo playbook, misma instancia técnica (filtro por región), marketing local
- **Investment:** $2K en ads locales
- **Meta:** 100 propiedades en 6 meses, $2K MRR adicional

**Destino 3: Point2LosCabos (Meses 18-24)**
- **Rationale:** Mercado más grande que PV, demografía similar
- **Strategy:** Requiere hiring de community manager local (part-time)
- **Investment:** $5K (marketing + primer mes de salario CM)
- **Meta:** 200 propiedades en 6 meses, $5K MRR adicional

**Destino 4: Point2Tulum (Meses 24-36)**
- **Rationale:** Mercado premium, alta inversión extranjera
- **Strategy:** Partnership con broker local establecido (revenue share 20%)
- **Investment:** $10K (marketing + tech customization)
- **Meta:** 150 propiedades en 6 meses, $4K MRR adicional

**ARR Año 3 proyectado (4 destinos):** $180K

---

### Mitigación de Riesgos Multi-Destino

**Riesgo: Dilución de enfoque**
- Mitigación: No expandir hasta dominar mercado actual (criterios arriba)

**Riesgo: Complejidad operativa**
- Mitigación: Playbook documentado + hiring local antes de launch

**Riesgo: Capital intensivo**
- Mitigación: Financiar expansión con revenue de destino anterior (bootstrapped)

**Riesgo: Inconsistencia de marca**
- Mitigación: Brand guidelines estrictos + QA checklist pre-launch

**Riesgo: Legal/regulaciones**
- Mitigación: Lawyer review de términos por destino + disclaimer de responsabilidad

---

## Métricas de Éxito

### North Star Metric

**MRR (Monthly Recurring Revenue)**

Razón: refleja salud del negocio SaaS, predice ARR, guía decisiones de producto.

---

### KPIs por Fase

**Fase 1 (Meses 1-6): Validación**
- Primary: MRR ($0 → $1,500)
- Secondary: # propiedades activas (0 → 200)
- Tertiary: Conversion rate signup → paid (target: 10%)

**Fase 2 (Meses 7-12): Growth**
- Primary: MRR ($1,500 → $5,000)
- Secondary: CAC (Cost to Acquire Customer) <$50
- Tertiary: Churn rate <5%/mes

**Fase 3 (Meses 13-24): Expansion**
- Primary: Multi-destino MRR ($5K → $15K)
- Secondary: NPS (Net Promoter Score) >50
- Tertiary: Organic traffic % (target: 40% del total)

---

### Dashboard de Métricas (a construir en Fase 2)

**Revenue:**
- MRR, ARR
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)
- LTV:CAC ratio (target: >3:1)

**Growth:**
- New signups/mes
- Paid conversions/mes
- Churn rate
- Reactivation rate

**Engagement:**
- Properties published/mes
- Inquiries generated/mes
- Avg. time to first inquiry
- Photos uploaded/mes

**Marketing:**
- CAC por canal
- Organic vs. paid traffic
- Top landing pages
- Conversion funnel (view → signup → paid)

---

## Anexos

### A. Tecnologías Evaluadas (y por qué no)

**Firebase vs. Supabase:**
- Elegimos Supabase: PostgreSQL > Firestore para queries complejas, RLS nativo, pricing predecible.

**Prisma vs. Query Builder:**
- Elegimos Query Builder de Supabase: menos overhead, tipos auto-generados, realtime integrado.

**Tailwind vs. CSS-in-JS:**
- Elegimos Tailwind: velocity en desarrollo, bundle size pequeño, utility-first.

**Vercel vs. Railway/Render:**
- Elegimos Vercel: integración perfecta con Next.js, edge functions, analytics incluido.

---

### B. Contingencias

**¿Qué pasa si no alcanzamos 10 suscripciones en Mes 1?**
- Pivote: ofrecer mes gratis de Premium a primeros 20 agentes
- Intensificar outreach directo (llamadas, no solo ads)
- Reducir precio Premium temporalmente a $39/mes

**¿Qué pasa si Stripe rechaza nuestra cuenta?**
- Backup: PayPal Subscriptions (fees más altos pero funcional)
- Largo plazo: incorporar en Delaware para acceso a mejor banking

**¿Qué pasa si aparece competidor con funding?**
- Defensa: velocidad de ejecución + conocimiento local + relaciones en PV
- Ofensiva: lock-in con data moat (analytics) y contratos anuales con descuento

---

### C. Exit Strategy (opcional, para inversionistas)

**Potenciales adquirentes:**
- Zillow/Trulia (expanding to Mexico)
- Compass (international expansion)
- CoStar Group (commercial + residential)
- Local brokerages grandes (consolidación)

**Valuación esperada Año 3:**
- $180K ARR × 5-8x multiple SaaS = $900K - $1.4M

**Trigger de exit:**
- Oferta >$1M
- Alcanzar $20K MRR sin path claro a $50K (plateau)
- Oportunidad de join competidor como acqui-hire

---

## Contacto

**Founder:** Kali Tovar  
**Email:** kali.tovar@cblacosta.com 
**Location:** Puerto Vallarta, Jalisco, México  
**LinkedIn:** https://www.linkedin.com/in/kalitovar 

---

**Última actualización:** Febrero 2025  
**Versión:** 1.0  
**Status:** Pre-launch (Fase de desarrollo técnico)

---

## Licencia

Este documento es confidencial y propietario. No distribuir sin autorización.
