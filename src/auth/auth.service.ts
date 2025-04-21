import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegistroAuthDto } from './dto/registro-auth.dto';
import { Model } from 'mongoose';
import { Usuario , UsuarioDocument } from 'src/usuario/schema/usuario.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    private jwtService: JwtService, //inicializamos el servicio de jwt para poder usarlo en el login y crear el token
  ){}
  
  async registro(usuarioObject: RegistroAuthDto) { 
    const { contraseña } = usuarioObject; //capturamos la contraseña en texto plato
    const plainToHasdh = await bcrypt.hash(contraseña, 10); //encriptamos la contraseña con el bcrypt usando el metodo hash y le pasamos la contraseña y el numero de vueltas que queremos hacerle a la encriptacion
    usuarioObject = { ...usuarioObject, contraseña: plainToHasdh }; //desestructuramos el objeto y le pasamos la contraseña encriptada
    return this.usuarioModel.create(usuarioObject); //creamos el usuario en la base de datos
  }


  async login(usuarioObjectLogin: LoginAuthDto) {
    const { correo} = usuarioObjectLogin; //capturamos el correo del objeto que nos llega
    const encontrarUsuario = await this.usuarioModel.findOne({correo}); //buscamos el usuario en la base de datos por el correo, encapsulamos el correo en un objeto para que lo busque por ese campo
                                                                              //cuando nosotros tenemos un objeto donde el valor se llama exactamente igual el lennguaje lo da por centado
    if (!encontrarUsuario) throw new HttpException('Usuario no encontrado', 404); //si no lo encuentra lanzamos un error
    
    const checkContraseña = await bcrypt.compare(usuarioObjectLogin.contraseña, encontrarUsuario.contraseña); //comparamos la contraseña que nos llega con la que tenemos en la base de datos, usando el metodo compare de bcrypt
    
    if (!checkContraseña) throw new HttpException('Contraseña incorrecta', 403); //si no es correcta lanzamos un error
  
    const payload = {id: encontrarUsuario._id, nombre: encontrarUsuario.nombre}; //creamos el payload que es lo que vamos a enviar al token, le pasamos el id y el correo del usuario encontrado
    const token = this.jwtService.sign(payload);
    const datos = {
      usuario: encontrarUsuario,
      token
    }
    return datos; //si todo es correcto devolvemos el usuario encontrado
  }
}