import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  async create(@Body() body: { name: string; slug: string; color?: string }) {
    return this.tagsService.create(body);
  }

  @Get()
  async findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tagsService.findById(id);
  }

  @Post('bookmarks/:bookmarkId/tags/:tagId')
  async addToBookmark(@Param('bookmarkId') bookmarkId: string, @Param('tagId') tagId: string) {
    return this.tagsService.addToBookmark(bookmarkId, tagId);
  }

  @Delete('bookmarks/:bookmarkId/tags/:tagId')
  async removeFromBookmark(@Param('bookmarkId') bookmarkId: string, @Param('tagId') tagId: string) {
    await this.tagsService.removeFromBookmark(bookmarkId, tagId);
    return { success: true };
  }
}
