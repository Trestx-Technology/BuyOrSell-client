import { collection, query, where, orderBy, getDocs, Query } from "firebase/firestore";
import { getFirebaseDb } from "../config";
import { Ticket, TicketFilters } from "./types";

export async function getUserTickets(
  userId: string,
  filters?: TicketFilters
): Promise<Ticket[]> {
  const db = getFirebaseDb();
  const ticketsRef = collection(db, "tickets");
  
  // Base query: tickets for this user
  let q: Query = query(ticketsRef, where("userId", "==", userId));

  // Apply filters
  if (filters?.status && filters.status.length > 0) {
    q = query(q, where("status", "in", filters.status));
  }

  if (filters?.queryType && filters.queryType.length > 0) {
    q = query(q, where("queryType", "in", filters.queryType));
  }
  
  // Sort
  // Note: This requires a composite index in Firestore for userId + sortBy field
  const sortBy = filters?.sortBy || 'createdAt';
  const order = filters?.order || 'desc';
  
  q = query(q, orderBy(sortBy, order));

  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Ticket));
}
