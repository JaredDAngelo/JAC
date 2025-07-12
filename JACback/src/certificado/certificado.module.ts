import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificadoService } from './certificado.service';
import { CertificadoController } from './certificado.controller';
import { CertificadoSchema } from './schema/certificado.schema';
import { CertificadoTemplateService } from './certificado-template.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Certificado', schema: CertificadoSchema },
    ]),
  ],
  controllers: [CertificadoController],
  providers: [CertificadoService, CertificadoTemplateService],
  exports: [CertificadoService],
})
export class CertificadoModule {}
