import {playwrightLauncher} from '@web/test-runner-playwright'
import { esbuildPlugin } from '@web/dev-server-esbuild';
import rollupCommonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';

const commonjs = fromRollup(rollupCommonjs);

const CONCURRENCY = 10

/** @type {import("@web/test-runner").TestRunnerConfig} */
export default {
  concurrency: CONCURRENCY,
  nodeResolve: true,
  watch: process.argv.includes("--watch"),
  // in a monorepo you need to set the root dir to resolve modules
  rootDir: '.',
  files: [
    "./tests/js/**/*.test.ts",
    "./src/**/*.test.ts"
  ],
  browsers: [
    playwrightLauncher({ product: 'chromium', concurrency: CONCURRENCY / 3 }),
    playwrightLauncher({ product: 'webkit', concurrency: CONCURRENCY / 3 }),
    playwrightLauncher({ product: 'firefox', concurrency: CONCURRENCY / 3 }),
  ],
  testFramework: {
    config: {
      ui: 'tdd',
      timeout: (10_000).toString()
    }
  },
  testRunnerHtml: testFramework => `
    <html lang="en-US">
      <head>
        <script>
          window.process = {env: { NODE_ENV: "test" }}
          var global = typeof self !== undefined ? self : this;
        </script>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  plugins: [
    commonjs({
      include: [
        /\/node_modules\/lz-string/,
        /\/node_modules\/aria-label/,
        /\/node_modules\/pretty-format/,
        /\/node_modules\/ansi-styles/,
        /\/node_modules\/ansi-regex/,
        /\/node_modules\/react-is/
      ],
	    requireReturnsDefault: 'namespace',
    }),
    esbuildPlugin({ ts: true, target: 'auto' })
  ],
};
