# Guide de Migration React/Vite vers Next.js App Router

## Vue d'ensemble

Ce guide détaille la migration du projet AMZing FBA de React/Vite vers Next.js 14+ avec App Router pour un SEO optimal et un déploiement sur Vercel.

**Durée estimée :** 2-3 semaines  
**Complexité :** Élevée  
**Pages à migrer :** ~70 routes

---

## Phase 1 : Préparation (Jour 1-2)

### 1.1 Exporter le projet depuis Lovable

1. Dans Lovable, cliquez sur **GitHub → Connect to GitHub**
2. Créez un nouveau repository (ex: `amzing-fba-nextjs`)
3. Clonez le repo localement :
```bash
git clone https://github.com/votre-username/amzing-fba-nextjs.git
cd amzing-fba-nextjs
```

### 1.2 Créer un nouveau projet Next.js

```bash
# Dans un dossier séparé
npx create-next-app@latest amzing-fba-next --typescript --tailwind --eslint --app --src-dir
cd amzing-fba-next
```

Options recommandées :
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ `src/` directory
- ✅ App Router
- ❌ Turbopack (optionnel)

### 1.3 Installer les dépendances

```bash
# Dépendances principales
npm install @supabase/supabase-js @tanstack/react-query
npm install lucide-react date-fns zod
npm install react-hook-form @hookform/resolvers
npm install recharts sonner vaul

# UI Components (shadcn/ui)
npx shadcn@latest init
npx shadcn@latest add button card dialog input label select toast tabs accordion alert avatar badge breadcrumb calendar checkbox dropdown-menu form popover progress scroll-area separator sheet skeleton slider switch table textarea toggle tooltip

# Capacitor (si apps mobiles)
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm install @capacitor/push-notifications @capacitor/browser
```

---

## Phase 2 : Structure du Projet (Jour 2-3)

### 2.1 Architecture des dossiers

```
src/
├── app/                          # App Router pages
│   ├── (public)/                 # Routes publiques (marketing)
│   │   ├── page.tsx              # / (Index)
│   │   ├── formation/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── tarifs/
│   │   │   └── page.tsx
│   │   ├── guides/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Layout public avec Navbar/Footer
│   │
│   ├── (auth)/                   # Routes authentification
│   │   ├── auth/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │   │   └── page.tsx
│   │
│   ├── (dashboard)/              # Routes VIP (protégées)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── catalogue/
│   │   │   └── page.tsx
│   │   ├── chat/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Layout dashboard avec sidebar
│   │
│   ├── (admin)/                  # Routes admin
│   │   ├── admin-profiles/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (legal)/                  # Routes légales
│   │   ├── mentions-legales/
│   │   │   └── page.tsx
│   │   ├── cgv/
│   │   │   └── page.tsx
│   │   ├── cgu/
│   │   │   └── page.tsx
│   │   ├── confidentialite/
│   │   │   └── page.tsx
│   │   └── refund/
│   │       └── page.tsx
│   │
│   ├── api/                      # API Routes (remplace Edge Functions)
│   │   ├── create-checkout/
│   │   │   └── route.ts
│   │   ├── stripe-webhook/
│   │   │   └── route.ts
│   │   └── ...
│   │
│   ├── globals.css               # Styles globaux (copier index.css)
│   ├── layout.tsx                # Root layout
│   └── not-found.tsx             # 404 page
│
├── components/                   # Composants React
│   ├── ui/                       # shadcn/ui components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
│
├── hooks/                        # Custom hooks
├── lib/                          # Utilitaires
│   ├── supabase/
│   │   ├── client.ts             # Client browser
│   │   └── server.ts             # Client server
│   └── utils.ts
│
└── types/                        # Types TypeScript
```

### 2.2 Configuration Supabase pour Next.js

**`src/lib/supabase/client.ts`** (côté client)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`src/lib/supabase/server.ts`** (côté serveur)
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

Installer le package SSR :
```bash
npm install @supabase/ssr
```

---

## Phase 3 : Migration des Pages (Jour 4-10)

### 3.1 Pattern de conversion des pages

**Avant (React/Vite) :**
```tsx
// src/pages/Formation.tsx
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Formation = () => {
  return (
    <div>
      <SEO title="Formation" description="..." />
      <Navbar />
      <main>...</main>
      <Footer />
    </div>
  );
};

export default Formation;
```

**Après (Next.js App Router) :**
```tsx
// src/app/(public)/formation/page.tsx
import { Metadata } from 'next'
import FormationContent from './FormationContent'

export const metadata: Metadata = {
  title: 'Formation Amazon FBA - AMZing FBA',
  description: 'Apprends à lancer ton business Amazon FBA rentable...',
  openGraph: {
    title: 'Formation Amazon FBA - AMZing FBA',
    description: '...',
    images: ['/og-formation.png'],
  },
}

export default function FormationPage() {
  return <FormationContent />
}
```

```tsx
// src/app/(public)/formation/FormationContent.tsx
'use client'

import { useEffect } from 'react'
// ... composants

export default function FormationContent() {
  // Logique client-side ici
  return (
    <main>...</main>
  )
}
```

### 3.2 Gestion du SEO avec Metadata API

