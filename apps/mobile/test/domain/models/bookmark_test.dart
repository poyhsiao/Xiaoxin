import 'package:flutter_test/flutter_test.dart';
import 'package:xiaoxin_mobile/domain/models/bookmark.dart';

void main() {
  group('Bookmark', () {
    final now = DateTime(2025, 1, 20);

    test('creates from constructor', () {
      final bm = Bookmark(
        remoteId: 'r1',
        url: 'https://example.com',
        createdAt: now,
        updatedAt: now,
      );
      expect(bm.remoteId, 'r1');
      expect(bm.url, 'https://example.com');
      expect(bm.title, isNull);
    });

    test('copyWith preserves unchanged fields', () {
      final bm = Bookmark(
        remoteId: 'r1',
        url: 'https://example.com',
        title: 'Title',
        createdAt: now,
        updatedAt: now,
      );
      final copy = bm.copyWith(url: 'https://changed.com');
      expect(copy.title, 'Title');
      expect(copy.remoteId, 'r1');
      expect(copy.url, 'https://changed.com');
    });

    test('toJson serializes all fields', () {
      final bm = Bookmark(
        id: 1,
        remoteId: 'r1',
        url: 'https://example.com',
        title: 'Example',
        createdAt: now,
        updatedAt: now,
      );
      final json = bm.toJson();
      expect(json['remoteId'], 'r1');
      expect(json['url'], 'https://example.com');
      expect(json['title'], 'Example');
    });

    test('fromJson deserializes correctly', () {
      final json = {
        'id': 1,
        'remoteId': 'r1',
        'url': 'https://example.com',
        'title': 'Example',
        'description': 'Desc',
        'favicon': null,
        'thumbnail': null,
        'organizationId': null,
        'spaceId': null,
        'collectionId': null,
        'userId': null,
        'createdAt': now.toIso8601String(),
        'updatedAt': now.toIso8601String(),
        'syncedAt': null,
      };
      final bm = Bookmark.fromJson(json);
      expect(bm.remoteId, 'r1');
      expect(bm.title, 'Example');
      expect(bm.description, 'Desc');
    });
  });
}
