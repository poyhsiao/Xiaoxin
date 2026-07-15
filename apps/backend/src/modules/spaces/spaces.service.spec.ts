import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { PrismaService } from '../../database/prisma.service';

describe('SpacesService', () => {
  let service: SpacesService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    space: {
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
        SpacesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a space', async () => {
      const mockSpace = { id: 'space-1', name: 'My Space', slug: 'my-space', orgId: 'org-1' };
      mockPrisma.space.create.mockResolvedValue(mockSpace as any);

      const result = await service.create('org-1', { name: 'My Space', slug: 'my-space' });

      expect(mockPrisma.space.create).toHaveBeenCalledWith({
        data: { name: 'My Space', slug: 'my-space', orgId: 'org-1' },
      });
      expect(result).toEqual(mockSpace);
    });
  });

  describe('findAll', () => {
    it('should return all spaces for an organization', async () => {
      const mockSpaces = [{ id: 'space-1' }, { id: 'space-2' }];
      mockPrisma.space.findMany.mockResolvedValue(mockSpaces as any);

      const result = await service.findAll('org-1');

      expect(mockPrisma.space.findMany).toHaveBeenCalledWith({ where: { orgId: 'org-1' } });
      expect(result).toEqual(mockSpaces);
    });
  });

  describe('findById', () => {
    it('should return a space if found', async () => {
      const mockSpace = { id: 'space-1', name: 'My Space' };
      mockPrisma.space.findUnique.mockResolvedValue(mockSpace as any);

      const result = await service.findById('space-1');

      expect(result).toEqual(mockSpace);
    });

    it('should throw NotFoundException if space not found', async () => {
      mockPrisma.space.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a space', async () => {
      const mockSpace = { id: 'space-1', name: 'Old Name' };
      const updatedSpace = { id: 'space-1', name: 'Updated Name' };

      mockPrisma.space.findUnique.mockResolvedValue(mockSpace as any);
      mockPrisma.space.update.mockResolvedValue(updatedSpace as any);

      const result = await service.update('space-1', { name: 'Updated Name' });

      expect(mockPrisma.space.update).toHaveBeenCalledWith({
        where: { id: 'space-1' },
        data: { name: 'Updated Name' },
      });
      expect(result).toEqual(updatedSpace);
    });
  });

  describe('delete', () => {
    it('should delete a space', async () => {
      mockPrisma.space.delete.mockResolvedValue({ id: 'space-1', name: 'My Space' } as any);

      await service.delete('space-1');

      expect(mockPrisma.space.delete).toHaveBeenCalledWith({ where: { id: 'space-1' } });
    });
  });
});
