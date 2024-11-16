import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: process.env.NODE_ENV !== 'production',
  clean: true,
  minify: process.env.NODE_ENV === 'production',
  treeshake: true,
  external: Object.keys(require('./package.json').dependencies || {}),
  outDir: 'dist',
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.mjs' : '.js',
  }),
  banner: {
    js: `/*! * ${require('./package.json').name} v${require('./package.json').version} * Released under the MIT License. */`,
  },
});
