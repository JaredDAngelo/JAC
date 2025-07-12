import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TipoDocumento } from '../dto/create-documento.dto';

export type DocumentoDocument = Documento & Document;

@Schema({ timestamps: true })
export class Documento {
  @Prop({ required: true, enum: Object.values(TipoDocumento) })
  tipo: TipoDocumento;

  @Prop({ required: true, type: Buffer })
  contenido: Buffer;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DocumentoSchema = SchemaFactory.createForClass(Documento);
