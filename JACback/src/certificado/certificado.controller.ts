import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('certificados')
@Controller('certificados')
export class CertificadoController {
  constructor(private readonly certificadoService: CertificadoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo certificado' })
  create(@Body() createCertificadoDto: CreateCertificadoDto) {
    return this.certificadoService.create(createCertificadoDto);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Descargar PDF del certificado' })
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.certificadoService.generatePDF(id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=certificado_${id}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los certificados' })
  findAll() {
    return this.certificadoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un certificado por ID' })
  findOne(@Param('id') id: string) {
    return this.certificadoService.findOne(id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Actualizar un certificado' })
  update(
    @Param('id') id: string,
    @Body() updateCertificadoDto: UpdateCertificadoDto,
  ) {
    return this.certificadoService.update(id, updateCertificadoDto);
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Eliminar un certificado' })
  remove(@Param('id') id: string) {
    return this.certificadoService.remove(id);
  }
}
