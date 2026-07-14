import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationVisibility } from '@prisma/client';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Post()
  async create(@Body() body: { name: string; slug: string; description?: string; visibility?: OrganizationVisibility }, @Request() req: any) {
    return this.organizationsService.create(body, req.user.id);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.organizationsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name?: string; description?: string; visibility?: OrganizationVisibility }, @Request() req: any) {
    return this.organizationsService.update(id, body, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.organizationsService.delete(id, req.user.id);
    return { success: true };
  }
}
