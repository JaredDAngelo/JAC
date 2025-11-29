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
    try {
      const created = await this.usuarioModel.create(usuarioObject); //creamos el usuario en la base de datos
      const userObj = (created as any).toObject ? (created as any).toObject() : { ...(created as any) };
      if (userObj.contraseña) delete userObj.contraseña;
      return userObj;
    } catch (err: any) {
      // Manejar errores de duplicados para dar mensajes amigables
      if (err && err.code === 11000 && err.keyValue) {
        const key = Object.keys(err.keyValue)[0];
        const value = err.keyValue[key];
        let message = `Valor duplicado en campo ${key}`;
        if (key === 'correo') message = 'El correo ya está registrado';
        if (key === 'cedula') message = 'La cédula ya está registrada';
        throw new HttpException(message, 400);
      }
      // Para otros errores, relanzar como error interno con mensaje
      throw new HttpException(err.message || 'Error al crear usuario', 500);
    }
  }


  async login(usuarioObjectLogin: LoginAuthDto) {
    const { correo} = usuarioObjectLogin; //capturamos el correo del objeto que nos llega
    const encontrarUsuario = await this.usuarioModel.findOne({correo}); //buscamos el usuario en la base de datos por el correo, encapsulamos el correo en un objeto para que lo busque por ese campo
                                                                              //cuando nosotros tenemos un objeto donde el valor se llama exactamente igual el lennguaje lo da por centado
    if (!encontrarUsuario) throw new HttpException('Usuario no encontrado', 404); //si no lo encuentra lanzamos un error
    
    const checkContraseña = await bcrypt.compare(usuarioObjectLogin.contraseña, encontrarUsuario.contraseña); //comparamos la contraseña que nos llega con la que tenemos en la base de datos, usando el metodo compare de bcrypt
    
    if (!checkContraseña) throw new HttpException('Contraseña incorrecta', 403); //si no es correcta lanzamos un error
  
    const payload = { id: encontrarUsuario._id, nombre: encontrarUsuario.nombre, rol: (encontrarUsuario as any).rol || 'user' }; // añadimos rol al payload
    const token = this.jwtService.sign(payload);
    // devolver usuario sin la contraseña
    const userObj = (encontrarUsuario as any).toObject ? (encontrarUsuario as any).toObject() : { ...(encontrarUsuario as any) };
    if (userObj.contraseña) delete userObj.contraseña;
    const datos = {
      usuario: userObj,
      token,
    };
    return datos; //si todo es correcto devolvemos el usuario (sin contraseña) y el token
  }
}