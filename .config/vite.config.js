import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from 'acorn'
import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJsonPath = process.env.npm_package_json || resolve(root, 'package.json')
const packageRoot = dirname(packageJsonPath)
const pkg = JSON.parse(readFileSync(packageJsonPath).toString())
const isRootPackage = packageRoot === root
const libraryName = toLibraryName(pkg.name)
const packageGlobals = getPackageGlobals()
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
    jsCommentStripPlugin(),
    declarationBundlePlugin()
  ],
  build: {
    outDir: resolve(packageRoot, 'dist'),
    lib: {
      entry,
      name: libraryName,
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'module' : format}.js`
    },
    target: 'esnext',
    minify: false,
    esbuild: {
      keepNames: true
    },
    rollupOptions: {
      external: isPackageExternal,
      output: {
        banner,
        exports: 'named',
        globals: packageGlobals
      }
    }
  }
})

function jsCommentStripPlugin() {
  return {
    name: 'js-comment-strip',
    apply: 'build',
    /**
     * @param {string} code
     */
    async renderChunk(code) {
      const bannerPrefix = code.startsWith(banner) ? banner : ''
      const body = bannerPrefix ? code.slice(bannerPrefix.length) : code

      return `${bannerPrefix}${stripJsComments(body)}`
    }
  }
}

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
      stripImportJsdocComments(resolve(packageRoot, 'dist/index.d.ts'))
      await bundle.close()
      if (isRootPackage) {
        rmSync(resolve(packageRoot, 'types'), { recursive: true, force: true })
      }
    }
  }
}

/**
 * Removes line and block comments from generated JavaScript chunks.
 * The bundle banner is injected after renderChunk, so it stays intact.
 *
 * @param {string} code
 * @returns {string}
 */
function stripJsComments(code) {
  /** @type {{ block: boolean, start: number, end: number }[]} */
  const comments = []

  parse(code, {
    ecmaVersion: 'latest',
    onComment(block, _text, start, end) {
      comments.push({ block, start, end })
    },
    sourceType: 'module'
  })

  if (!comments.length) {
    return code
  }

  let stripped = ''
  let cursor = 0

  for (const comment of comments) {
    stripped += code.slice(cursor, comment.start)

    if (comment.block) {
      const left = code[comment.start - 1]
      const right = code[comment.end]

      if (left && right && !/\s/.test(left) && !/\s/.test(right)) {
        stripped += ' '
      }
    }

    cursor = comment.end
  }

  stripped += code.slice(cursor)

  return stripped
}

/**
 * Removes JSDoc import-only comment blocks from generated declaration files.
 *
 * @param {string} filePath
 */
function stripImportJsdocComments(filePath) {
  const contents = readFileSync(filePath, 'utf8')
  const stripped = contents.replace(/\/\*\*[\s\S]*?\*\//g, (block) => (
    block.includes('@import') ? '' : block
  ))

  if (stripped !== contents) {
    writeFileSync(filePath, stripped)
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

/**
 * Returns the UMD global names for workspace packages.
 *
 * @returns {Record<string, string>}
 */
function getPackageGlobals() {
  return Object.fromEntries(
    readdirSync(resolve(root, 'packages'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map(({ name }) => [
        `@wimaengine/${name}`,
        toLibraryName(`@wimaengine/${name}`)
      ])
  )
}

/**
 * Converts a package name to a valid UMD global identifier.
 *
 * @param {string} name
 * @returns {string}
 */
function toLibraryName(name) {
  return name
    .replace(/^@/, '')
    .replace(/\//g, '_')
    .replace(/-/g, '_')
    .toUpperCase()
}
