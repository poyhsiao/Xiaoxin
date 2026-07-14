import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrganizationVisibility, OrgRole } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; slug: string; description?: string; visibility?: OrganizationVisibility }, userId: string) {
    const org = await this.prisma.organization.create({
      data: {
        ...data,
        ownerId: userId,
        members: { create: { userId, role: OrgRole.OWNER } },
      },
    });
    return org;
  }

  async findAll(userId: string) {
    const memberships = await this.prisma.member.findMany({
      where: { userId },
      include: { org: true },
    });
    return memberships.map(m => m.org);
  }

  async findById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: { members: { include: { user: true } } },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, data: { name?: string; description?: string; visibility?: OrganizationVisibility }, userId: string) {
    await this.checkPermission(id, userId, [OrgRole.OWNER, OrgRole.ADMIN]);
    return this.prisma.organization.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    await this.checkPermission(id, userId, [OrgRole.OWNER]);
    await this.prisma.organization.delete({ where: { id } });
  }

  private async checkPermission(orgId: string, userId: string, roles: OrgRole[]) {
    const membership = await this.prisma.member.findUnique({
      where: { userId_orgId: { userId, orgId } },
    });
    if (!membership || !roles.includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }
}
