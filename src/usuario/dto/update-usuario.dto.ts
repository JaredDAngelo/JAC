import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto } from './crear-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CrearUsuarioDto) {}
