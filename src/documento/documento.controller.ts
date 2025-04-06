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
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentoService } from './documento.service';
import { DocumentoDto } from './dto/create-documento.dto';
import { Response } from 'express';

@Controller('documentos')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}

  // * Crea un nuevo documento
  @Post()
  @UseInterceptors(FileInterceptor('contenido'))
  async crearDocumento(
    @Body() documentoDto: DocumentoDto,
    @UploadedFile() contenido: Express.Multer.File
  ) {
    documentoDto.contenido = contenido.buffer;
    return await this.documentoService.crearDocumento(documentoDto);
  }

  // * Obtiene la información de un documento por ID
  @Get(':id')
  async obtenerDocumento(@Param('id') id: string) {
    const documento = await this.documentoService.obtenerDocumento(id);
    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }
    return documento;
  }

  // * Descarga un documento por ID
  @Get(':id/descargar')
  async descargarDocumento(@Param('id') id: string, @Res() res: Response) {
    const documento = await this.documentoService.descargarDocumento(id);
    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }
    // * Configura los encabezados de la respuesta HTTP para la descarga del archivo
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${documento.tipo}.pdf`,
    });
    res.status(HttpStatus.OK).send(documento.contenido);
  }

  // * Actualiza un documento por ID
  @Patch(':id/actualizar')
  async actualizarDocumento(
    @Param('id') id: string,
    @Body() dto: DocumentoDto
  ) {
    const documento = await this.documentoService.actualizarDocumento(id, dto);
    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }
    return documento;
  }
}
