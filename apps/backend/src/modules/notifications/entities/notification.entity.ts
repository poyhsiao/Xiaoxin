import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  BOOKMARK_CREATED = 'BOOKMARK_CREATED',
  BOOKMARK_UPDATED = 'BOOKMARK_UPDATED',
  BOOKMARK_DELETED = 'BOOKMARK_DELETED',
  MEMBER_INVITED = 'MEMBER_INVITED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
  SPACE_UPDATED = 'SPACE_UPDATED',
  COLLECTION_UPDATED = 'COLLECTION_UPDATED',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, unknown> | null;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
