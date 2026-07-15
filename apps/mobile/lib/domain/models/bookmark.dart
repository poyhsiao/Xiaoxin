import 'package:drift/drift.dart';

class Bookmark {
  final int? id;
  final String remoteId;
  final String url;
  final String? title;
  final String? description;
  final String? favicon;
  final String? thumbnail;
  final int? organizationId;
  final int? spaceId;
  final int? collectionId;
  final int? userId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int? syncedAt;

  Bookmark({
    this.id,
    required this.remoteId,
    required this.url,
    this.title,
    this.description,
    this.favicon,
    this.thumbnail,
    this.organizationId,
    this.spaceId,
    this.collectionId,
    this.userId,
    required this.createdAt,
    required this.updatedAt,
    this.syncedAt,
  });

  Bookmark copyWith({
    int? id,
    String? remoteId,
    String? url,
    String? title,
    String? description,
    String? favicon,
    String? thumbnail,
    int? organizationId,
    int? spaceId,
    int? collectionId,
    int? userId,
    DateTime? createdAt,
    DateTime? updatedAt,
    int? syncedAt,
  }) {
    return Bookmark(
      id: id ?? this.id,
      remoteId: remoteId ?? this.remoteId,
      url: url ?? this.url,
      title: title ?? this.title,
      description: description ?? this.description,
      favicon: favicon ?? this.favicon,
      thumbnail: thumbnail ?? this.thumbnail,
      organizationId: organizationId ?? this.organizationId,
      spaceId: spaceId ?? this.spaceId,
      collectionId: collectionId ?? this.collectionId,
      userId: userId ?? this.userId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      syncedAt: syncedAt ?? this.syncedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'remoteId': remoteId,
      'url': url,
      'title': title,
      'description': description,
      'favicon': favicon,
      'thumbnail': thumbnail,
      'organizationId': organizationId,
      'spaceId': spaceId,
      'collectionId': collectionId,
      'userId': userId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'syncedAt': syncedAt,
    };
  }

  factory Bookmark.fromJson(Map<String, dynamic> json) {
    return Bookmark(
      id: json['id'] as int?,
      remoteId: json['remoteId'] as String,
      url: json['url'] as String,
      title: json['title'] as String?,
      description: json['description'] as String?,
      favicon: json['favicon'] as String?,
      thumbnail: json['thumbnail'] as String?,
      organizationId: json['organizationId'] as int?,
      spaceId: json['spaceId'] as int?,
      collectionId: json['collectionId'] as int?,
      userId: json['userId'] as int?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      syncedAt: json['syncedAt'] as int?,
    );
  }
}
