import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { PrismaService } from '../../database/prisma.service';
import { BookmarkStatus } from '@prisma/client';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let prisma: jest.Mocked<PrismaService>;

  const mockMember = { userId: 'user-1', role: 'EDITOR' };

  const mockPrisma = {
    bookmark: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    collection: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  // Helper: mock collection with org access
  const mockCollectionWithAccess = () => {
    mockPrisma.collection.findUnique.mockResolvedValue({
      id: 'col-1',
      name: 'Test Collection',
      spaceId: 'space-1',
      space: {
        id: 'space-1',
        orgId: 'org-1',
        org: {
          id: 'org-1',
          members: [mockMember],
        },
      },
    });
  };

  // Helper: mock bookmark findUnique with full access path
  const mockBookmarkWithAccess = (bookmark = {
    id: 'bm-1',
    url: 'https://example.com',
    title: 'Example',
    collectionId: 'col-1',
    tags: [],
  }) => {
    mockPrisma.bookmark.findUnique.mockResolvedValue({
      ...bookmark,
      collection: {
        id: 'col-1',
        spaceId: 'space-1',
        space: {
          id: 'space-1',
          orgId: 'org-1',
          org: {
            id: 'org-1',
            members: [mockMember],
          },
        },
      },
    });
  };

  describe('create', () => {
    it('should create a bookmark', async () => {
      mockCollectionWithAccess();
      const mockBookmark = {
        id: 'bm-1',
        url: 'https://example.com',
        title: 'Example',
        collectionId: 'col-1',
        creatorId: 'user-1',
        status: BookmarkStatus.UNREAD,
      };
      mockPrisma.bookmark.create.mockResolvedValue(mockBookmark as any);

      const result = await service.create('col-1', { url: 'https://example.com', title: 'Example' }, 'user-1');

      expect(mockPrisma.bookmark.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ url: 'https://example.com', title: 'Example', collectionId: 'col-1', creatorId: 'user-1' }),
      });
      expect(result).toEqual(mockBookmark);
    });

    it('should throw ForbiddenException if user has no access to collection', async () => {
      mockPrisma.collection.findUnique.mockResolvedValue({
        id: 'col-1',
        space: {
          org: {
            members: [],
          },
        },
      });

      await expect(service.create('col-1', { url: 'https://example.com' }, 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return all bookmarks for a collection', async () => {
      mockCollectionWithAccess();
      const mockBookmarks = [{ id: 'bm-1' }, { id: 'bm-2' }];
      mockPrisma.bookmark.findMany.mockResolvedValue(mockBookmarks as any);

      const result = await service.findAll('col-1', 'user-1');

      expect(mockPrisma.bookmark.findMany).toHaveBeenCalledWith({
        where: { collectionId: 'col-1' },
        include: { tags: { include: { tag: true } } },
        orderBy: { customOrder: 'asc' },
      });
      expect(result).toEqual(mockBookmarks);
    });
  });

  describe('findById', () => {
    it('should return a bookmark if found', async () => {
      mockBookmarkWithAccess();

      const result = await service.findById('bm-1', 'user-1');

      expect(result.id).toEqual('bm-1');
    });

    it('should throw NotFoundException if bookmark not found', async () => {
      mockPrisma.bookmark.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user has no access', async () => {
      mockPrisma.bookmark.findUnique.mockResolvedValue({
        id: 'bm-1',
        collection: {
          space: {
            org: {
              members: [],
            },
          },
        },
      });

      await expect(service.findById('bm-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a bookmark', async () => {
      mockBookmarkWithAccess();
      const updatedBookmark = { id: 'bm-1', title: 'Updated Title' };
      mockPrisma.bookmark.update.mockResolvedValue(updatedBookmark as any);

      const result = await service.update('bm-1', { title: 'Updated Title' }, 'user-1');

      expect(mockPrisma.bookmark.update).toHaveBeenCalledWith({
        where: { id: 'bm-1' },
        data: { title: 'Updated Title' },
      });
      expect(result).toEqual(updatedBookmark);
    });
  });

  describe('delete', () => {
    it('should delete a bookmark', async () => {
      mockBookmarkWithAccess();
      const mockBookmark = { id: 'bm-1', url: 'https://example.com' };
      mockPrisma.bookmark.delete.mockResolvedValue(mockBookmark as any);

      await service.delete('bm-1', 'user-1');

      expect(mockPrisma.bookmark.delete).toHaveBeenCalledWith({ where: { id: 'bm-1' } });
    });
  });

  describe('search', () => {
    it('should search bookmarks by query within user scope', async () => {
      const mockBookmarks = [{ id: 'bm-1', title: 'NestJS Guide' }];
      mockPrisma.bookmark.findMany.mockResolvedValue(mockBookmarks as any);

      const result = await service.search('NestJS', 'user-1');

      expect(mockPrisma.bookmark.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'NestJS', mode: 'insensitive' } },
            { description: { contains: 'NestJS', mode: 'insensitive' } },
            { url: { contains: 'NestJS', mode: 'insensitive' } },
          ],
          collection: {
            space: {
              org: {
                members: {
                  some: { userId: 'user-1' },
                },
              },
            },
          },
        },
        include: { tags: { include: { tag: true } } },
        take: 50,
      });
      expect(result).toEqual(mockBookmarks);
    });
  });
});
