# Firebase Chat System Schema

## Overview
This document outlines the Firebase Firestore database schema for the chat system supporting three chat types: Ad, DM, and Organisation.

## Database Structure

### 1. Users Collection (`users/{userId}`)
Stores user information and online status.

```typescript
{
  id: string;                    // User ID
  name: string;                  // User display name
  avatar: string;                // Avatar URL
  email: string;                 // User email
  isVerified: boolean;           // Verification status
  lastSeen: Timestamp;           // Last seen timestamp
  online: boolean;               // Current online status
  createdAt: Timestamp;          // Account creation date
  updatedAt: Timestamp;          // Last update timestamp
}
```

### 2. Chats Collection (`chats/{chatId}`)
Stores chat metadata, participants, and real-time status.

```typescript
{
  id: string;                    // Chat ID (Firestore auto-generated ID)
  type: "ad" | "dm" | "organisation" | "ticket"; // Chat type
  title: string;                 // Chat title (e.g. Ad title or Organisation name)
  titleAr: string;               // Arabic Chat title
  image: string;                 // Chat image (Ad image or Organisation logo)
  participants: string[];        // Array of user IDs (ALWAYS userIds, never jobProfileId)
  participantDetails: {          // Participant information
    [userId: string]: {
      name: string;
      nameAr: string;            // Arabic name
      image: string;             // User image/avatar URL
      isVerified: boolean;
    }
  };
  jobProfiles: {                 // Mapping of userId to jobProfileId
    [userId: string]: string;    
  };
  lastMessage: {                 // Last message preview
    text: string;
    senderId: string;
    createdAt: Timestamp;        // Message creation timestamp
    type: string;                // Message type (e.g., "text")
  };
  onlineStatus: {                // Online status per user in this chat
    [userId: string]: boolean;
  };
  unreadCount: {                 // Unread count per user
    [userId: string]: number;
  };
  typing: {                      // Typing status per user
    [userId: string]: boolean;
  };
  createdAt: Timestamp;          // Chat creation date
  updatedAt: Timestamp;          // Last update timestamp
  context?: {                    // Metadata related to the chat context
    adId?: string;
    organisationId?: string;
    ticketId?: string;
    [key: string]: any;
  };
  roles?: {                      // Role mapping per user
    [userId: string]: string;
  };
}
```

### 3. Messages Subcollection (`chats/{chatId}/messages/{messageId}`)
Stores individual messages within each chat.

```typescript
{
  chatId: string;                // Parent chat ID
  senderId: string;              // User ID of sender
  text: string;                  // Message content
  type: "text" | "location" | "file"; // Message type
  isRead: boolean;               // Read status
  createdAt: Timestamp;          // Creation timestamp
  timeStamp: Timestamp;          // Message timestamp
  userImage?: string;            // Sender's avatar URL

  // Location specific fields (if type === "location")
  coordinates?: {
    latitude: number;
    longitude: number;
  };

  // File specific fields (if type === "file")
  fileUrl?: string;
}
```

### 4. User Chats Subcollection (`users/{userId}/chats/{chatId}`)
Optimized index for quick access to user's chats, nested within the user's document.

```typescript
{
  chatId: string;                // Reference to chat document
  type: "ad" | "dm" | "organisation";
  lastMessage: {
    text: string;
    createdAt: Timestamp;
  };
  unreadCount: number;          // Unread count for this user
  updatedAt: Timestamp;         // Last update timestamp
}
```


## Indexes Required

### Firestore Composite Indexes:
1. `chats` collection:
   - `type` (Ascending) + `updatedAt` (Descending)
   - `participants` (Array Contains) + `updatedAt` (Descending)

2. `users/{userId}/chats` subcollection:
   - `updatedAt` (Descending)

3. `chats/{chatId}/messages` subcollection:
   - `createdAt` (Descending)

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;

      // User chats nested subcollection
      match /chats/{chatId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Chats collection
    match /chats/{chatId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.participants;
      
      // Messages subcollection
      match /messages/{messageId} {
        allow read: if request.auth != null && 
                       request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow create: if request.auth != null && 
                         request.auth.uid == request.resource.data.senderId;
        allow update: if request.auth != null && 
                         request.auth.uid == request.resource.data.senderId;
      }
    }
  }
}
```

## Key Features

1. **Chat ID**: Uses Firestore auto-generated IDs instead of concatenated strings.
2. **Participants**: The `participants` array must ALWAYS contain only **userIds** (UUIDs). Never store `jobProfileId` in the `participants` array.
3. **Job Profile Mapping**: The `jobProfiles` field maps a user's `userId` to their `jobProfileId`. This allows identifying which profile a user is acting from in the context of the chat.
4. **Chat Context**: Identifiers like `adId`, `organisationId`, or `ticketId` are stored within the `context` object rather than at the top level, keeping the schema clean.
5. **Real-time Updates**: Uses Firestore real-time listeners for messages, typing status, and online presence.
6. **Unread Counts**: Tracks unread messages per user per chat.
7. **Typing Indicators**: Real-time typing status per user.
8. **Online/Offline Status**: Tracks user presence.
9. **Optimized Queries**: User chats index (if used) or direct queries on `participants` array.
10. **Message Read Status**: Tracks which users have read each message.

## Job Profiles in Chats

The `jobProfiles` field is a map: `Record<userId, jobProfileId>`.
- On chat creation, the `jobProfileId` of the **initiator** (createdBy) is always stored.
- The second user's `jobProfileId` is optional and can be populated later when they interact with the chat or when it's resolved from their profile.
- This mapping ensures we know the context of the user's participation without cluttering the `participants` array with irrelevant IDs.

## Backward Compatibility & Migration

- **Existing Chats**: Chats created with the old deterministic ID format will still work as long as the code handles both ID lookup and auto-generated ID storage.
- **Lazy Population**: `jobProfiles` for existing chats can be populated lazily when users interact with the chat.
- **Top-level Fields**: Code should handle cases where `adId` or `organisationId` might be at the top level (legacy) or within the `context` object (new).


## Data Flow

1. **Creating a Chat**:
   - Create document in `chats` collection
   - Add chat reference to `userChats/{userId}/chats` for each participant
   - Initialize unread counts and typing status

2. **Sending a Message**:
   - Add message to `chats/{chatId}/messages`
   - Update `chats/{chatId}` lastMessage and updatedAt
   - Update unread counts for all participants except sender
   - Update `userChats/{userId}/chats/{chatId}` for all participants

3. **Typing Status**:
   - Update `chats/{chatId}.typing.{userId}` to true when user starts typing
   - Set to false when user stops typing or sends message
   - Listen to changes in real-time

4. **Online Status**:
   - Update `chats/{chatId}.onlineStatus.{userId}` when user enters/leaves the chat
   - Uses Firestore real-time listeners for updates

5. **Reading Messages**:
   - Mark message as read in `messages/{messageId}.readBy`
   - Update unread count in `chats/{chatId}.unreadCount.{userId}`
   - Update `userChats/{userId}/chats/{chatId}.unreadCount`

