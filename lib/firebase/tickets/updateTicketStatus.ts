import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "../config";
import { TicketStatus } from "./types";

export async function updateTicketStatus(
  ticketId: string, 
  status: TicketStatus,
  userId: string // For logging/auth check if needed, or identifying who made the change
): Promise<void> {
  const db = getFirebaseDb();
  const ticketRef = doc(db, "tickets", ticketId);
  
  const updates: any = {
    status,
    updatedAt: serverTimestamp()
  };

  // Set timestamps based on status
  if (status === 'resolved') {
    updates.resolvedAt = serverTimestamp();
  } else if (status === 'closed') {
    updates.closedAt = serverTimestamp();
  } else if (status === 'open' || status === 'in_progress') {
     // If reopened, maybe clear resolvedAt/closedAt?
     // The requirements for reopenTicket usually handle this, but generic status update might need it too.
     updates.resolvedAt = null;
     updates.closedAt = null;
  }

  await updateDoc(ticketRef, updates);
  
  // Potential: Add system message to the chat about status change?
}
