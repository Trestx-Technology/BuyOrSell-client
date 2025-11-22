# Spacing System Guide

This guide explains how to use both **Tailwind's default spacing** and **your custom design system spacing** without conflicts.

## 🎯 Two Spacing Systems

### 1. Tailwind Default Spacing (Always Available)

- **Gap utilities**: `space-y-4`, `space-x-6`, `gap-8`
- **Padding**: `p-4`, `px-6`, `py-8`, `pt-4`, `pb-6`, `pl-8`, `pr-10`
- **Margin**: `m-4`, `mx-6`, `my-8`, `mt-4`, `mb-6`, `ml-8`, `mr-10`

### 2. Custom Design System Spacing (When You Need Exact Values)

- **Gap utilities**: `spacing-4`, `spacing-8`, `spacing-12`, etc.
- **Padding**: `p-custom-4`, `p-custom-8`, `p-custom-12`, etc.
- **Margin**: `m-custom-4`, `m-custom-8`, `m-custom-12`, etc.

## 📏 Custom Spacing Values

| Class        | Value     | Pixels | Notes                |
| ------------ | --------- | ------ | -------------------- |
| `spacing-4`  | `0.25rem` | 4px    |                      |
| `spacing-8`  | `0.5rem`  | 8px    | **1min** - Base unit |
| `spacing-12` | `0.75rem` | 12px   |                      |
| `spacing-16` | `1rem`    | 16px   |                      |
| `spacing-20` | `1.25rem` | 20px   |                      |
| `spacing-24` | `1.5rem`  | 24px   |                      |
| `spacing-32` | `2rem`    | 32px   |                      |
| `spacing-40` | `2.5rem`  | 40px   |                      |
| `spacing-48` | `3rem`    | 48px   |                      |
| `spacing-60` | `3.75rem` | 60px   |                      |

## 🚀 When to Use Which

### Use Tailwind Default Spacing For:

- **General layouts**: `space-y-4`, `gap-6`
- **Responsive designs**: `p-4 sm:p-6 lg:p-8`
- **Common patterns**: `m-4`, `px-6`
- **Quick prototyping**: `space-x-2`, `py-4`

### Use Custom Spacing For:

- **Design system compliance**: When you need exact 8px, 20px, 24px
- **Pixel-perfect designs**: `p-custom-8` for exactly 8px padding
- **Brand consistency**: `spacing-8` for your "1min" base unit
- **Specific requirements**: `m-custom-24` for exactly 24px margin

## 💡 Usage Examples

### Layout with Mixed Spacing

```tsx
<div className="space-y-6">
  {" "}
  {/* Tailwind default - 24px gaps */}
  <div className="p-custom-8">
    {" "}
    {/* Custom - exactly 8px padding */}
    <h2>Section Title</h2>
  </div>
  <div className="p-4">
    {" "}
    {/* Tailwind default - 16px padding */}
    <p>Content with standard spacing</p>
  </div>
  <div className="m-custom-24">
    {" "}
    {/* Custom - exactly 24px margin */}
    <Button>Action Button</Button>
  </div>
</div>
```

### Button Component with Custom Spacing

```tsx
<Button
  variant="filled"
  className="m-custom-8 p-custom-12" // Custom spacing
>
  Click me
</Button>
```

### Grid Layout

```tsx
<div className="grid grid-cols-2 gap-6">
  {" "}
  {/* Tailwind default - 24px gaps */}
  <div className="p-custom-8">
    {" "}
    {/* Custom - exactly 8px padding */}
    Card 1
  </div>
  <div className="p-custom-8">
    {" "}
    {/* Custom - exactly 8px padding */}
    Card 2
  </div>
</div>
```

## 🔧 Available Custom Classes

### Gap Utilities

```css
.spacing-4   /* gap: 4px */
.spacing-8   /* gap: 8px */
.spacing-12  /* gap: 12px */
.spacing-16  /* gap: 16px */
.spacing-20  /* gap: 20px */
.spacing-24  /* gap: 24px */
.spacing-32  /* gap: 32px */
.spacing-40  /* gap: 40px */
.spacing-48  /* gap: 48px */
.spacing-60  /* gap: 60px */
```

### Padding Utilities

```css
.p-custom-4   /* padding: 4px */
.p-custom-8   /* padding: 8px */
.p-custom-12  /* padding: 12px */
.p-custom-16  /* padding: 16px */
.p-custom-20  /* padding: 20px */
.p-custom-24  /* padding: 24px */
.p-custom-32  /* padding: 32px */
.p-custom-40  /* padding: 40px */
.p-custom-48  /* padding: 48px */
.p-custom-60  /* padding: 60px */
```

### Margin Utilities

```css
.m-custom-4   /* margin: 4px */
.m-custom-8   /* margin: 8px */
.m-custom-12  /* margin: 12px */
.m-custom-16  /* margin: 16px */
.m-custom-20  /* margin: 20px */
.m-custom-24  /* margin: 24px */
.m-custom-32  /* margin: 32px */
.m-custom-40  /* margin: 40px */
.m-custom-48  /* margin: 48px */
.m-custom-60  /* margin: 60px */
```

## 🎨 Best Practices

1. **Start with Tailwind defaults** for general layouts
2. **Use custom spacing** when you need exact design system values
3. **Mix both systems** - they work perfectly together
4. **Be consistent** within components - pick one approach per component
5. **Document your choices** for team consistency

## 🔍 Comparison Examples

| Need                     | Tailwind     | Custom        | Recommendation |
| ------------------------ | ------------ | ------------- | -------------- |
| General layout gaps      | `space-y-4`  | `spacing-16`  | Use Tailwind   |
| Exact 8px padding        | `p-2` (8px)  | `p-custom-8`  | Use Custom     |
| Responsive padding       | `p-4 sm:p-6` | N/A           | Use Tailwind   |
| Design system compliance | N/A          | `spacing-8`   | Use Custom     |
| Quick prototyping        | `m-4`        | `m-custom-16` | Use Tailwind   |

## 💭 Why This Approach?

- **No conflicts**: Custom spacing doesn't override Tailwind defaults
- **Flexibility**: Use the right tool for each job
- **Performance**: Tailwind utilities are optimized
- **Maintainability**: Clear separation of concerns
- **Team adoption**: Familiar Tailwind + specific custom values

## 🚨 Important Notes

- Custom spacing classes are defined in `@layer utilities`
- They use CSS variables from your design system
- They work alongside all Tailwind classes
- They're available globally in your app
- They follow the same naming convention for consistency
