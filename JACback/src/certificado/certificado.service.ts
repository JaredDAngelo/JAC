import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { CertificadoTemplateService } from './certificado-template.service';
import { Certificado } from './schema/certificado.schema';

@Injectable()
export class CertificadoService {
  constructor(
    @InjectModel('Certificado')
    private readonly certificadoModel: Model<Certificado>,
    private readonly templateService: CertificadoTemplateService,
  ) {}

  async create(createCertificadoDto: CreateCertificadoDto) {
    const certificado = new this.certificadoModel(createCertificadoDto);
    const pdfBuffer =
      await this.templateService.generarPDF(createCertificadoDto);
    certificado.pdfBuffer = pdfBuffer;
    return certificado.save();
  }

  async generatePDF(id: string) {
    const certificado = await this.certificadoModel.findById(id).exec();
    if (!certificado) {
      throw new Error('Certificado no encontrado');
    }
    return (
      certificado.pdfBuffer || this.templateService.generarPDF(certificado)
    );
  }

  findAll() {
    return this.certificadoModel.find().exec();
  }

  findOne(id: string) {
    return this.certificadoModel.findById(id).exec();
  }

  update(id: string, updateCertificadoDto: UpdateCertificadoDto) {
    return this.certificadoModel
      .findByIdAndUpdate(id, updateCertificadoDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.certificadoModel.findByIdAndDelete(id).exec();
  }
}
