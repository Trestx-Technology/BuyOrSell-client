import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDb } from "../config";
import { Ticket } from "./types";

export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  const db = getFirebaseDb();
  const ticketRef = doc(db, "tickets", ticketId);
  const snap = await getDoc(ticketRef);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() } as Ticket;
}
