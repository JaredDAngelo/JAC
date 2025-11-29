import { Body, Controller, Delete, Get, Param, Patch, Post, Req, ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService, private readonly jwtService: JwtService) {}

  // listar roles (autenticado)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  // crear rol
  // Permitir creación sin admin sólo si no existen roles (bootstrap).
  // En casos normales, requiere token y rol 'admin'.
  @Post()
  async create(@Req() req: any, @Body() dto: CreateRoleDto) {
    const count = await this.roleService.count()
    if (count === 0) {
      // bootstrap: allow creating the first role
      return this.roleService.create(dto)
    }

    // otherwise require authenticated admin
    // Intent: permitir bootstrap si no hay roles; si hay roles, validar token manualmente
    const authHeader = req.headers?.authorization || req.headers?.Authorization
    if (!authHeader) throw new ForbiddenException('Se requiere autenticación')
    const token = (authHeader as string).replace(/^Bearer\s+/i, '')
    let payload: any = null
    try {
      payload = this.jwtService.verify(token)
    } catch (e) {
      throw new ForbiddenException('Se requiere autenticación')
    }
    const userRole = payload?.rol || payload?.role
    if (userRole !== 'admin') throw new ForbiddenException('No tienes permiso para crear roles')

    return this.roleService.create(dto)
  }

  // actualizar rol (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  // eliminar rol (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
