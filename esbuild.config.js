// @ts-check
import * as path from "path";
import * as glob from "glob"
import esbuild from "esbuild"
import * as fs from "fs"
import * as fsPromises from "fs/promises"
import chalk from "chalk"

const pkg = JSON.parse(fs.readFileSync("./package.json").toString())
const deps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
]

const watchMode = process.argv.includes("--watch")

/**
 * @return {import("esbuild").Plugin}
 */
function AppendCssStyles () {
  return {
    name: "append-css-styles",
    setup(build) {
      build.onStart(async () => {
        const styles = await fsPromises.readFile(
          path.join(process.cwd(), "src", "exports", "styles", "trix-core.css"),
          { encoding: "utf8" }
        )

        let date = new Date()

        const {
          hostStyles,
          toolbarButtonStyles,
          cursorStyles
        } = await import(`./src/exports/styles/editor.js?cache=${date.toString()}`)

        const finalString = `/* THIS FILE IS AUTO-GENERATED. DO NOT EDIT BY HAND! */
${styles.toString()}
/* src/exports/styles/editor.js:hostStyles */
${hostStyles.toString()}

/* src/exports/styles/editor.js:toolbarButtonStyles */
${cursorStyles.toString()}

/* src/exports/styles/editor.js:toolbarButtonStyles */
${toolbarButtonStyles.toString()}
`

        await fsPromises.writeFile(path.join(process.cwd(), "src", "exports", "styles", "trix.css"), finalString)
        // await fsPromises.writeFile(path.join(process.cwd(), "exports", "styles", "trix.css"), finalString)
      })
    }
  }
}

/**
 * @returns {import("esbuild").Plugin}
 */
function BuildTimer () {
  return {
    name: "build-timer",
    setup(build) {
      let startTime

      build.onStart(() => {
        startTime = Number(new Date())
      })

      build.onEnd(() => {
        const endTime = Number(new Date())
        const buildTime = endTime - startTime

        console.log(chalk.green(`Build complete in ${buildTime}ms!`), `✨\n\n`)
      })
    }
  }
}

;(async function () {
  /**
   * @type {import("esbuild").BuildOptions["entryPoints"]}
   */
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
    target: "es2020",
    color: true,
    bundle: true,
    external: [],
    plugins: [
      AppendCssStyles(),
    ]
  }

  /**
   * @type {Array<import("esbuild").BuildOptions>}
   */
  const configs = [
    {
      ...defaultConfig,
      outfile: "exports/bundle/index.common.js",
      format: "cjs",
      minify: true,
    },
    {
      ...defaultConfig,
      outfile: "exports/bundle/index.module.js",
      format: "esm",
      minify: true,
      splitting: false,
    },
    {
      ...defaultConfig,
      entryPoints: entries,
      outdir: 'exports',
      format: 'esm',
      target: "es2020",
      bundle: true,
      external: deps,
      splitting: true,
      minify: false,
      chunkNames: 'chunks/[name]-[hash]',
      plugins: defaultConfig.plugins.concat([BuildTimer()])
    },
    {
      ...defaultConfig,
      entryPoints: entries,
      outdir: 'cdn/exports',
      format: 'esm',
      target: "es2020",
      external: [],
      splitting: true,
      minify: false,
      chunkNames: 'chunks/[name]-[hash]'
    },
  ]

  if (!watchMode) {
    await Promise.all(configs.map((config) => esbuild.build(config)))
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })

    return
  }

  await Promise.all(configs.map(async (config) => {
    const context = await esbuild.context(config)
    return await context.watch()
  })).catch((err) => {
    console.error(err)
  })
})()
