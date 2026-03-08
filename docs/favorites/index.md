# Collection Manager & Shared Features

This document explains the logic behind common platform features like Search History, Favorites, and general Collection Management.

## 1. Search History Logic

The platform tracks and manages user search history to enhance discovery and personalization.

### Features

- **Automatic Logging**: Every search performed via the `SimpleSearchInput` or AI Search is logged.
- **Categorization**: Searches are linked to categories if a specific category was selected during search.
- **Persistence**: Logged via `useSaveSearchTerm` which hits the `/search-history` API.
- **Management**: Users can view, reuse, or delete their search history from the `/user/search-history` page.

### Redirection Logic

When a user selects a previous search term:

1. **Slugified Redirect**: If the search was category-specific, the user is sent to the category path (e.g., `motors/cars`).
2. **Query Parameter**: If no category is involved, it defaults to `/ad?query=term`.

---

## 2. Favorites System

Common across ads, jobs, and organizations.

### Hook: `useFavorites`

- **GET**: Fetches user-specific liked items.
- **POST/DELETE**: Toggles the favorite status via a specialized endpoint.
- **Cache Invalidation**: Automatically invalidates related item lists to ensure consistent UI state.

---

## 3. General Collection Management

The platform provides a flexible "Collection" system primarily used for grouping ads into sets.

### Architecture

- **API Base**: `/collections`
- **Schema**:
  - `name`: Human-readable label.
  - `items`: Array of IDs (Ads/Jobs).
  - `userId`: Owner ID for access control.

### Operations

- **Bulk Selection**: Logic allows users to select multiple items from their dashboard to add to a new or existing collection.
- **Privacy**: Collections are private by default but can be extended for sharing via public links.
