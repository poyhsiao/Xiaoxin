import 'package:drift/drift.dart';
import '../../core/api/api_client.dart';
import '../../core/db/database.dart' hide Organization;
import '../models/organization.dart';

class OrganizationService {
  final ApiClient _apiClient;
  final AppDatabase _database;

  OrganizationService({
    required ApiClient apiClient,
    required AppDatabase database,
  })  : _apiClient = apiClient,
        _database = database;

  Future<List<Organization>> fetchOrganizations() async {
    try {
      final response = await _apiClient.get('/organizations');
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => Organization.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Organization>> getLocalOrganizations() async {
    return [];
  }

  Future<List<OrganizationMember>> fetchMembers(String organizationId) async {
    try {
      final response = await _apiClient.get('/organizations/$organizationId/members');
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => OrganizationMember.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }
}
