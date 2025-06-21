import { PartialType } from '@nestjs/mapped-types';
import { LibrosDto } from './create-libro.dto';

export class ActualizarLibroDto extends PartialType(LibrosDto) {}
