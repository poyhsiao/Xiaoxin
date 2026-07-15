import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { PrismaService } from '../../database/prisma.service';

describe('CollectionsService', () => {
  let service: CollectionsService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    collection: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CollectionsService>(CollectionsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a collection', async () => {
      const mockCollection = { id: 'col-1', name: 'My Collection', slug: 'my-collection', spaceId: 'space-1' };
      mockPrisma.collection.create.mockResolvedValue(mockCollection as any);

      const result = await service.create('space-1', { name: 'My Collection', slug: 'my-collection' });

      expect(mockPrisma.collection.create).toHaveBeenCalledWith({
        data: { name: 'My Collection', slug: 'my-collection', spaceId: 'space-1' },
      });
      expect(result).toEqual(mockCollection);
    });
  });

  describe('findAll', () => {
    it('should return all collections for a space', async () => {
      const mockCollections = [{ id: 'col-1' }, { id: 'col-2' }];
      mockPrisma.collection.findMany.mockResolvedValue(mockCollections as any);

      const result = await service.findAll('space-1');

      expect(mockPrisma.collection.findMany).toHaveBeenCalledWith({ where: { spaceId: 'space-1' } });
      expect(result).toEqual(mockCollections);
    });
  });

  describe('findById', () => {
    it('should return a collection if found', async () => {
      const mockCollection = { id: 'col-1', name: 'My Collection' };
      mockPrisma.collection.findUnique.mockResolvedValue(mockCollection as any);

      const result = await service.findById('col-1');

      expect(result).toEqual(mockCollection);
    });

    it('should throw NotFoundException if collection not found', async () => {
      mockPrisma.collection.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a collection', async () => {
      const mockCollection = { id: 'col-1', name: 'Old Name' };
      const updatedCollection = { id: 'col-1', name: 'Updated Name' };

      mockPrisma.collection.findUnique.mockResolvedValue(mockCollection as any);
      mockPrisma.collection.update.mockResolvedValue(updatedCollection as any);

      const result = await service.update('col-1', { name: 'Updated Name' });

      expect(mockPrisma.collection.update).toHaveBeenCalledWith({
        where: { id: 'col-1' },
        data: { name: 'Updated Name' },
      });
      expect(result).toEqual(updatedCollection);
    });
  });

  describe('delete', () => {
    it('should delete a collection', async () => {
      mockPrisma.collection.delete.mockResolvedValue({ id: 'col-1', name: 'My Collection' } as any);

      await service.delete('col-1');

      expect(mockPrisma.collection.delete).toHaveBeenCalledWith({ where: { id: 'col-1' } });
    });
  });
});
