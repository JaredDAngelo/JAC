import { Injectable } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import * as fs from 'fs';
import { Certificado } from '../../certificado/entities/certificado.entity';
import { IActa } from '../../acta/entities/acta.entity';

@Injectable()
export class PdfGeneratorService {
  async generarCertificadoPdf(
    certificado: Certificado,
    opciones: {
      rutaLogo?: string;
      textoPiePagina?: string;
      incluirBorde?: boolean;
    } = {}
  ): Promise<PDFKit.PDFDocument> {
    const doc = new PDFKit({
      size: 'A4',
      margin: 50,
      bufferPages: true,
    });

    // Opciones por defecto
    const {
      rutaLogo = null,
      textoPiePagina = '© 2023 Certificados Digitales - Todos los derechos reservados',
      incluirBorde = true,
    } = opciones;

    // Agregar borde si se solicita
    if (incluirBorde) {
      this.agregarBorde(doc);
    }

    // Agregar logo si se proporciona
    if (rutaLogo && fs.existsSync(rutaLogo)) {
      await this.agregarLogo(doc, rutaLogo);
    }

    // Encabezado
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('CERTIFICADO', { align: 'center' })
      .moveDown(0.5);

    // Título
    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .text(certificado.titulo, { align: 'center' })
      .moveDown(1.5);

    // Cuerpo del texto
    doc
      .font('Helvetica')
      .fontSize(12)
      .text('Se certifica que:', { align: 'center' })
      .moveDown(1);

    // Detalles del certificado
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text(`Tipo: ${(certificado.acta as IActa).tipo}`, { align: 'center' })
      .moveDown(0.5);

    doc
      .font('Helvetica')
      .fontSize(12)
      .text(`Código único: ${certificado.codigoUnico}`, { align: 'center' })
      .moveDown(0.5);

    doc
      .text(
        `Fecha de emisión: ${certificado.fechaEmision.toLocaleDateString()}`,
        { align: 'center' }
      )
      .moveDown(2);

    // Área de firma
    doc
      .moveTo(150, doc.y)
      .lineTo(450, doc.y)
      .stroke()
      .moveDown(3)
      .font('Helvetica')
      .fontSize(10)
      .text('Firma y sello autorizado', { align: 'center' })
      .moveDown(0.5);

    // Pie de página
    this.agregarPiePagina(doc, textoPiePagina);

    return doc;
  }

  private agregarBorde(doc: PDFKit.PDFDocument): void {
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();
  }

  private async agregarLogo(
    doc: PDFKit.PDFDocument,
    rutaLogo: string
  ): Promise<void> {
    doc.image(rutaLogo, 50, 45, { width: 100 });
  }

  private agregarPiePagina(doc: PDFKit.PDFDocument, texto: string): void {
    doc
      .fontSize(8)
      .text(texto, 50, doc.page.height - 40, {
        align: 'center',
        width: doc.page.width - 100,
      });
  }

  async generarPdfComoArchivo(
    certificado: Certificado,
    rutaSalida: string,
    opciones?: any
  ): Promise<string> {
    const doc = await this.generarCertificadoPdf(certificado, opciones);
    
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(rutaSalida);
      doc.pipe(stream);
      doc.end();

      stream.on('finish', () => resolve(rutaSalida));
      stream.on('error', reject);
    });
  }

  async generarPdfComoBuffer(
    certificado: Certificado,
    opciones?: any
  ): Promise<Buffer> {
    const doc = await this.generarCertificadoPdf(certificado, opciones);
    
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.end();
    });
  }
}