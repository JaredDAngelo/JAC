import { Schema, Document, model } from 'mongoose';
import { TipoDocumento } from '../dto/create-documento.dto';


// * Esquema de Mongoose para documentos
export const DocumentoSchema = new Schema(
  {
    tipo: {
      type: String,
      enum: Object.values(TipoDocumento),
      required: true,
    },
    contenido: {
      type: Buffer,
      required: true,
    },
  },
  /*
   * Esta opción automáticamente añade dos campos a cada documento
   * Añade createdAt (Fecha de creacion) datedAt (Fecha Ultima modificacion)
   */
  { timestamps: true }
);

// * Interfaz que representa un documento en la base de datos
export interface IDocumento extends Document {
  tipo: TipoDocumento;
  contenido: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

// * Creación del modelo
export const DocumentoModel = model<IDocumento>('Documento', DocumentoSchema);
