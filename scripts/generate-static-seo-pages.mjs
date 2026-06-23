#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const libDir = path.join(rootDir, 'src', 'lib');
const siteUrl = 'https://amzingfba.com';
const defaultImage = `${siteUrl}/logo-amzing.png`;

const indexPath = path.join(distDir, 'index.html');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripMarkdown(value = '') {
  return String(value)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(value = '', maxLength = 500) {
  const cleaned = stripMarkdown(value);
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trim()}…`;
}

function decodeJsString(raw = '') {
  return raw
    .replace(/\\r/g, '\r')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\`/g, '`')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .trim();
}

function readStringAt(source, quoteIndex) {
  const quote = source[quoteIndex];
  let raw = '';
  for (let i = quoteIndex + 1; i < source.length; i += 1) {
    const char = source[i];
    if (char === '\\') {
      raw += char;
      if (i + 1 < source.length) {
        raw += source[i + 1];
        i += 1;
      }
      continue;
    }
    if (char === quote) return decodeJsString(raw);
    raw += char;
  }
  return decodeJsString(raw);
}

function readStringProperty(block, propName) {
  const regex = new RegExp('\\b' + escapeRegex(propName) + '\\s*:\\s*([\"\'`])');
  const match = regex.exec(block);
  if (!match) return '';
  const quoteIndex = match.index + match[0].length - 1;
  return readStringAt(block, quoteIndex);
}

function readStringArrayProperty(block, propName) {
  const startMatch = new RegExp(`\\b${escapeRegex(propName)}\\s*:\\s*\\[`).exec(block);
  if (!startMatch) return [];
  const start = startMatch.index + startMatch[0].length;
  const end = block.indexOf(']', start);
  if (end === -1) return [];
  const arrayBody = block.slice(start, end);
  const values = [];
  for (let i = 0; i < arrayBody.length; i += 1) {
    const char = arrayBody[i];
    if (char === '"' || char === "'" || char === '`') {
      values.push(readStringAt(arrayBody, i));
      let escaped = false;
      for (i += 1; i < arrayBody.length; i += 1) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (arrayBody[i] === '\\') {
          escaped = true;
          continue;
        }
        if (arrayBody[i] === char) break;
      }
    }
  }
  return values;
}

