# 🔌 API Structure & Data Flow

BuyOrSell uses a strictly typed, three-layer architecture for all backend communications.

## 1. The Service Layer (`app/api/`)
Each domain (Ads, Categories, etc.) has its own directory in `app/api/` containing:

- **`index.ts`**: Defines standard Query Keys and Endpoint paths.
  - Example: `categoriesQueries.categories.endpoint = "/categories"`
- **`*.services.ts`**: Contains pure Axios functions for each endpoint.
  - Example: `getCategoriesTree()` returns a Promise typed with an interface.

## 2. The Hook Layer (`hooks/`)
Custom hooks bridge the Service Layer with the React Components using **TanStack Query**.

- **Files**: `useAds.ts`, `useCategories.ts`, etc.
- **Pattern**:
  - `useQuery` for fetching data (GET).
  - `useMutation` for creating/updating data (POST/PUT/DELETE).
- **Benefits**: Centralized caching, automatic revalidation, and standardized loading/error states across the whole app.

## 3. The Interface Layer (`interfaces/`)
All data moving through the services and hooks is strictly typed.

- **Files**: `ad.ts`, `categories.types.ts`, `user.ts`, etc.
- **Structure**:
  - `BaseModel`: Common fields like `_id`, `createdAt`.
  - `ApiResponse<T>`: Standardized wrapper for backend responses.
  - Feature-specific types (e.g., `SubCategory`, `PostAdPayload`).

## Flow Example: Fetching Ads
1. **Component** calls `useAds(params)`.
2. **Hook** (`useAds`) uses `adQueries.ads.Key` for caching and calls `getAds(params)`.
3. **Service** (`getAds`) executes an `axiosInstance.get("/ad")` request.
4. **Interface** ensures the returned JSON matches `GetLiveAdsResponse`.
5. **Component** receives `data`, `isLoading`, and `error`.
