import { readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json')).toString())
const created = `2023-${new Date().getFullYear()}`
const name = pkg.name.toUpperCase().replace('-', '_')
  .replace('@', '')
const banner = `/*
 * @author ${pkg.author}
 * {@link ${pkg.repository.url}}
 * @copyright  ${created} ${pkg.author}
 *
 * @license ${pkg.license}
 * @version ${pkg.version}
 */
 `

export default defineConfig({
  publicDir: 'assets',
  resolve: {
    alias: [
      {
        find: /^wima$/,
        replacement: resolve(root, 'src/index.js')
      }
    ]
  },
  plugins: [
    declarationBundlePlugin()
  ],
  server: {
    port: 8082,
    strictPort: true,
    open: '/examples/index.html'
  },
  build: {
    lib: {
      entry: resolve(root, 'src/index.js'),
      name,
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'module' : format}.js`
    },
    target: 'es2020',
    minify: 'esbuild',
    esbuild: {
      keepNames: true
    },
    rollupOptions: {
      output: {
        banner,
        exports: 'named'
      }
    }
  }
})

function declarationBundlePlugin() {
  return {
    name: 'declaration-bundle',
    apply: 'build',
    async closeBundle() {
      const bundle = await rollup({
        input: resolve(root, 'types/src/index.d.ts'),
        plugins: [
          dts({
            tsconfig: resolve(root, '.config/tsc.type.json'),
            compilerOptions: {
              baseUrl: root,
              paths: {
                '@wimaengine/*': ['types/*/index.d.ts']
              }
            }
          })
        ]
      })

      await bundle.write({
        file: resolve(root, 'dist/index.d.ts'),
        format: 'es'
      })
      await bundle.close()
      rmSync(resolve(root, 'types'), { recursive: true, force: true })
    }
  }
}
