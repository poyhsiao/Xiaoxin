import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BookmarkStatus } from '@prisma/client';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async create(collectionId: string, data: { url: string; title?: string; description?: string }, userId: string) {
    return this.prisma.bookmark.create({
      data: { ...data, collectionId, creatorId: userId },
    });
  }

  async findAll(collectionId: string) {
    return this.prisma.bookmark.findMany({
      where: { collectionId },
      include: { tags: { include: { tag: true } } },
      orderBy: { customOrder: 'asc' },
    });
  }

  async findById(id: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    if (!bookmark) throw new NotFoundException('Bookmark not found');
    return bookmark;
  }

  async update(id: string, data: { title?: string; description?: string; status?: BookmarkStatus; url?: string }) {
    return this.prisma.bookmark.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.bookmark.delete({ where: { id } });
  }

  async search(query: string) {
    return this.prisma.bookmark.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { url: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 50,
    });
  }
}
