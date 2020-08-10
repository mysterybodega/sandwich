import fs from 'fs'
import { IFileWithMeta } from '../components/sandwich-dropzone-component'
import { PDFDocument } from 'pdf-lib'

export async function createPDF(files: IFileWithMeta[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()

  files.forEach(async ({ file }) => {
    const imageBytes = fs.readFileSync(file.path)

    let image, page;

    if (file.type === 'image/jpeg') {
      page = pdfDoc.addPage();
      image = await pdfDoc.embedJpg(imageBytes)
    } else if (file.type === 'image/png') {
      page = pdfDoc.addPage();
      image = await pdfDoc.embedPng(imageBytes)
    }

    if (image && page) {
      const imageDims = image.scale(0.2)

      page.drawImage(image, {
        x: (page.getWidth() / 2) - (imageDims.width / 2),
        y: (page.getHeight() / 2) - (imageDims.height / 2),
        width: imageDims.width,
        height: imageDims.height
      })
    }
  });

  return pdfDoc.save()
}

