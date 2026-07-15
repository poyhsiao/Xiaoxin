import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BookmarkStatus } from '@prisma/client';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async create(collectionId: string, data: { url: string; title?: string; description?: string }, userId: string) {
    await this.verifyCollectionAccess(collectionId, userId);
    return this.prisma.bookmark.create({
      data: { ...data, collectionId, creatorId: userId },
    });
  }

  async findAll(collectionId: string, userId: string) {
    await this.verifyCollectionAccess(collectionId, userId);
    return this.prisma.bookmark.findMany({
      where: { collectionId },
      include: { tags: { include: { tag: true } } },
      orderBy: { customOrder: 'asc' },
    });
  }

  async findById(id: string, userId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        collection: {
          include: {
            space: {
              include: {
                org: {
                  include: { members: true },
                },
              },
            },
          },
        },
      },
    });
    if (!bookmark) throw new NotFoundException('Bookmark not found');
    await this.verifyBookmarkAccess(id, userId);
    return bookmark;
  }

  async update(id: string, data: { title?: string; description?: string; status?: BookmarkStatus; url?: string }, userId: string) {
    await this.verifyBookmarkAccess(id, userId);
    return this.prisma.bookmark.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    await this.verifyBookmarkAccess(id, userId);
    await this.prisma.bookmark.delete({ where: { id } });
  }

  async search(query: string, userId: string) {
    return this.prisma.bookmark.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { url: { contains: query, mode: 'insensitive' } },
        ],
        collection: {
          space: {
            org: {
              members: {
                some: { userId },
              },
            },
          },
        },
      },
      include: { tags: { include: { tag: true } } },
      take: 50,
    });
  }

  private async verifyCollectionAccess(collectionId: string, userId: string): Promise<void> {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        space: {
          include: {
            org: {
              include: { members: true },
            },
          },
        },
      },
    });

    if (!collection) throw new NotFoundException('Collection not found');

    const hasAccess = collection.space.org.members.some(
      (member: { userId: string }) => member.userId === userId
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this collection');
    }
  }

  private async verifyBookmarkAccess(bookmarkId: string, userId: string): Promise<void> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
      include: {
        collection: {
          include: {
            space: {
              include: {
                org: {
                  include: { members: true },
                },
              },
            },
          },
        },
      },
    });

    if (!bookmark) throw new NotFoundException('Bookmark not found');

    const hasAccess = bookmark.collection.space.org.members.some(
      (member: { userId: string }) => member.userId === userId
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this bookmark');
    }
  }
}
