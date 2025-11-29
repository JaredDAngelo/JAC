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
    // incluir rol en el objeto usuario para que los guards puedan accederlo
    return { userId: payload.id, nombre: payload.nombre, rol: payload.rol || payload.role || 'user' };
  }

}