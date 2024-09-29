import { test, expect } from "@playwright/test"
import * as path from "path"
import { createDataTransfer } from "./create-data-transfer.js"

const pagePath = "/how-tos/specifying-accepted-file-types/"

test("Should pass the 'accept' attribute onto the underlying file input", async ({ page }) => {
  await page.goto(pagePath)
  await expect(page.locator("rhino-editor[accept='image/*'] input[type='file'][accept='image/*']")).toBeAttached()
})

test("Should only allow PNG images to be added via file chooser", async ({ page }) => {
  await page.goto(pagePath)

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator("rhino-editor[accept='image/*'] role-toolbar button[part~='toolbar__button--attach-files']").click()
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./tests/fixtures/view-layer-benchmarks.png');

  await expect(page.locator("rhino-editor[accept='image/*'] figure")).toBeVisible()
})

test("Should not allow non-png files to be added via file chooser", async ({ page }) => {
  await page.goto(pagePath)

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator("rhino-editor[accept='image/*'] role-toolbar button[part~='toolbar__button--attach-files']").click()
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./tests/fixtures/thing.txt');
  await expect(page.locator("rhino-editor#png-only figure")).not.toBeAttached()
})

test("Should allow PNG files to be added via drag and drop", async ({ page }) => {
  await page.goto(pagePath)


  // Need to interact with the page before drag and drop works
  await page.locator("rhino-editor#png-only .ProseMirror").click()
  // Drag and drop
  // https://github.com/microsoft/playwright/issues/13364#issuecomment-1156288428
  // https://github.com/microsoft/playwright/issues/10667#issuecomment-998397241
  // Create the DataTransfer and File
  const dataTransfer = await createDataTransfer({
    page,
    filePath: path.join(process.cwd(), 'tests/fixtures/view-layer-benchmarks.png'),
    fileName: "view-layer-benchmarks.png",
    fileType: "image/png",
  });

  await page.dispatchEvent('rhino-editor#png-only .ProseMirror', 'drop', { dataTransfer, bubbles: true,  composed: true, cancelable: true });
  await expect(page.locator("rhino-editor#png-only figure")).toBeVisible()
})

test("Should not allow non-png files to be added via drag and drop", async ({ page }) => {
  await page.goto(pagePath)
  // Create the DataTransfer and File
  const dataTransfer = await createDataTransfer({
    page,
    filePath: path.join(process.cwd(), 'tests/fixtures/thing.txt'),
    fileName: "thing.txt",
    fileType: "text/plain",
  });


  await page.dispatchEvent('rhino-editor#png-only .ProseMirror', 'drop', { dataTransfer });
  await expect(page.locator("rhino-editor#png-only figure")).not.toBeAttached()
})

