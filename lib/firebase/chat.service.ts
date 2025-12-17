"use client";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";
import {
  Chat,
  Message,
  UserChat,
  Presence,
  CreateChatParams,
  SendMessageParams,
  ChatType,
} from "./types";

// Collection names
const COLLECTIONS = {
  USERS: "users",
  CHATS: "chats",
  MESSAGES: "messages",
  USER_CHATS: "userChats",
  PRESENCE: "presence",
} as const;

/**
 * Chat Service
 * Handles all chat-related Firebase operations
 */
export class ChatService {
  /**
   * Create a new chat
   */
  static async createChat(params: CreateChatParams): Promise<string> {
    const chatRef = doc(collection(db, COLLECTIONS.CHATS));
    const chatId = chatRef.id;

    const chatData: Omit<Chat, "id"> = {
      chatType: params.chatType,
      participants: params.participants,
      participantDetails: params.participantDetails,
      adId: params.adId,
      adTitle: params.adTitle,
      adImage: params.adImage,
      organisationId: params.organisationId,
      organisationName: params.organisationName,
      lastMessage: {
        text: "",
        senderId: "",
        timestamp: serverTimestamp() as Timestamp,
      },
      unreadCount: {},
      typing: {},
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    // Initialize unread counts for all participants
    params.participants.forEach((userId) => {
      chatData.unreadCount[userId] = 0;
      chatData.typing[userId] = false;
    });

    await setDoc(chatRef, chatData);

    // Create user chat index entries for all participants
    const batch = writeBatch(db);
    params.participants.forEach((userId) => {
      const userChatRef = doc(
        db,
        COLLECTIONS.USER_CHATS,
        userId,
        "chats",
        chatId
      );
      batch.set(userChatRef, {
        chatId,
        chatType: params.chatType,
        lastMessage: chatData.lastMessage,
        unreadCount: 0,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();

    return chatId;
  }

  /**
   * Get a chat by ID
   */
  static async getChat(chatId: string): Promise<Chat | null> {
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      return null;
    }

    return { id: chatSnap.id, ...chatSnap.data() } as Chat;
  }

  /**
   * Get all chats for a user filtered by chat type
   */
  static async getUserChats(
    userId: string,
    chatType?: ChatType
  ): Promise<Chat[]> {
    const userChatsRef = collection(
      db,
      COLLECTIONS.USER_CHATS,
      userId,
      "chats"
    );

    let q = query(userChatsRef, orderBy("updatedAt", "desc"));

    if (chatType) {
      q = query(userChatsRef, where("chatType", "==", chatType), orderBy("updatedAt", "desc"));
    }

    const snapshot = await getDocs(q);
    const chatIds = snapshot.docs.map((doc) => doc.data().chatId);

    if (chatIds.length === 0) {
      return [];
    }

    // Fetch full chat documents
    const chats: Chat[] = [];
    for (const chatId of chatIds) {
      const chat = await this.getChat(chatId);
      if (chat) {
        chats.push(chat);
      }
    }

    return chats;
  }

  /**
   * Listen to user chats in real-time
   */
  static subscribeToUserChats(
    userId: string,
    chatType: ChatType | undefined,
    callback: (chats: Chat[]) => void
  ): () => void {
    const userChatsRef = collection(
      db,
      COLLECTIONS.USER_CHATS,
      userId,
      "chats"
    );

    let q = query(userChatsRef, orderBy("updatedAt", "desc"));

    if (chatType) {
      q = query(
        userChatsRef,
        where("chatType", "==", chatType),
        orderBy("updatedAt", "desc")
      );
    }

    return onSnapshot(q, async (snapshot) => {
      const chatIds = snapshot.docs.map((doc) => doc.data().chatId);
      const chats: Chat[] = [];

      for (const chatId of chatIds) {
        const chat = await this.getChat(chatId);
        if (chat) {
          chats.push(chat);
        }
      }

      callback(chats);
    });
  }

  /**
   * Send a message
   */
  static async sendMessage(params: SendMessageParams): Promise<string> {
    const { chatId, senderId, text } = params;

    // Create message
    const messagesRef = collection(
      db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES
    );
    const messageRef = doc(messagesRef);
    const messageId = messageRef.id;

    const messageData: Omit<Message, "id"> = {
      chatId,
      senderId,
      text,
      isRead: false,
      readBy: [senderId], // Sender has read their own message
      timestamp: serverTimestamp() as Timestamp,
      createdAt: serverTimestamp() as Timestamp,
    };

    await setDoc(messageRef, messageData);

    // Update chat document
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);
    const chat = await this.getChat(chatId);

    if (chat) {
      const batch = writeBatch(db);

      // Update chat last message
      batch.update(chatRef, {
        lastMessage: {
          text,
          senderId,
          timestamp: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });

      // Update unread counts for all participants except sender
      chat.participants.forEach((participantId) => {
        if (participantId !== senderId) {
          batch.update(chatRef, {
            [`unreadCount.${participantId}`]: increment(1),
          });

          // Update user chat index
          const userChatRef = doc(
            db,
            COLLECTIONS.USER_CHATS,
            participantId,
            "chats",
            chatId
          );
          batch.update(userChatRef, {
            unreadCount: increment(1),
            lastMessage: {
              text,
              senderId,
              timestamp: serverTimestamp(),
            },
            updatedAt: serverTimestamp(),
          });
        } else {
          // Update sender's user chat index (no unread increment)
          const userChatRef = doc(
            db,
            COLLECTIONS.USER_CHATS,
            senderId,
            "chats",
            chatId
          );
          batch.update(userChatRef, {
            lastMessage: {
              text,
              senderId,
              timestamp: serverTimestamp(),
            },
            updatedAt: serverTimestamp(),
          });
        }
      });

      await batch.commit();
    }

    return messageId;
  }

  /**
   * Get messages for a chat
   */
  static async getMessages(
    chatId: string,
    limitCount: number = 50
  ): Promise<Message[]> {
    const messagesRef = collection(
      db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES
    );
    const q = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Message))
      .reverse(); // Reverse to get chronological order
  }

  /**
   * Listen to messages in real-time
   */
  static subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void,
    limitCount: number = 50
  ): () => void {
    const messagesRef = collection(
      db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES
    );
    const q = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Message))
        .reverse();
      callback(messages);
    });
  }

  /**
   * Mark message as read
   */
  static async markMessageAsRead(
    chatId: string,
    messageId: string,
    userId: string
  ): Promise<void> {
    const messageRef = doc(
      db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES,
      messageId
    );

    await updateDoc(messageRef, {
      readBy: arrayUnion(userId),
      isRead: true,
    });
  }

  /**
   * Mark all messages in chat as read for a user
   */
  static async markChatAsRead(
    chatId: string,
    userId: string
  ): Promise<void> {
    const chat = await this.getChat(chatId);
    if (!chat) return;

    // Get unread count for this user
    const unreadCount = chat.unreadCount[userId] || 0;

    if (unreadCount === 0) return;

    const batch = writeBatch(db);
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);

    // Reset unread count
    batch.update(chatRef, {
      [`unreadCount.${userId}`]: 0,
    });

    // Update user chat index
    const userChatRef = doc(
      db,
      COLLECTIONS.USER_CHATS,
      userId,
      "chats",
      chatId
    );
    batch.update(userChatRef, {
      unreadCount: 0,
    });

    await batch.commit();
  }

  /**
   * Set typing status
   */
  static async setTypingStatus(
    chatId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void> {
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);
    await updateDoc(chatRef, {
      [`typing.${userId}`]: isTyping,
    });
  }

  /**
   * Listen to typing status in real-time
   */
  static subscribeToTypingStatus(
    chatId: string,
    callback: (typing: { [userId: string]: boolean }) => void
  ): () => void {
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);

    return onSnapshot(chatRef, (snapshot) => {
      const data = snapshot.data();
      callback(data?.typing || {});
    });
  }

  /**
   * Set user online status
   */
  static async setOnlineStatus(
    userId: string,
    online: boolean
  ): Promise<void> {
    const presenceRef = doc(db, COLLECTIONS.PRESENCE, userId);
    await setDoc(
      presenceRef,
      {
        userId,
        online,
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  /**
   * Get user online status
   */
  static async getOnlineStatus(userId: string): Promise<boolean> {
    const presenceRef = doc(db, COLLECTIONS.PRESENCE, userId);
    const presenceSnap = await getDoc(presenceRef);

    if (!presenceSnap.exists()) {
      return false;
    }

    const data = presenceSnap.data() as Presence;
    return data.online;
  }

  /**
   * Listen to user online status in real-time
   */
  static subscribeToOnlineStatus(
    userId: string,
    callback: (online: boolean) => void
  ): () => void {
    const presenceRef = doc(db, COLLECTIONS.PRESENCE, userId);

    return onSnapshot(presenceRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(false);
        return;
      }

      const data = snapshot.data() as Presence;
      callback(data.online);
    });
  }

  /**
   * Get unread count for a specific chat and user
   */
  static async getUnreadCount(
    chatId: string,
    userId: string
  ): Promise<number> {
    const chat = await this.getChat(chatId);
    if (!chat) return 0;

    return chat.unreadCount[userId] || 0;
  }

  /**
   * Get total unread count across all chats for a user
   */
  static async getTotalUnreadCount(
    userId: string,
    chatType?: ChatType
  ): Promise<number> {
    const userChats = await this.getUserChats(userId, chatType);
    return userChats.reduce(
      (total, chat) => total + (chat.unreadCount[userId] || 0),
      0
    );
  }

  /**
   * Delete a chat
   */
  static async deleteChat(chatId: string): Promise<void> {
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);
    await deleteDoc(chatRef);

    // Note: User chat indexes should be cleaned up via Cloud Function
    // or manually when user accesses their chat list
  }
}

