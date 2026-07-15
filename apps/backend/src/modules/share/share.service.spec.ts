import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ShareService } from './share.service';
import { PrismaService } from '../../database/prisma.service';

describe('ShareService', () => {
  let service: ShareService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    shareLink: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShareService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ShareService>(ShareService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a share link', async () => {
      const mockShareLink = {
        id: 'share-1',
        type: 'BOOKMARK',
        targetId: 'bm-1',
        expiresAt: null,
      };
      mockPrisma.shareLink.create.mockResolvedValue(mockShareLink as any);

      const result = await service.create({ type: 'BOOKMARK', targetId: 'bm-1' });

      expect(mockPrisma.shareLink.create).toHaveBeenCalledWith({
        data: { type: 'BOOKMARK', targetId: 'bm-1' },
      });
      expect(result).toEqual(mockShareLink);
    });
  });

  describe('findByToken', () => {
    it('should return a share link if found and not expired', async () => {
      const mockShareLink = { id: 'share-1', token: 'abc123', type: 'BOOKMARK', targetId: 'bm-1', expiresAt: null };
      mockPrisma.shareLink.findUnique.mockResolvedValue(mockShareLink as any);

      const result = await service.findByToken('abc123');

      expect(result).toEqual(mockShareLink);
    });

    it('should throw NotFoundException if share link not found', async () => {
      mockPrisma.shareLink.findUnique.mockResolvedValue(null);

      await expect(service.findByToken('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if share link expired', async () => {
      const expiredLink = { id: 'share-1', token: 'abc123', type: 'BOOKMARK', targetId: 'bm-1', expiresAt: new Date('2020-01-01') };
      mockPrisma.shareLink.findUnique.mockResolvedValue(expiredLink as any);

      await expect(service.findByToken('abc123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a share link', async () => {
      mockPrisma.shareLink.delete.mockResolvedValue({ id: 'share-1' } as any);

      await service.delete('share-1');

      expect(mockPrisma.shareLink.delete).toHaveBeenCalledWith({ where: { id: 'share-1' } });
    });
  });
});
