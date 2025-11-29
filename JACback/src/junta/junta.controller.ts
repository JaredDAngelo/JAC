import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { JuntaService } from './junta.service';
import { JuntaDto } from './dto/create-junta.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Juntas')
@Controller('juntas')
@UsePipes(new ValidationPipe({ transform: true }))
export class JuntaController {
  constructor(private readonly juntaService: JuntaService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listado de juntas' })
  async listarJuntas() {
    return this.juntaService.listarJuntas();
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Junta creada exitosamente' })
  async crearJunta(@Body() juntaDto: JuntaDto) {
    return this.juntaService.crearJunta(juntaDto);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Junta encontrada' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Junta no encontrada' })
  async obtenerJunta(@Param('id') id: string) {
    return this.juntaService.obtenerJunta(id);
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Junta actualizada' })
  async actualizarJunta(
    @Param('id') id: string,
    @Body() dto: JuntaDto
  ) {
    return this.juntaService.actualizarJunta(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Junta eliminada' })
  async eliminarJunta(@Param('id') id: string) {
    return this.juntaService.eliminarJunta(id);
  }
}