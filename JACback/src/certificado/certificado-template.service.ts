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
      doc.image(headerPath, 50, 45, { width: 250 });
    }
    doc.moveDown(6);
  }

  private addFooter(doc: PDFKit.PDFDocument) {
    const footerPath = join(this.templatesPath, 'footer.png');
    const pageHeight = doc.page.height;

    if (fs.existsSync(footerPath)) {
      doc.image(footerPath, 50, pageHeight - 110, { width: 500 });
    }
  }

  private addMainContent(doc: PDFKit.PDFDocument, dto: CreateCertificadoDto) {
    // Título del certificado - centrado
    doc.font('Helvetica-Bold').fontSize(16);
    doc.text(this.getTituloCertificado(dto.tipo), { align: 'center' });
    doc.moveDown(1);

    // Subtítulo (DECALDAS) - centrado
    doc.font('Helvetica-Bold').fontSize(14);
    doc.text('GOBERNACION DE CALDAS', { align: 'center' });
    doc.moveDown(2);

    // Contenido principal - centrado
    doc.font('Helvetica').fontSize(12);
    doc.text(this.getContenidoCertificado(dto), {
      align: 'justify',
      width: 500,
      lineGap: 5,
    });
    doc.moveDown(4);

    // Fecha y lugar - alineado a la derecha
    const fechaFormateada = this.formatDate(new Date());
    doc.text(`En ${dto.ciudadEmision}, a ${fechaFormateada}`, {
      align: 'right',
    });
    doc.moveDown(10);

    // Firmas - una al lado de la otra
    const yPosition = doc.y;
    const pageWidth = doc.page.width - 100; // Margen izquierdo y derecho de 50

    // Firma izquierda}
    const firmaSecPath = join(this.templatesPath, 'firmaa.png');

    if (fs.existsSync(firmaSecPath)) {
      doc.image(firmaSecPath, 50, yPosition - 60, { width: 120, height: 60 });
    }

    doc.text(
      `___________________________\n${'ALBERTO HOYOS LÓPEZ'}\n${'Secretario General'}`,
      50,
      yPosition,
      { width: pageWidth / 2, align: 'left' },
    );

    // Firma derecha
    const firmaGobPath = join(this.templatesPath, 'firmah.png');

    const xRight = 50 + pageWidth / 2;

    if (fs.existsSync(firmaGobPath)) {
      doc.image(firmaGobPath, xRight + 120, yPosition - 60, {
        width: 120,
        height: 70,
      });
    }

    doc.text(
      `___________________________\n${'HENRY GUTIERREZ ANGEL'}\n${'Gobernador'}`,
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
      [TipoCertificado.ACTA_EXISTENCIA]: 'CERTIFICADO DE ACTA DE EXISTENCIA',
      [TipoCertificado.ACTA_DIRECTIVOS]: 'CERTIFICADO DE ACTA DE DIRECTIVOS',
      [TipoCertificado.ACTA_LIBROS]: 'CERTIFICADO DE ACTA DE LIBROS',
      [TipoCertificado.CERTIFICADO_ACTA]: 'CERTIFICADO DE ACTAS',
    };
    return titulos[tipo];
  }

  private getContenidoCertificado(dto: CreateCertificadoDto): string {
    const fecha = new Date(dto.fechaEmision);
    const fechaFormateada = fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    return (
      `La junta de acción comunal ${dto.nombreJunta}, en ejercicio de las facultades conferidas por la normativa ` +
      `vigente que regula la organización, funcionamiento y actuación de las entidades de ` +
      `carácter comunitario, certifica que en la ciudad de ${dto.ciudadEmision}, el día ` +
      `${fechaFormateada}, fue expedido un documento oficial cuya emisión se realizó en ` +
      `debida forma y conforme a los procedimientos internos establecidos. ` +
      `Dicho documento se encuentra incorporado en los registros institucionales y conserva ` +
      `plena validez para los fines administrativos, comunitarios y legales que puedan ` +
      `derivarse de su consulta o presentación ante las autoridades competentes.`
    );
  }
}
