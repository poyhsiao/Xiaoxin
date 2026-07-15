import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:xiaoxin_mobile/core/api/api_client.dart';

class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}

void main() {
  group('ApiClient', () {
    test('creates with default baseUrl', () {
      final storage = MockFlutterSecureStorage();
      final client = ApiClient(storage: storage);
      expect(client.dio.options.baseUrl, 'http://localhost:3000/api/v1');
    });

    test('setToken writes to storage', () async {
      final storage = MockFlutterSecureStorage();
      when(() => storage.write(key: any(named: 'key'), value: any(named: 'value')))
          .thenAnswer((_) async {});
      final client = ApiClient(storage: storage);
      await client.setToken('test-token');
      verify(() => storage.write(key: 'auth_token', value: 'test-token')).called(1);
    });

    test('clearToken removes from storage', () async {
      final storage = MockFlutterSecureStorage();
      when(() => storage.delete(key: any(named: 'key'))).thenAnswer((_) async {});
      final client = ApiClient(storage: storage);
      await client.clearToken();
      verify(() => storage.delete(key: 'auth_token')).called(1);
    });

    test('getToken reads from storage', () async {
      final storage = MockFlutterSecureStorage();
      when(() => storage.read(key: any(named: 'key'))).thenAnswer((_) async => 'tok123');
      final client = ApiClient(storage: storage);
      final token = await client.getToken();
      expect(token, 'tok123');
    });
  });
}
