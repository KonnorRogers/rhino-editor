import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser";
import { brotliCompressSync } from 'zlib'
import gzipPlugin from 'rollup-plugin-gzip'

function basePlugins(tsconfig = "./tsconfig.json") {
  return [
    resolve(),
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
    output: [{
      file: "dist/tip-tap-element.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: basePlugins()
  },
  // Compressed
  {
    input: "src/index.ts",
    output: [{
      file: "dist/tip-tap-element.min.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: compressionPlugins()
  },
]
