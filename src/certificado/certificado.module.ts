import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificadoController } from './certificado.controller';
import { CertificadoService } from './certificado.service';
import { Certificado, CertificadoSchema } from './entities/certificado.entity';
import { PdfGeneratorModule } from './pdf-generator/pdf-generator.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificado.name, schema: CertificadoSchema }
    ]),
    PdfGeneratorModule
  ],
  controllers: [CertificadoController],
  providers: [CertificadoService]
})
export class CertificadoModule {}