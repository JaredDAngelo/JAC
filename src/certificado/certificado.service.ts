import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Certificado } from './entities/certificado.entity';
import { CertificadoDto } from './dto/create-certificado.dto';
import { PdfGeneratorService } from './pdf-generator/pdf-generator.service';



@Injectable()
export class CertificadoService {
  constructor(
    @InjectModel(Certificado.name)
    private readonly certificadoModel: Model<Certificado>,
    private readonly PdfGeneratorService: PdfGeneratorService
  ) {}

   /* async create(certificadoDto: CertificadoDto): Promise<Certificado> {
    try {
      const crearCertificado = new this.certificadoModel({
        ...certificadoDto,
        certificado: new Types.ObjectId(certificadoDto.)
      });
      return await crearCertificado.save();
    } catch (error) {
      throw new BadRequestException('Error al crear certificado: ' + error.message);
    }
  }  */

  async generarPdf(certificadoId: string) {
    const certificado = await this.certificadoModel
      .findById(certificadoId)
      .populate('acta')
      .orFail(() => new Error('Certificado no encontrado'))
      .exec();

    if (!certificado.acta) {
      throw new Error('El acta asociada no fue encontrada');
    }

    return this.PdfGeneratorService.generarCertificadoPdf(certificado, {
      rutaLogo: './assets/logo.png', // Ajusta la ruta según necesites
      textoPiePagina: '© 2023 Sistema de Certificados Digitales',
      incluirBorde: true
    });
  }
}