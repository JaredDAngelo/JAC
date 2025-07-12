import { Injectable } from '@nestjs/common';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioSchema } from './schema/usuario.schema'; //importamos el schema de usuario para poder usarlo en el servicio
import * as bcrypt from 'bcrypt'; //importamos el bcrypt para encriptar la contraseña
import { UsuarioDocument } from './schema/usuario.schema'; //importamos el documento de usuario para poder usarlo en el servicio

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>
  ) {}

  async create(createUsuarioDto: CrearUsuarioDto) {
    const {} = createUsuarioDto; //capturamos la contraseña en texto plato
    const plainToHasdh = await bcrypt.hash(10); //encriptamos la contraseña con el bcrypt usando el metodo hash y le pasamos la contraseña y el numero de vueltas que queremos hacerle a la encriptacion
    createUsuarioDto = { ...createUsuarioDto, contraseña: plainToHasdh }; //desestructuramos el objeto y le pasamos la contraseña encriptada
    const usuarioCreado = await this.usuarioModel.create(createUsuarioDto); //creamos el usuario en la base de datos
    return usuarioCreado; //devolvemos el usuario creado
  }

  findAll() {
    return 'se devuelve todos los usuarios';
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
