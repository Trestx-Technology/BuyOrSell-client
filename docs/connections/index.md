# Connections & Messaging Logic

This document explains the "Connection" system and how it acts as a gatekeeper for user-to-user messaging.

## 1. Connection-Based Messaging

In the BuyOrSell platform, messaging is not open by default for privacy and spam prevention.

- **Rule**: You must be **connected** with a user (Accepted status) to initiate a chat.
- **Verification**: The system uses the `useCanChat(userId)` hook to check eligibility before allowing the message box to open.

## 2. Connection Lifecycle

### Sending a Request

- **Hook**: `useSendConnectionRequest`.
- A user sends a request to another user. The status is `PENDING` for the receiver.
- Total sent requests can be viewed via `useSentRequests`.

### Receiving a Request

- The receiver sees invitations via `useReceivedRequests`.
- They can choose to:
  - **Accept** (`useAcceptConnectionRequest`): Status moves to `ACCEPTED`, and both users can now message each other.
  - **Reject** (`useRejectConnectionRequest`): Request is dismissed.

### Managing Connections

- Users can view their full network via `useMyConnections`.
- **Removal**: Either party can remove a connection at any time (`useRemoveConnection`), which revokes the ability to start _new_ chats.

## 3. Connection Levels

The system tracks shared network depth via `useConnectionLevel`.

- **1st Degree**: Directly connected.
- **2nd Degree**: Connected through a mutual friend.
- This logic is used to suggest potential connections in the "People You May Know" section.

## 4. Technical Implementation

- **Direct Gatekeeper**: `useCanChat` - This is the primary hook used in the UI to disable/enable the "Message" button on profiles or ads.
- **API Cache**: `queryClient.invalidateQueries` is used extensively in `useConnections.ts` to ensure that as soon as a request is accepted, the "Message" button becomes active without a page refresh.
- **Source Code**: `hooks/useConnections.ts` / `app/api/connections/connections.services.ts`.
