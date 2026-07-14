import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ImportExportService {
  constructor(private prisma: PrismaService) {}

  async exportCollection(collectionId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { collectionId },
      include: { tags: { include: { tag: true } } },
    });
    return { bookmarks, exportedAt: new Date().toISOString() };
  }

  async importBookmarks(collectionId: string, bookmarks: any[], userId: string) {
    const results = [];
    for (const bm of bookmarks) {
      const created = await this.prisma.bookmark.create({
        data: {
          url: bm.url,
          title: bm.title,
          description: bm.description,
          collectionId,
          creatorId: userId,
        },
      });
      results.push(created);
    }
    return { imported: results.length, bookmarks: results };
  }
}
