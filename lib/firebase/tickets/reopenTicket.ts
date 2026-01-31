import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "../config";

export async function reopenTicket(
  ticketId: string,
  userId: string,
  reason?: string
): Promise<void> {
  const db = getFirebaseDb();
  const ticketRef = doc(db, "tickets", ticketId);
  
  // Logic to reopen: clear resolution timestamps, set back to open
  await updateDoc(ticketRef, {
    status: 'open',
    resolvedAt: null,
    closedAt: null,
    updatedAt: serverTimestamp()
  });
  
  // If 'reason' is provided, ideally we would log it or send as a message. 
  // For now, minimal implementation as per schema constraints.
}
