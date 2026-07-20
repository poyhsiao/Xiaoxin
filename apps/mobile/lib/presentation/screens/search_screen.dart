import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../../domain/models/bookmark.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(searchQueryProvider);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bookmarksAsync = ref.watch(filteredBookmarksProvider);

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: '搜尋書籤...',
            border: InputBorder.none,
          ),
          onChanged: (value) {
            ref.read(searchQueryProvider.notifier).state = value;
          },
        ),
        actions: [
          if (_searchController.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                _searchController.clear();
                ref.read(searchQueryProvider.notifier).state = '';
              },
            ),
        ],
      ),
      body: bookmarksAsync.when(
        data: (bookmarks) {
          if (bookmarks.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.search_off, size: 64, color: Colors.grey),
                  const SizedBox(height: 16),
                  Text(
                    _searchController.text.isEmpty
                        ? '輸入關鍵字搜尋書籤'
                        : '找不到符合「${_searchController.text}」的書籤',
                    style: const TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            );
          }
          return ListView.builder(
            itemCount: bookmarks.length,
            itemBuilder: (context, index) {
              final bookmark = bookmarks[index];
              return _SearchResultTile(bookmark: bookmark);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('搜尋失敗: $error')),
      ),
    );
  }
}

class _SearchResultTile extends StatelessWidget {
  final Bookmark bookmark;

  const _SearchResultTile({required this.bookmark});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: bookmark.favicon != null
          ? Image.network(bookmark.favicon!, width: 24, height: 24,
              errorBuilder: (_, __, ___) => const Icon(Icons.link))
          : const Icon(Icons.link),
      title: Text(
        bookmark.title ?? bookmark.url,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      subtitle: Text(
        bookmark.url,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(color: Colors.grey[600]),
      ),
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

class BookmarkDetailScreen extends StatelessWidget {
  final Bookmark bookmark;

  const BookmarkDetailScreen({super.key, required this.bookmark});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(bookmark.title ?? '書籤詳情'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // Share functionality
            },
          ),
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // Edit functionality
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (bookmark.favicon != null)
              Center(
                child: Image.network(
                  bookmark.favicon!,
                  width: 64,
                  height: 64,
                  errorBuilder: (_, __, ___) => const Icon(Icons.link, size: 64),
                ),
              ),
            const SizedBox(height: 24),
            if (bookmark.title != null) ...[
              Text(
                bookmark.title!,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
            ],
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    const Icon(Icons.link, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: SelectableText(
                        bookmark.url,
                        style: const TextStyle(color: Colors.blue),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            if (bookmark.description != null && bookmark.description!.isNotEmpty) ...[
              const SizedBox(height: 24),
              Text(
                '描述',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Text(bookmark.description!),
            ],
            const SizedBox(height: 24),
            Text(
              '建立時間',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(_formatDate(bookmark.createdAt)),
            const SizedBox(height: 16),
            Text(
              '更新時間',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(_formatDate(bookmark.updatedAt)),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')} '
        '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
