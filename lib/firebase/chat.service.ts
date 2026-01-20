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
  increment,
  writeBatch,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";
import {
  Chat,
  Message,
  Presence,
  CreateChatParams,
  SendMessageParams,
  ChatType,
  UnreadCount,
  TypingStatus,
  OnlineStatus,
} from "./types";

// Collection names
const COLLECTIONS = {
  USERS: "users",
  CHATS: "chats",
  MESSAGES: "messages",
  PRESENCE: "presence",
} as const;

/**
 * Chat Service
 * Handles all chat-related Firebase operations
 */

export class ChatService {
  // Use getter function instead of direct import
  private static get db() {
    return getFirebaseDb();
  }

  /**
   * Generate a prefixed chat ID based on chat type
   */
  private static generateChatId(type: ChatType): string {
    const prefix = `${type}_`;
    const randomId = doc(collection(this.db, COLLECTIONS.CHATS)).id;
    return `${prefix}${randomId}`;
  }

  /**
   * Create a new chat
   */
  static async createChat(params: CreateChatParams): Promise<string> {
    // Generate prefixed chat ID
    const chatId = this.generateChatId(params.type);
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);

    // Initialize unread counts, typing status, and online status
    const unreadCount: UnreadCount = {};
    const typing: TypingStatus = {};
    const onlineStatus: OnlineStatus = {};

    params.participants.forEach((userId) => {
      unreadCount[userId] = 0;
      typing[userId] = false;
      onlineStatus[userId] = false;
    });

    // Build base chat data object
    const chatData: Omit<Chat, "id"> = {
      type: params.type,
      title: params.title,
      titleAr: params.titleAr,
      image: params.image,
      participants: params.participants,
      participantDetails: params.participantDetails,
      lastMessage: {
        text: "",
        senderId: "",
        createdAt: serverTimestamp() as Timestamp,
        type: "text",
      },
      unreadCount,
      typing,
      onlineStatus,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      ...(params.adId && { adId: params.adId }),
      ...(params.organisationId && { organisationId: params.organisationId }),
    };

    await setDoc(chatRef, chatData);

