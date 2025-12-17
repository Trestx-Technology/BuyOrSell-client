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
Stores chat metadata and participants.

```typescript
{
  id: string;                    // Chat ID (auto-generated)
  chatType: "ad" | "dm" | "organisation";  // Chat type
  participants: string[];        // Array of user IDs
  participantDetails: {          // Participant information
    [userId: string]: {
      name: string;
      avatar: string;
      isVerified: boolean;
    }
  };
  adId?: string;                 // Ad ID (only for "ad" type chats)
  adTitle?: string;              // Ad title (only for "ad" type chats)
  adImage?: string;              // Ad image URL (only for "ad" type chats)
  organisationId?: string;       // Organisation ID (only for "organisation" type)
  organisationName?: string;     // Organisation name (only for "organisation" type)
  lastMessage: {                 // Last message preview
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  unreadCount: {                 // Unread count per user
    [userId: string]: number;
  };
  typing: {                      // Typing status per user
    [userId: string]: boolean;
  };
  createdAt: Timestamp;          // Chat creation date
  updatedAt: Timestamp;          // Last update timestamp
}
```

### 3. Messages Subcollection (`chats/{chatId}/messages/{messageId}`)
Stores individual messages within each chat.

```typescript
{
  id: string;                    // Message ID (auto-generated)
  chatId: string;                // Parent chat ID
  senderId: string;              // User ID of sender
  text: string;                  // Message content
  isRead: boolean;               // Read status
  readBy: string[];              // Array of user IDs who read the message
  timestamp: Timestamp;          // Message timestamp
  createdAt: Timestamp;         // Creation timestamp
}
```

### 4. User Chats Index (`userChats/{userId}/chats/{chatId}`)
Optimized index for quick access to user's chats.

```typescript
{
  chatId: string;                // Reference to chat document
  chatType: "ad" | "dm" | "organisation";
  lastMessage: {
    text: string;
    timestamp: Timestamp;
  };
  unreadCount: number;          // Unread count for this user
  updatedAt: Timestamp;         // Last update timestamp
}
```

### 5. Online Status Collection (`presence/{userId}`)
Tracks user online/offline status in real-time.

```typescript
{
  userId: string;                // User ID
  online: boolean;               // Online status
  lastSeen: Timestamp;           // Last seen timestamp
  updatedAt: Timestamp;          // Last update timestamp
}
```

## Indexes Required

### Firestore Composite Indexes:
1. `chats` collection:
   - `chatType` (Ascending) + `updatedAt` (Descending)
   - `participants` (Array Contains) + `updatedAt` (Descending)

2. `userChats/{userId}/chats` subcollection:
   - `updatedAt` (Descending)

3. `chats/{chatId}/messages` subcollection:
   - `timestamp` (Descending)

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
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
    
    // User chats index
    match /userChats/{userId}/chats/{chatId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Presence collection
    match /presence/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Key Features

1. **Chat Types**: Supports three types - Ad, DM, and Organisation
2. **Real-time Updates**: Uses Firestore real-time listeners for messages, typing status, and online presence
3. **Unread Counts**: Tracks unread messages per user per chat
4. **Typing Indicators**: Real-time typing status per user
5. **Online/Offline Status**: Tracks user presence
6. **Optimized Queries**: User chats index for fast retrieval
7. **Message Read Status**: Tracks which users have read each message

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
   - Update `presence/{userId}` when user comes online/offline
   - Use Firestore onDisconnect to handle offline status

5. **Reading Messages**:
   - Mark message as read in `messages/{messageId}.readBy`
   - Update unread count in `chats/{chatId}.unreadCount.{userId}`
   - Update `userChats/{userId}/chats/{chatId}.unreadCount`

