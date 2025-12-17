# Firebase Chat System Setup Guide

## Prerequisites

1. Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. Firestore Database enabled
3. Authentication enabled (if using Firebase Auth)

## Installation

Firebase has been installed. If you need to reinstall:

```bash
yarn add firebase
```

## Configuration

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select Web (</>)
7. Copy the configuration values from the `firebaseConfig` object

### 3. Firestore Database Setup

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in **production mode** (we'll add security rules)
4. Choose a location for your database

### 4. Firestore Security Rules

Go to Firestore Database → Rules and paste the following:

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

### 5. Firestore Indexes

Go to Firestore Database → Indexes and create the following composite indexes:

1. **Collection**: `chats`
   - Fields: `chatType` (Ascending), `updatedAt` (Descending)

2. **Collection**: `chats`
   - Fields: `participants` (Array Contains), `updatedAt` (Descending)

3. **Collection**: `userChats/{userId}/chats`
   - Fields: `updatedAt` (Descending)

4. **Collection**: `chats/{chatId}/messages`
   - Fields: `timestamp` (Descending)

## Usage

### Basic Chat Operations

```typescript
import { ChatService } from "@/lib/firebase/chat.service";
import { usePresence } from "@/lib/firebase/presence.hook";

// Create a chat
const chatId = await ChatService.createChat({
  chatType: "ad",
  participants: ["user1", "user2"],
  participantDetails: {
    user1: { name: "User 1", avatar: "...", isVerified: true },
    user2: { name: "User 2", avatar: "...", isVerified: false },
  },
  adId: "ad123",
  adTitle: "Car for Sale",
  adImage: "https://...",
});

// Send a message
await ChatService.sendMessage({
  chatId,
  senderId: "user1",
  text: "Hello!",
});

// Get messages
const messages = await ChatService.getMessages(chatId);

// Subscribe to messages (real-time)
const unsubscribe = ChatService.subscribeToMessages(chatId, (messages) => {
  console.log("New messages:", messages);
});

// Set typing status
await ChatService.setTypingStatus(chatId, "user1", true);

// Set online status
await ChatService.setOnlineStatus("user1", true);

// Use presence hook in component
function ChatComponent() {
  const userId = "user1";
  usePresence(userId);
  // ...
}
```

### Real-time Subscriptions

```typescript
// Subscribe to user chats
const unsubscribeChats = ChatService.subscribeToUserChats(
  userId,
  "ad", // or undefined for all types
  (chats) => {
    console.log("Chats updated:", chats);
  }
);

// Subscribe to typing status
const unsubscribeTyping = ChatService.subscribeToTypingStatus(
  chatId,
  (typing) => {
    console.log("Typing status:", typing);
  }
);

// Subscribe to online status
const unsubscribeOnline = ChatService.subscribeToOnlineStatus(
  userId,
  (online) => {
    console.log("User online:", online);
  }
);

// Cleanup subscriptions
unsubscribeChats();
unsubscribeTyping();
unsubscribeOnline();
```

## Features

✅ **Chat Types**: Supports Ad, DM, and Organisation chats  
✅ **Real-time Messages**: Live message updates using Firestore listeners  
✅ **Typing Indicators**: Real-time typing status per user  
✅ **Online/Offline Status**: Track user presence  
✅ **Unread Counts**: Per-chat and per-user unread message tracking  
✅ **Message Read Status**: Track which users have read messages  
✅ **Optimized Queries**: User chats index for fast retrieval  

## File Structure

```
lib/firebase/
├── config.ts              # Firebase initialization
├── types.ts               # TypeScript interfaces
├── chat.service.ts        # Chat service with all operations
└── presence.hook.ts       # React hook for online/offline status

docs/
├── FIREBASE_CHAT_SCHEMA.md  # Database schema documentation
└── FIREBASE_SETUP.md        # This setup guide
```

## Next Steps

1. Review the schema in `docs/FIREBASE_CHAT_SCHEMA.md`
2. Set up your Firebase project and add environment variables
3. Configure Firestore security rules and indexes
4. Integrate the chat service into your chat components
5. Test the real-time functionality

## Troubleshooting

### "Firebase should only be initialized on the client side"
- Make sure you're using the chat service only in client components (with "use client")

### "Permission denied" errors
- Check your Firestore security rules
- Ensure the user is authenticated
- Verify the user is a participant in the chat

### Real-time updates not working
- Check your Firestore indexes are created
- Verify you're properly subscribing to changes
- Check browser console for errors

### Typing status not updating
- Ensure you're calling `setTypingStatus` with the correct chatId and userId
- Check that the user is a participant in the chat

