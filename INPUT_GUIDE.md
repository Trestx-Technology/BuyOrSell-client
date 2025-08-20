# Custom Input Component

A comprehensive, customizable input component built on top of shadcn's input with our design system colors and enhanced functionality.

## 🎨 Features

- **Multiple Variants**: Default, success, warning, error, and filled styles
- **Different Sizes**: Small (32px), default (40px), and large (48px)
- **State Management**: Success, warning, and error states with visual feedback
- **Icon Support**: Left and right icons for enhanced UX
- **Accessibility**: Full ARIA support, labels, helper text, and error messages
- **Design System Integration**: Uses our comprehensive color palette
- **Form Validation**: Built-in error handling and required field support

## 🎯 Variants

### Basic Variants

- **`default`**: Standard input with grey-blue border and purple focus
- **`filled`**: Purple-themed input with subtle background

### Semantic Variants

- **`success`**: Green border and focus ring for success states
- **`warning`**: Yellow border and focus ring for warning states
- **`error`**: Red border and focus ring for error states

## 📏 Sizes

- **`sm`**: Height 32px, smaller text and padding
- **`default`**: Height 40px, standard text and padding
- **`lg`**: Height 48px, larger text and padding

## 🔄 States

- **`default`**: Standard appearance
- **`success`**: Green background with success styling
- **`warning`**: Yellow background with warning styling
- **`error`**: Red background with error styling

## 🎨 Design System Colors

The component uses our comprehensive design system:

### Primary Colors

- **Purple**: `#8B31E1` (focus states, filled variant)
- **Dark Blue**: `#1D2939` (text color)
- **Grey Blue**: `#667085` (placeholder, borders, icons)

### Semantic Colors

- **Success**: `#2E7D32` (100), `#66BB6A` (60), `#E8F5E8` (10)
- **Warning**: `#FFB319` (100), `#FFD280` (60), `#FFF4E0` (10)
- **Error**: `#FF4E64` (100), `#FF8A9A` (60), `#FFE8EC` (10)

## 📝 Props

| Prop         | Type                                                         | Default     | Description                     |
| ------------ | ------------------------------------------------------------ | ----------- | ------------------------------- |
| `variant`    | `'default' \| 'success' \| 'warning' \| 'error' \| 'filled'` | `'default'` | Input appearance style          |
| `inputSize`  | `'sm' \| 'default' \| 'lg'`                                  | `'default'` | Input size                      |
| `state`      | `'default' \| 'success' \| 'warning' \| 'error'`             | `'default'` | Input state                     |
| `label`      | `string`                                                     | `undefined` | Input label text                |
| `helperText` | `string`                                                     | `undefined` | Helper text below input         |
| `error`      | `string`                                                     | `undefined` | Error message (overrides state) |
| `leftIcon`   | `React.ReactNode`                                            | `undefined` | Icon on the left side           |
| `rightIcon`  | `React.ReactNode`                                            | `undefined` | Icon on the right side          |
| `isRequired` | `boolean`                                                    | `false`     | Shows required field indicator  |
| `className`  | `string`                                                     | `undefined` | Additional CSS classes          |

## 💡 Usage Examples

### Basic Input

```tsx
import { Input } from "@/components/ui/input";

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>;
```

### Input with Icons

```tsx
<Input
  label="Search"
  leftIcon={<SearchIcon />}
  placeholder="Search for something..."
  helperText="Type to search"
/>
```

### Semantic Variants

```tsx
<Input
  label="Username"
  variant="success"
  placeholder="Username is available"
  helperText="This username is available"
/>

<Input
  label="Password"
  variant="error"
  type="password"
  placeholder="Enter password"
  error="Password is too short"
/>
```

### Different Sizes

```tsx
<Input inputSize="sm" label="Small Input" placeholder="Small size" />
<Input inputSize="default" label="Default Input" placeholder="Default size" />
<Input inputSize="lg" label="Large Input" placeholder="Large size" />
```

### Input States

```tsx
<Input
  label="Success State"
  state="success"
  placeholder="Success state"
  helperText="Green background styling"
/>

<Input
  label="Warning State"
  state="warning"
  placeholder="Warning state"
  helperText="Yellow background styling"
/>
```

### Required Fields

```tsx
<Input
  label="Full Name"
  placeholder="Enter your full name"
  isRequired
  helperText="As it appears on your ID"
/>
```

### Error Handling

```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error="Please enter a valid email address"
/>
```

## 🔧 Customization

### Adding New Variants

```tsx
const inputVariants = cva("base-classes", {
  variants: {
    variant: {
      // Add your custom variant
      custom: "border-custom-color bg-custom-bg text-custom-text",
    },
  },
});
```

### Custom Colors

The component automatically uses your design system CSS variables:

- `--color-purple`
- `--color-dark-blue`
- `--color-grey-blue`
- `--color-success-100/60/10`
- `--color-warning-100/60/10`
- `--color-error-100/60/10`

## ♿ Accessibility Features

- **Labels**: Proper label association with `htmlFor` and `id`
- **ARIA Attributes**: `aria-invalid`, `aria-describedby`
- **Error Handling**: Clear error messages with proper ARIA descriptions
- **Required Fields**: Visual indicator (\*) for required fields
- **Focus States**: Clear focus rings with proper contrast
- **Screen Reader Support**: Proper semantic structure and descriptions

## 🎨 Styling Details

### Focus States

- Purple focus ring for default and filled variants
- Semantic color focus rings for success, warning, and error variants
- Smooth transitions with `duration-200`

### Border Radius

- Consistent `rounded-lg` (8px) across all variants
- Matches our design system's border radius

### Transitions

- Smooth transitions for all interactive states
- Focus, hover, and state changes are animated

## 🔗 Dependencies

- `class-variance-authority` - For variant management
- `@/lib/utils` - For className merging utility
- Your design system CSS variables

## 📱 Responsive Design

The component is fully responsive and works across all screen sizes:

- Grid layouts adapt from 1 column on mobile to 3 columns on desktop
- Consistent spacing and sizing across breakpoints
- Touch-friendly sizing for mobile devices

## 🚀 Best Practices

1. **Always provide labels** for screen reader accessibility
2. **Use helper text** to provide additional context
3. **Show errors clearly** with descriptive messages
4. **Choose appropriate variants** for different use cases
5. **Use icons sparingly** to avoid visual clutter
6. **Maintain consistent sizing** within forms
7. **Test with screen readers** for accessibility compliance

## 🔄 Migration from shadcn

The component is fully backward compatible with shadcn's Input:

- All existing props continue to work
- Enhanced with additional functionality
- Maintains the same base styling approach
- Adds our design system colors and variants
