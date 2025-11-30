import { IsEnum, IsOptional, IsMongoId, IsNotEmpty } from 'class-validator';

export enum TipoActa {
  ACTA_DE_CONSTITUCION             = 'acta_constitucion',
  ACTA_DE_ELECCION_DE_DESTINATARIO = 'acta_eleccion_destinatario',
}

export class ActaDto {
  @IsEnum(TipoActa)
  @IsNotEmpty()
  tipo: TipoActa;

  @IsOptional()
  @IsMongoId()
  junta?: string;

  @IsOptional()
  contenido?: Buffer;
}
