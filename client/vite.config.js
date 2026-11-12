import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// The platform passes every address as an environment variable when it starts
// the app, so nothing in this file is ever rewritten. Keep this wiring as it
// is; the defaults only matter when running the app by hand.
const port = Number(process.env.PORT ?? 5173);
const apiPort = Number(process.env.ICOD_PORT_API ?? 3001);
const previewHost = process.env.ICOD_PREVIEW_HOST;

// Hot reload's socket carries nothing between edits, so the proxies in front of
// the preview close it as idle, and a closed socket makes Vite reload the page.
// A small message every 30 seconds keeps it open; the page ignores it.
const hmrKeepAlive = () => ({
  name: 'icod-hmr-keepalive',
  configureServer(server) {
    const timer = setInterval(() => server.ws.send({ type: 'custom', event: 'icod:keepalive' }), 30_000);
    server.httpServer?.on('close', () => clearInterval(timer));
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), hmrKeepAlive()],
  // The user's environment variables are in the project root's .env, which the
  // platform manages; only names starting with VITE_ reach the browser.
  envDir: '..',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Find every dependency when the server starts, not when a page first imports
  // it: one found later is bundled on the spot and every open page reloads.
  optimizeDeps: {
    entries: ['index.html', 'src/**/*.{js,jsx,ts,tsx}'],
  },
  server: {
    host: '0.0.0.0',
    port,
    // Fail instead of quietly moving to another port nobody routes to.
    strictPort: true,
    allowedHosts: previewHost ? [previewHost] : [],
    // Behind the preview URL the browser reaches hot reload over HTTPS.
    hmr: previewHost ? { host: previewHost, protocol: 'wss', clientPort: 443 } : undefined,
    // The client and the API share one origin: /api is forwarded to the server.
    proxy: { '/api': `http://127.0.0.1:${apiPort}` },
  },
});
