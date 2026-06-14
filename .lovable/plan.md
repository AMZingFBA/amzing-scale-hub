# Générateur de blog IA — Admin AMZing FBA

## Vue d'ensemble

Aujourd'hui les articles de blog sont **statiques** (fichiers TS hardcodés dans `src/lib/blog-articles-*.ts` puis agrégés dans `blog-data.ts`). On ajoute une couche **dynamique** en base de données pour les articles générés par IA, **sans toucher** aux articles statiques existants ni à leur rendu visuel. Le rendu public réutilise exactement le composant `BlogPost.tsx` actuel.

## 1. Base de données (Lovable Cloud)

Nouvelle table `blog_posts` :
- `slug` (unique), `title`, `meta_title`, `meta_description`
- `excerpt`, `content` (markdown/HTML), `category`, `keywords[]`, `related_slugs[]`
- `cover_image` (url storage), `images` (jsonb : url + alt + position)
- `faqs` (jsonb)
- `status` : `draft` | `published`
- `author_id`, `published_at`, `created_at`, `updated_at`

RLS :
- `SELECT` public uniquement si `status = 'published'`
- `INSERT/UPDATE/DELETE` réservé au rôle `admin` (via `has_role(auth.uid(), 'admin')`)

Bucket Storage public `blog-ai-images` pour les images générées.

## 2. Edge functions (clés IA côté serveur)

- `admin-blog-generate` — vérifie le JWT + rôle admin, appelle Lovable AI Gateway (`google/gemini-3-flash-preview`) pour produire en JSON structuré : intro, sections H2/H3, FAQ, meta, slug, alt-text d'images. Génère ensuite N images via `openai/gpt-image-2`, les upload dans le bucket, et insère le post en `draft` ou `published`.
- `admin-blog-update` / `admin-blog-delete` — mutations sécurisées admin uniquement.

Toutes les clés (`LOVABLE_API_KEY`) restent server-side.

## 3. Pages admin (`/admin/...`)

- **`/admin/blog-generator`** — formulaire (titre, mots-clés principaux/secondaires, nb d'images, ton, catégorie, statut, meta title/description, slug auto-éditable). Bouton "Générer" → loader → aperçu éditable → "Publier" ou "Enregistrer brouillon".
- **`/admin/blog-articles`** — liste des articles générés (filtre publié/brouillon), actions : voir / modifier / publier-dépublier / supprimer.

Garde : route protégée + check `has_role` côté UI et RLS côté backend.

## 4. Rendu public

- `getArticleBySlug` étendu : si pas trouvé dans le statique, requête `blog_posts` (published) en DB.
- `Blog.tsx` fusionne les deux sources pour la liste.
- `BlogPost.tsx` **inchangé visuellement** : même mise en page, sidebar, FAQ, JSON-LD. Les articles IA respectent la même `interface BlogArticle`.

## 5. SEO

JSON-LD `Article` + `FAQPage` déjà géré par `BlogPost.tsx` — fonctionnera automatiquement. Images avec alt text généré par l'IA. Sitemap : ajout dynamique au build (phase 2, optionnel).

## Détails techniques

- Le prompt IA exige un JSON strict respectant `BlogArticle` (validation Zod côté edge function).
- Génération images : streaming désactivé, on stocke le PNG final dans le bucket et on stocke l'URL publique.
- Slug auto = slugify(title) avec dédoublonnage en DB.
- Aucune modification des fichiers `blog-articles-*.ts` existants.

## Fichiers créés / modifiés

Créés :
- Migration `blog_posts` + bucket
- `supabase/functions/admin-blog-generate/index.ts`
- `supabase/functions/admin-blog-update/index.ts` (+ delete)
- `src/pages/AdminBlogGenerator.tsx`
- `src/pages/AdminBlogArticles.tsx`
- `src/lib/blog-db.ts` (helpers fetch DB articles)

Modifiés :
- `src/App.tsx` (routes admin)
- `src/lib/blog-data.ts` (`getArticleBySlug` async fallback ou helper séparé)
- `src/pages/Blog.tsx` + `BlogPost.tsx` (chargement DB + statique fusionné — visuel identique)
- Page admin (sidebar/menu) pour ajouter les 2 nouveaux liens

## Estimation

~1h de génération côté agent + coût crédits IA par article généré (texte + N images). L'admin contrôle le volume.

Confirme et je lance l'implémentation.
