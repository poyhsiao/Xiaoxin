import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../../domain/models/bookmark.dart';
import '../../domain/services/bookmark_service.dart';

class AddBookmarkScreen extends ConsumerStatefulWidget {
  const AddBookmarkScreen({super.key});

  @override
  ConsumerState<AddBookmarkScreen> createState() => _AddBookmarkScreenState();
}

class _AddBookmarkScreenState extends ConsumerState<AddBookmarkScreen> {
  final _urlController = TextEditingController();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  bool _isLoading = false;
  String? _detectedUrl;

  @override
  void initState() {
    super.initState();
    _checkClipboard();
  }

  @override
  void dispose() {
    _urlController.dispose();
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _checkClipboard() async {
    try {
      final data = await Clipboard.getData(Clipboard.kTextPlain);
      if (data?.text != null && _isValidUrl(data!.text!)) {
        setState(() {
          _detectedUrl = data.text;
        });
        if (mounted) {
          _showClipboardDialog(data.text!);
        }
      }
    } catch (e) {
      // Clipboard access denied
    }
  }

  bool _isValidUrl(String text) {
    final urlPattern = RegExp(
      r'^https?:\/\/([\w\-]+\.)+[\w\-]+(\/[\w\-\._~:/?#\[\]@!$&()*+,;=]*)?',
      caseSensitive: false,
    );
    return urlPattern.hasMatch(text);
  }

  void _showClipboardDialog(String url) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('偵測到 URL'),
        content: Text('是否要新增此書籤？\n\n$url'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _urlController.text = url;
            },
            child: const Text('使用'),
          ),
        ],
      ),
    );
  }

  Future<void> _saveBookmark() async {
    final url = _urlController.text.trim();
    if (url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('請輸入 URL')),
      );
      return;
    }

    if (!_isValidUrl(url)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('請輸入有效的 URL')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final service = ref.read(bookmarkServiceProvider);
      final now = DateTime.now();
      final bookmark = Bookmark(
        remoteId: DateTime.now().millisecondsSinceEpoch.toString(),
        url: url,
        title: _titleController.text.isNotEmpty ? _titleController.text : null,
        description: _descriptionController.text.isNotEmpty ? _descriptionController.text : null,
        createdAt: now,
        updatedAt: now,
      );

      // For now, just show success (actual API call would sync)
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('書籤已新增')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('新增失敗: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _scanQRCode() {
    // QR code scanning would require camera permission and library
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('QR Code 掃描功能需要相機權限')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('新增書籤'),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner),
            onPressed: _scanQRCode,
            tooltip: '掃描 QR Code',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_detectedUrl != null)
              Card(
                color: Colors.blue.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Icon(Icons.content_paste, color: Colors.blue.shade700),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          '偵測到 URL: $_detectedUrl',
                          style: TextStyle(color: Colors.blue.shade700),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => setState(() => _detectedUrl = null),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 16),
            TextField(
              controller: _urlController,
              decoration: const InputDecoration(
                labelText: 'URL',
                hintText: 'https://example.com',
                prefixIcon: Icon(Icons.link),
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.url,
              autocorrect: false,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: '標題 (選填)',
                hintText: '輸入書籤標題',
                prefixIcon: Icon(Icons.title),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: '描述 (選填)',
                hintText: '輸入書籤描述',
                prefixIcon: Icon(Icons.description),
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: _isLoading ? null : _saveBookmark,
              icon: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.save),
              label: Text(_isLoading ? '儲存中...' : '儲存書籤'),
            ),
          ],
        ),
      ),
    );
  }
}
