# 🎫 Support Ticket System

The support ticket system is built on Firebase Firestore and provides a robust way for users to communicate with platform administrators for technical, billing, or feature-related inquiries.

---

## 🏗️ Architecture

The system is organized into two primary collections in Firestore:

1. **`tickets`**: Stores the ticket metadata (status, priority, query type, owner).
2. **`tickets/{ticketId}/messages`**: Sub-collection containing the actual conversation thread.

### Key Data Interfaces (`lib/firebase/tickets/types.ts`)

```typescript
interface Ticket {
  id: string;
  userId: string;
  subject: string;
  queryType:
    | "technical"
    | "billing"
    | "account"
    | "feature_request"
    | "bug_report"
    | "custom_planning"
    | "other";
  status: "open" | "in_progress" | "waiting_for_user" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Lifecycle & Logic

### 1. Ticket Creation

- **Trigger**: Handled by the `useCreateTicket` hook.
- **Auto-tagging**: System captures `userAgent` and `platform` metadata during creation for better debugging.
- **Enterprise Flow**: If `type=custom_planning` is passed in the URL, the form is automatically:
  - Set to **Urgent** priority.
  - Tagged with the `custom_planning` query type.
  - Pre-filled with a custom requirement template.

### 2. Status Management

- **`open`**: Default state upon creation.
- **`in_progress`**: Marked when an admin views or responds.
- **`resolved`**: Marked when the issue is settled (requires resolution note).
- **`closed`**: Archive state (no further replies allowed).

### 3. Real-time Communication

The system uses Firestore's `onSnapshot` inside `useTicket` and `useUserTickets` hooks to provide a lag-free messaging experience without manual refreshing.

---

## 🛠️ Components & Hooks

- **`CreateTicketForm`**: The primary entry point for users to submit requests.
- **`useTickets`**: A comprehensive hook providing:
  - `createTicket()`: Mutation to launch new threads.
  - `useUserTickets(userId)`: Fetches the user's ticket history.
  - `useTicket(ticketId)`: Fetches a single ticket with its conversation.
  - `useTicketStats(userId)`: Provides dashboard summaries (Open vs Resolved counts).

---

## 🎯 Enterprise Highlighting

For administrators, `custom_planning` tickets are highlighted in the admin dashboard. These tickets bypass the standard queue and are flagged for "Administration Review" to ensure business-critical requests are handled immediately.
