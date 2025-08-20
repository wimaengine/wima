import { readFileSync } from "fs"
import { resolve } from "path"
import { cwd } from "process"
import { dts } from "rollup-plugin-dts"
import terser from '@rollup/plugin-terser'

const pkg = JSON.parse(readFileSync(resolve(cwd(), "./package.json")).toString())

const input = "src/index.js"
const created = `2023-${new Date().getFullYear()}`
const name = pkg.name.toUpperCase().replace("-", "_")
  .replace("@", "")
const banner = `/*
 * @author ${pkg.author}
 * {@link ${pkg.repository.url}}
 * @copyright  ${created} ${pkg.author}
 *
 * @license ${pkg.license}
 * @version ${pkg.version}
 */
 `
const minifier = terser({
  format:{
    comments:false,
  },
  mangle:false,
  keep_classnames:true,
  keep_fnames:true,
  sourceMap:true
})
export default [{

  // UMD
  input,
  output: {
    plugins:[
      minifier
    ],
    file: "dist/index.umd.js",
    format: "umd",
    name,
    esModule: false,
    exports: "named",
    sourcemap: true,
    banner
  }
},
{

  // ESM
  input,
  output: {
    plugins:[
      minifier
    ],
    file: "dist/index.module.js",
    format: "esm",
    exports: "named",
    sourcemap: true,
    banner
  },
},
{

  // Declaration
  input: 'types/index.d.ts',
  plugins: [dts()],
  output: {
    file: "dist/index.d.ts",
    format: 'es',
    banner
  }
}]