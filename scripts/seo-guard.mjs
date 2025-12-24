#!/usr/bin/env node

/**
 * SEO Build Guard
 * Scans the dist/ folder for hidden links, spam patterns, and external origins.
 * Fails the build (exit 1) if forbidden patterns are found.
 */

import fs from 'fs';
import path from 'path';

const DIST_DIR = process.argv[2] || 'dist';

// Forbidden patterns that should FAIL the build
const FORBIDDEN_PATTERNS = [
  { regex: /id=["']partner-links["']/gi, name: 'partner-links ID' },
  { regex: /formationmax\.com/gi, name: 'formationmax.com domain' },
  { regex: /left:\s*-9999px/gi, name: 'left:-9999px (hidden offscreen)' },
  { regex: /position:\s*absolute[^}]*left:\s*-\d{4,}px/gi, name: 'absolute positioning offscreen' },
];

// Warning patterns (logged but don't fail)
const WARNING_PATTERNS = [
  { regex: /opacity:\s*0(?![.\d])/gi, name: 'opacity:0' },
  { regex: /display:\s*none/gi, name: 'display:none' },
  { regex: /pointer-events:\s*none/gi, name: 'pointer-events:none' },
  { regex: /visibility:\s*hidden/gi, name: 'visibility:hidden' },
];

// Extract external URLs from href and src attributes
const EXTERNAL_URL_REGEX = /(?:href|src)=["'](https?:\/\/[^"']+)["']/gi;

// Trusted domains (won't be flagged)
const TRUSTED_DOMAINS = [
  'amzingfba.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'googletagmanager.com',
  'google-analytics.com',
  'schema.org',
  'supabase.co',
  'storage.googleapis.com',
  'prerender.io',
];

function walkDir(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    process.exit(1);
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

function extractDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return null;
  }
}

function scanFile(filePath, content) {
  const errors = [];
  const warnings = [];
  const externalUrls = new Set();
  
  // Check forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    const matches = content.match(pattern.regex);
    if (matches) {
      errors.push({
        file: filePath,
        pattern: pattern.name,
        count: matches.length,
        samples: matches.slice(0, 3),
      });
    }
  }
  
  // Check warning patterns (only in context of links)
  const linkRegex = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
  const links = content.match(linkRegex) || [];
  
  for (const link of links) {
    for (const pattern of WARNING_PATTERNS) {
      if (pattern.regex.test(link)) {
        warnings.push({
          file: filePath,
          pattern: pattern.name,
          context: link.substring(0, 100) + (link.length > 100 ? '...' : ''),
        });
      }
    }
  }
  
  // Extract external URLs
  let match;
  const urlRegex = new RegExp(EXTERNAL_URL_REGEX.source, 'gi');
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];
    const domain = extractDomain(url);
    if (domain && !TRUSTED_DOMAINS.some(trusted => domain.includes(trusted))) {
      externalUrls.add(domain);
    }
  }
  
  return { errors, warnings, externalUrls };
}

function main() {
  console.log('\n🔍 SEO Build Guard - Scanning for hidden links and spam patterns...\n');
  console.log(`📁 Scanning directory: ${DIST_DIR}\n`);
  
  const allFiles = walkDir(DIST_DIR);
  const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
  
  console.log(`📄 Found ${htmlFiles.length} HTML file(s) to scan\n`);
  
  const allErrors = [];
  const allWarnings = [];
  const allExternalDomains = new Set();
  
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const { errors, warnings, externalUrls } = scanFile(file, content);
    
    allErrors.push(...errors);
    allWarnings.push(...warnings);
    externalUrls.forEach(url => allExternalDomains.add(url));
  }
  
  // Report external domains
  if (allExternalDomains.size > 0) {
    console.log('🌐 External domains detected (not in trusted list):');
    for (const domain of [...allExternalDomains].sort()) {
      console.log(`   - ${domain}`);
    }
    console.log('');
  }
  
  // Report warnings
  if (allWarnings.length > 0) {
    console.log('⚠️  Warnings (potential hidden link patterns in <a> tags):');
    for (const warning of allWarnings.slice(0, 10)) {
      console.log(`   ${warning.file}: ${warning.pattern}`);
      console.log(`      Context: ${warning.context}`);
    }
    if (allWarnings.length > 10) {
      console.log(`   ... and ${allWarnings.length - 10} more warnings`);
    }
    console.log('');
  }
  
  // Report errors and exit
  if (allErrors.length > 0) {
    console.log('❌ FORBIDDEN PATTERNS DETECTED - BUILD FAILED!\n');
    for (const error of allErrors) {
      console.log(`   🚫 ${error.file}`);
      console.log(`      Pattern: ${error.pattern} (${error.count} occurrence(s))`);
      console.log(`      Samples: ${error.samples.join(', ')}`);
      console.log('');
    }
    console.log('━'.repeat(60));
    console.log('🛑 Build blocked due to SEO spam/hidden link patterns.');
    console.log('   These patterns can result in Google penalties.');
    console.log('━'.repeat(60));
    process.exit(1);
  }
  
  console.log('✅ SEO Guard passed - No forbidden patterns detected!\n');
  process.exit(0);
}

main();
