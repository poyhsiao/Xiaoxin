Feature: Bookmark Management

  Scenario: Create a bookmark in a collection
    Given the user is authenticated
    And the user has a collection "My Collection"
    And the user provides URL "https://example.com" and title "Example"
    When creating the bookmark
    Then the system should create the bookmark in the collection

  Scenario: Search bookmarks by title
    Given the user has bookmarks with titles containing "NestJS"
    When searching for "NestJS"
    Then the system should return matching bookmarks

  Scenario: List bookmarks in a collection
    Given the user is authenticated
    And the user has a collection with 3 bookmarks
    When listing bookmarks in the collection
    Then the system should return all 3 bookmarks

  Scenario: Delete a bookmark
    Given the user is authenticated
    And the user has a bookmark
    When deleting the bookmark
    Then the system should remove the bookmark

  Scenario: Update bookmark status
    Given the user is authenticated
    And the user has a bookmark with status "UNREAD"
    When marking the bookmark as read
    Then the system should update the bookmark status to "READ"
