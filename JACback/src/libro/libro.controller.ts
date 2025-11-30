import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { LibroService } from './libro.service';
import { LibrosDto } from './dto/create-libro.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('libro')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Post()
  @UseInterceptors(FileInterceptor('contenidoLibro'))
  async crearLibro(
    @Body() librosDto: LibrosDto,
    @UploadedFile() contenidoLibro: Express.Multer.File
  ) {
    if (!contenidoLibro || !contenidoLibro.buffer) {
      // devolver un error claro cuando no se sube archivo
      throw new BadRequestException('El campo contenidoLibro (archivo) es requerido')
    }
    librosDto.contenidoLibro = contenidoLibro.buffer;
    return await this.libroService.crearLibro(librosDto);
  }

  @Get()
  async obtenerLibros() {
    return await this.libroService.findAll();
  }

  @Get('grouped')
  async obtenerLibrosGrouped() {
    return await this.libroService.findGrouped();
  }

  @Get(':id')
  async obtenerLibro(@Param('id') id: string) {
    return await this.libroService.obtenerLibro(id);
  }

  @Get(':id/descargar')
  async descargarLibro(@Param('id') id: string, @Res() res: Response) {
    const libro = await this.libroService.descargarLibro(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${libro.tipo}.pdf`,
    });
    res.status(HttpStatus.OK).send(libro.contenidoLibro);
  }

  @Get(':id/contenido')
  async verContenido(@Param('id') id: string, @Res() res: Response) {
    const libro = await this.libroService.descargarLibro(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=${libro.tipo}.pdf`,
    });
    res.status(HttpStatus.OK).send(libro.contenidoLibro);
  }

  @Patch(':id/actualizar')
  async actualizarLibro(@Param('id') id: string, @Body() dto: LibrosDto) {
    return await this.libroService.actualizarLibro(id, dto);
  }

  @Delete(':id/eliminar')
  async eliminarLibro(@Param('id') id: string) {
    return await this.libroService.eliminarLibro(id);
  }
}
