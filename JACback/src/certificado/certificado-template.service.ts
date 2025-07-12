import { Injectable } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import * as fs from 'fs';
import { join } from 'path';
import {
  CreateCertificadoDto,
  TipoCertificado,
} from './dto/create-certificado.dto';

@Injectable()
export class CertificadoTemplateService {
  private readonly templatesPath = join(__dirname, 'templates', 'images');

  async generarPDF(dto: CreateCertificadoDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // Crear documento PDF
        const doc = new PDFKit({
          size: 'A4',
          margin: 50,
          bufferPages: true,
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Añadir contenido al PDF
        this.addHeader(doc);
        this.addMainContent(doc, dto);
        this.addFooter(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addHeader(doc: PDFKit.PDFDocument) {
    const headerPath = join(this.templatesPath, 'header.png');

    if (fs.existsSync(headerPath)) {
      doc.image(headerPath, 50, 45, { width: 500 });
    }
    doc.moveDown(3);
  }

  private addFooter(doc: PDFKit.PDFDocument) {
    const footerPath = join(this.templatesPath, 'footer.png');
    const pageHeight = doc.page.height;

    if (fs.existsSync(footerPath)) {
      doc.image(footerPath, 50, pageHeight - 100, { width: 500 });
    }

    // Número de página
    doc
      .fontSize(10)
      .text(`Página ${doc.bufferedPageRange().count}`, 50, pageHeight - 30, {
        align: 'center',
        width: 500,
      });
  }

  private addMainContent(doc: PDFKit.PDFDocument, dto: CreateCertificadoDto) {
    // Título del certificado - centrado
    doc.font('Helvetica-Bold').fontSize(16);
    doc.text(this.getTituloCertificado(dto.tipo), { align: 'center' });
    doc.moveDown(1);

    // Subtítulo (DECALDAS) - centrado
    doc.font('Helvetica-Bold').fontSize(14);
    doc.text('DECALDAS', { align: 'center' });
    doc.moveDown(1);

    // Número de página (1 / 2) - centrado
    doc.font('Helvetica').fontSize(12);
    doc.text('1 / 2', { align: 'center' });
    doc.moveDown(2);

    // Contenido principal - centrado
    doc.font('Helvetica').fontSize(12);
    doc.text(this.getContenidoCertificado(dto), {
      align: 'center',
      width: 450,
      lineGap: 5,
    });
    doc.moveDown(4);

    // Fecha y lugar - alineado a la derecha
    const fechaFormateada = this.formatDate(this.parseFecha(dto.fechaEmision));
    doc.text(`En ${dto.ciudadEmision}, a ${fechaFormateada}`, {
      align: 'right',
    });
    doc.moveDown(4);

    // Firmas - una al lado de la otra
    const yPosition = doc.y;
    const pageWidth = doc.page.width - 100; // Margen izquierdo y derecho de 50

    // Firma izquierda
    doc.text(
      `___________________________\n${dto.nombreSecretario}\n${dto.cargoSecretario}`,
      50,
      yPosition,
      { width: pageWidth / 2, align: 'left' },
    );

    // Firma derecha
    doc.text(
      `___________________________\n${dto.nombreGobernador}\nGobernador(a)`,
      50 + pageWidth / 2,
      yPosition,
      { width: pageWidth / 2, align: 'right' },
    );
  }

  private parseFecha(fecha: string | Date): Date {
    if (fecha instanceof Date) {
      return fecha;
    }

    const parsedDate = new Date(fecha);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Fecha inválida: ${fecha}`);
    }

    return parsedDate;
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private getTituloCertificado(tipo: TipoCertificado): string {
    const titulos = {
      [TipoCertificado.GUIA_ESTATUTO]: 'CERTIFICADO DE GUÍA ESTATUTARIA',
      [TipoCertificado.ACTA_CONSTITUCION]:
        'CERTIFICADO DE ACTA DE CONSTITUCIÓN',
      [TipoCertificado.ACTA_ELECCION]:
        'CERTIFICADO DE ACTA DE ELECCIÓN DE DESTINATARIO',
      [TipoCertificado.ASAMBLEA_CONSTITUCION]:
        'CERTIFICADO DE ASAMBLEA DE CONSTITUCIÓN',
      [TipoCertificado.INTERES_ASOCIATIVO]: 'CERTIFICADO DE INTERÉS ASOCIATIVO',
    };
    return titulos[tipo];
  }

  private getContenidoCertificado(dto: CreateCertificadoDto): string {
    return (
      `Por medio del presente documento se certifica que ${dto.nombreJunta}, ` +
      `identificada con radicado número ${dto.numeroRadicado}, ha cumplido con ` +
      `todos los requisitos establecidos por la normativa vigente para la ` +
      `constitución y funcionamiento de las organizaciones de este tipo.`
    );
  }
}
