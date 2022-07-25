import * as path from "path";
import glob from "glob"
import esbuild from "esbuild"

let entries = glob
.sync("src/**/*.{ts,js}")
.map((file) => {
  return path.join(path.dirname(file), path.basename(file, path.extname(file)))
});

console.log(entries)

const defaultConfig = {
  entryPoints: ["./src/index.ts"],
  sourcemap: true,
  platform: "browser",
  target: "es2018",
  watch: process.argv.includes("--watch"),
  color: true,
  bundle: true,
  external: []
}


;(async function () {
  await Promise.all[
    esbuild.build({
      ...defaultConfig,
      outfile: "dist/bundle/index.module.js",
      format: "esm",
      minify: true,
    }),

    esbuild.build({
      ...defaultConfig,
      outfile: "dist/bundle/index.common.js",
      format: "cjs",
      minify: true,
    }),

    esbuild.build({
      ...defaultConfig,
      // splitting: true,
      entryPoints: entries,
      outdir: 'dist',
      format: 'esm',
      target: "es2020",
      external: ['./node_modules/*'],
      splitting: true,
      chunkNames: 'chunks/[name]-[hash]'
    })
  ]
  console.log("Build complete! ✨")
})()
