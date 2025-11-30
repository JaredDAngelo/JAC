import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ActaDto } from './dto/create-acta.dto';
import { Acta } from './schema/acta.schema';

@Injectable()
export class ActaService {
  constructor(@InjectModel('Acta') private readonly actaModel: Model<Acta>) {}

  async CrearActa(actaDto: ActaDto): Promise<Acta> {
    const nuevoActa = new this.actaModel(actaDto);
    if (!nuevoActa) {
      throw new NotFoundException('Acta no creada');
    }
    return await nuevoActa.save();
  }

  // Obtener la lista completa de actas
  async ObtenerActas(): Promise<Acta[]> {
    // Poblar la junta relacionada para facilitar el mapeo en frontend
    return await this.actaModel.find().populate('junta').exec();
  }

  async ObtenerActa(id: string): Promise<Acta> {
    const documentoActa = await this.actaModel.findById(id).populate('junta').exec();
    if (!documentoActa) {
      throw new NotFoundException('Acta no encontrada');
    }
    return documentoActa;
  }

  async DescargarActa(
    id: string
  ): Promise<{ contenido: Buffer; tipo: string }> {
    const documentoActa = await this.ObtenerActa(id);
    if (!documentoActa) {
      throw new NotFoundException('Acta no Descargada');
    }
    return {
      contenido: documentoActa.contenido,
      tipo: documentoActa.tipo,
    };
  }

  async actualizarActa(id: string, dto: Partial<ActaDto> | any): Promise<Acta> {
    const update: any = {}
    if (dto.tipo !== undefined) update.tipo = dto.tipo
    if (dto.junta !== undefined) update.junta = dto.junta
    if (dto.contenido !== undefined) update.contenido = dto.contenido

    const documentoActa = await this.actaModel.findByIdAndUpdate(id, update, {
      new: true,
    }).populate('junta');
    if (!documentoActa) {
      throw new NotFoundException('Acta no Actualizada');
    }
    return documentoActa;
  }

  async eliminarActa(id: string): Promise<Acta> {
    const documentoActa = await this.actaModel.findByIdAndDelete(id);
    if (!documentoActa) {
      throw new NotFoundException('Acta no Eliminada');
    }
    return documentoActa;
  }
}
