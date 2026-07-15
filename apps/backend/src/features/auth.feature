Feature: Authentication

  Scenario: User registers with valid email and password
    Given the user provides email "test@example.com" and password "password123"
    When the user registers
    Then the system should create a new user account
    And return a valid access token

  Scenario: User cannot register with existing email
    Given a user with email "test@example.com" already exists
    And the user provides email "test@example.com" and password "password123"
    When the user registers
    Then the system should reject with a conflict error

  Scenario: User login with valid credentials
    Given a user with email "test@example.com" and password "password123" exists
    And the user provides email "test@example.com" and password "password123"
    When the user logs in
    Then the system should return a valid access token

  Scenario: User login fails with wrong password
    Given a user with email "test@example.com" and password "password123" exists
    And the user provides email "test@example.com" and password "wrongpassword"
    When the user logs in
    Then the system should reject with invalid credentials error

  Scenario: User login fails with non-existent email
    Given no user with email "nonexistent@example.com" exists
    And the user provides email "nonexistent@example.com" and password "password123"
    When the user logs in
    Then the system should reject with invalid credentials error
