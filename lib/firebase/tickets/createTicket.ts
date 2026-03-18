import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "../config";
import { CreateTicketParams, Ticket } from "./types";
import { ChatService } from "../chat.service";

export async function createTicket(
  params: CreateTicketParams,
): Promise<Ticket> {
  const db = getFirebaseDb();

  // 1. Create Ticket Document in the top-level "tickets" collection
  const ticketRef = doc(collection(db, "tickets"));
  const ticketId = ticketRef.id;

  const ticketData: any = {
    id: ticketId,
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

  // 2. Create a corresponding Chat for the ticket to handle real-time messaging
  try {
    const userData = await ChatService.getUser(params.userId);
    
    const chatId = await ChatService.createChat({
      type: "ticket",
      title: params.subject,
      titleAr: params.subject,
      image: "", 
      participants: [params.userId, "support_team"], 
      participantDetails: {
        [params.userId]: {
          name: userData?.firstName || "User",
          nameAr: userData?.firstName || "User",
          image: userData?.image || "",
          isVerified: !!userData?.emailVerified,
        },
        "support_team": {
          name: "Support Team",
          nameAr: "فريق الدعم",
          image: "/images/support-avatar.png", 
          isVerified: true,
        }
      },
      context: {
        ticketId: ticketId,
        initiatorId: params.userId,
      }
    });

    // 3. Send the initial message via ChatService
    await ChatService.sendMessage({
      chatId,
      senderId: params.userId,
      text: params.message,
      type: "text",
    });

  } catch (error) {
    console.error("Error creating chat for ticket:", error);
  }

  // Return the data as Ticket type
  return {
    ...ticketData,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Ticket;
}
