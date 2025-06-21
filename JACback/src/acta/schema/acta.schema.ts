import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TipoActa } from '../dto/create-acta.dto';

export type ActaDocument = Acta & Document;

@Schema({ timestamps: true })
export class Acta {
  @Prop({ required: true, enum: Object.values(TipoActa) })
  tipo: TipoActa;

  @Prop({ required: true, type: Buffer })
  contenido: Buffer;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ActaSchema = SchemaFactory.createForClass(Acta);
