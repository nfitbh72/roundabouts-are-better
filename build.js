const esbuild = require('esbuild');
const path = require('path');

// Build main process (Node.js environment)
esbuild.build({
  entryPoints: ['src/main/main.ts', 'src/main/preload.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'dist/main',
  sourcemap: true,
  external: ['electron'],
  format: 'cjs',
}).catch(() => process.exit(1));

// Build renderer process (Browser environment)
esbuild.build({
  entryPoints: ['src/renderer/renderer.ts'],
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  outfile: 'dist/renderer/renderer.js',
  sourcemap: true,
  format: 'iife',
}).catch(() => process.exit(1));
