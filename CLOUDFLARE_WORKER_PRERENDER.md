# Configuration Cloudflare Worker pour Prerender.io

## Prérequis

1. Compte Cloudflare avec domaine `amzingfba.com` configuré
2. Compte Prerender.io avec token API
3. Plan Cloudflare (gratuit suffit pour Workers)

---

## Étape 1 : Créer le Worker

1. Connecte-toi à [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Va dans **Workers & Pages** → **Create application** → **Create Worker**
3. Nomme-le `prerender-middleware`
4. Clique **Deploy**
5. Clique **Edit code** et remplace tout par le code ci-dessous :

```javascript
// Cloudflare Worker pour Prerender.io
// Remplace YOUR_PRERENDER_TOKEN par ton token Prerender.io

const PRERENDER_TOKEN = 'YOUR_PRERENDER_TOKEN';
const ORIGIN_URL = 'https://6c002a1c-db75-4b68-b43b-8e5c9b112692.lovableproject.com';

// User agents des bots à rediriger vers Prerender
const BOT_AGENTS = [
  'googlebot',
  'yahoo! slurp',
  'bingbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest/0.',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'whatsapp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'discordbot',
  'google page speed',
  'qwantify',
  'pinterestbot',
  'bitrix link preview',
  'xing-contenttabreceiver',
  'chrome-lighthouse',
  'telegrambot'
];

// Extensions à ignorer (fichiers statiques)
const IGNORE_EXTENSIONS = [
  '.js', '.css', '.xml', '.less', '.png', '.jpg', '.jpeg', '.gif', '.pdf',
  '.doc', '.txt', '.ico', '.rss', '.zip', '.mp3', '.rar', '.exe', '.wmv',
  '.avi', '.ppt', '.mpg', '.mpeg', '.tif', '.wav', '.mov', '.psd', '.ai',
  '.xls', '.mp4', '.m4a', '.swf', '.dat', '.dmg', '.iso', '.flv', '.m4v',
  '.torrent', '.woff', '.woff2', '.ttf', '.svg', '.webp', '.webm', '.map'
];

function isBot(userAgent) {
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some(bot => ua.includes(bot));
}

function shouldIgnore(pathname) {
  return IGNORE_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext));
}

function isPrerender(request) {
  return request.headers.get('X-Prerender') === '1';
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('User-Agent') || '';
  
  // Ne pas traiter les fichiers statiques
  if (shouldIgnore(url.pathname)) {
    return fetch(ORIGIN_URL + url.pathname + url.search, {
      headers: request.headers,
    });
  }
  
  // Éviter les boucles infinies
  if (isPrerender(request)) {
    return fetch(ORIGIN_URL + url.pathname + url.search, {
      headers: request.headers,
    });
  }
  
  // Si c'est un bot, utiliser Prerender.io
  if (isBot(userAgent)) {
    const prerenderUrl = `https://service.prerender.io/${url.href}`;
    
    const prerenderResponse = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': PRERENDER_TOKEN,
        'X-Prerender-Int-Type': 'cloudflare',
      },
      redirect: 'manual',
    });
    
    // Si Prerender renvoie une erreur, fallback vers l'origine
    if (!prerenderResponse.ok && prerenderResponse.status !== 304) {
      console.log(`Prerender error ${prerenderResponse.status}, falling back to origin`);
      return fetch(ORIGIN_URL + url.pathname + url.search, {
        headers: request.headers,
      });
    }
    
    // Créer une nouvelle réponse avec le contenu prérendu
    const body = await prerenderResponse.text();
    return new Response(body, {
      status: prerenderResponse.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'X-Prerendered': 'true',
      },
    });
  }
  
  // Utilisateur normal : rediriger vers l'origine Lovable
  return fetch(ORIGIN_URL + url.pathname + url.search, {
    headers: request.headers,
  });
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
```

6. Clique **Save and deploy**

---

## Étape 2 : Configurer la Route

1. Dans Cloudflare, va dans **Workers & Pages**
2. Clique sur ton Worker `prerender-middleware`
3. Va dans l'onglet **Triggers**
4. Sous **Routes**, clique **Add route**
5. Configure :
   - **Route** : `amzingfba.com/*`
   - **Zone** : `amzingfba.com`
6. Clique **Save**
7. Répète pour `www.amzingfba.com/*` si nécessaire

---

## Étape 3 : Obtenir le Token Prerender.io

1. Va sur [prerender.io](https://prerender.io) et crée un compte
2. Dans le dashboard, copie ton **Token** (Settings → Integration)
3. Retourne dans le code du Worker et remplace `YOUR_PRERENDER_TOKEN` par ton vrai token
4. Re-déploie le Worker

---

## Étape 4 : Configurer le Cache Prerender.io

Dans le dashboard Prerender.io :

1. **Crawl Settings** :
   - Active **JavaScript rendering**
   - Timeout : 20 secondes
   - Wait for : 3 secondes après le dernier réseau

2. **Cache Settings** :
   - Cache duration : 7 jours
   - Active **Automatic recache**

3. **Whitelist URLs** (optionnel mais recommandé) :
   Ajoute les URLs prioritaires :
   ```
   https://www.amzingfba.com/
   https://www.amzingfba.com/formation
   https://www.amzingfba.com/services
   https://www.amzingfba.com/tarifs
   https://www.amzingfba.com/guides
   https://www.amzingfba.com/contact
   https://www.amzingfba.com/faq
   https://www.amzingfba.com/mentions-legales
   https://www.amzingfba.com/cgv
   https://www.amzingfba.com/confidentialite
   ```

---

## Étape 5 : Tester

### Test manuel avec curl :
```bash
# Simuler Googlebot
curl -A "Googlebot/2.1" https://www.amzingfba.com/formation

# Vérifier les headers
curl -I -A "Googlebot/2.1" https://www.amzingfba.com/formation
# Doit contenir : X-Prerendered: true
```

### Test dans le navigateur :
1. Installe l'extension [User-Agent Switcher](https://chrome.google.com/webstore/detail/user-agent-switcher-for-c/djflhoibgkdhkhhcedjiklpkjnoahfmg)
2. Change le User-Agent en "Googlebot"
3. Visite `https://www.amzingfba.com/formation`
4. Fais **Ctrl+U** (View Source) — tu dois voir le HTML complet, pas un shell JavaScript

### Test Google Search Console :
1. Va dans [Search Console](https://search.google.com/search-console)
2. **Inspection d'URL** → Entre `https://www.amzingfba.com/formation`
3. Clique **Tester l'URL en ligne**
4. Vérifie que le HTML rendu contient tout le contenu

---

## Étape 6 : Demander un recrawl

Une fois tout configuré :

1. Dans Google Search Console, inspecte chaque URL prioritaire
2. Clique **Demander l'indexation**
3. Attends 24-48h pour voir les résultats

---

## Dépannage

### Le Worker ne fonctionne pas
- Vérifie que la route est bien configurée sur la bonne zone
- Vérifie les logs dans **Workers & Pages** → **Logs**

### Prerender renvoie une erreur 403
- Vérifie que le token est correct
- Vérifie que le domaine est autorisé dans Prerender.io

### Le contenu n'est pas rendu
- Augmente le timeout dans Prerender.io
- Vérifie que le site charge correctement sans JavaScript désactivé

### Google ne voit toujours pas le contenu
- Attends que le cache Prerender.io se remplisse
- Force un recache dans le dashboard Prerender.io
- Re-demande l'indexation dans Search Console

---

## Coûts

- **Cloudflare Workers** : Gratuit jusqu'à 100 000 requêtes/jour
- **Prerender.io** : 
  - Gratuit : 250 pages/mois
  - Starter : $15/mois pour 1 000 pages
  - Pro : $50/mois pour 10 000 pages

Pour un site avec ~15 pages publiques et quelques milliers de visites de bots/mois, le plan gratuit ou Starter devrait suffire.
