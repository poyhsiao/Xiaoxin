import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('collections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('spaces/:spaceId/collections')
export class CollectionsController {
  constructor(private collectionsService: CollectionsService) {}

  @Post()
  async create(@Param('spaceId') spaceId: string, @Body() body: { name: string; slug: string; description?: string }) {
    return this.collectionsService.create(spaceId, body);
  }

  @Get()
  async findAll(@Param('spaceId') spaceId: string) {
    return this.collectionsService.findAll(spaceId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.collectionsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name?: string; description?: string }) {
    return this.collectionsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.collectionsService.delete(id);
    return { success: true };
  }
}
