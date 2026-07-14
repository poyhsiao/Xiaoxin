import 'package:flutter/material.dart';

class XiaoxinApp extends StatelessWidget {
  const XiaoxinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '小新',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const HomePage(),
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
            ListTile(title: const Text('首頁'), onTap: () {}),
            ListTile(title: const Text('書籤'), onTap: () {}),
            ListTile(title: const Text('設定'), onTap: () {}),
          ],
        ),
      ),
    );
  }
}
