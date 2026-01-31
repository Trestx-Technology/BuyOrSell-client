"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import {
  Ticket,
  TicketFilters,
  CreateTicketParams,
  TicketStatus,
} from "@/lib/firebase/tickets/types";
import { createTicket } from "@/lib/firebase/tickets/createTicket";
import { updateTicketStatus } from "@/lib/firebase/tickets/updateTicketStatus";
import { resolveTicket } from "@/lib/firebase/tickets/resolveTicket";
import { closeTicket } from "@/lib/firebase/tickets/closeTicket";
import { reopenTicket } from "@/lib/firebase/tickets/reopenTicket";

export const useCreateTicket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (params: CreateTicketParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const ticket = await createTicket(params);
      return ticket;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTicket: create, isLoading, error };
};

export const useUserTickets = (userId: string, filters?: TicketFilters) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setTickets([]);
      setIsLoading(false);
      return;
    }

    const db = getFirebaseDb();
    const ticketsRef = collection(db, "tickets");
    let q = query(ticketsRef, where("userId", "==", userId));

    if (filters?.status && filters.status.length > 0) {
      q = query(q, where("status", "in", filters.status));
    }

    if (filters?.queryType && filters.queryType.length > 0) {
      q = query(q, where("queryType", "in", filters.queryType));
    }

    const sortBy = filters?.sortBy || "createdAt";
    const order = filters?.order || "desc";
    q = query(q, orderBy(sortBy, order));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTickets = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              // Convert timestamps to Dates if needed, or keep as is.
              // Usually UI expects Dates.
              createdAt:
                doc.data().createdAt?.toDate?.() || doc.data().createdAt,
              updatedAt:
                doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
              resolvedAt:
                doc.data().resolvedAt?.toDate?.() || doc.data().resolvedAt,
              closedAt: doc.data().closedAt?.toDate?.() || doc.data().closedAt,
            }) as Ticket,
        );
        setTickets(fetchedTickets);
        setIsLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err as Error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId, JSON.stringify(filters)]);

  const refetch = () => {
    // No-op for realtime listener
  };

  return { tickets, isLoading, error, refetch };
};

export const useTicket = (ticketId: string) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const db = getFirebaseDb();
    const unsubscribe = onSnapshot(
      doc(db, "tickets", ticketId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTicket({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
            resolvedAt: data.resolvedAt?.toDate?.() || data.resolvedAt,
            closedAt: data.closedAt?.toDate?.() || data.closedAt,
          } as Ticket);
        } else {
          setTicket(null);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err as Error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [ticketId]);

  const updateStatus = async (status: TicketStatus, userId: string) => {
    await updateTicketStatus(ticketId, status, userId);
  };

  const resolve = async (userId: string, note?: string) => {
    await resolveTicket(ticketId, userId, note);
  };

  const close = async (userId: string) => {
    await closeTicket(ticketId, userId);
  };

  const reopen = async (userId: string, reason?: string) => {
    await reopenTicket(ticketId, userId, reason);
  };

  return { ticket, isLoading, error, updateStatus, resolve, close, reopen };
};

export const useTicketStats = (userId: string) => {
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    total: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const db = getFirebaseDb();
    const q = query(collection(db, "tickets"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let open = 0;
      let inProgress = 0;
      let resolved = 0;
      let closed = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const status = data.status;
        if (status === "open") open++;
        else if (status === "in_progress") inProgress++;
        else if (status === "resolved") resolved++;
        else if (status === "closed") closed++;
      });

      setStats({
        open,
        inProgress,
        resolved,
        closed,
        total: snapshot.size,
      });
    });

    return () => unsubscribe();
  }, [userId]);

  return stats;
};
