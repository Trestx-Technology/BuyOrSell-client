# Translations

Global, scalable translation system for the BuyOrSell application.

## Structure

```
translations/
├── index.ts          # Main entry point - exports all translations
├── types.ts          # TypeScript type definitions
├── auth.ts           # Authentication-related translations
├── README.md         # This file
└── [feature].ts      # Additional feature-specific translations
```

## Architecture

### Type Safety
- All translations are fully typed with TypeScript
- Type definitions are centralized in `types.ts`
- Compile-time checking ensures translation keys exist

### Scalability
- Each feature/domain has its own translation file
- Easy to add new translation namespaces
- Maintainable structure for large applications

### Locale Support
- Currently supports: `en-US`, `nl-NL`, `nl`, `ar`
- Easy to add new locales by extending existing translation files

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

## Adding New Translations

### Step 1: Define Types

Edit `translations/types.ts`:

```ts
export type CommonTranslations = {
  buttons: {
    save: string;
    cancel: string;
    delete: string;
  };
  messages: {
    success: string;
    error: string;
  };
};

// Add to main Translations type
export type Translations = {
  auth: AuthTranslations;
  common: CommonTranslations; // Add here
};
```

### Step 2: Create Translation File

Create `translations/common.ts`:

```ts
import { type TranslationNamespace } from './types';
import type { CommonTranslations } from './types';
import { type Locale } from '@/lib/i18n/config';

export const commonTranslations: TranslationNamespace<CommonTranslations> = {
  'en-US': {
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
    },
    messages: {
      success: 'Success!',
      error: 'An error occurred',
    },
  },
  'nl-NL': {
    buttons: {
      save: 'Opslaan',
      cancel: 'Annuleren',
      delete: 'Verwijderen',
    },
    messages: {
      success: 'Succes!',
      error: 'Er is een fout opgetreden',
    },
  },
  'nl': {
    // Same as nl-NL
  },
  'ar': {
    buttons: {
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
    },
    messages: {
      success: 'نجح!',
      error: 'حدث خطأ',
    },
  },
};
```

### Step 3: Export from Index

Edit `translations/index.ts`:

```ts
import { commonTranslations } from './common';

export function getTranslations(locale: Locale): Translations {
  return {
    auth: authTranslations[locale],
    common: commonTranslations[locale], // Add here
  };
}

// Export for direct access
export { commonTranslations } from './common';
```

### Step 4: Use in Components

```tsx
const { t } = useLocale();
<Button>{t.common.buttons.save}</Button>
```

## Best Practices

1. **Organize by Feature**: Group related translations together (auth, navigation, common, etc.)

2. **Consistent Naming**: Use clear, descriptive keys that indicate the context
   - ✅ `t.auth.login.title`
   - ❌ `t.loginTitle`

3. **Reuse Common Strings**: Create a `common` namespace for shared translations (buttons, messages, etc.)

4. **Type Safety**: Always define types in `types.ts` before implementing translations

5. **Complete Locales**: When adding a new translation key, ensure all locales are updated

6. **Documentation**: Add comments for complex or context-specific translations

## File Naming Convention

- Use kebab-case for file names: `user-profile.ts`, `job-listings.ts`
- Use camelCase for TypeScript types: `UserProfileTranslations`, `JobListingsTranslations`
- Use camelCase for export names: `userProfileTranslations`, `jobListingsTranslations`

## Example: Complete Feature Translation

```ts
// translations/jobs.ts
import { type TranslationNamespace } from './types';
import type { JobTranslations } from './types';

export const jobTranslations: TranslationNamespace<JobTranslations> = {
  'en-US': {
    listing: {
      title: 'Job Listings',
      apply: 'Apply Now',
      posted: 'Posted',
    },
  },
  // ... other locales
};
```

## Migration Notes

- Old location: `lib/i18n/translations/*` → New location: `translations/*`
- Old import: `@/lib/i18n/translations/auth` → New import: `@/translations`
- The `useLocale` hook automatically provides all translations via `t`

