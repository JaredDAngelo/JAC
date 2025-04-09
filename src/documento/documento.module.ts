import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentoController } from './documento.controller';
import { DocumentoService } from './documento.service';
import { DocumentoSchema } from './entities/documento.entity';

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
