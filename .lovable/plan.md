

# Optimisation des performances de chargement

## Problemes identifies

Apres analyse du code, voici les principales causes de lenteur :

### 1. Import de `cordova-plugin-purchase` sur le web (impact majeur)
Le fichier `StoreProvider.tsx` importe `cordova-plugin-purchase` de maniere globale. Ce plugin est lourd et n'est utile que sur les apps natives (iOS/Android). Sur le web, il se charge inutilement a chaque visite, bloquant le rendu initial.

Le fichier `use-trial.tsx` fait egalement un `import 'cordova-plugin-purchase'` au top level.

### 2. Script externe TradeDoubler bloquant dans `index.html`
Le script TradeDoubler dans le `<head>` est charge de maniere synchrone (malgre `async=1` dans le code genere), ce qui peut retarder le rendu de la page.

### 3. Prefetch inutiles dans `index.html`
Les `<link rel="prefetch">` pour `/formation`, `/tarifs`, `/guides` tentent de prefetcher des documents SPA qui n'existent pas en tant que fichiers statiques, generant des requetes inutiles.

### 4. Service Worker qui met en cache `index.html` (risque de cache perime)
Le SW met `/` et `/index.html` dans le cache statique a l'installation, ce qui peut servir une version perimee lors de la navigation.

### 5. Realtime Supabase trop agressif dans `useNotifications`
Le hook ecoute 6 canaux realtime differents (INSERT/UPDATE sur 3 tables), chaque evenement declenchant un `fetchNotifications()` complet. Sur des tables actives, ca cree un flux constant de requetes.

---

## Plan d'optimisation

### Etape 1 : Lazy-load de `cordova-plugin-purchase` (gain majeur)
- Dans `StoreProvider.tsx` : supprimer l'import statique `import 'cordova-plugin-purchase'` et ne charger le plugin que si `Capacitor.isNativePlatform()` est vrai
- Dans `use-trial.tsx` : meme chose, supprimer l'import statique au top level
- Cela supprime un module lourd du bundle web

### Etape 2 : Deplacer le script TradeDoubler en fin de `<body>`
- Deplacer le script TradeDoubler juste avant la fermeture `</body>` pour ne pas bloquer le rendu

### Etape 3 : Supprimer les prefetch inutiles dans `index.html`
- Retirer les 3 lignes `<link rel="prefetch">` qui ne servent a rien dans une SPA

### Etape 4 : Retirer `/` et `/index.html` du cache statique du Service Worker
- Supprimer ces entrees de `STATIC_ASSETS` dans `sw.js` pour eviter de servir un shell HTML perime

### Etape 5 : Debounce du realtime dans `useNotifications`
- Ajouter un debounce de 2 secondes sur les callbacks realtime pour eviter les rafales de requetes quand plusieurs evenements arrivent en meme temps

---

## Details techniques

### Fichiers modifies
1. `src/components/StoreProvider.tsx` - Suppression de `import 'cordova-plugin-purchase'`, chargement dynamique conditionnel
2. `src/hooks/use-trial.tsx` - Suppression de `import 'cordova-plugin-purchase'`, chargement dynamique conditionnel
3. `index.html` - Deplacer TradeDoubler, supprimer prefetch
4. `public/sw.js` - Nettoyer STATIC_ASSETS
5. `src/hooks/use-notifications.tsx` - Ajouter debounce sur les callbacks realtime

### Impact attendu
- Reduction significative du bundle JavaScript charge sur le web (suppression cordova-plugin-purchase)
- Rendu initial plus rapide (script TradeDoubler non bloquant)
- Moins de requetes reseau inutiles (suppression prefetch + debounce notifications)
- Cache plus fiable (pas de HTML perime servi par le SW)

