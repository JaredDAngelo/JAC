import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from './jwt.constants';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),// vamos a extraer el jwt del headertoken de el encabezado
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, //llamamos a la constante que tenemos en el archivo jwt.constants.ts, asi puede validar que la generacion del backen la genero el backend
    });
  }

  async validate(payload: any) {
    return { userId: payload.id, nombre: payload.nombre };
  }

}