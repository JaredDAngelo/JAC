import { TipoActa } from './create-acta.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ActualizarActaDto {
  @IsEnum(TipoActa)
  @IsNotEmpty()
  tipo: TipoActa;

  @IsNotEmpty()
  contenido: Buffer;
}
