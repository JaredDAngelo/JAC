import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TipoLibro } from '../dto/create-libro.dto';


export type LibroDocument = Libro & Document;

@Schema({ timestamps: true })
export class Libro {
  @Prop({ required: true, enum: Object.values(TipoLibro) })
  tipo: TipoLibro;

  @Prop({ required: true, type: Buffer })
  contenidoLibro: Buffer;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LibroSchema = SchemaFactory.createForClass(Libro);
