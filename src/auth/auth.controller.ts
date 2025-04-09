import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegistroAuthDto } from './dto/registro-auth.dto';
import { ApiTags } from '@nestjs/swagger';

// TODO POST - http://localhost:3000/auth/login
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO REGISTRO - http://localhost:3000/auth/registro
  @Post('registro')
  registrousuario(@Body() usuarioObject: RegistroAuthDto) {
    return this.authService.registro(usuarioObject);
  }

  // TODO LOGIN - http://localhost:3000/auth/login
  @Post('login')
  loginUsuario(@Body() usuarioObjectLogin: LoginAuthDto) { //agarramos el cuerpo, le pasamos la validacion con esto dejamos el controlador limpio
    return this.authService.login(usuarioObjectLogin);
  }

}
