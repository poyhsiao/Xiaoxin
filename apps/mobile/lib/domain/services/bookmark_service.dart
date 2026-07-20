import 'package:drift/drift.dart';
import '../../core/api/api_client.dart';
import '../../core/db/database.dart' hide Bookmark;
import '../models/bookmark.dart';

class BookmarkService {
  final ApiClient _apiClient;
  final AppDatabase _database;

  BookmarkService({
    required ApiClient apiClient,
    required AppDatabase database,
  })  : _apiClient = apiClient,
        _database = database;

  Future<List<Bookmark>> fetchBookmarks({
    int? collectionId,
    int? spaceId,
    int? organizationId,
  }) async {
    final queryParams = <String, dynamic>{};
    if (collectionId != null) queryParams['collectionId'] = collectionId;
    if (spaceId != null) queryParams['spaceId'] = spaceId;
    if (organizationId != null) queryParams['organizationId'] = organizationId;

    try {
      final response = await _apiClient.get('/bookmarks', queryParameters: queryParams);
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => Bookmark.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Bookmark>> getLocalBookmarks({int? collectionId}) async {
    // Return empty list - full local implementation requires matching domain model
    return [];
  }
}
