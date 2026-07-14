import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; slug: string; color?: string }) {
    return this.prisma.tag.create({ data: { color: data.color || '#6366f1', ...data } });
  }

  async findAll() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async addToBookmark(bookmarkId: string, tagId: string) {
    return this.prisma.bookmarkTag.create({ data: { bookmarkId, tagId } });
  }

  async removeFromBookmark(bookmarkId: string, tagId: string) {
    await this.prisma.bookmarkTag.delete({ where: { bookmarkId_tagId: { bookmarkId, tagId } } });
  }
}
