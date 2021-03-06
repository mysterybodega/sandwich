import FileType from './FileType'
import { PageSizes, PDFDocument } from 'pdf-lib'
import { readFileSync } from 'fs'

type AddFileToPDFDocument = (pdfDoc: PDFDocument, file: File) => Promise<PDFDocument>

export async function createPDFPreviewUrl(file: File): Promise<string> {
  const fileBuffer = readFileSync(file.path)
  const pdfDoc = await PDFDocument.load(fileBuffer)

  return await pdfDoc.saveAsBase64({ dataUri: true })
}

export async function createPDF(files: File[]): Promise<Uint8Array> {
  let pdfDoc = await PDFDocument.create()

  for (const file of files) {
    pdfDoc = await addFileToPDFDocument(pdfDoc, file)
  }

  return pdfDoc.save()
}

const addFileToPDFDocument: AddFileToPDFDocument = async (pdfDoc, file) => {
  switch(file.type) {
    case FileType.JPEG:
    case FileType.PNG:
      pdfDoc = await addImageToPDFDocument(pdfDoc, file)
      break
    case FileType.PDF:
      pdfDoc = await addPDFToPDFDocument(pdfDoc, file)
      break
    default:
      break
  }

  return pdfDoc
}

const addImageToPDFDocument: AddFileToPDFDocument = async (pdfDoc, file) => {
  let page, image
  const fileBuffer = readFileSync(file.path)

  if (file.type === FileType.JPEG || file.type === FileType.PNG) {
    page = pdfDoc.addPage(PageSizes.Letter)
  }

  switch(file.type) {
    case FileType.JPEG:
      image = await pdfDoc.embedJpg(fileBuffer)
      break;
    case FileType.PNG:
      image = await pdfDoc.embedPng(fileBuffer)
      break;
    default:
      break;
  }

  if (page && image) {
    const ratio = image.height / image.width
    const padding = 10
    const pageHeight = page.getHeight()
    const pageWidth = page.getWidth()

    const width = pageWidth - padding
    const height = width * ratio - padding

    const x = padding / 2
    const y = Math.floor((pageHeight - height) / 2);

    page.drawImage(image, { width, height, x, y })
  }

  return pdfDoc
}

const addPDFToPDFDocument: AddFileToPDFDocument = async (pdfDoc, file) => {
  const fileBuffer = readFileSync(file.path)
  const srcDoc = await PDFDocument.load(fileBuffer)
  const pages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices())

  for (const page of pages) {
    pdfDoc.addPage(page)
  }

  return pdfDoc
}
