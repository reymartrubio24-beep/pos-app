# POS UI Style Guide

## Reference

- Reference file: c:\Users\anneb\OneDrive\Desktop\GUI-2\pos.jsx

## Design Tokens

### Colors

- --color-bg: #f3f4f6
- --color-surface: #ffffff
- --color-border: #e5e7eb
- --color-text: #111827
- --color-muted: #6b7280
- --color-primary: #2563eb
- --color-primary-dark: #1d4ed8

### Typography

- --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Base line-height: 1.5

### Radius

- --radius-md: 0.5rem
- --radius-lg: 0.75rem

### Shadow

- --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)

## Reusable Utility Patterns

- Focus ring: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white
- Primary action: bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200
- Surface card: bg-white rounded-lg border-2 border-gray-200
- Section header: bg-gray-50 px-6 py-4 border-b-2 border-gray-200 text-xl font-bold text-gray-800

## Mixins

- None. The UI uses utility classes instead of CSS mixins.

## Reusable React Components

- PrimaryButton: primary CTA button with focus ring and transition
- IconButton: icon-only button with a11y label and focus ring
- StatCard: gradient metric card with icon pair, value, and label
- SectionCard: reusable card wrapper with standard header styling

## Iconography

- Icon set: lucide-react
- Common sizes: 16, 18, 20, 24, 32

## Spacing Scale

- Section padding: 16px to 24px
- Card padding: 12px to 24px
- Gaps: 8px, 12px, 16px, 24px
