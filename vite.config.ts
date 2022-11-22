import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  // plugins: [
  //   dts({
  //     insertTypesEntry: true,
  //   }),
  // ],
  // build: {
  //   lib: {
  //     entry: resolve(__dirname, './src/index.ts'),
  //     name: 'hydro-graph',
  //     formats: ['es', 'umd'],
  //     fileName: (format) => `hydro-graph.${format}.${format === 'es' ? 'mjs' : 'js'}`,
  //   },
  //   emptyOutDir: false,
  // },
  server: {
    host: '0.0.0.0',
  },
})
