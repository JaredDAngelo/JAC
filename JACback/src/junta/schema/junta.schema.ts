import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Acta } from '../../acta/schema/acta.schema';
import { Documento } from '../../documento/schema/documento.schema';
import { Libro } from '../../libro/schema/libro.schema';

export type JuntaDocument = Junta & Document;

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Junta {
  @Prop({ required: true, trim: true })
  nombreJunta: string;

  @Prop({ required: true, trim: true })
  direccion: string;

  @Prop({ required: true, trim: true })
  departamento: string;

  @Prop({ required: true, trim: true })
  municipio: string;

  @Prop({ required: true, trim: true })
  barrio: string;

  @Prop({ required: true, trim: true })
  presidente: string;

  @Prop({ required: true, trim: true })
  vicepresidente: string;

  @Prop({ required: true, trim: true })
  tesorero: string;

  @Prop({ required: true, trim: true })
  secretario: string;

  @Prop({ required: true, trim: true })
  coordinador: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Documento' }], default: [] })
  documentos: Documento[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Acta' }], default: [] })
  actas: Acta[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Libro' }], default: [] })
  libros: Libro[];
}

export const JuntaSchema = SchemaFactory.createForClass(Junta);

JuntaSchema.index({ nombreJunta: 1 });
JuntaSchema.index({ municipio: 1 });