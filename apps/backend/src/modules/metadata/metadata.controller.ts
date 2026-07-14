import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from './metadata.service';

@ApiTags('metadata')
@Controller('metadata')
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  @Post('fetch')
  async fetch(@Body() body: { url: string }) {
    return this.metadataService.fetch(body.url);
  }
}
