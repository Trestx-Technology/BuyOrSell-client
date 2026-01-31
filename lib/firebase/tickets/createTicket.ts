import { collection, doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { getFirebaseDb } from "../config";
import { ChatService } from "../chat.service";
import { CreateTicketParams, Ticket } from "./types";
import { ChatType } from "../types";

// Constant for support team ID - in a real app this might be a specific agent or a shared inbox ID
const SUPPORT_TEAM_ID = "support-team"; 

export async function createTicket(params: CreateTicketParams): Promise<Ticket> {
  const db = getFirebaseDb();
  
  // 1. Create a Chat for this ticket
  // We're using 'organisation' type for support tickets as it fits the B2C model better than 'dm'
  const chatId = await ChatService.createChat({
    type: "organisation" as ChatType, 
    title: `Ticket: ${params.subject}`,
    titleAr: `Ticket: ${params.subject}`,
    image: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/support-agent.svg", // Placeholder support icon
    participants: [params.userId, SUPPORT_TEAM_ID],
    participantDetails: {
      [params.userId]: {
         //Ideally we should fetch user details, but for chat creation minimal info is often okay
         // or we can update it later. 
         name: "User", 
         nameAr: "User",
         image: "",
         isVerified: false
      },
      [SUPPORT_TEAM_ID]: {
        name: "Support Team",
        nameAr: "Support Team",
        image: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/support-agent.svg",
        isVerified: true
      }
    }
  });

  // 2. Send initial message from user to populate the chat
  await ChatService.sendMessage({
    chatId,
    senderId: params.userId,
    text: params.message,
    type: "text"
  });

  // 3. Create Ticket Document
  const ticketRef = doc(collection(db, "tickets"));
  // Note: We use serverTimestamp for Firestore consistency
  
  const ticketData: any = { // Use any for initial write to handle serverTimestamp
    id: ticketRef.id,
    userId: params.userId,
    subject: params.subject,
    message: params.message,
    queryType: params.queryType,
    status: 'open',
    priority: params.priority || 'medium',
    chatId: chatId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    metadata: params.metadata || {}
  };

  await setDoc(ticketRef, ticketData);

  // Return the data as Ticket type (casting timestamps roughly)
  return {
    ...ticketData,
    createdAt: new Date(), 
    updatedAt: new Date()
  } as Ticket;
}
