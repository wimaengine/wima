import { readFileSync, readdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJsonPath = process.env.npm_package_json || resolve(root, 'package.json')
const packageRoot = dirname(packageJsonPath)
const pkg = JSON.parse(readFileSync(packageJsonPath).toString())
const isRootPackage = packageRoot === root
const packageName = pkg.name.split('/').at(-1)
const entry = isRootPackage
  ? resolve(root, 'src/index.js')
  : resolve(packageRoot, 'index.js')
const created = `2023-${new Date().getFullYear()}`
const isPackageExternal = (id) => !isRootPackage
  && id.startsWith('@wimaengine/')
  && id !== pkg.name
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
  ...(isRootPackage ? {
    publicDir: 'assets',
    resolve: {
      alias: [
        {
          find: /^wima$/,
          replacement: resolve(root, 'src/index.js')
        }
      ]
    },
    server: {
      port: 8082,
      strictPort: true,
      open: '/examples/index.html'
    }
  } : {}),
  plugins: [
    declarationBundlePlugin()
  ],
  build: {
    outDir: resolve(packageRoot, 'dist'),
    lib: {
      entry,
      formats: ['es'],
      fileName: () => 'index.module.js'
    },
    target: 'es2020',
    minify: 'esbuild',
    esbuild: {
      keepNames: true
    },
    rollupOptions: {
      external: isPackageExternal,
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
      const declarationInput = isRootPackage
        ? resolve(root, 'types/src/index.d.ts')
        : resolve(packageRoot, 'types/index.d.ts')
      const declarationPaths = isRootPackage
        ? getPackageDeclarationPaths()
        : { [pkg.name]: ['types/index.d.ts'] }

      const bundle = await rollup({
        input: declarationInput,
        external: isPackageExternal,
        plugins: [
          dts({
            tsconfig: isRootPackage
              ? resolve(root, '.config/tsc.type.json')
              : resolve(packageRoot, 'tsc.type.json'),
            compilerOptions: {
              baseUrl: isRootPackage ? root : packageRoot,
              paths: declarationPaths
            },
            respectExternal: !isRootPackage
          })
        ]
      })

      await bundle.write({
        file: resolve(packageRoot, 'dist/index.d.ts'),
        format: 'es'
      })
      await bundle.close()
      if (isRootPackage) {
        rmSync(resolve(packageRoot, 'types'), { recursive: true, force: true })
      }
    }
  }
}

function getPackageDeclarationPaths() {
  return Object.fromEntries(
    readdirSync(resolve(root, 'packages'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map(({ name }) => [
        `@wimaengine/${name}`,
        [`packages/${name}/types/index.d.ts`]
      ])
  )
}
