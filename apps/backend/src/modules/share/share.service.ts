import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ShareService {
  constructor(private prisma: PrismaService) {}

  async create(data: { type: string; targetId: string; expiresAt?: Date }) {
    return this.prisma.shareLink.create({ data });
  }

  async findByToken(token: string) {
    const link = await this.prisma.shareLink.findUnique({ where: { token } });
    if (!link) throw new NotFoundException('Share link not found');
    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new NotFoundException('Share link expired');
    }
    return link;
  }

  async delete(id: string) {
    await this.prisma.shareLink.delete({ where: { id } });
  }
}
