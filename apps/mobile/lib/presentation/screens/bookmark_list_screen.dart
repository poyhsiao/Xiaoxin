import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../../domain/models/bookmark.dart';
import 'search_screen.dart';
import 'add_bookmark_screen.dart';

class BookmarkListScreen extends ConsumerWidget {
  const BookmarkListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookmarksAsync = ref.watch(filteredBookmarksProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('書籤列表'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SearchScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.invalidate(bookmarksProvider),
          ),
        ],
      ),
      body: bookmarksAsync.when(
        data: (bookmarks) => bookmarks.isEmpty
            ? const Center(child: Text('尚無書籤'))
            : ListView.builder(
                itemCount: bookmarks.length,
                itemBuilder: (context, index) {
                  final bookmark = bookmarks[index];
                  return BookmarkListTile(bookmark: bookmark);
                },
              ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('載入失敗: $error'),
              TextButton(
                onPressed: () => ref.invalidate(bookmarksProvider),
                child: const Text('重試'),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddBookmarkScreen()),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class BookmarkListTile extends StatelessWidget {
  final Bookmark bookmark;

  const BookmarkListTile({super.key, required this.bookmark});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: bookmark.favicon != null
          ? Image.network(bookmark.favicon!, width: 24, height: 24,
              errorBuilder: (_, __, ___) => const Icon(Icons.link))
          : const Icon(Icons.link),
      title: Text(bookmark.title ?? bookmark.url),
      subtitle: Text(
        bookmark.url,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => BookmarkDetailScreen(bookmark: bookmark),
          ),
        );
      },
    );
  }
}
