import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Get,
  NotFoundException,
  Res,
  HttpStatus,
  BadRequestException,
  Delete,
  Patch,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { LibroService } from "./libro.service";
import { LibrosDto } from "./dto/libro.dto";
import { Response } from "express";
import path from "path";

@Controller("libro")
export class LibroController {
  constructor(private readonly LibroService: LibroService) {}

  @Post() //CREAR
  @UseInterceptors(FileInterceptor('contenidoLibro'))
  async crearLibro(
    @Body() librosDto: LibrosDto,
    @UploadedFile() contenidoLibro: Express.Multer.File,
  ) {
    librosDto.contenidoLibro = contenidoLibro.buffer;
    return await this.LibroService.crearLibro(librosDto);
  }

  @Get(':id')  //BUSCAR POR ID
  async obtenerLibro(@Param('id') id: string) {
    return await this.LibroService.obtenerLibro(id);
    
  }

  @Get(':id/descargar') 
  async descargarLibro(@Param('id') id: string, @Res() res: Response) {
    const libro = await this.LibroService.descargaLibro(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${libro.tipo}.pdf`,
    });
    res.status(HttpStatus.OK).send(libro.contenidoLibro);

  }

  @Delete(':id/eliminar')
  async eliminarLibro(@Param('id') id: string) {
    return await this.LibroService.eliminarLibro(id);
  }

  @Patch(':id/actualizar')
  async actualizarLibro(@Param('id') id:string, @Body()dto:LibrosDto){
    return await this.LibroService.actualizarLibro(id,dto);
  
    
  }
  }

