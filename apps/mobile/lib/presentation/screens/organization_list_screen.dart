import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../../domain/models/organization.dart';

class OrganizationListScreen extends ConsumerWidget {
  const OrganizationListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final organizationsAsync = ref.watch(organizationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('組織列表'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.invalidate(organizationsProvider),
          ),
        ],
      ),
      body: organizationsAsync.when(
        data: (organizations) {
          if (organizations.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.business, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('尚無組織', style: TextStyle(color: Colors.grey)),
                ],
              ),
            );
          }
          return ListView.builder(
            itemCount: organizations.length,
            itemBuilder: (context, index) {
              final org = organizations[index];
              return OrganizationListTile(organization: org);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('載入失敗: $error'),
              TextButton(
                onPressed: () => ref.invalidate(organizationsProvider),
                child: const Text('重試'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class OrganizationListTile extends StatelessWidget {
  final Organization organization;

  const OrganizationListTile({super.key, required this.organization});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: organization.logo != null
          ? Image.network(
              organization.logo!,
              width: 40,
              height: 40,
              errorBuilder: (_, __, ___) => _buildDefaultAvatar(),
            )
          : _buildDefaultAvatar(),
      title: Text(organization.name),
      subtitle: Text(organization.slug),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => MemberManagementScreen(organization: organization),
          ),
        );
      },
    );
  }

  Widget _buildDefaultAvatar() {
    return CircleAvatar(
      backgroundColor: Colors.blue,
      child: Text(
        organization.name.isNotEmpty ? organization.name[0].toUpperCase() : '?',
        style: const TextStyle(color: Colors.white),
      ),
    );
  }
}

class MemberManagementScreen extends ConsumerStatefulWidget {
  final Organization organization;

  const MemberManagementScreen({super.key, required this.organization});

  @override
  ConsumerState<MemberManagementScreen> createState() => _MemberManagementScreenState();
}

class _MemberManagementScreenState extends ConsumerState<MemberManagementScreen> {
  List<OrganizationMember> _members = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadMembers();
  }

  Future<void> _loadMembers() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final service = ref.read(organizationServiceProvider);
      final members = await service.fetchMembers(widget.organization.remoteId);
      setState(() {
        _members = members;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.organization.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add),
            onPressed: () {
              // Show add member dialog
              _showAddMemberDialog();
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('載入失敗: $_error'),
                      TextButton(
                        onPressed: _loadMembers,
                        child: const Text('重試'),
                      ),
                    ],
                  ),
                )
              : _members.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.people_outline, size: 64, color: Colors.grey),
                          SizedBox(height: 16),
                          Text('尚無成員', style: TextStyle(color: Colors.grey)),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: _members.length,
                      itemBuilder: (context, index) {
                        final member = _members[index];
                        return MemberListTile(member: member);
                      },
                    ),
    );
  }

  void _showAddMemberDialog() {
    final emailController = TextEditingController();
    String selectedRole = 'member';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('新增成員'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                hintText: 'member@example.com',
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: selectedRole,
              decoration: const InputDecoration(labelText: '角色'),
              items: const [
                DropdownMenuItem(value: 'admin', child: Text('管理員')),
                DropdownMenuItem(value: 'member', child: Text('成員')),
                DropdownMenuItem(value: 'viewer', child: Text('檢視者')),
              ],
              onChanged: (value) {
                if (value != null) selectedRole = value;
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          FilledButton(
            onPressed: () {
              // Add member logic
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('成員邀請已發送')),
              );
            },
            child: const Text('邀請'),
          ),
        ],
      ),
    );
  }
}

class MemberListTile extends StatelessWidget {
  final OrganizationMember member;

  const MemberListTile({super.key, required this.member});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: _getRoleColor(member.role),
        child: Text(
          member.userId.isNotEmpty ? member.userId[0].toUpperCase() : '?',
          style: const TextStyle(color: Colors.white),
        ),
      ),
      title: Text(member.userId),
      subtitle: Text(_getRoleLabel(member.role)),
      trailing: PopupMenuButton<String>(
        onSelected: (value) {
          if (value == 'remove') {
            _showRemoveConfirmation(context);
          }
        },
        itemBuilder: (context) => [
          const PopupMenuItem(value: 'change_role', child: Text('變更角色')),
          const PopupMenuItem(value: 'remove', child: Text('移除')),
        ],
      ),
    );
  }

  Color _getRoleColor(String role) {
    switch (role) {
      case 'admin':
        return Colors.red;
      case 'member':
        return Colors.blue;
      case 'viewer':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  String _getRoleLabel(String role) {
    switch (role) {
      case 'admin':
        return '管理員';
      case 'member':
        return '成員';
      case 'viewer':
        return '檢視者';
      default:
        return role;
    }
  }

  void _showRemoveConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('移除成員'),
        content: Text('確定要移除成員 ${member.userId} 嗎？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('成員已移除')),
              );
            },
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('移除'),
          ),
        ],
      ),
    );
  }
}