function collectBlogArticles() {
  const articles = new Map();
  const files = fs
    .readdirSync(libDir)
    .filter((file) => /^blog.*\.ts$/.test(file))
    .map((file) => path.join(libDir, file));

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const slugRegex = /\bslug\s*:\s*(["'`])/g;
    let match;

    while ((match = slugRegex.exec(source)) !== null) {
      const slug = readStringAt(source, match.index + match[0].length - 1);
      if (!slug || articles.has(slug)) continue;

      const block = source.slice(match.index, Math.min(source.length, match.index + 9000));
      const title = readStringProperty(block, 'title');
      const metaTitle = readStringProperty(block, 'metaTitle');
      const metaDescription = readStringProperty(block, 'metaDescription');
      const excerpt = readStringProperty(block, 'excerpt');
      const category = readStringProperty(block, 'category');
      const keywords = readStringArrayProperty(block, 'keywords');

      if (!title || !metaTitle || !metaDescription) continue;

      articles.set(slug, {
        slug,
        route: `/blog/${slug}`,
        title,
        metaTitle,
        metaDescription,
        excerpt,
        category,
        keywords,
      });
    }
  }

  return [...articles.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

function replaceOrInsert(html, regex, replacement, before = '</head>') {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace(before, `${replacement}\n${before}`);
}

function setMetaName(html, name, content) {
  const tag = `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}">`;
  return replaceOrInsert(html, new RegExp(`<meta\\s+[^>]*name=["']${escapeRegex(name)}["'][^>]*>`, 'i'), tag);
}

function setMetaProperty(html, property, content) {
  const tag = `<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}">`;
  return replaceOrInsert(html, new RegExp(`<meta\\s+[^>]*property=["']${escapeRegex(property)}["'][^>]*>`, 'i'), tag);
}

function setCanonical(html, canonicalUrl) {
  const tag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`;
  return replaceOrInsert(html, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i, tag);
}

function staticNoscript(route) {
  const heading = route.h1 || route.title;
  const intro = route.excerpt || route.description;
  const keywords = route.keywords?.length ? route.keywords.slice(0, 8) : [];
  const keywordList = keywords.length
    ? `<p><strong>Sujets :</strong> ${escapeHtml(keywords.join(', '))}</p>`
    : '';

  return `<noscript>
      <div id="noscript-seo-content" style="padding:20px;max-width:1100px;margin:0 auto;font-family:Arial,sans-serif;line-height:1.6;color:#111827;background:#fff;">
        <header>
          <p><a href="/blog">← Retour au blog Amazon FBA</a></p>
          <h1>${escapeHtml(heading)}</h1>
          <p>${escapeHtml(intro)}</p>
          ${keywordList}
        </header>
        <main>
          <p>Article AMZing FBA consacré à Amazon FBA, au sourcing, aux outils vendeurs et aux méthodes pour trouver des produits rentables.</p>
          <p><a href="${escapeHtml(route.route)}">Lire l'article complet</a></p>
          <p><a href="/formation">Découvrir la formation Amazon FBA</a> · <a href="/services">Voir les services</a> · <a href="/tarifs">Voir les tarifs</a></p>
        </main>
      </div>
    </noscript>`;
}

function blogIndexNoscript(articles) {
  const links = articles
    .slice(0, 40)
    .map((article) => `<li><a href="/blog/${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a></li>`)
    .join('\n');

  return `<noscript>
      <div id="noscript-seo-content" style="padding:20px;max-width:1100px;margin:0 auto;font-family:Arial,sans-serif;line-height:1.6;color:#111827;background:#fff;">
        <header>
          <h1>Blog Amazon FBA : guides, Keepa, SellerAmp et produits rentables</h1>
          <p>Guides pratiques pour comprendre Amazon FBA, choisir une formation, utiliser Keepa/SellerAmp et trouver des fournisseurs ou produits rentables.</p>
        </header>
        <main>
          <ul>${links}</ul>
        </main>
      </div>
    </noscript>`;
}

function replaceBodyNoscript(html, noscriptHtml) {
  const regex = /<noscript>\s*<div id="noscript-seo-content"[\s\S]*?<\/div>\s*<\/noscript>/i;
  if (regex.test(html)) return html.replace(regex, noscriptHtml);
  return html.replace('<div id="root"></div>', `${noscriptHtml}\n    <div id="root"></div>`);
}

function injectJsonLd(html, schema) {
  const script = `<script type="application/ld+json" data-static-seo="true">${JSON.stringify(schema)}</script>`;
  return html.replace('</head>', `    ${script}\n  </head>`);
}

function applySeo(baseHtml, route) {
  const canonicalUrl = `${siteUrl}${route.route}`;
  const title = normalizeText(route.title, 70);
  const description = normalizeText(route.description, 165);
  const keywords = route.keywords?.join(', ') || '';

  let html = baseHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = setMetaName(html, 'description', description);
  if (keywords) html = setMetaName(html, 'keywords', keywords);
  html = setMetaName(html, 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  html = setMetaName(html, 'googlebot', 'index, follow');
  html = setMetaProperty(html, 'og:type', route.type || 'article');
  html = setMetaProperty(html, 'og:site_name', 'AMZing FBA');
  html = setMetaProperty(html, 'og:url', canonicalUrl);
  html = setMetaProperty(html, 'og:title', title);
  html = setMetaProperty(html, 'og:description', description);
  html = setMetaProperty(html, 'og:image', route.image || defaultImage);
  html = setMetaName(html, 'twitter:card', 'summary_large_image');
  html = setMetaName(html, 'twitter:title', title);
  html = setMetaName(html, 'twitter:description', description);
  html = setMetaName(html, 'twitter:image', route.image || defaultImage);
  html = setCanonical(html, canonicalUrl);
  html = replaceBodyNoscript(html, route.noscriptHtml || staticNoscript(route));
  html = injectJsonLd(html, route.schema);
  return html;
}

function writeRoute(routePath, html) {
  const cleanRoute = routePath.replace(/^\//, '').replace(/\/$/, '');
  const outputDir = cleanRoute ? path.join(distDir, cleanRoute) : distDir;
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

function articleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: { '@type': 'Organization', name: 'AMZing FBA', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'AMZing FBA',
      logo: { '@type': 'ImageObject', url: defaultImage },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${article.slug}` },
    keywords: article.keywords.join(', '),
    inLanguage: 'fr-FR',
  };
}

function main() {
  if (!fs.existsSync(indexPath)) {
    console.error(`Static SEO generation failed: ${indexPath} not found.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf8');
  const articles = collectBlogArticles();

  const blogRoute = {
    route: '/blog',
    title: 'Blog Amazon FBA : guides Keepa, SellerAmp et produits rentables',
    description: 'Guides Amazon FBA pour comprendre le business, choisir une formation, utiliser Keepa/SellerAmp, trouver des fournisseurs et des produits rentables.',
    keywords: ['amazon fba', 'formation amazon fba', 'keepa', 'selleramp', 'produits rentables amazon', 'fournisseur amazon fba'],
    type: 'website',
    noscriptHtml: blogIndexNoscript(articles),
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Blog AMZing FBA',
      url: `${siteUrl}/blog`,
      description: 'Guides et ressources Amazon FBA pour vendeurs français.',
      inLanguage: 'fr-FR',
    },
  };

  writeRoute('/blog', applySeo(baseHtml, blogRoute));

  for (const article of articles) {
    const route = {
      route: `/blog/${article.slug}`,
      title: article.metaTitle || article.title,
      h1: article.title,
      description: article.metaDescription || article.excerpt,
      excerpt: article.excerpt,
      keywords: article.keywords,
      type: 'article',
      schema: articleSchema(article),
    };

    writeRoute(route.route, applySeo(baseHtml, route));
  }

  console.log(`✅ Static SEO pages generated: ${articles.length + 1} routes (/blog + articles).`);
}

main();