**Metadata statique :**
```tsx
// src/app/(public)/formation/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formation Amazon FBA | AMZing FBA',
  description: '...',
  keywords: ['formation amazon fba', 'business e-commerce'],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.amzingfba.com/formation',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.amzingfba.com/formation',
    siteName: 'AMZing FBA',
    title: 'Formation Amazon FBA',
    description: '...',
    images: [{
      url: '/og-formation.png',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formation Amazon FBA',
    description: '...',
  },
}
```

**Metadata dynamique :**
```tsx
// src/app/(public)/guides/[slug]/page.tsx
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await getGuide(params.slug)
  
  return {
    title: guide.title,
    description: guide.description,
  }
}
```

### 3.3 Migration des hooks d'authentification

**`src/hooks/use-auth.tsx`** (version Next.js)
```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { useEffect, useState, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### 3.4 Layouts partagés

**Root Layout (`src/app/layout.tsx`):**
```tsx
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/hooks/use-auth'
import { Toaster } from '@/components/ui/sonner'
import QueryProvider from '@/components/QueryProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    template: '%s | AMZing FBA',
    default: 'AMZing FBA - Formation Amazon FBA',
  },
  description: 'Lance ton business Amazon FBA rentable',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
```

**Public Layout (`src/app/(public)/layout.tsx`):**
```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
```

---

## Phase 4 : API Routes (Jour 10-12)

### 4.1 Migration des Edge Functions vers API Routes

**Avant (Supabase Edge Function):**
```typescript
// supabase/functions/create-checkout/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@18.5.0"

serve(async (req) => {
  // ...
})
```

**Après (Next.js API Route):**
```typescript
// src/app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{ price: 'price_xxx', quantity: 1 }],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/success`,
      cancel_url: `${request.headers.get('origin')}/tarifs`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### 4.2 Webhook Stripe

```typescript
// src/app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful payment
      break
    case 'customer.subscription.deleted':
      // Handle cancellation
      break
  }

  return NextResponse.json({ received: true })
}
```

---

## Phase 5 : Capacitor Integration (Jour 12-14)

### 5.1 Configuration pour Next.js + Capacitor

Next.js avec Capacitor nécessite l'export statique :

**`next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static export pour Capacitor
  trailingSlash: true,
  images: {
    unoptimized: true,  // Nécessaire pour export statique
  },
}

module.exports = nextConfig
```

**⚠️ Limitation importante :**  
Avec `output: 'export'`, vous perdez :
- Les API Routes (utiliser Supabase Edge Functions à la place)
- Le SSR dynamique (tout devient statique)
- Les fonctionnalités serveur de Next.js

### 5.2 Alternative recommandée : Projet séparé

Garder deux projets :
1. **Next.js** pour le web (SSR complet, SEO optimal)
2. **React/Vite + Capacitor** pour mobile (projet actuel)

Les deux partagent :
- Supabase (même backend)
- Edge Functions
- Composants UI (via npm package ou monorepo)

---

## Phase 6 : Variables d'environnement

### 6.1 Fichier `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wvmfzlogijvqcsgablrb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Other
NEXT_PUBLIC_APP_URL=https://www.amzingfba.com
```

### 6.2 Configuration Vercel

1. Connectez le repo GitHub à Vercel
2. Ajoutez toutes les variables d'environnement dans Settings → Environment Variables
3. Configurez le domaine personnalisé

---

## Phase 7 : Déploiement Vercel (Jour 14-15)

### 7.1 Configuration `vercel.json`

```json
{
  "framework": "nextjs",
  "regions": ["cdg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 7.2 Déploiement

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Production
vercel --prod
```

---

## Checklist de Migration

### Pages publiques (SEO prioritaire)
- [ ] `/` (Index)
- [ ] `/formation`
- [ ] `/services`
- [ ] `/tarifs`
- [ ] `/guides`
- [ ] `/contact`
- [ ] `/faq`
- [ ] `/mentions-legales`
- [ ] `/cgv`
- [ ] `/cgu`
- [ ] `/confidentialite`
- [ ] `/refund`

### Pages authentification
- [ ] `/auth`
- [ ] `/forgot-password`
- [ ] `/reset-password`

### Pages VIP (noindex)
- [ ] `/dashboard`
- [ ] `/catalogue`
- [ ] `/chat`
- [ ] `/profile`
- [ ] `/produits-qogita`
- [ ] `/produits-eany`
- [ ] `/marketplace`
- [ ] ... (autres pages VIP)

### Pages Admin
- [ ] `/admin-profiles`
- [ ] `/admin-alerts`
- [ ] `/admin-tickets`
- [ ] ... (autres pages admin)

### API Routes
- [ ] `create-checkout`
- [ ] `stripe-webhook`
- [ ] `cancel-subscription`
- [ ] ... (autres edge functions)

### Configuration
- [ ] Variables d'environnement
- [ ] Domaine Vercel
- [ ] Webhook Stripe (nouvelle URL)
- [ ] Tests E2E

---

## Ressources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [shadcn/ui](https://ui.shadcn.com/)

---

## Support

Pour toute question sur la migration, contactez contact@amzingfba.com
