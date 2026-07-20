import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client.dart';
import '../../core/db/database.dart' hide Bookmark, Organization;
import '../../domain/models/bookmark.dart';
import '../../domain/models/organization.dart';
import '../../domain/services/bookmark_service.dart';
import '../../domain/services/organization_service.dart';

// Core providers
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});

final databaseProvider = Provider<AppDatabase>((ref) {
  return AppDatabase();
});

// Service providers
final bookmarkServiceProvider = Provider<BookmarkService>((ref) {
  return BookmarkService(
    apiClient: ref.watch(apiClientProvider),
    database: ref.watch(databaseProvider),
  );
});

final organizationServiceProvider = Provider<OrganizationService>((ref) {
  return OrganizationService(
    apiClient: ref.watch(apiClientProvider),
    database: ref.watch(databaseProvider),
  );
});

// Bookmark state providers
final bookmarksProvider = FutureProvider<List<Bookmark>>((ref) async {
  final service = ref.watch(bookmarkServiceProvider);
  return service.fetchBookmarks();
});

final localBookmarksProvider = FutureProvider<List<Bookmark>>((ref) async {
  final service = ref.watch(bookmarkServiceProvider);
  return service.getLocalBookmarks();
});

final searchQueryProvider = StateProvider<String>((ref) => '');

final filteredBookmarksProvider = Provider<AsyncValue<List<Bookmark>>>((ref) {
  final bookmarksAsync = ref.watch(bookmarksProvider);
  final query = ref.watch(searchQueryProvider).toLowerCase();

  return bookmarksAsync.when(
    data: (bookmarks) {
      if (query.isEmpty) return AsyncValue.data(bookmarks);
      final filtered = bookmarks.where((b) {
        return (b.title?.toLowerCase().contains(query) ?? false) ||
            b.url.toLowerCase().contains(query) ||
            (b.description?.toLowerCase().contains(query) ?? false);
      }).toList();
      return AsyncValue.data(filtered);
    },
    loading: () => const AsyncValue.loading(),
    error: (e, st) => AsyncValue.error(e, st),
  );
});

// Organization state providers
final organizationsProvider = FutureProvider<List<Organization>>((ref) async {
  final service = ref.watch(organizationServiceProvider);
  return service.fetchOrganizations();
});

final localOrganizationsProvider = FutureProvider<List<Organization>>((ref) async {
  final service = ref.watch(organizationServiceProvider);
  return service.getLocalOrganizations();
});

final selectedOrganizationProvider = StateProvider<Organization?>((ref) => null);
