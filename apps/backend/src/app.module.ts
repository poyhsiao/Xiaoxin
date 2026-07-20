import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { SpacesModule } from './modules/spaces/spaces.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { TagsModule } from './modules/tags/tags.module';
import { ShareModule } from './modules/share/share.module';
import { MetadataModule } from './modules/metadata/metadata.module';
import { ImportExportModule } from './modules/import-export/import-export.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    SpacesModule,
    CollectionsModule,
    BookmarksModule,
    TagsModule,
    ShareModule,
    MetadataModule,
    ImportExportModule,
    NotificationsModule,
  ],
})
export class AppModule {}
