import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario, UsuarioSchema } from 'src/usuario/schema/usuario.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt.constants';
import { JwtStrategy } from './jwt.strategy'; //importamos el jwt strategy para poder usarlo en el login y crear el token

@Module({
  imports: [
  MongooseModule.forFeature([
    { name: Usuario.name, schema: UsuarioSchema },
  ]),
  JwtModule.register({
    secret: jwtConstants.secret, //es la semilla clave para encriptar el token
    signOptions: { expiresIn: '24h' },
  }),
],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], //inicializamos el servicio de jwt para poder usarlo en el login y crear el token
  exports: [JwtModule], // exportar JwtModule para que otros módulos puedan inyectar JwtService
})
export class AuthModule {}
