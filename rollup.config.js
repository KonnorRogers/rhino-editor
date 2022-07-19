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
    const key = path.join(path.dirname(file), path.basename(file, path.extname(file)))
    entries[key] = file
  });

const input = "./src/index.ts"
// console.log(entries)

export default [
  // {
    // input,
    // plugins: [compressionPlugins()],
    // output: [
    //   {
    //     file: "dist/bundle/tip-tap-element.umd.js",
    //     format: "umd",
    //     name: "TipTapElement",
    //     esModule: false,
    //   },
    //   {
    //     file: "dist/bundle/tip-tap-element.module.js",
    //     format: "es",
    //   }
    // ]
  // },
  {
    input: entries,
    plugins: basePlugins(),
    output: [
      {
        dir: "dist",
        format: "es",
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
