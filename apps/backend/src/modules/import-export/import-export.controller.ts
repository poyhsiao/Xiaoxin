import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ImportExportService } from './import-export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('import-export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ImportExportController {
  constructor(private importExportService: ImportExportService) {}

  @Get('export/:collectionId')
  async export(@Param('collectionId') collectionId: string) {
    return this.importExportService.exportCollection(collectionId);
  }

  @Post('import')
  async import(@Body() body: { collectionId: string; bookmarks: any[] }, @Request() req: any) {
    return this.importExportService.importBookmarks(body.collectionId, body.bookmarks, req.user.id);
  }
}
