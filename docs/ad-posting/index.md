# Ad Posting Logic & Flow

This document details the complete end-to-end flow of posting an ad (or job) on the BuyOrSell platform, covering category selection, form generation, and submission.

## Post Ad Lifecycle

The ad posting process is a multi-step flow managed by a combination of server-side routes and client-side stores.

### 1. Step 1: Category Selection

- **Route**: `/[locale]/post-ad/select`
- **Component**: `SelectCategoryContent`
- **Logic**:
  - Users navigate through a hierarchical category tree (Primary > Sub > Leaf).
  - The `useAdPostingStore` (Zustand) tracks the selection path in a `categoryArray` for breadcrumbs.
  - Selecting a "Leaf" category (a category with no further sub-categories) triggers a redirect to the details page.

### 2. Step 2: Form Initialization

- **Route**: `/[locale]/post-ad/details/[leafCategoryId]`
- **Component**: `LeafCategoryContent`
- **Hydration**:
  - If a user arrives via "AI Ad Generation", the URL contains `prompt`, `title`, and `images`.
  - The component hydrates the form state from these parameters automatically.
- **Dynamic Schema**:
  - The `createPostAdSchema(category)` utility generates a Zod schema in real-time based on the specific fields defined for that category in the database.

### 3. Step 3: Detailed Information Entry

The form is divided into several logical sections:

#### A. Basic Information

- **Organization**: Users choose to post as an individual or on behalf of a verified organization. (Jobs must be posted via an organization).
- **Title & Description**: Manual entry or AI-assisted generation.
- **Media**: `ImageGallery` (max 8 images) and `VideoUpload`.
- **Location**: `MapComponent` interfaces with Google Maps to extract full address objects (state, city, zip, coordinates).

#### B. Dynamic Category Fields

- Custom fields fetched from the Category API are rendered via `DynamicFieldRenderer`.
- **Dependencies**: Some fields only appear based on previous selections (e.g., "Model" appears after "Make" is selected). This is managed by `shouldShowField` logic.

#### C. Pricing & Deals

- **Featured Ad**: If the user's subscription allows, they can toggle `isFeatured`. The availability is checked via `getAvailableFeaturedAdsCount`.
- **Deals**: Users can toggle a "Deal" status, providing a discounted price and expiration date.
- **Exchange**: Option to offer the item for exchange/barter.

### 4. Step 4: Eligibility & Validation

Before submission, the system performs two final checks:

1.  **Zod Validation**: Ensures all required client-side fields meet the schema (phone formats, price ranges, required selects).
2.  **Ad Availability**: Uses the `useAdAvailability` hook to ensure the user has sufficient "slots" in their active subscription plan to post in this category.

### 5. Step 5: Submission & Success

- **Mutation**: `useCreateAd` asynchronously sends the `PostAdPayload` to the `/ads` or `/jobs` endpoint.
- **Payload Processing**: `extraFields` are formatted into the API's expected name/type/value structure.
- **Final Step**: Upon a successful `201 Created` response, the user is redirected to `/[locale]/success?id=...`.

---

## Technical Stack

- **State Management**: Zustand (`useAdPostingStore`) for persistent navigation state.
- **Form Management**: `react-hook-form` for performance and typed inputs.
- **Validation**: `Zod` for dynamic, category-specific schemas.
- **Maps**: Google Maps JS API for location intelligence.

## Posting Statuses

- **`idle`**: User filling the form.
- **`loading`**: Data being submitted to server.
- **`success`**: Ad created, redirecting.
- **`error`**: Submission failed (e.g., network error or validation failure on server).
