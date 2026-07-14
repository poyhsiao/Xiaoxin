import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookmarkStatus } from '@prisma/client';

@ApiTags('bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Post('collections/:collectionId/bookmarks')
  async create(
    @Param('collectionId') collectionId: string,
    @Body() body: { url: string; title?: string; description?: string },
    @Request() req: any,
  ) {
    return this.bookmarksService.create(collectionId, body, req.user.id);
  }

  @Get('collections/:collectionId/bookmarks')
  async findAll(@Param('collectionId') collectionId: string) {
    return this.bookmarksService.findAll(collectionId);
  }

  @Get('bookmarks/search')
  async search(@Query('q') query: string) {
    return this.bookmarksService.search(query);
  }

  @Get('bookmarks/:id')
  async findOne(@Param('id') id: string) {
    return this.bookmarksService.findById(id);
  }

  @Patch('bookmarks/:id')
  async update(@Param('id') id: string, @Body() body: { title?: string; description?: string; status?: BookmarkStatus; url?: string }) {
    return this.bookmarksService.update(id, body);
  }

  @Delete('bookmarks/:id')
  async delete(@Param('id') id: string) {
    await this.bookmarksService.delete(id);
    return { success: true };
  }
}
