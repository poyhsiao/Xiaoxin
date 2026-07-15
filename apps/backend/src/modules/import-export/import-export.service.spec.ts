import { Test, TestingModule } from '@nestjs/testing';
import { ImportExportService } from './import-export.service';
import { PrismaService } from '../../database/prisma.service';

describe('ImportExportService', () => {
  let service: ImportExportService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    bookmark: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportExportService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ImportExportService>(ImportExportService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('exportCollection', () => {
    it('should export all bookmarks from a collection with tags', async () => {
      const mockBookmarks = [
        { id: 'bm-1', url: 'https://example.com', title: 'Example', tags: [{ tag: { id: 'tag-1', name: 'Tag1' } }] },
      ];
      mockPrisma.bookmark.findMany.mockResolvedValue(mockBookmarks as any);

      const result = await service.exportCollection('col-1');

      expect(mockPrisma.bookmark.findMany).toHaveBeenCalledWith({
        where: { collectionId: 'col-1' },
        include: { tags: { include: { tag: true } } },
      });
      expect(result.bookmarks).toEqual(mockBookmarks);
      expect(result.exportedAt).toBeDefined();
    });

    it('should return empty array for collection with no bookmarks', async () => {
      mockPrisma.bookmark.findMany.mockResolvedValue([]);

      const result = await service.exportCollection('empty-col');

      expect(result.bookmarks).toEqual([]);
    });
  });

  describe('importBookmarks', () => {
    it('should import bookmarks into a collection', async () => {
      const bookmarksToImport = [
        { url: 'https://example1.com', title: 'Example 1' },
        { url: 'https://example2.com', title: 'Example 2' },
      ];
      const mockCreated = [{ id: 'bm-1' }, { id: 'bm-2' }];
      mockPrisma.bookmark.create.mockResolvedValueOnce(mockCreated[0] as any);
      mockPrisma.bookmark.create.mockResolvedValueOnce(mockCreated[1] as any);

      const result = await service.importBookmarks('col-1', bookmarksToImport, 'user-1');

      expect(result.imported).toBe(2);
      expect(result.bookmarks).toEqual(mockCreated);
      expect(mockPrisma.bookmark.create).toHaveBeenCalledTimes(2);
    });

    it('should handle empty import list', async () => {
      const result = await service.importBookmarks('col-1', [], 'user-1');

      expect(result.imported).toBe(0);
      expect(result.bookmarks).toEqual([]);
    });
  });
});
