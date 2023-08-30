import { readFile } from "node:fs/promises";

export async function createDataTransfer ({
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
      fileHex: (await readFile(filePath)).toString(),
      localFileName: fileName,
      localFileType: fileType,
    }
  );
};

