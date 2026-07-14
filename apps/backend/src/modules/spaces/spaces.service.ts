import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, data: { name: string; slug: string; description?: string }) {
    return this.prisma.space.create({ data: { ...data, orgId } });
  }

  async findAll(orgId: string) {
    return this.prisma.space.findMany({ where: { orgId } });
  }

  async findById(id: string) {
    const space = await this.prisma.space.findUnique({ where: { id } });
    if (!space) throw new NotFoundException('Space not found');
    return space;
  }

  async update(id: string, data: { name?: string; description?: string }) {
    return this.prisma.space.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.space.delete({ where: { id } });
  }
}
