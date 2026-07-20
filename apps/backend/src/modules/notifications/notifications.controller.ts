import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const result = await this.notificationsService.findAllByUser(
      req.user.id,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
    return {
      data: result.data,
      meta: {
        total: result.total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
    };
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.findOne(id, req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return { success: true };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.notificationsService.delete(id, req.user.id);
    return { success: true };
  }
}
