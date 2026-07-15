import 'package:drift/drift.dart';
import '../../core/api/api_client.dart';
import '../../core/db/database.dart';
import '../models/bookmark.dart';

class BookmarkService {
  final ApiClient _apiClient;
  final AppDatabase _database;

  BookmarkService({
    required ApiClient apiClient,
    required AppDatabase database,
  })  : _apiClient = apiClient,
        _database = database;

  // Fetch bookmarks from API and sync to local DB
  Future<List<Bookmark>> fetchBookmarks({
    int? collectionId,
    int? spaceId,
    int? organizationId,
  }) async {
    final queryParams = <String, dynamic>{};
    if (collectionId != null) queryParams['collectionId'] = collectionId;
    if (spaceId != null) queryParams['spaceId'] = spaceId;
    if (organizationId != null) queryParams['organizationId'] = organizationId;

    final response = await _apiClient.get<Map<String, dynamic>>(
      '/bookmarks',
      queryParameters: queryParams,
    );

    final data = response.data?['data'] as List<dynamic>? ?? [];
    final bookmarks = data.map((json) => Bookmark.fromJson(json as Map<String, dynamic>)).toList();

    // Sync to local database
    for (final bookmark in bookmarks) {
      await _syncBookmark(bookmark);
    }

    return bookmarks;
  }

  // Create bookmark
  Future<Bookmark> createBookmark({
    required String url,
    String? title,
    String? description,
    int? collectionId,
    int? spaceId,
    int? organizationId,
  }) async {
    final response = await _apiClient.post<Map<String, dynamic>>(
      '/bookmarks',
      data: {
        'url': url,
        if (title != null) 'title': title,
        if (description != null) 'description': description,
        if (collectionId != null) 'collectionId': collectionId,
        if (spaceId != null) 'spaceId': spaceId,
        if (organizationId != null) 'organizationId': organizationId,
      },
    );

    final data = response.data?['data'] as Map<String, dynamic>;
    final bookmark = Bookmark.fromJson(data);
    await _syncBookmark(bookmark);
    return bookmark;
  }

  // Update bookmark
  Future<Bookmark> updateBookmark({
    required String remoteId,
    String? title,
    String? description,
    int? collectionId,
  }) async {
    final response = await _apiClient.put<Map<String, dynamic>>(
      '/bookmarks/$remoteId',
      data: {
        if (title != null) 'title': title,
        if (description != null) 'description': description,
        if (collectionId != null) 'collectionId': collectionId,
      },
    );

    final data = response.data?['data'] as Map<String, dynamic>;
    final bookmark = Bookmark.fromJson(data);
    await _syncBookmark(bookmark);
    return bookmark;
  }

  // Delete bookmark
  Future<void> deleteBookmark(String remoteId) async {
    await _apiClient.delete('/bookmarks/$remoteId');

    // Remove from local DB
    await (_database.delete(_database.bookmarks)
          ..where((t) => t.remoteId.equals(remoteId)))
        .go();
  }

  // Get local bookmarks
  Future<List<Bookmark>> getLocalBookmarks({int? collectionId}) async {
    final query = _database.select(_database.bookmarks);
    if (collectionId != null) {
      query.where((t) => t.collectionId.equals(collectionId));
    }
    query.orderBy([(t) => OrderingTerm.desc(t.updatedAt)]);

    final rows = await query.get();
    return rows.map(_bookmarkFromRow).toList();
  }

  // Sync single bookmark to local DB (LWW)
  Future<void> _syncBookmark(Bookmark bookmark) async {
    await _database.upsertBookmark(BookmarksCompanion(
      remoteId: Value(bookmark.remoteId),
      url: Value(bookmark.url),
      title: Value(bookmark.title),
      description: Value(bookmark.description),
      favicon: Value(bookmark.favicon),
      thumbnail: Value(bookmark.thumbnail),
      organizationId: Value(bookmark.organizationId),
      spaceId: Value(bookmark.spaceId),
      collectionId: Value(bookmark.collectionId),
      userId: Value(bookmark.userId),
      createdAt: Value(bookmark.createdAt),
      updatedAt: Value(bookmark.updatedAt),
      syncedAt: Value(DateTime.now().millisecondsSinceEpoch),
    ));
  }

  Bookmark _bookmarkFromRow(BookmarkData row) {
    return Bookmark(
      id: row.id,
      remoteId: row.remoteId,
      url: row.url,
      title: row.title,
      description: row.description,
      favicon: row.favicon,
      thumbnail: row.thumbnail,
      organizationId: row.organizationId,
      spaceId: row.spaceId,
      collectionId: row.collectionId,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      syncedAt: row.syncedAt,
    );
  }
}
