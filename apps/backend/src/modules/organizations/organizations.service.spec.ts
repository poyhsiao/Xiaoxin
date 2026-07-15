import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../../database/prisma.service';
import { OrgRole, OrganizationVisibility } from '@prisma/client';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    organization: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    member: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an organization and assign user as owner', async () => {
      const mockOrg = {
        id: 'org-1',
        name: 'My Org',
        slug: 'my-org',
        description: null,
        visibility: OrganizationVisibility.PUBLIC,
        ownerId: 'user-1',
        createdAt: new Date(),
      };
      const mockMember = { id: 'member-1', orgId: 'org-1', userId: 'user-1', role: OrgRole.OWNER };

      mockPrisma.organization.create.mockResolvedValue(mockOrg);
      mockPrisma.member.create.mockResolvedValue(mockMember as any);

      const result = await service.create({ name: 'My Org', slug: 'my-org' }, 'user-1');

      expect(mockPrisma.organization.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'My Org', slug: 'my-org', ownerId: 'user-1' }),
      });
      expect(result).toEqual(mockOrg);
    });
  });

  describe('findAll', () => {
    it('should return all organizations for a user', async () => {
      const mockOrgs = [{ id: 'org-1', name: 'Org 1' }, { id: 'org-2', name: 'Org 2' }];
      mockPrisma.member.findMany.mockResolvedValue([
        { orgId: 'org-1', role: OrgRole.OWNER, org: mockOrgs[0] },
        { orgId: 'org-2', role: OrgRole.VIEWER, org: mockOrgs[1] },
      ] as any);

      const result = await service.findAll('user-1');

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { org: true },
      });
      expect(result).toEqual(mockOrgs);
    });
  });

  describe('findById', () => {
    it('should return organization if found', async () => {
      const mockOrg = { id: 'org-1', name: 'My Org', members: [] };
      mockPrisma.organization.findUnique.mockResolvedValue(mockOrg as any);

      const result = await service.findById('org-1');

      expect(result).toEqual(mockOrg);
    });

    it('should throw NotFoundException if organization not found', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update organization if user is OWNER', async () => {
      const mockOrg = { id: 'org-1', name: 'Old Name' };
      const updatedOrg = { id: 'org-1', name: 'Updated Name' };

      mockPrisma.organization.findUnique.mockResolvedValue(mockOrg as any);
      mockPrisma.member.findUnique.mockResolvedValue({ role: OrgRole.OWNER } as any);
      mockPrisma.organization.update.mockResolvedValue(updatedOrg as any);

      const result = await service.update('org-1', { name: 'Updated Name' }, 'user-1');

      expect(mockPrisma.organization.update).toHaveBeenCalled();
      expect(result).toEqual(updatedOrg);
    });

    it('should throw ForbiddenException if user is not OWNER or ADMIN', async () => {
      const mockOrg = { id: 'org-1', name: 'My Org' };

      mockPrisma.organization.findUnique.mockResolvedValue(mockOrg as any);
      mockPrisma.member.findUnique.mockResolvedValue({ role: OrgRole.VIEWER } as any);

      await expect(service.update('org-1', { name: 'New Name' }, 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete organization if user is OWNER', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ id: 'org-1', name: 'My Org' } as any);
      mockPrisma.member.findUnique.mockResolvedValue({ role: OrgRole.OWNER } as any);
      mockPrisma.organization.delete.mockResolvedValue({ id: 'org-1', name: 'My Org' } as any);

      await service.delete('org-1', 'user-1');

      expect(mockPrisma.organization.delete).toHaveBeenCalledWith({ where: { id: 'org-1' } });
    });

    it('should throw ForbiddenException if user is not OWNER', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ id: 'org-1', name: 'My Org' } as any);
      mockPrisma.member.findUnique.mockResolvedValue({ role: OrgRole.ADMIN } as any);

      await expect(service.delete('org-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });
});
