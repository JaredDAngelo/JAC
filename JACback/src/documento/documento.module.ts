import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentoController } from './documento.controller';
import { DocumentoService } from './documento.service';
import { DocumentoSchema } from './schema/documento.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Documento',
        schema: DocumentoSchema,
      },
    ]),
  ],
  controllers: [DocumentoController],
  providers: [DocumentoService],
  exports: [DocumentoService],
})
export class DocumentoModule {}
