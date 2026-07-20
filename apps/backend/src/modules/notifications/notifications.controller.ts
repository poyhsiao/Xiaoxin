import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: { id: string },
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const result = await this.notificationsService.findAllByUser(
      user.id,
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
  async getUnreadCount(@CurrentUser() user: { id: string }) {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.notificationsService.findOne(id, user.id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: { id: string }) {
    await this.notificationsService.markAllAsRead(user.id);
    return { success: true };
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    await this.notificationsService.delete(id, user.id);
    return { success: true };
  }
}
