# Translations

Optimized, scalable translation system for the BuyOrSell application with a modular folder structure following the API pattern.

## Structure

```
translations/
├── index.ts                    # Main entry point with registry system
├── README.md                   # This documentation
├── auth/                       # Authentication feature
│   ├── index.ts               # Auth translations
│   └── types.ts               # Auth type definitions
├── home/                       # Home page feature
│   ├── index.ts               # Home translations
│   └── types.ts               # Home type definitions
├── ad/                         # Ad page feature
│   ├── index.ts               # Ad translations
│   └── types.ts               # Ad type definitions
├── common/                     # Shared/common translations
│   ├── index.ts               # Common translations
│   └── types.ts               # Common type definitions
└── types/                      # Global/shared types
    └── index.ts               # Global type exports
```

## Architecture

### Modular Folder Structure
- **Feature-based organization** - Each page/feature has its own folder (like `@app/api/`)
- **Separation of concerns** - Translations and types are co-located
- **Easy discovery** - Find translations for specific features quickly
- **Scalable** - Add new features by creating new folders

### Type Safety & Optimization
- **Fully typed** with TypeScript and compile-time checking
- **Shared utilities** in `@validations/utils.ts` reduce code duplication
- **Registry system** for automatic translation loading
- **Helper functions** for consistent translation creation

### Performance Optimizations
- **Reduced bundle size** through shared imports
- **Tree shaking friendly** structure
- **Lazy loading** support for large translation sets
- **Fallback system** with default locale support

## Usage

### In React Components (Client-side)

```tsx
import { useLocale } from '@/hooks/useLocale';

function MyComponent() {
  const { locale, localePath, t } = useLocale();

  return (
    <div>
      <h1>{t.auth.login.title}</h1>
      <Link href={localePath('/login')}>Login</Link>
    </div>
  );
}
```

### Direct Access (Server-side or utilities)

```ts
import { getTranslations, getTranslationNamespace } from '@/translations';

// Get all translations for a locale
const allTranslations = getTranslations('en-US');
const loginTitle = allTranslations.auth.login.title;

// Get specific namespace
const authTranslations = getTranslationNamespace('en-US', 'auth');
const signupTitle = authTranslations.signup.title;
```

## Adding New Feature Translations

### Step 1: Create Feature Folder

Create a new folder for your feature (e.g., `translations/user/`):

```bash
mkdir translations/user
```

### Step 2: Define Types

Create `translations/user/types.ts`:

```ts
export type UserTranslations = {
  profile: {
    title: string;
    edit: string;
    save: string;
  };
  settings: {
    title: string;
    notifications: string;
    privacy: string;
  };
};
```

### Step 3: Create Translations

Create `translations/user/index.ts`:

```ts
import { createTranslationNamespace } from '../../validations/utils';
import type { UserTranslations } from './types';

export const userTranslations = createTranslationNamespace<UserTranslations>({
  'en-US': {
    profile: {
      title: 'Profile',
      edit: 'Edit Profile',
      save: 'Save Changes',
    },
    settings: {
      title: 'Settings',
      notifications: 'Notifications',
      privacy: 'Privacy',
    },
  },
  'nl-NL': {
    profile: {
      title: 'Profiel',
      edit: 'Profiel bewerken',
      save: 'Wijzigingen opslaan',
    },
    settings: {
      title: 'Instellingen',
      notifications: 'Meldingen',
      privacy: 'Privacy',
    },
  },
  'nl': {
    // Same as nl-NL
  },
  'ar': {
    profile: {
      title: 'الملف الشخصي',
      edit: 'تعديل الملف الشخصي',
      save: 'حفظ التغييرات',
    },
    settings: {
      title: 'الإعدادات',
      notifications: 'الإشعارات',
      privacy: 'الخصوصية',
    },
  },
});
```

### Step 4: Update Global Types

Add to `translations/types/index.ts`:

```ts
export type { UserTranslations } from '../user/types';

// Add to Translations type
export type Translations = {
  auth: AuthTranslations;
  home: HomeTranslations;
  ad: AdTranslations;
  common: CommonTranslations;
  user: UserTranslations; // Add here
};
```

### Step 5: Register in Main Index

Update `translations/index.ts`:

```ts
import { userTranslations } from './user';

// Add to registry
const translationRegistry = {
  auth: authTranslations,
  home: homeTranslations,
  ad: adTranslations,
  common: commonTranslations,
  user: userTranslations, // Add here
} as const;

// Export types
export type {
  Translations,
  AuthTranslations,
  HomeTranslations,
  AdTranslations,
  CommonTranslations,
  UserTranslations, // Add here
} from './types';
```

### Step 6: Use in Components

```tsx
const { t } = useLocale();
<h1>{t.user.profile.title}</h1>
```

## Best Practices

1. **Feature-based Organization**: Each page/feature gets its own folder
2. **Co-located Files**: Keep translations and types together
3. **Shared Utilities**: Use `createTranslationNamespace` from `@validations/utils`
4. **Consistent Naming**: Use clear, descriptive keys
5. **Complete Locales**: Ensure all supported locales are implemented
6. **Type Safety**: Define types before implementing translations

## File Naming Convention

- **Folders**: Use the feature/page name (e.g., `auth/`, `home/`, `user/`)
- **Translation files**: Always `index.ts`
- **Type files**: Always `types.ts`
- **Type names**: `FeatureTranslations` (e.g., `UserTranslations`)

## Migration Notes

- **Old structure**: Flat files in `translations/` folder
- **New structure**: Feature-based folders with `index.ts` and `types.ts`
- **Utilities moved**: `utils.ts` → `@validations/utils.ts`
- **Same API**: `useLocale` hook and import paths remain unchanged

