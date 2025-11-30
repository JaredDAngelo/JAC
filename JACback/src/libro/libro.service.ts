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

  async findAll(): Promise<Libro[]> {
    return this.libroModel.find().populate('junta', 'nombreJunta').exec();
  }

  async findGrouped(): Promise<any> {
    const libros = await this.findAll();
    const grouped = {
      inventarios: [] as any[],
      actas: [] as any[],
      afiliados: [] as any[],
      tesoreria: [] as any[],
    };
    libros.forEach((l: any) => {
      const item = {
        id: l._id?.toString?.() ?? '',
        nombre: l.nombre ?? (l.tipo || ''),
        junta: l.junta ? (typeof l.junta === 'string' ? l.junta : l.junta.nombreJunta || '') : '',
        actualizado: l.updatedAt ? l.updatedAt.toISOString().split('T')[0] : '',
      };
      switch (l.tipo) {
        case 'libro_inventarios':
          grouped.inventarios.push(item);
          break;
        case 'libro_actas':
          grouped.actas.push(item);
          break;
        case 'libro_afiliados':
          grouped.afiliados.push(item);
          break;
        case 'Libro_Tesoreria':
          grouped.tesoreria.push(item);
          break;
        default:
          break;
      }
    });
    return grouped;
  }

  async obtenerLibro(id: string): Promise<Libro> {
    // Obtener el libro y popular la referencia de `junta` para facilitar
    // que el frontend muestre el nombre y el id correctamente al editar.
    const libro = await this.libroModel.findById(id).populate('junta', 'nombreJunta nombre').exec();
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
