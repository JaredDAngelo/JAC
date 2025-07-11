import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Junta } from './schema/junta.schema';
import { JuntaDto } from './dto/create-junta.dto';

@Injectable()
export class JuntaService {
  constructor(
    @InjectModel(Junta.name) private readonly juntaModel: Model<Junta>,
  ) {}

  async crearJunta(juntaDto: JuntaDto): Promise<Junta> {
    const juntaData = {
      ...juntaDto,
      documentos: juntaDto.documentos || [],
      actas: juntaDto.actas || [],
      libros: juntaDto.libros || []
    };

    const nuevaJunta = new this.juntaModel(juntaData);
    const juntaGuardada = await nuevaJunta.save();
    
    if (!juntaGuardada) {
      throw new NotFoundException('No se pudo crear la junta');
    }
    return juntaGuardada;
  }

  async obtenerJunta(id: string): Promise<Junta> {
    const junta = await this.juntaModel.findById(id).exec();
    if (!junta) {
      throw new NotFoundException(`Junta con ID ${id} no encontrada`);
    }
    return junta;
  }

  async actualizarJunta(id: string, dto: JuntaDto): Promise<Junta> {
    const juntaActualizada = await this.juntaModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    
    if (!juntaActualizada) {
      throw new NotFoundException(`Junta con ID ${id} no encontrada para actualizar`);
    }
    return juntaActualizada;
  }

  async eliminarJunta(id: string): Promise<{ message: string }> {
    const resultado = await this.juntaModel.findByIdAndDelete(id).exec();
    if (!resultado) {
      throw new NotFoundException(`Junta con ID ${id} no encontrada para eliminar`);
    }
    return { message: `Junta con ID ${id} eliminada correctamente` };
  }
}