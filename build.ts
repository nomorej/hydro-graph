import { build as viteBuild, LibraryOptions } from 'vite'
import dts from 'vite-plugin-dts'

function build(libraries: Array<LibraryOptions> | LibraryOptions) {
  libraries = Array.isArray(libraries) ? libraries : [libraries]

  libraries.forEach(async (lib) => {
    await viteBuild({
      configFile: false,
      plugins: [
        dts({
          include: './src',
        }),
      ],
      build: {
        outDir: 'lib',
        lib: {
          ...lib,
          formats: ['es', 'umd'],
          fileName: (format) => `${lib.name}.${format}.${format === 'es' ? 'mjs' : 'js'}`,
        },
        emptyOutDir: false,
      },
    })
  })
}

build({
  entry: './src/index.ts',
  name: 'hydro-graph',
})
