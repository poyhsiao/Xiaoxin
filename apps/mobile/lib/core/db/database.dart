import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'database.g.dart';

// Tables

class Bookmarks extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get remoteId => text()();
  TextColumn get url => text()();
  TextColumn get title => text().nullable()();
  TextColumn get description => text().nullable()();
  TextColumn get favicon => text().nullable()();
  TextColumn get thumbnail => text().nullable()();
  IntColumn get organizationId => integer().nullable()();
  IntColumn get spaceId => integer().nullable()();
  IntColumn get collectionId => integer().nullable()();
  IntColumn get userId => integer().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  IntColumn get syncedAt => integer().nullable()();

  @override
  List<String> get customConstraints => ['UNIQUE(remote_id)'];
}

class Organizations extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get remoteId => text()();
  TextColumn get name => text()();
  TextColumn get slug => text()();
  TextColumn get logo => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();

  @override
  List<String> get customConstraints => ['UNIQUE(remote_id)'];
}

class Spaces extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get remoteId => text()();
  TextColumn get name => text()();
  IntColumn get organizationId => integer()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();

  @override
  List<String> get customConstraints => ['UNIQUE(remote_id)'];
}

class Collections extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get remoteId => text()();
  TextColumn get name => text()();
  IntColumn get spaceId => integer()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();

  @override
  List<String> get customConstraints => ['UNIQUE(remote_id)'];
}

@DriftDatabase(tables: [Bookmarks, Organizations, Spaces, Collections])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // LWW Conflict Resolution - Remote wins on same updatedAt
  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        // Future migrations
      },
      beforeOpen: (OpeningDetails details) async {
        // Enable foreign keys
        await customStatement('PRAGMA foreign_keys = ON');
      },
    );
  }

  // Bookmark operations with LWW
  Future<void> upsertBookmark(BookmarksCompanion bookmark) async {
    final existing = await (select(bookmarks)
          ..where((t) => t.remoteId.equals(bookmark.remoteId.value)))
        .getSingleOrNull();

    if (existing == null) {
      await into(bookmarks).insert(bookmark);
    } else if (bookmark.updatedAt.value.isAfter(existing.updatedAt)) {
      // LWW: Remote wins
      await (update(bookmarks)..where((t) => t.remoteId.equals(bookmark.remoteId.value)))
          .write(bookmark);
    }
  }

  // Organization operations with LWW
  Future<void> upsertOrganization(OrganizationsCompanion org) async {
    final existing = await (select(organizations)
          ..where((t) => t.remoteId.equals(org.remoteId.value)))
        .getSingleOrNull();

    if (existing == null) {
      await into(organizations).insert(org);
    } else if (org.updatedAt.value.isAfter(existing.updatedAt)) {
      await (update(organizations)..where((t) => t.remoteId.equals(org.remoteId.value)))
          .write(org);
    }
  }

  // Space operations with LWW
  Future<void> upsertSpace(SpacesCompanion space) async {
    final existing = await (select(spaces)
          ..where((t) => t.remoteId.equals(space.remoteId.value)))
        .getSingleOrNull();

    if (existing == null) {
      await into(spaces).insert(space);
    } else if (space.updatedAt.value.isAfter(existing.updatedAt)) {
      await (update(spaces)..where((t) => t.remoteId.equals(space.remoteId.value)))
          .write(space);
    }
  }

  // Collection operations with LWW
  Future<void> upsertCollection(CollectionsCompanion collection) async {
    final existing = await (select(collections)
          ..where((t) => t.remoteId.equals(collection.remoteId.value)))
        .getSingleOrNull();

    if (existing == null) {
      await into(collections).insert(collection);
    } else if (collection.updatedAt.value.isAfter(existing.updatedAt)) {
      await (update(collections)..where((t) => t.remoteId.equals(collection.remoteId.value)))
          .write(collection);
    }
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'xiaoxin.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
