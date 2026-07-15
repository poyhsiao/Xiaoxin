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
  async findAll(@Param('collectionId') collectionId: string, @Request() req: any) {
    return this.bookmarksService.findAll(collectionId, req.user.id);
  }

  @Get('bookmarks/search')
  async search(@Query('q') query: string, @Request() req: any) {
    return this.bookmarksService.search(query, req.user.id);
  }

  @Get('bookmarks/:id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.bookmarksService.findById(id, req.user.id);
  }

  @Patch('bookmarks/:id')
  async update(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; status?: BookmarkStatus; url?: string },
    @Request() req: any,
  ) {
    return this.bookmarksService.update(id, body, req.user.id);
  }

  @Delete('bookmarks/:id')
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.bookmarksService.delete(id, req.user.id);
    return { success: true };
  }
}
