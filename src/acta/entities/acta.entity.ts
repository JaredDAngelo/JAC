import { model, Schema } from 'mongoose';
import { TipoActa } from '../dto/create-acta.dto';

export const ActaSchema = new Schema(
  {
    tipo: {
      type: String,
      enum: Object.values(TipoActa),
      required: true,
    },
    contenido: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true }
);

export interface IActa {
  tipo: TipoActa;
  contenido: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export const ActaModel = model<IActa>('Acta', ActaSchema);
