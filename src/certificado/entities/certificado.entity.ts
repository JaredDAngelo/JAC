import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IActa } from 'src/acta/entities/acta.entity';


@Schema({ timestamps: true })
export class Certificado extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  fechaEmision: Date;

  @Prop({ required: true, unique: true })
  codigoUnico: string;

  @Prop({ type: Types.ObjectId, ref: 'Acta', required: true })
  acta: IActa | Types.ObjectId;
}

export const CertificadoSchema = SchemaFactory.createForClass(Certificado);