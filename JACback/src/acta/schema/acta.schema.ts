import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TipoActa } from '../dto/create-acta.dto';
import { Junta } from '../../junta/schema/junta.schema';

export type ActaDocument = Acta & Document;

@Schema({ timestamps: true })
export class Acta {
  @Prop({ required: true, enum: Object.values(TipoActa) })
  tipo: TipoActa;

  @Prop({ required: true, type: Buffer })
  contenido: Buffer;

  // Referencia a la Junta responsable de la acta
  @Prop({ type: Types.ObjectId, ref: 'Junta', required: false })
  junta?: Junta | Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ActaSchema = SchemaFactory.createForClass(Acta);
