import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShareService } from './share.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('share')
@Controller('share-links')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { type: string; targetId: string; expiresAt?: string }) {
    return this.shareService.create({
      ...body,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });
  }

  @Get(':token')
  async findByToken(@Param('token') token: string) {
    return this.shareService.findByToken(token);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    await this.shareService.delete(id);
    return { success: true };
  }
}
