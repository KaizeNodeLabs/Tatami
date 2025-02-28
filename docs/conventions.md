# Tatami Design System

This document outlines the design system used in Tatami, a project designed to accelerate the development of Dojo Engine games within the Starknet ecosystem.

## Overview

The design system is built on top of shadcn/ui components and follows a minimalist, modern aesthetic that aligns with both the landing page and the application UI.


## Design Tokens

### Colors

Tatami uses a core palette of five brand colors:

| Color   | Hex     | HSL Value        | Usage |
|---------|---------|------------------|-------|
| Yellow  | #FEB913 | 42 99% 54%       | Primary actions, Secondary actions, highlights, links |
| Black   | #101010 | 0 0% 6%         | Backgrounds, dark surfaces |
| White   | #FFFFFF | 0 0% 100%        | Text, light text |

Colors are defined as CSS variables using HSL values. This allows for easy manipulation of opacity and ensures consistency across themes:

```css
/* Brand colors */
--yellow: 42 99% 54%; /* #FEB913 */
--black: 0 0% 6%
--white: 0 0% 100%

/* Semantic mappings */
--background: var(--black)
--foreground: var(--white)
--primary: var(--yellow)
--primary-foreground: var(--white)
--secondary: var(--yellow)
--secondary-foreground: var(--black)
--accent-foreground: var(--white)
```

Access these in your components using Tailwind classes:
```tsx
// Using semantic colors (preferred)
<button className="bg-primary text-primary-foreground">
  Click me
</button>

// Using brand colors directly
<div className="bg-yellow text-black">
  Highlighted content
</div>
```

[Rest of the document remains the same...]

### Typography

Font scale and line heights are configured in the theme:

```ts
fontSize: {
  "xs": ["0.75rem", { lineHeight: "1rem" }],
  "sm": ["0.875rem", { lineHeight: "1.25rem" }],
  "base": ["1rem", { lineHeight: "1.5rem" }],
  "lg": ["1.125rem", { lineHeight: "1.75rem" }],
  "xl": ["1.25rem", { lineHeight: "1.75rem" }],
  "2xl": ["1.5rem", { lineHeight: "2rem" }],
}
```

## Component Variants

### Button

The Button component has been extended with variants specific to Tatami:

```tsx
// Default button
<Button>Click me</Button>

// Action variant - Used for primary CTAs
<Button variant="action">Get Started</Button>

// Action secondary variant - Used for secondary actions
<Button variant="action-secondary">Learn More</Button>

// Available sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Input

Input fields have additional variants for different contexts:

```tsx
// Default input
<Input />

// Ghost variant - No borders or background
<Input variant="ghost" />

// Inline variant - For inline editing
<Input variant="inline" />
```

### Card

Cards can be styled differently based on their context:

```tsx
// Default card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Ghost variant - No borders or shadow
<Card variant="ghost">...</Card>

// Elevated variant - More prominent shadow
<Card variant="elevated">...</Card>
```

### Form

Forms have been enhanced with different layouts and improved accessibility:

```tsx
// Default layout
<FormItem>
  <FormLabel>Label</FormLabel>
  <FormControl>
    <Input />
  </FormControl>
</FormItem>

// Horizontal layout
<FormItem layout="horizontal">
  <FormLabel>Label</FormLabel>
  <FormControl>
    <Input />
  </FormControl>
</FormItem>

// With required field
<FormLabel required>Required Field</FormLabel>
```

## Naming Conventions

### CSS Variables

- Use kebab-case
- Follow pattern: `--{category}-{property}-{variant?}`
- Example: `--primary-500`, `--background`

### Component Classes

- Use kebab-case for class names
- Follow pattern: `{component}-{element?}-{modifier?}`
- Example: `card-header`, `button-primary`

### React Components

- Use PascalCase for component names
- Use camelCase for props
- Example: `Button`, `CardHeader`

### Files and Folders

- Use kebab-case for file names
- Group related components logically
- Example: `button.tsx`, `app-layout/`

## Type System

Types are located in `apps/frontend/types/design-tokens.ts`:

```typescript
// Import types
import type { DesignTokens, TokenValue } from '@/types'

// Usage example
const color: TokenValue<DesignTokens['colors']> = 'primary.500'
```

## Contributing

When contributing to the design system:

1. Follow the naming conventions outlined above
2. Ensure components are accessible
3. Test in both light and dark themes
4. Add proper TypeScript types
5. Include usage examples in comments

## Browser Support

The design system is built with modern CSS features but maintains compatibility with:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Figma Design](https://www.figma.com/file/1K4FYVG1Ix7uUUqOaKtO0/Tatami?node-id=12-858&t=8kRNn9wXQh0Sn27Z-0)
- [Tailwind CSS Documentation](https://tailwindcss.com)