const build = require("./config/esbuild.defaults.js")
const path = require("path")

// Update this if you need to configure a destination folder other than `output`
const outputFolder = "output"

// You can customize this as you wish, perhaps to add new esbuild plugins.
//
// ```
// const path = require("path")
const esbuildCopy = require('esbuild-plugin-copy').default
// const esbuildOptions = {
//   plugins: [
//     esbuildCopy({
//       assets: {
//         from: [path.resolve(__dirname, 'node_modules/somepackage/files/*')],
//         to: [path.resolve(__dirname, 'output/_bridgetown/somepackage/files')],
//       },
//       verbose: false
//     }),
//   ]
// }
// ```
//
// You can also support custom base_path deployments via changing `publicPath`.
//
// ```
// const esbuildOptions = { publicPath: "/my_subfolder/_bridgetown/static" }
// ```
const esbuildOptions = {
  target: "es2020",
  entryPoints: [
    "frontend/javascript/index.js",
    "frontend/javascript/defer.js",
    "frontend/javascript/entrypoints/character-counter.js",
    "frontend/javascript/entrypoints/starter-kit-setup.js",
    "frontend/javascript/entrypoints/syntax-highlighting.js"
  ],
  splitting: true,
  format: "esm",
  plugins: [
    esbuildCopy({
      assets: {
        from: [path.resolve(__dirname, '../exports/styles/trix.css')],
        to: [path.resolve(__dirname, 'src/rhino-editor/exports/styles/trix.css')],
        from: [path.resolve(__dirname, '../exports/styles/rhino-editor.css')],
        to: [path.resolve(__dirname, 'src/rhino-editor/exports/styles/rhino-editor.css')],
      },
      verbose: false,
      watch: true,

    }),
  ]
}

build(outputFolder, esbuildOptions)
