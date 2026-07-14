import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SpacesService } from './spaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('spaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations/:orgId/spaces')
export class SpacesController {
  constructor(private spacesService: SpacesService) {}

  @Post()
  async create(@Param('orgId') orgId: string, @Body() body: { name: string; slug: string; description?: string }) {
    return this.spacesService.create(orgId, body);
  }

  @Get()
  async findAll(@Param('orgId') orgId: string) {
    return this.spacesService.findAll(orgId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.spacesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name?: string; description?: string }) {
    return this.spacesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.spacesService.delete(id);
    return { success: true };
  }
}
