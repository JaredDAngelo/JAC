import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TipoCertificado } from '../dto/create-certificado.dto';

export type CertificadoDocument = Certificado & Document;

@Schema()
export class Certificado {
  @Prop({ type: String, enum: Object.values(TipoCertificado), required: true })
  tipo: TipoCertificado;

  @Prop({ required: true })
  nombreJunta: string;

  @Prop({ required: true })
  fechaEmision: Date;

  @Prop({ required: true })
  numeroRadicado: string;

  @Prop({ required: true })
  ciudadEmision: string;

  @Prop({ required: true })
  nombreSecretario: string;

  @Prop({ required: true })
  cargoSecretario: string;

  @Prop({ required: true })
  nombreGobernador: string;

  @Prop({ type: Buffer })
  pdfBuffer?: Buffer;
}

export const CertificadoSchema = SchemaFactory.createForClass(Certificado);
