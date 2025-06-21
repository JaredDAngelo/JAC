import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TipoDocumento {
  GUIA_ESTATUTO         = 'guia_estatuto',
  INTERES_ASOCIATIVO    = 'interes_asociativo',
  ASAMBLEA_CONSTITUCION = 'asamblea_constitucion',
}

export class DocumentoDto {
  @IsEnum(TipoDocumento)
  @IsNotEmpty()
  tipo: TipoDocumento;

  @IsNotEmpty()
  contenido: Buffer;
}
