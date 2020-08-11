import fs from 'fs'
import { IFileWithMeta } from '../components/sandwich-dropzone-component'
import { PDFDocument } from 'pdf-lib'

export async function createPDF(files: IFileWithMeta[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()

  files.forEach(async ({ file }) => {
    const fileBuffer = fs.readFileSync(file.path)

    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      let image, page

      if (file.type === 'image/jpeg') {
        page = pdfDoc.addPage()
        image = await pdfDoc.embedJpg(fileBuffer)
      } else if (file.type === 'image/png') {
        page = pdfDoc.addPage()
        image = await pdfDoc.embedPng(fileBuffer)
      }

      const ratio = image.height / image.width
      const padding = 10
      const width = page.getWidth() - padding
      const height = width * ratio - padding
      const x = padding / 2
      const y = padding / 2

      page.drawImage(image, { width, height, x, y })
    } else if (file.type === 'application/pdf') {
      const src = await PDFDocument.load(fileBuffer)
      const indicies = src.getPages().map((_, i) => i)
      const pages = await pdfDoc.copyPages(src, indicies)

      pages.forEach(page => {
        pdfDoc.addPage(page)
      })
    }
  });

  return pdfDoc.save()
}

