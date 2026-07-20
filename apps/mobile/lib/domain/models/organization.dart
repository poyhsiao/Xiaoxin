class Organization {
  final int? id;
  final String remoteId;
  final String name;
  final String slug;
  final String? logo;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Organization({
    this.id,
    required this.remoteId,
    required this.name,
    required this.slug,
    this.logo,
    required this.createdAt,
    required this.updatedAt,
  });

  Organization copyWith({
    int? id,
    String? remoteId,
    String? name,
    String? slug,
    String? logo,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Organization(
      id: id ?? this.id,
      remoteId: remoteId ?? this.remoteId,
      name: name ?? this.name,
      slug: slug ?? this.slug,
      logo: logo ?? this.logo,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'remoteId': remoteId,
      'name': name,
      'slug': slug,
      'logo': logo,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory Organization.fromJson(Map<String, dynamic> json) {
    return Organization(
      id: json['id'] as int?,
      remoteId: json['remoteId'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      logo: json['logo'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }
}

class OrganizationMember {
  final int? id;
  final String remoteId;
  final String organizationId;
  final String userId;
  final String role;
  final DateTime createdAt;
  final DateTime updatedAt;

  const OrganizationMember({
    this.id,
    required this.remoteId,
    required this.organizationId,
    required this.userId,
    required this.role,
    required this.createdAt,
    required this.updatedAt,
  });

  OrganizationMember copyWith({
    int? id,
    String? remoteId,
    String? organizationId,
    String? userId,
    String? role,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return OrganizationMember(
      id: id ?? this.id,
      remoteId: remoteId ?? this.remoteId,
      organizationId: organizationId ?? this.organizationId,
      userId: userId ?? this.userId,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'remoteId': remoteId,
      'organizationId': organizationId,
      'userId': userId,
      'role': role,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory OrganizationMember.fromJson(Map<String, dynamic> json) {
    return OrganizationMember(
      id: json['id'] as int?,
      remoteId: json['remoteId'] as String,
      organizationId: json['organizationId'] as String,
      userId: json['userId'] as String,
      role: json['role'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }
}
