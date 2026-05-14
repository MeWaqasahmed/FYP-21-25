# Design Instructions — Influencer Promotional Management Platform
> Kiro Instruction Document | Modern UI/UX | React + MUI v5

---

## Design Philosophy

This platform is for **social media influencers** — the design must feel modern, aspirational, and creator-focused. Think Linktree × Shopify × Notion. Clean, minimal, high-contrast, with just enough personality to feel premium without being cluttered.

**Core Principles:**
- **Clarity first** — every screen has one primary action
- **Data at a glance** — analytics are beautiful, not boring
- **Mobile-ready** — influencers often work from phones
- **Creator energy** — bold accents, smooth transitions, subtle gradients

---

## Color System

```css
/* Primary Palette */
--color-primary:       #6366f1;   /* Indigo — brand identity */
--color-primary-dark:  #4f46e5;
--color-primary-light: #a5b4fc;

/* Accent */
--color-accent:        #f59e0b;   /* Amber — CTAs, highlights */
--color-accent-dark:   #d97706;

/* Semantic */
--color-success:       #22c55e;
--color-warning:       #f97316;
--color-error:         #ef4444;
--color-info:          #3b82f6;

/* Neutrals (Dark Mode First) */
--color-bg:            #0f0f13;   /* App background */
--color-surface:       #1a1a24;   /* Cards, panels */
--color-surface-2:     #252535;   /* Elevated surfaces */
--color-border:        #2e2e45;
--color-text-primary:  #f1f5f9;
--color-text-secondary:#94a3b8;
--color-text-muted:    #475569;

/* Gradients */
--gradient-hero:       linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
--gradient-card:       linear-gradient(145deg, #1a1a24 0%, #252535 100%);
--gradient-glow:       radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%);
```

**MUI Theme Override (in `src/theme.js`):**
```js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1', dark: '#4f46e5', light: '#a5b4fc' },
    secondary: { main: '#f59e0b' },
    background: { default: '#0f0f13', paper: '#1a1a24' },
    text: { primary: '#f1f5f9', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"Inter", "Geist", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.5)',
    '0 4px 16px rgba(0,0,0,0.4)',
    '0 8px 32px rgba(0,0,0,0.5)',
    // ...
  ],
});
```

---

## Typography Scale

| Token | Size | Weight | Use |
|---|---|---|---|
| `display` | 48–64px | 800 | Hero headings, landing |
| `h1` | 36px | 700 | Page titles |
| `h2` | 28px | 600 | Section headings |
| `h3` | 22px | 600 | Card headings |
| `body1` | 16px | 400 | Main body text |
| `body2` | 14px | 400 | Secondary text |
| `caption` | 12px | 500 | Labels, metadata |
| `overline` | 11px | 700 uppercase | Category tags |

**Font:** Import **Inter** from Google Fonts. Use `font-feature-settings: "cv02", "cv03", "cv04"` for polished numeral rendering.

---

## Spacing System

Use MUI's 8px base unit. Standard spacing tokens:

| Token | Value | Use |
|---|---|---|
| `xs` | 4px | Tight gaps, icon padding |
| `sm` | 8px | Inline spacing |
| `md` | 16px | Component internal padding |
| `lg` | 24px | Section gaps |
| `xl` | 32px | Page section padding |
| `2xl` | 48px | Hero sections |

---

## Layout

### Authenticated Shell

```
┌─────────────────────────────────────────────────┐
│ Sidebar (240px) │  Navbar (top, 64px)            │
│                 │─────────────────────────────── │
│  Logo           │  Page Title    [Bell] [Avatar] │
│  ──────         │─────────────────────────────── │
│  Nav Items      │                                 │
│  (with icons)   │   Page Content Area             │
│                 │   (padding: 24px)               │
│  ──────         │                                 │
│  User card      │                                 │
│  Plan badge     │                                 │
└─────────────────┴─────────────────────────────── ┘
```

- Sidebar collapses to icon-only mode on screens < 1280px.
- On mobile (< 768px): sidebar becomes a bottom drawer, triggered by hamburger.
- Content max-width: 1280px, centered with auto margins.

