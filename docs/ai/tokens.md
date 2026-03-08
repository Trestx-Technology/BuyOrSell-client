# AI Token Management & Consumption

This document describes how AI tokens are managed, tracked, and consumed within the BuyOrSell platform.

## Overview

AI-powered features (like AI Search, Ad Generation, and Chat Assists) consume tokens from a user's wallet. The system provides a unified interface for checking balances and deducting tokens upon successful feature usage.

## 1. Token Lifecycle

### Service Layer (`ai-tokens.services.ts`)

Three primary operations are supported:

- **`getBalance`**: Fetches the current token count for the authenticated user.
- **`getPackages`**: Retrieves available token purchase packages for top-ups.
- **`consumeTokens`**: Deducts a specific number of tokens from the user's balance.

### React Query Hooks (`useAITokens.ts`)

- **`useAITokenBalance`**: Provides a reactive way to display the balance in the UI (e.g., Topbar or Sidebar).
- **`useConsumeTokens`**: A mutation to trigger token deduction. It automatically invalidates the balance query upon success to ensure a consistent UI.

---

## 2. Consumption Logic

### When are tokens consumed?

Tokens should be consumed **only after** a successful AI operation to prevent users from being charged for failed requests.

### Standard Credit Costs

The platform currently uses a standard cost model:

- **`CREDIT_COST`**: Typically **1 token** per request (defined in `AIFeaturesPopover.tsx`).

### Consumption Flow

1. **Balance Check**: Before executing an AI action, the system verifies `tokenBalance.data.tokensRemaining >= CREDIT_COST`.
2. **Insufficient Credits**: If the balance is too low, the `NoCreditsDialog` is displayed, redirecting the user to `/${locale}/ai-tokens` for top-ups.
3. **Execution**: The AI service (e.g., `AIService.proofreadMessage`) is called.
4. **Deduction**: On success, `consumeTokens({ tokens: CREDIT_COST, purpose: "chat_assistant" })` is executed via the `useConsumeTokens` mutation.

### Token Deduction via Subscriptions

Some subscription plans come with a monthly allowance of AI assists (`aiAvailable`). The backend handles priority, utilized subscription-based assists before dipping into the purchased token wallet.

---

## 3. Implementation Example (Chat Assistant)

```typescript
const { data: tokenBalance } = useAITokenBalance();
const { mutateAsync: consumeTokens } = useConsumeTokens();

const handleFeatureClick = async (feature) => {
  const currentBalance = tokenBalance?.data?.tokensRemaining ?? 0;

  if (currentBalance < CREDIT_COST) {
    setIsNoCreditsOpen(true); // Trigger NoCreditsDialog
    return;
  }

  try {
    const result = await AIService.proofreadMessage(currentMessage);

    // Deduct token locally and on server
    await consumeTokens({ tokens: CREDIT_COST, purpose: "chat_assistant" });

    onMessageGenerated(result);
  } catch (error) {
    console.error("AI action failed");
  }
};
```

## 4. UI Components

- **`NoCreditsDialog`**: A responsive modal that informs the user of their current balance vs. requirements and provides a CTA to purchase more tokens.
- **`AIFeaturesPopover`**: The primary entry point for AI assists in Chat and Help Centre, integrating balance checks and consumption triggers.
- **Top Bar Balance**: Displays the user's real-time token count, updating automatically whenever `consumeTokens` is called.
