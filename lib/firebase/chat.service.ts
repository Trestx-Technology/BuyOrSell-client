"use client";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  increment,
  writeBatch,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";
import {
  Chat,
  Message,
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
} as const;

/**
 * Chat Service
 * Handles all chat-related Firebase operations
 */

export class ChatService {
  /**
   * Helper to get numeric timestamp from various formats
   */
  private static getTimestampValue(
    timestamp:
      | Timestamp
      | Date
      | { seconds: number; nanoseconds: number }
      | string
      | number
      | undefined,
  ): number {
    if (!timestamp) return 0;
    if (timestamp instanceof Date) return timestamp.getTime();
    if (typeof timestamp === "number") return timestamp;
    if (typeof timestamp === "string") return new Date(timestamp).getTime();
    if ("seconds" in timestamp && typeof timestamp.seconds === "number") {
      return timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000;
    }
    if (
      "toDate" in timestamp &&
      typeof (timestamp as any).toDate === "function"
    ) {
      return (timestamp as any).toDate().getTime();
    }
    return 0;
  }

  // Use getter function instead of direct import
  private static get db() {
    return getFirebaseDb();
  }

  /**
   * Get user by ID
   */
  static async getUser(userId: string): Promise<any> {
    const userRef = doc(this.db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    return userSnap.data();
  }

  /**
   * Generate a prefixed chat ID based on chat type, typeId and participants
   */
  static generateChatId(
    type: ChatType,
    typeId: string,
    participants: string[],
  ): string {
    const sortedParticipants = [...participants].sort();
    
    // Safety check: Avoid double prefixing (e.g., "ad_ad_...")
    // If typeId already starts with the type prefix, we remove it
    let cleanTypeId = typeId;
    if (typeId.startsWith(`${type}_`)) {
      cleanTypeId = typeId.substring(type.length + 1);
    }
    
    return `${type}_${cleanTypeId}_${sortedParticipants[0]}_${sortedParticipants[1]}`;
  }

  /**
   * Find an existing chat by participants and type/typeId
   */
  static async findExistingChat(
    params: CreateChatParams,
  ): Promise<string | null> {
    try {
      const chatsRef = collection(this.db, COLLECTIONS.CHATS);

      // We query by participants[0] and filter locally to avoid complex indexes
      const q = query(
        chatsRef,
        where("participants", "array-contains", params.participants[0]),
      );

      const snapshot = await getDocs(q);
      const existing = snapshot.docs.find((doc) => {
        const data = doc.data();

        // Check type
        if (data.type !== params.type) return false;

        // Check type-specific IDs
        if (params.type === "ad" && data.adId !== params.adId) return false;
        if (
          params.type === "organisation" &&
          data.organisationId !== params.organisationId
        )
          return false;

        // Check if participants match exactly
        const docParticipants = (data.participants as string[]) || [];
        if (docParticipants.length !== params.participants.length) return false;

        return params.participants.every((p) => docParticipants.includes(p));
      });

      return existing ? existing.id : null;
    } catch (error) {
      console.error("Error finding existing chat:", error);
      return null;
    }
  }

  /**
   * Create a new chat
   */
  static async createChat(params: CreateChatParams): Promise<string> {
    // 1. Check if a chat already exists using participants and typeId
    // This catches old random IDs as well as new deterministic ones
    const existingId = await this.findExistingChat(params);
    if (existingId) {
      return existingId;
    }

    // Determine the typeId for the chatId generation
    const typeId = params.adId || params.organisationId || "direct";

    // Generate deterministic chat ID
    const chatId = this.generateChatId(
      params.type,
      typeId,
      params.participants,
    );
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
        id: "",
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
      ...(params.initiatorId && { initiatorId: params.initiatorId }),
    };

    await setDoc(chatRef, chatData);

    // Index entries no longer strictly required as we query the main collection directly
    // This simplifies the logic and makes it more reliable.

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

    return { ...chatSnap.data(), id: chatSnap.id } as Chat;
  }

