import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  correo: string;

  @Prop({ required: true })
  contraseña: string;

  // cedula debe ser obligatoria y única para todos los usuarios
  @Prop({ required: true, unique: true })
  cedula: number;

  @Prop({ required: true, default: 'user', enum: ['user', 'admin'] })
  rol: string;

  @Prop()
  telefono: string;

  @Prop({ type: Types.ObjectId, ref: 'Junta', required: false })
  junta?: Types.ObjectId | string;

  @Prop({ required: false, default: 'Activo', enum: ['Activo', 'Inactivo'] })
  estado?: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
