import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'presentation/screens/bookmark_list_screen.dart';
import 'presentation/screens/organization_list_screen.dart';

class XiaoxinApp extends StatelessWidget {
  const XiaoxinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: MaterialApp(
        title: '小新',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
        ),
        home: const HomePage(),
        routes: {
          '/bookmarks': (_) => const BookmarkListScreen(),
          '/organizations': (_) => const OrganizationListScreen(),
        },
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('小新書籤'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text('書籤管理'),
      ),
      drawer: Drawer(
        child: ListView(
          children: [
            const DrawerHeader(child: Text('小新')),
            ListTile(
              leading: const Icon(Icons.bookmark),
              title: const Text('書籤'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/bookmarks');
              },
            ),
            ListTile(
              leading: const Icon(Icons.business),
              title: const Text('組織'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/organizations');
              },
            ),
            const Divider(),
            const ListTile(title: Text('設定')),
          ],
        ),
      ),
    );
  }
}
