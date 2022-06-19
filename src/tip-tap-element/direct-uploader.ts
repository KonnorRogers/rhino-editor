// import { DirectUpload } from "@rails/activestorage"

// export class DirectUploader {
//   constructor(file, url) {
//     this.file = file
//     this.url = url
//     this.directUpload = new DirectUpload(this.file, this.url, this)
//   }

//   start () {
//     this.directUpload.create((error, blob) => {
//       if (error) {
//         // Handle the error
//         console.log(error)
//       } else {
//         // Add an appropriately-named hidden input to the form
//         // with a value of blob.signed_id
//         console.log(blob)
//       }
//     })
//   }

//   directUploadWillStoreFileWithXHR(request) {
//     request.upload.addEventListener("progress",
//       event => this.directUploadDidProgress(event))
//   }

//   directUploadDidProgress(event) {
//     // Use event.loaded and event.total to update the progress bar
//     console.log(event.loaded)
//     console.log(event.total)
//   }
// }