    // Create user chat index entries for all participants
    // Path: users/{userId}/chats/{chatId}
    const batch = writeBatch(this.db);
    params.participants.forEach((userId) => {
      const userChatRef = doc(
        this.db,
        COLLECTIONS.USERS,
        userId,
        "chats",
        chatId,
      );
      batch.set(userChatRef, {
        chatId,
        type: params.type,
        lastMessage: {
          text: "",
          createdAt: serverTimestamp(),
        },
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
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      return null;
    }

    return { id: chatSnap.id, ...chatSnap.data() } as Chat;
  }

  /**
   * Get all chats for a user filtered by chat type
   * Reads from: users/{userId}/chats
   */
  static async getUserChats(userId: string, type?: ChatType): Promise<Chat[]> {
    const userChatsRef = collection(
      this.db,
      COLLECTIONS.USERS,
      userId,
      "chats",
    );

    let q;

    if (type) {
      q = query(
        userChatsRef,
        where("type", "==", type),
        orderBy("updatedAt", "desc"),
      );
    } else {
      q = query(userChatsRef, orderBy("updatedAt", "desc"));
    }

    const snapshot = await getDocs(q);
    const chatIds = snapshot.docs.map((doc) => doc.data().chatId);

    if (chatIds.length === 0) {
      return [];
    }

    // Fetch full chat documents
    // Note: In a production app with many chats, you might want to rely on the index data
    // or batch fetch to avoid N+1 reads. For now, fetching each is reliable.
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
   * Listens to: users/{userId}/chats
   */
  static subscribeToUserChats(
    userId: string,
    type: ChatType | undefined,
    callback: (chats: Chat[]) => void,
    onError?: (error: any) => void,
  ): () => void {
    const userChatsRef = collection(
      this.db,
      COLLECTIONS.USERS,
      userId,
      "chats",
    );

    let q;

    if (type) {
      q = query(
        userChatsRef,
        where("type", "==", type),
        orderBy("updatedAt", "desc"),
      );
    } else {
      q = query(userChatsRef, orderBy("updatedAt", "desc"));
    }

    return onSnapshot(
      q,
      async (snapshot) => {
        const chatIds = snapshot.docs.map((doc) => doc.data().chatId);
        const chats: Chat[] = [];

        // Note: This makes N reads every time the list updates.
        // Consider optimizing if list grows large.
        for (const chatId of chatIds) {
          const chat = await this.getChat(chatId);
          if (chat) {
            chats.push(chat);
          }
        }

        callback(chats);
      },
      (error) => {
        console.error("Error in user chats subscription:", error);
        if (onError) {
          onError(error);
        }
      },
    );
  }

  /**
   * Send a message
   */
  static async sendMessage(params: SendMessageParams): Promise<string> {
    const { chatId, senderId, text, type, userImage, coordinates, fileUrl } =
      params;

    // Create message
    const messagesRef = collection(
      this.db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES,
    );
    const messageRef = doc(messagesRef);
    const messageId = messageRef.id;

    const messageData: Omit<Message, "id"> = {
      chatId,
      senderId,
      text,
      type,
      isRead: false,
      readBy: [],
      timeStamp: serverTimestamp() as Timestamp,
      createdAt: serverTimestamp() as Timestamp,
      ...(userImage && { userImage }),
      ...(coordinates && { coordinates }),
      ...(fileUrl && { fileUrl }),
    };

    await setDoc(messageRef, messageData);

    // Update chat document
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
    const chat = await this.getChat(chatId);

    if (chat) {
      const batch = writeBatch(this.db);

      // Update chat last message
      batch.update(chatRef, {
        lastMessage: {
          text:
            type === "text" ? text : type === "location" ? "Location" : "File",
          senderId,
          createdAt: serverTimestamp(),
          type,
        },
        updatedAt: serverTimestamp(),
      });

      // Update unread counts and user indexes for all participants
      chat.participants.forEach((participantId) => {
        // Path: users/{userId}/chats/{chatId}
        const userChatRef = doc(
          this.db,
          COLLECTIONS.USERS,
          participantId,
          "chats",
          chatId,
        );

        if (participantId !== senderId) {
          // Increment unread for others
          batch.update(chatRef, {
            [`unreadCount.${participantId}`]: increment(1),
          });

          // Update user chat index for receiver
          batch.update(userChatRef, {
            unreadCount: increment(1),
            lastMessage: {
              text:
                type === "text"
                  ? text
                  : type === "location"
                    ? "Location"
                    : "File",
              createdAt: serverTimestamp(),
            },
            updatedAt: serverTimestamp(),
          });
        } else {
          // Update user chat index for sender (no unread increment)
          batch.update(userChatRef, {
            lastMessage: {
              text:
                type === "text"
                  ? text
                  : type === "location"
                    ? "Location"
                    : "File",
              createdAt: serverTimestamp(),
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
    limitCount: number = 50,
  ): Promise<Message[]> {
    const messagesRef = collection(
      this.db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES,
    );
    const q = query(
      messagesRef,
      orderBy("createdAt", "desc"), // Changed to createdAt based on schema
      limit(limitCount),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Message)
      .reverse(); // Reverse to get chronological order
  }

  /**
   * Listen to messages in real-time
   */
  static subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void,
    limitCount: number = 50,
  ): () => void {
    const messagesRef = collection(
      this.db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES,
    );
    const q = query(
      messagesRef,
      orderBy("createdAt", "desc"), // Changed to createdAt
      limit(limitCount),
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as Message)
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
    userId: string,
  ): Promise<void> {
    const messageRef = doc(
      this.db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES,
      messageId,
    );

    // Schema only has isRead boolean, not readBy array update in screenshot
    // But good to keep tracking if possible. Schema says isRead: boolean.
    // We'll update isRead to true.
    await updateDoc(messageRef, {
      isRead: true,
      readBy: arrayUnion(userId), // Optional given simplified schema but usually good practice
    });
  }

  /**
   * Mark all messages in chat as read for a user
   */
  static async markChatAsRead(chatId: string, userId: string): Promise<void> {
    const chat = await this.getChat(chatId);
    if (!chat) return;

    // Get unread count for this user
    const unreadCount = chat.unreadCount[userId] || 0;

    if (unreadCount === 0) return;

    const batch = writeBatch(this.db);
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);

    // Reset unread count in main chat
    batch.update(chatRef, {
      [`unreadCount.${userId}`]: 0,
    });

    // Reset unread count in user's chat index
    // Path: users/{userId}/chats/{chatId}
    const userChatRef = doc(
      this.db,
      COLLECTIONS.USERS,
      userId,
      "chats",
      chatId,
    );

    // We update because it should exist
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
    isTyping: boolean,
  ): Promise<void> {
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
    await updateDoc(chatRef, {
      [`typing.${userId}`]: isTyping,
    });
  }

  /**
   * Listen to typing status in real-time
   */
  static subscribeToTypingStatus(
    chatId: string,
    callback: (typing: { [userId: string]: boolean }) => void,
  ): () => void {
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);

    return onSnapshot(chatRef, (snapshot) => {
      const data = snapshot.data();
      callback(data?.typing || {});
    });
  }

  /**
   * Set user online status
   */
  static async setOnlineStatus(userId: string, online: boolean): Promise<void> {
    const presenceRef = doc(this.db, COLLECTIONS.PRESENCE, userId);
    await setDoc(
      presenceRef,
      {
        userId,
        online,
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  /**
   * Get user online status
   */
  static async getOnlineStatus(userId: string): Promise<boolean> {
    const presenceRef = doc(this.db, COLLECTIONS.PRESENCE, userId);
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
    callback: (online: boolean) => void,
  ): () => void {
    const presenceRef = doc(this.db, COLLECTIONS.PRESENCE, userId);

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
  static async getUnreadCount(chatId: string, userId: string): Promise<number> {
    const chat = await this.getChat(chatId);
    if (!chat) return 0;

    return chat.unreadCount[userId] || 0;
  }

  /**
   * Get total unread count across all chats for a user
   */
  static async getTotalUnreadCount(
    userId: string,
    type?: ChatType,
  ): Promise<number> {
    const userChats = await this.getUserChats(userId, type);
    return userChats.reduce(
      (total, chat) => total + (chat.unreadCount[userId] || 0),
      0,
    );
  }

  /**
   * Delete a chat
   */
  static async deleteChat(chatId: string): Promise<void> {
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
    const chat = await this.getChat(chatId);

    if (chat) {
      // Delete chat document
      await deleteDoc(chatRef);

      // Clean up user chat indexes
      const promises = chat.participants.map((participantId) => {
        const userChatRef = doc(
          this.db,
          COLLECTIONS.USERS,
          participantId,
          "chats",
          chatId,
        );
        return deleteDoc(userChatRef);
      });

      await Promise.all(promises);
    }
  }

  /**
   * Edit a message
   */
  static async editMessage(
    chatId: string,
    messageId: string,
    newText: string,
  ): Promise<void> {
    const messageRef = doc(
      this.db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES,
      messageId,
    );

    await updateDoc(messageRef, {
      text: newText,
      updatedAt: serverTimestamp(),
      isEdited: true,
    });
  }

  /**
   * Delete a message
   */
  static async deleteMessage(chatId: string, messageId: string): Promise<void> {
    const messageRef = doc(
      this.db,
      COLLECTIONS.CHATS,
      chatId,
      COLLECTIONS.MESSAGES,
      messageId,
    );

    await deleteDoc(messageRef);
  }
}
