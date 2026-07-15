Feature: Organizations Management

  Scenario: Create a new organization
    Given the user is authenticated
    And the user provides organization name "My Org" and slug "my-org"
    When creating the organization
    Then the system should create the organization
    And assign the user as owner

  Scenario: List user's organizations
    Given the user is authenticated
    And the user owns an organization "My Org"
    When listing organizations
    Then the system should return the user's organizations

  Scenario: Find organization by ID
    Given the user is authenticated
    And the user owns an organization "My Org"
    When finding the organization by ID
    Then the system should return the organization details

  Scenario: Update organization as owner
    Given the user is authenticated
    And the user owns an organization "My Org"
    When updating the organization with name "Updated Org"
    Then the system should update the organization name

  Scenario: Delete organization requires owner role
    Given the user is authenticated
    And the user is a member (not owner) of an organization
    When attempting to delete the organization
    Then the system should deny with forbidden error

  Scenario: Update organization forbidden for non-owner
    Given the user is authenticated
    And the user is a member (not owner) of an organization
    When attempting to update the organization
    Then the system should deny with forbidden error
