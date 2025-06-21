import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LibrosDto } from './dto/create-libro.dto';
import { Libro } from './schema/libro.schema';

@Injectable()
export class LibroService {
  constructor(
    @InjectModel('libro') private readonly libroModel: Model<Libro>
  ) {}

  async crearLibro(librosDto: LibrosDto): Promise<Libro> {
    const nuevoLibro = new this.libroModel(librosDto);
    if (!nuevoLibro) {
      throw new NotFoundException('Libro no Creado');
    }
    return await nuevoLibro.save();
  }

  async obtenerLibro(id: string): Promise<Libro> {
    const libro = await this.libroModel.findById(id).exec();
    if (!libro) {
      throw new NotFoundException('Libro no Encontrado');
    }
    return libro;
  }

  async descargarLibro(
    id: string
  ): Promise<{ contenidoLibro: Buffer; tipo: string }> {
    const libro = await this.obtenerLibro(id);
    if (!libro) {
      throw new NotFoundException('Libro no Descargado');
    }
    return {
      contenidoLibro: libro.contenidoLibro,
      tipo: libro.tipo,
    };
  }

  async actualizarLibro(
    id: string,
    dto: LibrosDto
  ): Promise<Libro> {
    const libro = await this.libroModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!libro) {
      throw new NotFoundException('Libro no Actualizado');
    }
    return libro;
  }

  async eliminarLibro(id: string): Promise<Libro | null> {
    const libro = await this.libroModel.findByIdAndDelete(id).exec();
    if (!libro) {
      throw new NotFoundException('Libro no Eliminado');
    }
    return libro;
  }
}