  /**
   * Get all chats for a user filtered by chat type
   * Reads from: users/{userId}/chats
   */
  static async getUserChats(userId: string, type?: ChatType): Promise<Chat[]> {
    const chatsRef = collection(this.db, COLLECTIONS.CHATS);

    // Use simple query to avoid indexing issues and missing field exclusions
    const q = query(chatsRef, where("participants", "array-contains", userId));

    const snapshot = await getDocs(q);
    let chatsArr = snapshot.docs.map((doc) => {
      const data = doc.data();
      // Ensure participants exists and is an array
      if (!data.participants) {
        console.warn(`Chat ${doc.id} missing participants field`);
      }
      return { ...data, id: doc.id } as Chat;
    });

    // Filter by type in-memory
    if (type) {
      chatsArr = chatsArr.filter((c) => c.type === type);
    }

    // Sort by updatedAt descending with fallback to lastMessage.createdAt
    return chatsArr.sort((a, b) => {
      const timeA =
        this.getTimestampValue(a.updatedAt) ||
        this.getTimestampValue(a.lastMessage?.createdAt);
      const timeB =
        this.getTimestampValue(b.updatedAt) ||
        this.getTimestampValue(b.lastMessage?.createdAt);
      return timeB - timeA;
    });
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
    const chatsRef = collection(this.db, COLLECTIONS.CHATS);

    // Use simple query to avoid missing field exclusions and composite index requirements
    const q = query(chatsRef, where("participants", "array-contains", userId));

    return onSnapshot(
      q,
      (snapshot) => {
        let chatsArr = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as Chat,
        );

        // Filter by type in-memory
        if (type) {
          chatsArr = chatsArr.filter((c) => c.type === type);
        }

        // Sort by updatedAt descending with fallback to lastMessage.createdAt
        chatsArr.sort((a, b) => {
          const timeA =
            this.getTimestampValue(a.updatedAt) ||
            this.getTimestampValue(a.lastMessage?.createdAt);
          const timeB =
            this.getTimestampValue(b.updatedAt) ||
            this.getTimestampValue(b.lastMessage?.createdAt);
          return timeB - timeA;
        });

        callback(chatsArr);
      },
      (error) => {
        console.error("Error in user chats subscription:", error);
        if (onError) onError(error);
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
      // Update chat last message and unread counts for all participants except sender
      const updates: any = {
        lastMessage: {
          id: messageId,
          text:
            type === "text" ? text : type === "location" ? "Location" : "File",
          senderId,
          createdAt: serverTimestamp(),
          type,
        },
        updatedAt: serverTimestamp(),
      };

      chat.participants?.forEach((participantId) => {
        if (participantId !== senderId) {
          updates[`unreadCount.${participantId}`] = increment(1);
        }
      });

      await updateDoc(chatRef, updates);
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

    // Query without orderBy to handle legacy messsages missing fields
    const q = query(messagesRef, limit(limitCount));

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Message,
    );

    // Sort chronologically in memory
    return messages.sort((a, b) => {
      const timeA =
        this.getTimestampValue(a.createdAt) ||
        this.getTimestampValue(a.timeStamp);
      const timeB =
        this.getTimestampValue(b.createdAt) ||
        this.getTimestampValue(b.timeStamp);
      return timeA - timeB;
    });
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

    // Query without orderBy to handle missing fields
    const q = query(messagesRef, limit(limitCount));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id }) as Message,
      );

      // Sort chronologically in memory
      messages.sort((a, b) => {
        const timeA =
          this.getTimestampValue(a.createdAt) ||
          this.getTimestampValue(a.timeStamp);
        const timeB =
          this.getTimestampValue(b.createdAt) ||
          this.getTimestampValue(b.timeStamp);
        return timeA - timeB;
      });

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

    // Use updateDoc to ensure we only update existing chat documents
    await updateDoc(messageRef, {
      isRead: true,
      readBy: arrayUnion(userId),
    });
  }

  /**
   * Mark all messages in chat as read for a user
   */
  static async markChatAsRead(chatId: string, userId: string): Promise<void> {
    try {
      const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);

      // Use direct dot notation with updateDoc for most reliable map field update
      // This will only work if the document already exists, preventing partial docs.
      await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  }

  /**
   * Visit chat: Mark as online and read in a single combined operation
   * This follows the rule of updating the chat doc itself directly.
   */
  static async visitChat(chatId: string, userId: string): Promise<void> {
    try {
      const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
      // ONLY use updateDoc. If it fails, it means the chat hasn't been properly created yet
      // which prevents creating the empty "shadow" documents shown in the screenshot.
      await updateDoc(chatRef, {
        [`onlineStatus.${userId}`]: true,
        [`unreadCount.${userId}`]: 0,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error visiting chat:", error);
    }
  }

  /**
   * Set typing status
   */
  static async setTypingStatus(
    chatId: string,
    userId: string,
    isTyping: boolean,
  ): Promise<void> {
    try {
      const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
      await updateDoc(chatRef, {
        [`typing.${userId}`]: isTyping,
      });
    } catch (error) {
      console.error("Error setting typing status:", error);
    }
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
   * Set user online status within a specific chat
   */
  static async setChatOnlineStatus(
    chatId: string,
    userId: string,
    online: boolean,
  ): Promise<void> {
    try {
      const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
      await updateDoc(chatRef, {
        [`onlineStatus.${userId}`]: online,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error setting chat online status:", error);
    }
  }

  /**
   * Listen to user online status in a specific chat
   */
  static subscribeToChatOnlineStatus(
    chatId: string,
    callback: (onlineStatus: OnlineStatus) => void,
  ): () => void {
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);

    return onSnapshot(chatRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback({});
        return;
      }

      const data = snapshot.data() as Chat;
      callback(data.onlineStatus || {});
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
    await deleteDoc(chatRef);
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

    await setDoc(
      messageRef,
      {
        text: newText,
        updatedAt: serverTimestamp(),
        isEdited: true,
      },
      { merge: true },
    );

    // Update chat document if this was the last message
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      const chatData = chatSnap.data() as Chat;
      if (chatData.lastMessage?.id === messageId) {
        await updateDoc(chatRef, {
          "lastMessage.text": newText,
          updatedAt: serverTimestamp(),
        });
      }
    }
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

    // Update chat document if this was the last message
    const chatRef = doc(this.db, COLLECTIONS.CHATS, chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      const chatData = chatSnap.data() as Chat;
      if (chatData.lastMessage?.id === messageId) {
        // Find the next last message
        const messagesRef = collection(
          this.db,
          COLLECTIONS.CHATS,
          chatId,
          COLLECTIONS.MESSAGES,
        );
        // We limit to 2 because we just deleted one, but we need the new last one
        // Actually we don't know the order from just a simple query without orderBy
        // but getMessages sorts them.
        const allMessages = await this.getMessages(chatId, 10);
        const lastMsg = allMessages[allMessages.length - 1];

        if (lastMsg) {
          await updateDoc(chatRef, {
            lastMessage: {
              id: lastMsg.id,
              text: lastMsg.text,
              senderId: lastMsg.senderId,
              createdAt: lastMsg.createdAt,
              type: lastMsg.type,
            },
            updatedAt: serverTimestamp(),
          });
        } else {
          // No messages left
          await updateDoc(chatRef, {
            lastMessage: {
              id: "",
              text: "Message deleted",
              senderId: "",
              createdAt: serverTimestamp(),
              type: "text",
            },
            updatedAt: serverTimestamp(),
          });
        }
      }
    }
  }
}
