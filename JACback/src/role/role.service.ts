import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto) {
    const created = await this.roleModel.create(createRoleDto as any);
    return created.toObject ? created.toObject() : created;
  }

  async findAll() {
    return this.roleModel.find().exec();
  }

  async count() {
    return this.roleModel.countDocuments().exec();
  }

  async findOne(id: string) {
    const r = await this.roleModel.findById(id).exec();
    if (!r) throw new NotFoundException('Role not found');
    return r;
  }

  async update(id: string, dto: UpdateRoleDto) {
    const updated = await this.roleModel.findByIdAndUpdate(id, dto as any, { new: true }).exec();
    if (!updated) throw new NotFoundException('Role not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.roleModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Role not found');
    return { deleted: true };
  }
}
