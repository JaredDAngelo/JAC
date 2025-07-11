import { PartialType } from '@nestjs/swagger';
import { JuntaDto } from './create-junta.dto';

export class ActualizarJuntaDto extends PartialType(JuntaDto) {}