### Grid System
- Dashboard stats: 4 columns on desktop, 2 on tablet, 1 on mobile.
- Product grid: 3 columns on desktop, 2 on tablet, 1 on mobile.
- Use MUI `<Grid container spacing={3}>`.

---

## Component Design Specs

### Sidebar
- Background: `#1a1a24` with a subtle left border glow on active item.
- Active nav item: `background: rgba(99,102,241,0.15)`, left border `3px solid #6366f1`.
- Hover state: `background: rgba(255,255,255,0.05)`.
- Icons: 20px, from Lucide React.
- Labels: 14px, weight 500.
- Bottom: user avatar + name + subscription badge (Free/Pro/Premium chip).

### Navbar
- Background: `rgba(15,15,19,0.8)` with `backdrop-filter: blur(12px)`.
- Sticky top.
- Right side: notification bell with unread badge + user avatar menu.

### Stats Card (Dashboard)
```
┌──────────────────────────────┐
│  Icon (40px circle bg)       │
│                              │
│  12,450          ↑ 18.5%    │
│  Total Clicks   vs last week │
└──────────────────────────────┘
```
- Background: `--color-surface` with subtle gradient.
- Border: `1px solid --color-border`.
- Border-radius: 16px.
- Icon circle background: `rgba(primary, 0.15)`.
- Positive delta: green with up arrow icon. Negative: red with down arrow.
- Hover: `transform: translateY(-2px)`, box-shadow increases.

### Product Card
```
┌──────────────────────────────┐
│  [Product Image - 16:9]      │
│  Category chip               │
├──────────────────────────────┤
│  Product Name                │
│  123 clicks  •  4.2% CVR     │
│                              │
│  [Edit]          [Share ↗]  │
└──────────────────────────────┘
```
- Image: `border-radius: 12px 12px 0 0`, `object-fit: cover`.
- Category chip: small pill, category-colored background.
- Action buttons appear on hover overlay.
- Click count shown with a small chart sparkline if available.

### Chart Styling (Recharts)
- Background: transparent.
- Grid lines: `stroke: #2e2e45`, `strokeDasharray: 4 4`.
- Line/bar color: `#6366f1` primary, `#f59e0b` secondary.
- Tooltip: dark background `#252535`, `border: 1px solid #2e2e45`, rounded-8, no shadow.
- Axes: `#475569` color, 12px font.
- Dot on line: filled `#6366f1`, `r: 4`, active `r: 6`.

### Buttons

| Variant | Style |
|---|---|
| Primary | `background: #6366f1`, white text, hover: `#4f46e5`, `border-radius: 8px` |
| Secondary | `background: transparent`, `border: 1px solid #6366f1`, primary text |
| Danger | `background: #ef4444`, white text |
| Ghost | No background or border, hover: subtle bg tint |
| Icon | Circle, `background: rgba(255,255,255,0.05)` |

All buttons: `height: 40px` (default), `padding: 0 20px`, `font-weight: 600`, `transition: all 150ms`.

### Form Inputs
- Variant: `outlined` in MUI.
- Label float on focus.
- Focus border: `#6366f1`.
- Error border: `#ef4444`.
- `border-radius: 8px`.
- Background: `#252535` (slightly elevated from page bg).

### Modals / Dialogs
- Background: `#1a1a24`.
- Backdrop: `rgba(0,0,0,0.7)` with blur.
- Border: `1px solid #2e2e45`.
- Max-width: 560px (standard), 800px (wide like AI tools).
- Border-radius: 16px.
- Enter animation: scale from 95% + fade in, 200ms ease-out.

### Tags / Chips
- Hashtag chips: `background: rgba(99,102,241,0.12)`, `color: #a5b4fc`, `border-radius: 999px`, `padding: 2px 12px`.
- Category chips: each category has a unique subtle color:
  - Fashion → purple, Tech → blue, Beauty → pink, Health → green, Food → orange.

---

## Page-Specific Design

