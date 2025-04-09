import { Injectable, NotFoundException } from '@nestjs/common';
import { IActa } from './entities/acta.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ActaDto } from './dto/create-acta.dto';

@Injectable()
export class ActaService {
  constructor(@InjectModel('Acta') private readonly actaModel: Model<IActa>) {}

  async CrearActa(actaDto: ActaDto): Promise<IActa> {
    const nuevoActa = new this.actaModel(actaDto);
    if (!nuevoActa) {
      throw new NotFoundException('Acta no creada');
    }
    return await nuevoActa.save();
  }

  async ObtenerActa(id: string): Promise<IActa> {
    const documentoActa = await this.actaModel.findById(id).exec();
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

  async actualizarActa(id: string, dto: ActaDto): Promise<IActa> {
    const documentoActa = await this.actaModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!documentoActa) {
      throw new NotFoundException('Acta no Actualizada');
    }
    return documentoActa;
  }

  async eliminarActa(id: string): Promise<IActa> {
    const documentoActa = await this.actaModel.findByIdAndDelete(id);
    if (!documentoActa) {
      throw new NotFoundException('Acta no Eliminada');
    }
    return documentoActa;
  }
}
