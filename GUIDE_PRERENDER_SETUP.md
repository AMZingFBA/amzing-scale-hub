# Guide de Configuration Prerender.io pour AMZing FBA

## Objectif
Permettre à Googlebot et autres crawlers de recevoir du HTML statique complet au lieu d'une page JavaScript vide.

## Étapes de Configuration

### 1. Créer un compte Prerender.io

1. Aller sur [prerender.io](https://prerender.io)
2. Créer un compte (plan gratuit disponible jusqu'à 250 pages/mois)
3. Récupérer votre **Token API** dans le dashboard

### 2. Configurer le middleware selon votre hébergeur

#### Option A: Cloudflare (Recommandé)

1. Aller dans Cloudflare Dashboard > Workers
2. Créer un nouveau Worker avec le code suivant:

```javascript
const PRERENDER_TOKEN = 'VOTRE_TOKEN_PRERENDER';
const PRERENDER_SERVICE_URL = 'https://service.prerender.io/';

const BOT_AGENTS = [
  'googlebot', 'bingbot', 'yandex', 'baiduspider', 'facebookexternalhit',
  'twitterbot', 'linkedinbot', 'pinterest', 'slackbot', 'discordbot',
  'telegrambot', 'whatsapp', 'applebot', 'redditbot'
];

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const url = new URL(request.url);
  
  // Vérifier si c'est un bot
  const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot));
  
  // Exclure les fichiers statiques
  const isStaticFile = /\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|woff2|svg|eot)$/i.test(url.pathname);
  
  if (isBot && !isStaticFile) {
    // Rediriger vers Prerender.io
    const prerenderUrl = PRERENDER_SERVICE_URL + url.href;
    const prerenderResponse = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': PRERENDER_TOKEN
      }
    });
    
    return new Response(prerenderResponse.body, {
      status: prerenderResponse.status,
      headers: {
        'Content-Type': 'text/html',
        'X-Prerendered': 'true'
      }
    });
  }
  
  // Requête normale pour les utilisateurs
  return fetch(request);
}
```

3. Déployer le Worker et l'associer à votre domaine amzingfba.com

#### Option B: Netlify (si hébergé sur Netlify)

Ajouter dans `netlify.toml`:

```toml
[[edge_functions]]
  path = "/*"
  function = "prerender"
```

Créer `netlify/edge-functions/prerender.ts`:

```typescript
import type { Context } from "https://edge.netlify.com";

const PRERENDER_TOKEN = Deno.env.get("PRERENDER_TOKEN") || "";
const BOT_AGENTS = [
  "googlebot", "bingbot", "yandex", "baiduspider", "facebookexternalhit",
  "twitterbot", "linkedinbot", "pinterest", "slackbot", "discordbot"
];

export default async (request: Request, context: Context) => {
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();
  const url = new URL(request.url);
  
  const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot));
  const isStaticFile = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i.test(url.pathname);
  
  if (isBot && !isStaticFile) {
    const prerenderUrl = `https://service.prerender.io/${url.href}`;
    const response = await fetch(prerenderUrl, {
      headers: { "X-Prerender-Token": PRERENDER_TOKEN }
    });
    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": "text/html" }
    });
  }
  
  return context.next();
};
```

#### Option C: Vercel

Créer `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*(googlebot|bingbot|yandex|facebookexternalhit|twitterbot|linkedinbot).*"
        }
      ],
      "destination": "/api/prerender?url=$1"
    }
  ]
}
```

### 3. Configurer les variables d'environnement

Ajouter dans votre hébergeur:
- `PRERENDER_TOKEN`: Votre token Prerender.io

### 4. Tester la configuration

1. **Test manuel avec curl:**
```bash
curl -A "Googlebot" https://amzingfba.com/formation
```

2. **Vérifier les headers de réponse:**
   - Le header `X-Prerendered: true` doit être présent pour les bots

3. **Google Search Console:**
   - Aller dans "Inspection de l'URL"
   - Tester `/formation`
   - Cliquer sur "Afficher la page explorée"
   - Vérifier que le HTML complet est visible

### 5. Forcer le recrawl

Une fois configuré:
1. Aller dans Google Search Console
2. Inspecter chaque URL principale
3. Cliquer sur "Demander l'indexation"

## URLs à prérendériser

Les URLs suivantes sont prioritaires pour le SEO:
- `/` (page d'accueil)
- `/formation`
- `/services`
- `/tarifs`
- `/guides`
- `/creation-societe`
- `/marketplace`
- `/contact`
- `/faq`

## Vérification du bon fonctionnement

### Via l'outil Rich Results Test de Google
1. Aller sur https://search.google.com/test/rich-results
2. Tester `https://amzingfba.com/formation`
3. Vérifier que le contenu est bien visible

### Via Mobile-Friendly Test
1. Aller sur https://search.google.com/test/mobile-friendly
2. Tester les pages principales
3. Cliquer sur "Afficher le HTML rendu"

## Coûts Prerender.io

- **Gratuit**: 250 pages/mois
- **Basic**: $15/mois - 10,000 pages
- **Plus**: $50/mois - 50,000 pages
- **Max**: $200/mois - 500,000 pages

Pour AMZing FBA avec ~15 pages SEO principales, le plan gratuit devrait suffire initialement.

## Alternative gratuite: Rendertron

Si vous préférez une solution self-hosted gratuite:

1. Déployer Rendertron sur Google Cloud Run (gratuit jusqu'à 2M requêtes/mois)
2. Configurer le middleware pour pointer vers votre instance Rendertron

```bash
docker run -p 3000:3000 --name rendertron rendertron/rendertron
```

## Support

En cas de problème, vérifier:
1. Les logs Prerender.io dans le dashboard
2. Les headers de réponse avec les outils de développement
3. Le cache Prerender.io (peut être vidé manuellement)
