import fs from 'fs';
import os from 'os';
import { promisify } from 'util';
import { DropzoneFile } from '../components/sandwich-dropzone-component';
import { PDFDocument } from 'pdf-lib';

const HOME = os.homedir();
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function createPDF(files: DropzoneFile[]): Promise<boolean> {
  if (files.length === 0) {
    return;
  }

  const pdfDoc = await PDFDocument.create();

  files.forEach(async (file) => {
    const imageBytes = fs.readFileSync(file.path);
    let image, page;

    if (file.type === 'image/jpeg') {
      page = pdfDoc.addPage();
      image = await pdfDoc.embedJpg(imageBytes)
    } else if (file.type === 'image/png') {
      page = pdfDoc.addPage();
      image = await pdfDoc.embedPng(imageBytes)
    }

    if (image && page) {
      const imageDims = image.scale(0.2);

      page.drawImage(image, {
        x: (page.getWidth() / 2) - (imageDims.width / 2),
        y: (page.getHeight() / 2) - (imageDims.height / 2),
        width: imageDims.width,
        height: imageDims.height
      });
    }
  });

  const pdfBytes = await pdfDoc.save()

  const out = await writeFile(`${HOME}/Desktop/output.pdf`, pdfBytes);
}