### Landing Page (`/`)
- Full-width hero with animated gradient background (`--gradient-hero`).
- Bold headline: "Your Creator Business, Supercharged."
- Subheadline in `--color-text-secondary`.
- Two CTA buttons: "Get Started Free" (primary) + "See how it works" (ghost).
- Feature grid: 3 cards with icon, title, description.
- Mockup screenshot of the dashboard (use a framed browser window SVG).
- Pricing section with 3 plan cards — Pro card highlighted with primary border glow.
- Simple footer.

### Influencer Dashboard
- Greeting: "Good morning, [Name] 👋" in h2.
- Stats row: 4 cards (Total Clicks, Active Products, Top Product, Subscription).
- Main area: 2/3 width line chart + 1/3 top products list.
- Bottom: recent notifications + AI quick action card.

### Analytics Dashboard
- Date range picker at top right (chip group: 7d | 30d | 90d | Custom).
- Full-width line chart below.
- 3-column layout: bar chart (top products) | donut chart (event types) | summary numbers.
- Full-width table at the bottom with sortable columns.

### Public Storefront
- Full-width banner image.
- Circular logo overlapping the banner bottom edge.
- Store name in h1, description in body.
- Category filter chips below header.
- Product grid — masonry or uniform card grid.
- Minimal header (no platform nav), just the store branding.
- "Powered by [Platform]" small footer link.

### AI Tools Page
- Two-column layout: input form (left) + generated output (right).
- Input: product name, category dropdown, target audience text.
- Loading state: skeleton shimmer on output panel + animated gradient border on the panel.
- Output sections: SEO Description | Hashtags | Instagram Caption | Facebook Post.
- Each section: copy button (top right of card), editable textarea on click.

---

## Animations & Transitions

- Page transitions: fade-in 200ms on route change (use Framer Motion `<AnimatePresence>`).
- Card hover: `transform: translateY(-2px)`, `box-shadow` increase — 150ms ease.
- Sidebar item hover: background tint — 100ms ease.
- Button press: `transform: scale(0.98)` — 100ms.
- Stats card number: count-up animation on mount (use `react-countup`).
- Chart entry: bars/lines animate in on first render (Recharts built-in animation).
- Notification bell: shake animation when new notification arrives.
- Modals: scale + fade — 200ms cubic-bezier(0.34, 1.56, 0.64, 1) for bounce feel.
- Skeleton loaders: use MUI `<Skeleton variant="rectangular">` with wave animation.

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Change |
|---|---|---|
| `xs` | 0–600px | Single column, bottom nav |
| `sm` | 600–900px | 2-column grid |
| `md` | 900–1200px | Sidebar collapsed to icons |
| `lg` | 1200px+ | Full sidebar + multi-column |

---

## Iconography

Use **Lucide React** exclusively for UI icons (consistent style, tree-shakable).

Key icons to use:
- Dashboard → `LayoutDashboard`
- Store → `Store`
- Products → `Package`
- Analytics → `BarChart2`
- AI Tools → `Sparkles`
- Subscription → `Crown`
- Settings → `Settings`
- Notifications → `Bell`
- Logout → `LogOut`
- Click → `MousePointerClick`
- Referral → `Link2`
- Upload → `Upload`
- Edit → `Pencil`
- Delete → `Trash2`

Icon size: 18px in nav items, 20px in buttons, 24px in headings.

---

## Micro-interactions & UX Polish

- Toast notifications: use `react-hot-toast` with dark theme, positioned bottom-right.
- Empty states: custom illustrations (SVG) + helpful message + CTA button. Never show blank white space.
- Confirmation dialogs for destructive actions (delete product/store): require typing "DELETE" or tapping confirm button.
- Infinite scroll on product lists (not pagination).
- Optimistic UI updates on product edits — update UI instantly, revert on error.
- Skeleton screens on all data-loading states — no spinners in the center of the page.
- Scroll-to-top button on long pages, appears after 400px scroll.

---

## Accessibility

- Color contrast ratio: minimum 4.5:1 for body text, 3:1 for large text.
- All interactive elements are keyboard-navigable.
- Focus rings visible: `outline: 2px solid #6366f1; outline-offset: 2px`.
- All images have `alt` text.
- ARIA labels on icon-only buttons.
- Screen-reader-only text where needed: `<span className="sr-only">`.
