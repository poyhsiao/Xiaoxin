// Organization visibility
export enum OrganizationVisibility {
  PUBLIC = 'PUBLIC',
  INVITE_ONLY = 'INVITE_ONLY',
  PRIVATE = 'PRIVATE',
}

// User organization role
export enum OrgRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

// Bookmark status
export enum BookmarkStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

// API Response format
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// User
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Organization
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  visibility: OrganizationVisibility;
  logo?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Space
export interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
}

// Collection
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  spaceId: string;
  createdAt: string;
  updatedAt: string;
}

// Bookmark
export interface Bookmark {
  id: string;
  url: string;
  title?: string;
  description?: string;
  ogImage?: string;
  favicon?: string;
  status: BookmarkStatus;
  customOrder: number;
  creatorId: string;
  collectionId: string;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

// Tag
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  createdAt: string;
}

// Share Link
export interface ShareLink {
  id: string;
  token: string;
  type: 'organization' | 'space' | 'collection' | 'bookmark';
  targetId: string;
  expiresAt?: string;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// Create DTOs
export interface CreateOrganizationDto {
  name: string;
  slug: string;
  description?: string;
  visibility?: OrganizationVisibility;
}

export interface CreateSpaceDto {
  name: string;
  slug: string;
  description?: string;
}

export interface CreateCollectionDto {
  name: string;
  slug: string;
  description?: string;
}

export interface CreateBookmarkDto {
  url: string;
  title?: string;
  description?: string;
  collectionId: string;
}

export interface CreateTagDto {
  name: string;
  slug: string;
  color?: string;
}

// Update DTOs
export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  visibility?: OrganizationVisibility;
}

export interface UpdateBookmarkDto {
  title?: string;
  description?: string;
  status?: BookmarkStatus;
  url?: string;
}
