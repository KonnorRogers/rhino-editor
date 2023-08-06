// @ts-check

/**
 * @typedef {Object} RhinoFile
 * @property {string} RhinoFile.name
 * @property {string} RhinoFile.data
 * @property {string} RhinoFile.type
 */

/**
 * @param {RhinoFile} file
 * @param {DataTransfer} dataTransfer
 */
function processFile (file, dataTransfer) {
  const { name, data, type } = file
  dataTransfer.items.add(new File([data], name, { type }))
}


/**
 * @example
 *    import { writeFile, readFile } from '@web/test-runner-commands';
 *
 *    const file = {
 *      name: "my-file.png",
 *      type: "image/png",
 *      data: await readFile("/path/to/my-file.png")
 *    }
 *
 *    const dataTransfer = createDataTransfer(file);
 *
 *    const el = document.querySelector("el")
 *    const dropEvent = new DropEvent('drop', { dataTransfer });
 *    el.dispatchEvent(dropEvent)
 *
 *    const pasteEvent = new ClipboardEvent("paste", { clipboardData: dataTransfer })
 *    el.dispatchEvent(pasteEvent)
 * @param {Array<RhinoFile | Array<RhinoFile>>} files
 */
export function createDataTransfer (...files) {
  const dataTransfer = new DataTransfer();

  files.forEach((file) => {
    if (!Array.isArray(file)) {
      processFile(file, dataTransfer)
    } else {
      file.forEach((file) => processFile(file, dataTransfer))
    }
  })

  return dataTransfer;
};

