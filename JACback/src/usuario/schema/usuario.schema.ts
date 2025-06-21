import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  correo: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop({ required: true, unique: true })
  cedula: number;

  @Prop()
  telefono: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
