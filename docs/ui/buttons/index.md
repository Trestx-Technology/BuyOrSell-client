# Merged Button Component

A comprehensive, customizable button component that combines shadcn's original variants with your design system specifications. This component is now located in `components/ui/button.tsx` and includes all the functionality from both systems.

## 🔄 What's Been Merged

- **Primary variants**: `primary`, `outline`, `secondary`, `ghost` (using our purple theme)
- **Semantic variants**: `warning`, `success`, `danger`, `cancel`, `active` (using our design system colors)
- **Outlined variants**: `warningOutlined`, `successOutlined`, `dangerOutlined`, `cancelOutlined`, `activeOutlined`
- **Design system variants**: `filled` (purple), `outlined` (purple)
- **All sizing options**: Original + our custom icon sizes (`icon-sm`, `icon`, `icon-lg`)
- **Width variants**: `default`, `long`, `full`
- **Icon positioning**: `left`, `right`, `none`
- **Enhanced disabled states**: Different appearances for each variant
- **8px border radius**: Applied consistently across all variants

## Features

- **Multiple Variants**: Filled, outlined, and disabled states
- **Flexible Sizing**: Small, default, large, and icon-specific sizes
- **Icon Support**: Left, right, or icon-only buttons
- **Width Options**: Default, long, and full-width variants
- **Loading States**: Built-in loading spinner
- **Accessibility**: Proper focus states and ARIA attributes
- **Design System Integration**: Uses your purple color scheme (#8B31E1)

## Variants

### Filled Buttons

- Purple background with white text
- Hover and active states
- Perfect for primary actions

### Outlined Buttons

- White background with purple border and text
- Hover and active states
- Great for secondary actions

### Disabled State

- Automatically applied when `disabled` or `loading` is true
- Gray appearance with reduced opacity

## Sizes

- **`sm`**: Small (h-8, px-3, py-1.5, text-xs)
- **`default`**: Default (h-10, px-4, py-2, text-sm)
- **`lg`**: Large (h-12, px-6, py-3, text-base)
- **`icon`**: Icon button (h-10, w-10, p-0)
- **`icon-sm`**: Small icon button (h-8, w-8, p-0)
- **`icon-lg`**: Large icon button (h-12, w-12, p-0)

## Width Options

- **`default`**: Auto-width based on content
- **`long`**: Minimum width of 200px
- **`full`**: Full width of container

## Icon Positioning

- **`none`**: No icon
- **`left`**: Icon on the left side
- **`right`**: Icon on the right side

## Usage Examples

### Basic Buttons

```tsx
import { Button } from "@/components/ui/button";

// Primary variants
<Button variant="primary">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="secondary">Tertiary Action</Button>

// Semantic variants
<Button variant="warning">Warning Action</Button>
<Button variant="success">Success Action</Button>
<Button variant="danger">Danger Action</Button>
<Button variant="cancel">Cancel Action</Button>
<Button variant="active">Active Action</Button>

// Design system variants
<Button variant="filled">Filled Button</Button>
<Button variant="outlined">Outlined Button</Button>

// Disabled button
<Button variant="filled" disabled>Disabled</Button>
```

### Buttons with Icons

```tsx
import { Button } from "@/components/ui/button";

// Icon on the left
<Button variant="filled" icon={<ArrowIcon />} iconPosition="left">
  Continue
</Button>

// Icon on the right
<Button variant="outlined" icon={<ArrowIcon />} iconPosition="right">
  Back
</Button>

// Semantic outlined variants
<Button variant="warningOutlined">Warning Outlined</Button>
<Button variant="successOutlined">Success Outlined</Button>
<Button variant="dangerOutlined">Danger Outlined</Button>
<Button variant="cancelOutlined">Cancel Outlined</Button>
<Button variant="activeOutlined">Active Outlined</Button>

// Icon-only button
<Button variant="filled" size="icon" icon={<MenuIcon />} />
```

### Different Sizes

```tsx
<Button variant="filled" size="sm">Small</Button>
<Button variant="filled" size="default">Default</Button>
<Button variant="filled" size="lg">Large</Button>
```

### Width Variants

```tsx
<Button variant="filled" width="default">Auto Width</Button>
<Button variant="filled" width="long">Long Button</Button>
<Button variant="filled" width="full">Full Width</Button>
```

### Loading State

```tsx
<Button variant="filled" loading>
  Loading...
</Button>
```

### Combining Props

```tsx
<Button
  variant="filled"
  size="lg"
  width="long"
  icon={<ArrowIcon />}
  iconPosition="left"
  onClick={handleClick}
>
  Large Long Button with Icon
</Button>
```

## Props

| Prop           | Type                                                                                                                                                                                                                                             | Default     | Description             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ----------------------- |
| `variant`      | `'primary' \| 'outline' \| 'secondary' \| 'warning' \| 'success' \| 'danger' \| 'cancel' \| 'active' \| 'ghost' \| 'filled' \| 'outlined' \| 'warningOutlined' \| 'successOutlined' \| 'dangerOutlined' \| 'cancelOutlined' \| 'activeOutlined'` | `'primary'` | Button appearance style |
| `size`         | `'sm' \| 'default' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-lg'`                                                                                                                                                                                  | `'default'` | Button size             |
| `width`        | `'default' \| 'long' \| 'full'`                                                                                                                                                                                                                  | `'default'` | Button width            |
| `iconPosition` | `'none' \| 'left' \| 'right'`                                                                                                                                                                                                                    | `'none'`    | Icon placement          |
| `icon`         | `React.ReactNode`                                                                                                                                                                                                                                | `undefined` | Icon element            |
| `loading`      | `boolean`                                                                                                                                                                                                                                        | `false`     | Show loading spinner    |
| `disabled`     | `boolean`                                                                                                                                                                                                                                        | `false`     | Disable button          |
| `children`     | `React.ReactNode`                                                                                                                                                                                                                                | `undefined` | Button content          |
| `className`    | `string`                                                                                                                                                                                                                                         | `undefined` | Additional CSS classes  |

## Design System Colors

The component uses your comprehensive design system colors:

### Primary Colors

- **Purple**: `#8B31E1` (primary, filled, outlined buttons)
- **Grey Blue**: `#667085` (disabled state)
- **White**: `#FFFFFF` (outlined button background)

### Semantic Colors

- **Warning**: `#FFB319` (100), `#FFD280` (60), `#FFF4E0` (10)
- **Success**: `#2E7D32` (100), `#66BB6A` (60), `#E8F5E8` (10)
- **Error/Danger**: `#FF4E64` (100), `#FF8A9A` (60), `#FFE8EC` (10)
- **Cancel**: `#BE1653` (100), `#D45A7A` (60), `#F7E8ED` (10)
- **Active**: `#5C33CF` (100), `#8B5CF6` (60), `#EDE9FE` (10)

Each semantic color has three variants:

- **100**: Full color for filled buttons
- **60**: Lighter shade for hover states
- **10**: Very light shade for outlined button backgrounds

## Accessibility

- Proper focus states with ring outline
- Disabled state handling
- Loading state indication
- Semantic button element
- Screen reader friendly

## Customization

You can extend the component by:

- Adding new variants to `buttonVariants`
- Customizing colors in the CSS variables
- Adding new size or width options
- Extending with additional props

## Dependencies

- `class-variance-authority` - For variant management
- `@/lib/utils` - For className merging utility
- Your design system CSS variables
