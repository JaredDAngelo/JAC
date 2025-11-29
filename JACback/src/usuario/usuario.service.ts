import { Injectable, NotFoundException } from '@nestjs/common';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario, UsuarioSchema, UsuarioDocument } from './schema/usuario.schema'; //importamos el schema de usuario para poder usarlo en el servicio
import * as bcrypt from 'bcrypt'; //importamos el bcrypt para encriptar la contraseña
import { Junta, JuntaDocument } from '../junta/schema/junta.schema';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Junta.name) private juntaModel: Model<JuntaDocument>,
  ) {}

  async create(createUsuarioDto: CrearUsuarioDto) {
    // encriptar la contraseña correctamente y crear el usuario
    const plainToHash = await bcrypt.hash(createUsuarioDto.contraseña, 10);
    const toCreate = { ...createUsuarioDto, contraseña: plainToHash } as any;
    const usuarioCreado = await this.usuarioModel.create(toCreate); //creamos el usuario en la base de datos
    // devolver el usuario creado sin contraseña y con la junta poblada (si existe)
    const populated = await this.usuarioModel
      .findById((usuarioCreado as any)._id)
      .select('-contraseña')
      .populate('junta', 'nombreJunta')
      .exec();
    return populated;
  }

  async findAll() {
    // devolver usuarios sin el campo contraseña
    try {
      // cuando populate funciona, normalizamos el campo `junta` a una cadena con el nombre para
      // facilitar el consumo por parte del frontend
      const users = await this.usuarioModel.find().select('-contraseña').populate('junta', 'nombreJunta').lean().exec();
      if (users && users.length) {
        users.forEach((u: any) => {
          if (u.junta && typeof u.junta === 'object') {
            u.junta = (u.junta.nombreJunta || u.junta.name || u.junta._id || '').toString();
          }
        })
      }
      return users;
    } catch (err: any) {
      // Si hay valores no válidos en el campo 'junta' (p.ej. nombres en vez de ObjectId)
      // Mongoose puede lanzar CastError al intentar popular. Hacemos fallback y devolvemos
      // los usuarios sin popular la referencia para evitar 500 en la API.
      // El frontend ya normaliza `junta` y mostrará el texto almacenado si existe.
      console.warn('[usuario.service] populate failed, returning users without populate:', err.message || err);
      // Intentamos enriquecer manualmente el campo `junta` consultando la colección de juntas
      const users: any[] = await this.usuarioModel.find().select('-contraseña').lean().exec();
      if (!users || !users.length) return users;
      // para cada usuario, si tiene junta y no es ObjectId poblado, intentar resolver el nombre
      await Promise.all(users.map(async (u) => {
        try {
          if (!u.junta) return;
          // si es un ObjectId válido, intentar obtener el nombre por id
          if (Types.ObjectId.isValid(u.junta)) {
            const j = await this.juntaModel.findById(u.junta).select('nombreJunta').lean().exec();
            if (j && j.nombreJunta) {
              u.junta = j.nombreJunta;
              return;
            }
          }
          // si junta es string que no es ObjectId, puede ser nombre; buscar por nombre
          if (typeof u.junta === 'string') {
            const j2 = await this.juntaModel.findOne({ nombreJunta: u.junta }).select('nombreJunta').lean().exec();
            if (j2 && j2.nombreJunta) {
              u.junta = j2.nombreJunta;
              return;
            }
          }
          // si nada, dejar el valor tal cual (es texto libre)
        } catch (e) {
          // ignore per-user resolution errors
          return;
        }
      }));
      return users;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.usuarioModel.findById(id).select('-contraseña').populate('junta', 'nombreJunta').exec();
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
    } catch (err: any) {
      // Si la razón fue un CastError al popular, intentamos devolver el documento sin popular
      if (err && err.name === 'CastError') {
        console.warn('[usuario.service] populate CastError for findOne, returning without populate:', err.message);
        const user = await this.usuarioModel.findById(id).select('-contraseña').exec();
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
      }
      throw err;
    }
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    // si vienen contraseña, hashearla
    const dto: any = { ...updateUsuarioDto } as any;
    if (dto.contraseña) {
      dto.contraseña = await bcrypt.hash(dto.contraseña, 10);
    }
    try {
      const updated = await this.usuarioModel.findByIdAndUpdate(id, dto, { new: true }).select('-contraseña').populate('junta', 'nombreJunta').exec();
      if (!updated) throw new NotFoundException('Usuario no encontrado');
      return updated;
    } catch (err: any) {
      if (err && err.name === 'CastError') {
        console.warn('[usuario.service] populate CastError for update, returning without populate:', err.message);
        const updated = await this.usuarioModel.findByIdAndUpdate(id, dto, { new: true }).select('-contraseña').exec();
        if (!updated) throw new NotFoundException('Usuario no encontrado');
        return updated;
      }
      throw err;
    }
  }

  async remove(id: string) {
    const deleted = await this.usuarioModel.findByIdAndDelete(id).select('-contraseña').exec();
    if (!deleted) throw new NotFoundException('Usuario no encontrado');
    return { deleted: true, usuario: deleted };
  }

  // asignar rol a un usuario (admin only endpoint)
  async setRole(id: string, rol: string) {
    // Asignar el nombre de rol al usuario. El control de existencia/validez
    // del rol (si está en la colección roles) se hace en el controlador o en
    // una capa superior si se desea. Aquí simplemente actualizamos el campo.
    const updated = await this.usuarioModel.findByIdAndUpdate(id, { rol }, { new: true }).select('-contraseña').populate('junta', 'nombreJunta').exec();
    if (!updated) throw new NotFoundException('Usuario no encontrado');
    return updated;
  }
}
