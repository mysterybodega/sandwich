import fs from 'fs'
import { PDFDocument } from 'pdf-lib'

type AddFunction = (pdfDoc: PDFDocument, file: File) => Promise<PDFDocument>

const addImageToPDFDocument: AddFunction = async (pdfDoc, file) => {
  let page, image
  const fileBuffer = fs.readFileSync(file.path)

  if (file.type === 'image/jpeg' || file.type === 'image/png') {
    page = pdfDoc.addPage()
  }

  if (file.type === 'image/jpeg') {
    image = await pdfDoc.embedJpg(fileBuffer)
  } else if (file.type === 'image/png') {
    image = await pdfDoc.embedPng(fileBuffer)
  }

  if (page && image) {
    const ratio = image.height / image.width
    const padding = 10
    const width = page.getWidth() - padding
    const height = width * ratio - padding
    const x = padding / 2
    const y = padding / 2

    page.drawImage(image, { width, height, x, y })
  }

  return pdfDoc
}

const addPDFToPDFDocument: AddFunction = async (pdfDoc, file) => {
  const fileBuffer = fs.readFileSync(file.path)
  const srcDoc = await PDFDocument.load(fileBuffer)
  const pages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices())

  return pdfDoc
}

export async function createPDF(files: File[]): Promise<Uint8Array> {
  let pdfDoc = await PDFDocument.create()

  files.forEach(async (file) => {
    switch(file.type) {
      case 'image/jpeg':
      case 'image/png':
        pdfDoc = await addImageToPDFDocument(pdfDoc, file)
        break
      case 'application/pdf':
        pdfDoc = await addPDFToPDFDocument(pdfDoc, file)
        break
      default:
        break
    }
  });

  return pdfDoc.save()
}
