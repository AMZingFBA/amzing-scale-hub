/**
 * Actorio Bridge Server
 * Express API that exposes Actorio search via Playwright automation.
 *
 * POST /api/search   - Run a search with filters
 * GET  /api/status    - Check if bridge is ready
 * POST /api/login     - Force re-login
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initBrowser, login, search, closeBrowser, type ActorioFilters } from './scraper.js';
import { startWorker } from './worker.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3456');
const HEADLESS = process.env.HEADLESS !== 'false';

app.use(cors());
app.use(express.json());

let ready = false;
let loginError: string | null = null;
let stopWorker: (() => void) | undefined;

// --- Routes ---

app.get('/api/status', (_req, res) => {
  res.json({
    ready,
    logged_in: ready,
    error: loginError,
    headless: HEADLESS,
  });
});

app.post('/api/login', async (_req, res) => {
  try {
    const email = process.env.ACTORIO_EMAIL;
    const password = process.env.ACTORIO_PASSWORD;
    if (!email || !password) {
      return res.status(400).json({ error: 'ACTORIO_EMAIL and ACTORIO_PASSWORD not set in .env' });
    }
    // Cancel any pending retry before manual login attempt
    if (loginRetryTimer) { clearTimeout(loginRetryTimer); loginRetryTimer = null; }

    await initBrowser(HEADLESS);
    const success = await login(email, password);
    if (success) {
      ready = true;
      loginError = null;
      if (!stopWorker) stopWorker = startWorker();
      return res.json({ success: true, email });
    }
    loginError = 'Login failed - check credentials';
    return res.status(401).json({ error: loginError });
  } catch (err: any) {
    loginError = err.message;
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/search', async (req, res) => {
  if (!ready) {
    return res.status(503).json({
      error: 'Bridge not ready. Call POST /api/login first.',
    });
  }

  const filters: ActorioFilters = req.body.filters || req.body;

  console.log(`[server] Search request with ${Object.keys(filters).length} filters`);

  try {
    const result = await search(filters);
    return res.json(result);
  } catch (err: any) {
    console.error(`[server] Search error: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: err.message,
      results: [],
      count: 0,
      duration_ms: 0,
    });
  }
});

// --- Startup ---

const LOGIN_RETRY_INTERVAL_MS = 30_000; // retry every 30s if login fails
let loginRetryTimer: ReturnType<typeof setTimeout> | null = null;

async function attemptLogin(email: string, password: string): Promise<void> {
  try {
    await initBrowser(HEADLESS);
    const success = await login(email, password);
    if (success) {
      ready = true;
      loginError = null;
      if (loginRetryTimer) { clearTimeout(loginRetryTimer); loginRetryTimer = null; }
      if (!stopWorker) stopWorker = startWorker();
      console.log('✓ Logged in to Actorio');
    } else {
      loginError = 'Login failed — check credentials';
      console.error(`✗ Login failed (${email}) — retry in ${LOGIN_RETRY_INTERVAL_MS / 1000}s`);
      loginRetryTimer = setTimeout(() => attemptLogin(email, password), LOGIN_RETRY_INTERVAL_MS);
    }
  } catch (err: any) {
    loginError = err.message;
    console.error(`✗ Login error: ${err.message} — retry in ${LOGIN_RETRY_INTERVAL_MS / 1000}s`);
    loginRetryTimer = setTimeout(() => attemptLogin(email, password), LOGIN_RETRY_INTERVAL_MS);
  }
}

async function startup() {
  const email = process.env.ACTORIO_EMAIL;
  const password = process.env.ACTORIO_PASSWORD;

  if (!email || !password) {
    console.error('⚠  ACTORIO_EMAIL and ACTORIO_PASSWORD not set in .env');
    console.error('   Set them and restart, or call POST /api/login');
  } else {
    attemptLogin(email, password); // non-blocking — retries automatically on failure
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Actorio Bridge running on http://localhost:${PORT}`);
    console.log(`   Status:  GET  http://localhost:${PORT}/api/status`);
    console.log(`   Login:   POST http://localhost:${PORT}/api/login`);
    console.log(`   Search:  POST http://localhost:${PORT}/api/search`);
    console.log(`   Headless: ${HEADLESS}\n`);
    console.log(`   Email: ${email ?? '(not set)'}`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  if (loginRetryTimer) clearTimeout(loginRetryTimer);
  stopWorker?.();
  await closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (loginRetryTimer) clearTimeout(loginRetryTimer);
  stopWorker?.();
  await closeBrowser();
  process.exit(0);
});

startup().catch(console.error);
