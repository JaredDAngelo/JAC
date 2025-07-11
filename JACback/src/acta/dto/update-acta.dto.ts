import { PartialType } from '@nestjs/mapped-types';
import { ActaDto } from './create-acta.dto';

export class ActualizarActaDto extends PartialType(ActaDto) {}
