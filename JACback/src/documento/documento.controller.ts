import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Get,
  Res,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentoService } from './documento.service';
import { DocumentoDto } from './dto/create-documento.dto';
import { Response } from 'express';

@Controller('documentos')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('contenido'))
  async crearDocumento(
    @Body() documentoDto: DocumentoDto,
    @UploadedFile() contenido: Express.Multer.File
  ) {
    documentoDto.contenido = contenido.buffer;
    return await this.documentoService.crearDocumento(documentoDto);
  }

  @Get(':id')
  async obtenerDocumento(@Param('id') id: string) {
    return await this.documentoService.obtenerDocumento(id);
  }

  @Get(':id/descargar')
  async descargarDocumento(@Param('id') id: string, @Res() res: Response) {
    const documento = await this.documentoService.descargarDocumento(id);
    // * Configura los encabezados de la respuesta HTTP para la descarga del archivo
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${documento.tipo}.pdf`,
    });
    res.status(HttpStatus.OK).send(documento.contenido);
  }

  @Patch(':id/actualizar')
  async actualizarDocumento(
    @Param('id') id: string,
    @Body() dto: DocumentoDto
  ) {
    return await this.documentoService.actualizarDocumento(id, dto);
  }

  @Delete(':id/eliminar')
  async eliminarDocumento(@Param('id') id: string) {
    return await this.documentoService.eliminardocumento(id);
  }
}
