import * as path from "path";
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { brotliCompressSync } from "zlib";
import gzipPlugin from "rollup-plugin-gzip";
import glob from "glob"

let entries = {}
glob
  .sync("src/**/*.{ts,js}")
  .forEach((file) => {
    let key = path.join(path.dirname(file), path.basename(file, path.extname(file)))
    key = key.replace(/^src\//, "")
    entries[key] = file
  });

export default [
  {
    input: "src/index.ts",
    external: [],
    output: [
      {
        name: "mrujs",
        file: "dist/bundle/index.umd.js",
        format: "umd",
        sourcemap: true,
        esModule: false,
        exports: "named",
      },
      {
        file: "dist/bundle/index.module.js",
        format: "es",
        sourcemap: true,
      }
    ],
    plugins: compressionPlugins()
  },
  {
    input: entries,
    plugins: basePlugins(),
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: true
      },
    ],
  },
];

function basePlugins(tsconfig = "./tsconfig.json") {
  return [
    resolve(),
    commonjs(),
    typescript({ tsconfig })
  ];
}

function compressionPlugins(tsconfig = "./tsconfig.json") {
  return [
    ...basePlugins(tsconfig),
    terser({
      compress: {
        passes: 10,
      },
    }),
    // GZIP compression as .gz files
    gzipPlugin(),
    // Brotil compression as .br files
    gzipPlugin({
      customCompression: (content) => brotliCompressSync(Buffer.from(content)),
      fileName: ".br",
    }),
  ];
}
