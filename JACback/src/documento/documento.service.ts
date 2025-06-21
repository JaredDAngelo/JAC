import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDocumento } from './entities/documento.entity';
import { DocumentoDto } from './dto/create-documento.dto';

@Injectable()
export class DocumentoService {
  constructor(
    @InjectModel('Documento') private readonly documentoModel: Model<IDocumento>
  ) {}

  // * Crea un nuevo documento en la base de datos
  async crearDocumento(documentoDto: DocumentoDto): Promise<IDocumento> {
    const nuevoDocumento = new this.documentoModel(documentoDto);
    if (!nuevoDocumento) {
      throw new NotFoundException('Documento no Creado');
    }
    return await nuevoDocumento.save();
  }

  // * Obtiene un documento por su ID
  async obtenerDocumento(id: string): Promise<IDocumento> {
    const documento = await this.documentoModel.findById(id).exec();
    if (!documento) {
      throw new NotFoundException('Documento no Encontrado');
    }
    return documento;
  }

  // * Prepara un documento para descarga
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

  // * Actualizar un documento por su ID
  async actualizarDocumento(
    id: string,
    dto: DocumentoDto
  ): Promise<IDocumento> {
    const documento = await this.documentoModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!documento) {
      throw new NotFoundException('Documento no Actualizado');
    }
    return documento;
  }

  // * Eliminar un documento por su ID
  async eliminardocumento(id: string): Promise<IDocumento | null> {
    const documento = await this.documentoModel.findByIdAndDelete(id).exec();
    if (!documento) {
      throw new NotFoundException('Documento no Eliminado');
    }
    return documento;
  }
}
