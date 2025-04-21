import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from "mongoose";
import{ILibro} from "./dto/libro.model";
import { LibrosDto } from './dto/libro.dto';
import { LibroModule } from './libro.module';

@Injectable()
export class LibroService {
    constructor(
        @InjectModel('libro') private readonly libroModel: Model<ILibro>
    ){}
//CREAR
    async crearLibro(librosDto: LibrosDto): Promise<ILibro> {
    const nuevoLibro = new this.libroModel(librosDto);
    if(!nuevoLibro){
        throw new NotFoundException("El libro no ha sido creado");
    }
    return await nuevoLibro.save();
    }
    //BUSCAR POR ID
    async obtenerLibro(id:string):Promise<ILibro>{
        const libro = await this.libroModel.findById(id).exec();
        if(!libro){
            throw new NotFoundException("El libro no ha sido encontrado");
        }
        return libro;
    }
    //DESCARGAR LIBRO
    async descargaLibro(
        id: string
    ):
    Promise<{contenidoLibro: Buffer, tipo: string}>{
        const libro = await this.obtenerLibro(id);
        if(!libro){
            throw new NotFoundException("El libro no ha sido Descargado");
        }
        return{
            contenidoLibro: libro.contenidoLibro,
            tipo: libro.tipo,
        };
    }
    // ELIMINAR
    async eliminarLibro(id: string): Promise<ILibro> {
        const libro= await this.libroModel.findByIdAndDelete(id);
        if(!libro){
            throw new NotFoundException("libro no eliminado")
        }
             
        return libro;
    }
    //ACTUALIZAR // EDITAR
    async actualizarLibro(id: string,dto:LibrosDto): Promise<ILibro>{
        const libro = await this.libroModel.findByIdAndUpdate(id,dto,{
            new: true,
        });
        if (!libro){
            throw new NotFoundException('Libro actualizado');
        }
return libro;
    }
}
