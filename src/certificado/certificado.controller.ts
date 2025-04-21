import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Res, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { Response } from 'express';
import { CertificadoService } from './certificado.service';
import { CertificadoDto } from './dto/create-certificado.dto';

@Controller('certificados')
export class CertificadoController {
  constructor(private readonly certificadoService: CertificadoService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() certificadoDto: CertificadoDto) {
    return this.certificadoService.create(certificadoDto);
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdf = await this.certificadoService.generarPdf(id);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="certificado-${id}.pdf"`
      );

      pdf.pipe(res);
      pdf.end();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}