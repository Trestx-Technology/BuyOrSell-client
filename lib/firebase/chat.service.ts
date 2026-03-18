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


  static async findExistingChat(
    params: CreateChatParams,
  ): Promise<string | null> {
    try {
      const chatsRef = collection(this.db, COLLECTIONS.CHATS);

      // Search chats by participants and type
      const q = query(
        chatsRef,
        where("participants", "array-contains", params.participants[0]),
      );

      const snapshot = await getDocs(q);
      const existing = snapshot.docs.find((doc) => {
        const data = doc.data();

        // Check type
        if (data.type !== params.type) return false;

        // Check context for specific IDs (adId, organisationId, etc.) 
        // if they were provided in the params.context
        if (params.context) {
          for (const key in params.context) {
            if (data.context?.[key] !== params.context[key]) return false;
          }
        }

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

  static async createChat(params: CreateChatParams): Promise<string> {
    // 1. Check if a chat already exists using participants and type
    const existingId = await this.findExistingChat(params);
    if (existingId) {
      return existingId;
    }

    // Use auto-generated ID
    const chatsRef = collection(this.db, COLLECTIONS.CHATS);
    const chatDocRef = doc(chatsRef);
    const chatId = chatDocRef.id;

    // Initialize unread counts, typing status, and online status
    const unreadCount: UnreadCount = {};
    const typing: TypingStatus = {};
    const onlineStatus: OnlineStatus = {};
    const lastSeen: any = {};
    const jobProfiles: Record<string, string> = {};

    // Use participants (userIds) only
    params.participants.forEach((userId) => {
      unreadCount[userId] = 0;
      typing[userId] = false;
      onlineStatus[userId] = false;
      lastSeen[userId] = serverTimestamp();
    });

    // Populate jobProfiles for the initiator if provided
    const initiatorId = params.participants[0]; // Assuming first participant is initiator for now, or use a better logic
    // In reality, we should pass the initiator's UID explicitly or rely on auth.
    // For now, if jobProfileId is passed, map it to the first participant or match by type
    if (params.jobProfileId) {
       jobProfiles[initiatorId] = params.jobProfileId;
    }

    // Build base chat data object
    const chatData: Omit<Chat, "id"> = {
      type: params.type,
      title: params.title,
      titleAr: params.titleAr,
      image: params.image,
      participants: params.participants,
      participantDetails: params.participantDetails,
      jobProfiles,
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
      lastSeen,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      ...(params.context && { context: params.context }),
      ...(params.roles && { roles: params.roles }),
    };

    await setDoc(chatDocRef, chatData);

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

    // Sort by lastMessage.createdAt descending
    return chatsArr.sort((a, b) => {
      const timeA = this.getTimestampValue(a.lastMessage?.createdAt);
      const timeB = this.getTimestampValue(b.lastMessage?.createdAt);
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

        // Sort by lastMessage.createdAt descending
        chatsArr.sort((a, b) => {
          const timeA = this.getTimestampValue(a.lastMessage?.createdAt);
          const timeB = this.getTimestampValue(b.lastMessage?.createdAt);
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

      // 1. Reset unread count on the chat document
      await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0,
        updatedAt: serverTimestamp(),
      });

      // 2. Mark individual messages inside the chat as read
      await this.markMessagesAsRead(chatId, userId);
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  }

  /**
   * Mark individual messages as read inside a chat subcollection.
   */
  static async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    try {
      const messagesRef = collection(this.db, COLLECTIONS.CHATS, chatId, COLLECTIONS.MESSAGES);
      
      // Query for messages from others that are not yet marked as read
      // NOTE: Using "!=" might require a composite index if combined with other fields.
      // We'll use a safer approach: get latest messages and filter in-memory if few,
      // or just query for unread.
      const q = query(
        messagesRef,
        where("isRead", "==", false),
        limit(50) // Mark up to 50 at a time
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return;

      const batch = writeBatch(this.db);
      let updatedCount = 0;

      snapshot.docs.forEach((d) => {
        const data = d.data();
        // Only mark if I'm NOT the sender and haven't read it yet
        if (data.senderId !== userId && (!data.readBy || !data.readBy.includes(userId))) {
          batch.update(d.ref, {
             isRead: true,
             readBy: arrayUnion(userId)
          });
          updatedCount++;
        }
      });

      if (updatedCount > 0) {
        await batch.commit();
      }
    } catch (error) {
      console.error("Error in markMessagesAsRead:", error);
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
        [`lastSeen.${userId}`]: serverTimestamp(),
      });

      // Also mark individual messages as read when visiting the chat
      await this.markMessagesAsRead(chatId, userId);
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
        [`lastSeen.${userId}`]: serverTimestamp(),
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
