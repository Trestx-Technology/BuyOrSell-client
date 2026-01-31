import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "../config";

export async function resolveTicket(
  ticketId: string,
  resolvedBy: string,
  resolutionNote?: string
): Promise<void> {
  const db = getFirebaseDb();
  const ticketRef = doc(db, "tickets", ticketId);
  
  const updates: any = {
    status: 'resolved',
    resolvedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  if (resolutionNote) {
    updates.resolutionNote = resolutionNote;
  }

  await updateDoc(ticketRef, updates);
}
