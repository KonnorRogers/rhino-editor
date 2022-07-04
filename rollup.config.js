import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import { brotliCompressSync } from 'zlib'
import gzipPlugin from 'rollup-plugin-gzip'

const libraryName = "tip-tap-element"

function basePlugins(tsconfig = "./tsconfig.json") {
  return [
    resolve(),
    commonjs(),
    typescript({ tsconfig }),
  ]
}

function compressionPlugins(tsconfig = "./tsconfig.json") {
  return [
    ...basePlugins(tsconfig),
    terser({
      compress: {
        passes: 10
      }
    }),
    // GZIP compression as .gz files
    gzipPlugin(),
    // Brotil compression as .br files
    gzipPlugin({
        customCompression: content =>
            brotliCompressSync(Buffer.from(content)),
        fileName: '.br',
    }),
  ]
}

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: `dist/${libraryName}.unbundled.js`,
        format: "es",
        sourcemap: true,
      },
      {
        format: 'es',
        dir: '.',
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    ],
    plugins: basePlugins()
  },

  // Compressed
  {
    input: "src/index.ts",
    external: [],
    output: [{
      file: `dist/${libraryName}.bundled.js`,
      format: "es",
      sourcemap: true,
    }],
    plugins: compressionPlugins()
  },
]
