import { PartialType } from '@nestjs/mapped-types';
import { DocumentoDto } from './create-documento.dto';

export class ActualizarDocumentoDto extends PartialType(DocumentoDto) {}
