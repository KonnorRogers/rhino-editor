import { playwrightLauncher } from '@web/test-runner-playwright';
// import { esbuildPlugin } from '@web/dev-server-esbuild';

const showChromium = (process.env.BROWSER || "").toLowerCase().includes("chromium")
const showFirefox = (process.env.BROWSER || "").toLowerCase().includes("firefox")
const showWebkit = (process.env.BROWSER || "").toLowerCase().includes("webkit")

/** @type {import("@web/test-runner").TestRunnerConfig} */
export default {
  rootDir: '.',
  nodeResolve: true,
  files: ['./src/**/*.test.js', './tests/unit/**/*.test.js'], // "default" group
  concurrentBrowsers: 3,
  nodeResolve: true,
  testFramework: {
    config: {
      ui: 'tdd',
      timeout: 3000,
      retries: 1
    }
  },
  plugins: [

  ],
  browsers: [
    playwrightLauncher({ product: 'chromium',
      launchOptions: {
        headless: !showChromium,
        devtools: showChromium,
      }
    }),
    playwrightLauncher({ product: 'firefox' }, {
      launchOptions: {
        headless: !showFirefox,
        devtools: showFirefox,
      }
    }),
    playwrightLauncher({ product: 'webkit' }, {
      launchOptions: {
        headless: !showWebkit,
        devtools: showWebkit,
      }
    })
  ],
}
