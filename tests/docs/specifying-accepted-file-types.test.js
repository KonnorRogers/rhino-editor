import { test, expect } from "@playwright/test"
import * as path from "path"
import { readFile } from "node:fs/promises";

const pagePath = "/how-tos/specifying-accepted-file-types/"

test("Should pass the 'accept' attribute onto the underlying file input", async ({ page }) => {
  await page.goto(pagePath)
  await expect(page.locator("rhino-editor[accept='image/*'] input[type='file'][accept='image/*']")).toBeAttached()
})

test("Should only allow PNG images to be added via file chooser", async ({ page }) => {
  await page.goto(pagePath)

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator("rhino-editor[accept='image/*'] button[part~='toolbar__button--attach-files']").click()
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./tests/fixtures/view-layer-benchmarks.png');

  await expect(page.locator("rhino-editor[accept='image/*'] figure")).toBeVisible()
})

test("Should not allow non-png files to be added via file chooser", async ({ page }) => {
  await page.goto(pagePath)

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator("rhino-editor[accept='image/*'] button[part~='toolbar__button--attach-files']").click()
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./tests/fixtures/thing.txt');
  await expect(page.locator("rhino-editor#png-only figure")).not.toBeAttached()
})

test("Should allow PNG files to be added via drag and drop", async ({ page }) => {
  await page.goto(pagePath)

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

  await page.dispatchEvent('rhino-editor#png-only .ProseMirror', 'drop', { dataTransfer });
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

async function createDataTransfer ({
  page,
  filePath,
  fileName,
  fileType,
}) {
  return await page.evaluateHandle(
    async ({ fileHex, localFileName, localFileType }) => {
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(
        new File([fileHex], localFileName, { type: localFileType })
      );

      return dataTransfer;
    },
    {
      fileHex: (await readFile(filePath)).toString("hex"),
      localFileName: fileName,
      localFileType: fileType,
    }
  );
};

