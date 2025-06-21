import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentoDto } from './dto/create-documento.dto';
import { Documento } from './schema/documento.schema';

@Injectable()
export class DocumentoService {
  constructor(
    @InjectModel('Documento') private readonly documentoModel: Model<Documento>
  ) {}

  async crearDocumento(documentoDto: DocumentoDto): Promise<Documento> {
    const nuevoDocumento = new this.documentoModel(documentoDto);
    if (!nuevoDocumento) {
      throw new NotFoundException('Documento no Creado');
    }
    return await nuevoDocumento.save();
  }

  async obtenerDocumento(id: string): Promise<Documento> {
    const documento = await this.documentoModel.findById(id).exec();
    if (!documento) {
      throw new NotFoundException('Documento no Encontrado');
    }
    return documento;
  }

  async descargarDocumento(
    id: string
  ): Promise<{ contenido: Buffer; tipo: string }> {
    const documento = await this.obtenerDocumento(id);
    if (!documento) {
      throw new NotFoundException('Documento no Descargado');
    }
    return {
      contenido: documento.contenido,
      tipo: documento.tipo,
    };
  }

  async actualizarDocumento(
    id: string,
    dto: DocumentoDto
  ): Promise<Documento> {
    const documento = await this.documentoModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!documento) {
      throw new NotFoundException('Documento no Actualizado');
    }
    return documento;
  }

  async eliminardocumento(id: string): Promise<Documento | null> {
    const documento = await this.documentoModel.findByIdAndDelete(id).exec();
    if (!documento) {
      throw new NotFoundException('Documento no Eliminado');
    }
    return documento;
  }
}
