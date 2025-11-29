import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioSchema, Usuario } from './schema/usuario.schema';
import { Junta, JuntaSchema } from '../junta/schema/junta.schema';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema }, // esquema de usuario
      { name: Junta.name, schema: JuntaSchema },
  ]),],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
