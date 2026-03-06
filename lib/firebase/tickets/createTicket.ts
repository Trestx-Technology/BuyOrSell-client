import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "../config";
import { CreateTicketParams, Ticket } from "./types";

export async function createTicket(
  params: CreateTicketParams,
): Promise<Ticket> {
  const db = getFirebaseDb();

  // 1. Create Ticket Document in the top-level "tickets" collection
  const ticketRef = doc(collection(db, "tickets"));

  const ticketData: any = {
    id: ticketRef.id,
    userId: params.userId,
    subject: params.subject,
    message: params.message,
    queryType: params.queryType,
    status: "open",
    priority: params.priority || "medium",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    metadata: params.metadata || {},
  };

  await setDoc(ticketRef, ticketData);

  // 2. Store the initial message as a subcollection under the ticket: tickets/{ticketId}/messages
  const messagesRef = collection(db, "tickets", ticketRef.id, "messages");
  const messageRef = doc(messagesRef);

  await setDoc(messageRef, {
    id: messageRef.id,
    ticketId: ticketRef.id,
    senderId: params.userId,
    text: params.message,
    type: "text",
    isRead: false,
    readBy: [],
    createdAt: serverTimestamp(),
  });

  // Return the data as Ticket type
  return {
    ...ticketData,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Ticket;
}
