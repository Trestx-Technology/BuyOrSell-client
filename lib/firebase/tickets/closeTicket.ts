import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "../config";

export async function closeTicket(
  ticketId: string,
  closedBy: string
): Promise<void> {
  const db = getFirebaseDb();
  const ticketRef = doc(db, "tickets", ticketId);
  
  await updateDoc(ticketRef, {
    status: 'closed',
    closedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}
