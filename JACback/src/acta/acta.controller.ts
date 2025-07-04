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
  NotFoundException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ActaService } from './acta.service';
import { ActaDto } from './dto/create-acta.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('acta')
export class ActaController {
  constructor(private readonly actaService: ActaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('contenido'))
  async crearActa(
    @Body() actaDto: ActaDto,
    @UploadedFile() contenido: Express.Multer.File
  ) {
    actaDto.contenido = contenido.buffer;
    return await this.actaService.CrearActa(actaDto);
  }

  @Get(':id')
  async ObtenerActa(@Param('id') id: string) {
    return await this.actaService.ObtenerActa(id);
  }

  @Get(':id/descargar')
  async descargarActa(@Param('id') id: string, @Res() res: Response) {
    const documentoActa = await this.actaService.DescargarActa(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${documentoActa.tipo}.pdf`,
    });
    res.status(HttpStatus.OK).send(documentoActa.contenido);
  }
  
  @Patch(':id/actualizar')
  async actualizarActa(@Param('id') id: string, @Body() dto: ActaDto) {
    return await this.actaService.actualizarActa(id, dto);
  }

  @Delete(':id/eliminar')
  async eliminarActa(@Param('id') id: string) {
    return await this.actaService.eliminarActa(id);
  }
}
