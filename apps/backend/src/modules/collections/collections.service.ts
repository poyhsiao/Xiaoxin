import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(spaceId: string, data: { name: string; slug: string; description?: string }) {
    return this.prisma.collection.create({ data: { ...data, spaceId } });
  }

  async findAll(spaceId: string) {
    return this.prisma.collection.findMany({ where: { spaceId } });
  }

  async findById(id: string) {
    const collection = await this.prisma.collection.findUnique({ where: { id } });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async update(id: string, data: { name?: string; description?: string }) {
    return this.prisma.collection.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.collection.delete({ where: { id } });
  }
}
