// @ts-check
import * as path from "path";
import glob from "glob"
import esbuild from "esbuild"
import * as fs from "fs"
import * as fsPromises from "fs/promises"

const pkg = JSON.parse(fs.readFileSync("./package.json").toString())
const deps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
]


import {
  hostStyles,
  toolbarButtonStyles
} from "./src/exports/styles/editor.js"


/** @type {(options: {} = {}) => import("esbuild").Plugin} */
function AppendCssStyles (options = {}) {
  return {
    name: "append-css-styles",
    setup(build) {
      build.onStart(async () => {
        const styles = await fsPromises.readFile(
          path.join(process.cwd(), "src", "exports", "styles", "trix-core.css"),
          { encoding: "utf8" }
        )

        const finalString = `/* THIS FILE IS AUTO-GENERATED. DO NOT EDIT BY HAND! */
${styles.toString()}
/* src/exports/styles/editor.js:hostStyles */
.trix-content {
  ${hostStyles.toString()}
}

/* src/exports/styles/editor.js:toolbarButtonStyles */
${toolbarButtonStyles.toString()}
`

        await fsPromises.writeFile(path.join(process.cwd(), "src", "exports", "styles", "trix.css"), finalString)
        // await fsPromises.writeFile(path.join(process.cwd(), "exports", "styles", "trix.css"), finalString)
      })
    }
  }
}

;(async function () {
  const entries = {}
  glob.sync("./src/exports/**/*.{ts,js,css}")
    .forEach((file) => {
      const key = path.relative(path.join("src", "exports"), path.join(path.dirname(file), path.basename(file, path.extname(file))))
      const value = "." + path.sep + path.join(path.dirname(file), path.basename(file, path.extname(file)))
      entries[key] = value
    });

  const defaultConfig = {
    entryPoints: ["./src/exports/index.ts"],
    sourcemap: true,
    platform: "browser",
    target: "es2018",
    watch: process.argv.includes("--watch"),
    color: true,
    bundle: true,
    external: [],
    plugins: [
      AppendCssStyles()
    ]
  }

  const startTime = Number(new Date())

  await Promise.allSettled[
    esbuild.build({
      ...defaultConfig,
      outfile: "exports/bundle/index.common.js",
      format: "cjs",
      minify: true,
    }),

    esbuild.build({
      ...defaultConfig,
      outfile: "exports/bundle/index.module.js",
      format: "esm",
      minify: true,
    }),

    esbuild.build({
      ...defaultConfig,
      entryPoints: entries,
      outdir: 'exports',
      format: 'esm',
      target: "es2020",
      external: deps,
      splitting: true,
      minify: false,
      chunkNames: 'chunks/[name]-[hash]'
    }),

    esbuild.build({
      ...defaultConfig,
      entryPoints: entries,
      outdir: 'cdn/exports',
      format: 'esm',
      target: "es2020",
      external: [],
      splitting: true,
      minify: false,
      chunkNames: 'chunks/[name]-[hash]'
    })
  ]

  const endTime = Number(new Date())
  const buildTime = endTime - startTime

  console.log(`Build complete in ${buildTime}ms! ✨`)
})()
