# Caption Control Center Style Guide

This document captures the visual system used in this repository so you can reproduce a very similar look in another project.

The styling in this repo is primarily:

- inline React `style` objects
- a dark custom theme
- bright accent colors for section identity
- glass-like translucent panels
- rounded cards, tables, and modals
- minimal motion
- strong reliance on spacing, typography, and color contrast rather than shadows or heavy decoration

This guide is intended to be practical. It explains:

- the exact visual feel
- the recurring colors
- the layout patterns
- how elements are positioned
- how buttons, tables, cards, modals, and badges are styled
- what makes the UI feel unique
- how to port the style to another repo

## 1. Visual Identity

The application has a dark "admin control center" aesthetic with neon-like accent colors.

Core traits:

- Deep plum/indigo background instead of pure black
- Strong purple-to-pink gradient headers
- Semi-transparent charcoal panels over the dark background
- Soft rounded corners everywhere
- Light gray text hierarchy with restrained contrast
- Accent colors used semantically by section or action
- Dense but readable admin layouts
- Minimal animation, mostly hover state changes and tiny translate effects

The overall vibe is:

- futuristic
- dashboard-oriented
- premium but compact
- colorful without being playful

## 2. Styling Architecture

This repo does not use a centralized component library for styling.

Instead, the style system is expressed through:

- `app/globals.css` for global tokens and fonts
- `app/layout.tsx` for font loading
- repeated inline style objects in pages and manager components

This means the style system is pattern-based rather than token-driven, but the patterns are very consistent.

## 3. Fonts

The repo uses Google fonts via Next font loading:

- Sans: `Space Grotesk`
- Mono: `Fira Code`

Implementation:

- `Space Grotesk` is the default UI font
- `Fira Code` is registered as the mono font, though the UI mostly uses the sans font

Global CSS behavior:

- body uses `Space Grotesk`
- foreground and background colors are also defined as CSS variables

Suggested port:

```css
:root {
  --background: #0d0a1c;
  --foreground: #f4f4f5;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: "Space Grotesk", system-ui, sans-serif;
}
```

## 4. Core Color Palette

### Foundation Colors

These create the base dark theme:

| Purpose | Color |
| --- | --- |
| App background | `#0d0a1c` |
| Modal surface | `#1a1025` |
| Pure white text/button text | `#fff` |
| Primary foreground | `#f4f4f5` |
| Secondary text | `#d4d4d8` |
| Muted text | `#a1a1aa` |
| Low-emphasis text | `#71717a` |
| Faint text / dividers | `#52525b` |
| Black image well / media frame | `#000` |

### Glass / Surface Transparency

These are used everywhere and are one of the most defining characteristics of the design:

| Usage | Value |
| --- | --- |
| Panel fill | `rgba(255, 255, 255, 0.03)` |
| Input / table / card fill | `rgba(255, 255, 255, 0.04)` |
| Stronger frosted card fill | `rgba(255, 255, 255, 0.06)` |
| Soft button fill | `rgba(255, 255, 255, 0.08)` |
| Logout button fill | `rgba(255, 255, 255, 0.1)` |
| Hovered logout fill | `rgba(255, 255, 255, 0.15)` |
| Modal overlay | `rgba(0, 0, 0, 0.8)` |

### Border Transparency

| Usage | Value |
| --- | --- |
| Soft panel border | `rgba(255, 255, 255, 0.05)` |
| Sidebar border | `rgba(255, 255, 255, 0.06)` |
| Input/card border | `rgba(255, 255, 255, 0.08)` |
| Modal/button border | `rgba(255, 255, 255, 0.1)` |
| Logout border | `rgba(255, 255, 255, 0.2)` |

### Signature Gradient

This is the most important visual signature in the repo:

| Usage | Value |
| --- | --- |
| Main header gradient | `linear-gradient(135deg, #7c3aed 0%, #db2777 100%)` |
| Primary action gradient | `linear-gradient(135deg, #a855f7, #ec4899)` |
| Add/create accent gradient | `linear-gradient(135deg, #14b8a6, #0d9488)` |

### Error / Unauthorized Gradients

| Usage | Value |
| --- | --- |
| Unauthorized page background | `linear-gradient(135deg, #9f1239 0%, #0d0a1c 100%)` |
| Destructive sign-out | `linear-gradient(135deg, #f43f5e, #e11d48)` |

## 5. Accent Colors by Meaning

The app uses color to make admin sections feel distinct. This is a large part of what makes the UI recognizable.

### Core Accent Set

| Accent | Color | Typical Meaning |
| --- | --- | --- |
| Purple | `#a855f7` | Edit actions, admin emphasis, primary accent |
| Pink | `#ec4899` | Header gradient endpoint, image/caption accent |
| Teal | `#14b8a6` | Create actions, public status, positive utility |
| Dark teal | `#0d9488` | Create gradient endpoint |
| Orange | `#f97316` | Common-use tags, examples, alerts of importance |
| Rose red | `#f43f5e` | Delete actions, unauthorized accents |
| Yellow | `#eab308` | Featured content, flavor emphasis |
| Sky blue | `#38bdf8` | Prompt chain accent |
| Cyan | `#22d3ee` | Requests / allowed domains accent |
| Indigo | `#818cf8` | LLM model identity |
| Violet-lavender | `#c084fc` | LLM provider identity |
| Amber | `#f59e0b` | LLM response identity |
| Emerald | `#10b981` | Humor mix identity |
| Soft rose | `#fb7185` | Terms / inline error text |

### Soft Tinted Stat Cards

Metric cards usually use:

- a tinted background at roughly 10% opacity
- a border using the same accent at roughly 30% opacity

Examples:

| Accent card | Background | Border |
| --- | --- | --- |
| Purple metric | `rgba(168, 85, 247, 0.1)` | `rgba(168, 85, 247, 0.3)` |
| Teal metric | `rgba(20, 184, 166, 0.1)` | `rgba(20, 184, 166, 0.3)` |
| Pink metric | `rgba(236, 72, 153, 0.1)` | `rgba(236, 72, 153, 0.3)` |
| Orange metric | `rgba(249, 115, 22, 0.1)` | `rgba(249, 115, 22, 0.3)` |
| Yellow metric | `rgba(234, 179, 8, 0.1)` | `rgba(234, 179, 8, 0.3)` |
| Cyan metric | `rgba(34, 211, 238, 0.1)` | `rgba(34, 211, 238, 0.3)` |
| Indigo metric | `rgba(99, 102, 241, 0.1)` | `rgba(99, 102, 241, 0.3)` |

## 6. Layout System

The positioning is simple and consistent.

### Global Page Structure

Most admin pages follow this pattern:

1. Full-height root container
2. Large gradient header at the top
3. Fixed-width content area centered on the page
4. A stats row near the top
5. Main content block below, usually a table, card grid, or manager component

Typical structure:

```tsx
<div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
  <header style={{ background: 'linear-gradient(...)', padding: '1.5rem 2rem' }}>
    ...
  </header>

  <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
    ...
  </main>
</div>
```

### Width Rules

Common width constraints:

| Area | Width |
| --- | --- |
| Main admin content | `maxWidth: '1400px'` |
| Login / unauthorized card container | `maxWidth: '700px'` |
| Most modals | `maxWidth: '500px'` |
| Larger form modal | `maxWidth: '520px'` |

### Dashboard Positioning

The dashboard is unique compared to the other admin pages.

It uses a 3-column grid:

- left sidebar: overview metrics
- center column: recent activity and vote summary
- right sidebar: navigation

Grid:

```tsx
gridTemplateColumns: '200px 1fr 260px'
gap: '1.5rem'
alignItems: 'start'
```

This produces a compact command-center feel instead of a plain admin table page.

### Standard Admin Page Positioning

Most other admin screens use:

- a centered header block
- a `main` container
- a metric row using `repeat(auto-fit, minmax(200px, 1fr))`
- then a table or grid content section

Reusable metric row:

```tsx
display: 'grid'
gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
gap: '1rem'
marginBottom: '2rem'
```

### Search + Action Toolbar Positioning

Manager components commonly start with:

- one flexible search bar on the left
- one create button on the right

Pattern:

```tsx
display: 'flex'
gap: '1rem'
marginBottom: '1.5rem'
alignItems: 'center'
```

The search input uses:

- a wrapper with `position: 'relative'`
- a search icon absolutely positioned inside
- left padding to account for the icon

## 7. Spacing System

The spacing is restrained and repeated consistently.

### Common Values

| Usage | Value |
| --- | --- |
| Page padding | `1.5rem` or `2rem` |
| Small panel padding | `1rem` |
| Card padding | `1rem` to `1.25rem` |
| Modal padding | `2rem` |
| Button x padding | `0.75rem` to `1.5rem` |
| Button y padding | `0.5rem` to `0.75rem` |
| Search input padding | `0.75rem 1rem 0.75rem 2.5rem` |
| Row padding | `0.45rem 0.75rem` to `1rem` |
| Standard gap | `0.5rem`, `0.75rem`, `1rem`, `1.5rem` |

### How It Feels

- Tables feel airy because of `1rem` cell padding
- Toolbars feel modern because of `1rem` gaps
- Modals feel premium because of `2rem` padding
- Cards stay compact by avoiding extra-large vertical spacing

## 8. Radius System

Rounded corners are one of the strongest visual signatures.

| Component | Radius |
| --- | --- |
| Small tags / pills | `6px` |
| Inputs / small controls | `8px` |
| Buttons / search / selects | `10px` |
| Stat cards | `12px` |
| Main cards / modals / panels | `16px` |

This produces a soft, modern look without becoming overly bubbly.

## 9. Typography System

The app uses size and color rather than many font families or weights.

### Common Sizes

| Usage | Size |
| --- | --- |
| Dashboard title | `1.4rem` |
| Standard page titles | `1.8rem` |
| Modal title | default with `fontWeight: 700` |
| Metric values | `2rem` |
| Body text | `0.9rem` to `1rem` |
| Secondary labels | `0.85rem` |
| Muted metadata | `0.75rem` to `0.8rem` |
| Tiny uppercase sidebar labels | `0.7rem` |

### Typical Weights

| Usage | Weight |
| --- | --- |
| Page titles | `700` |
| Metric values | `bold` |
| Buttons | `600` |
| Table headers | `600` |
| Pill labels | `bold` |

### Text Color Hierarchy

| Level | Color |
| --- | --- |
| Highest emphasis | `#fff` / `#f4f4f5` |
| Mid emphasis | `#d4d4d8` |
| Labels / metadata | `#a1a1aa` |
| Quiet labels | `#71717a` |
| Lowest emphasis | `#52525b` |

### Small-Caps Utility Labels

Frequently used in sidebars and micro-headings:

```tsx
fontSize: '0.7rem'
fontWeight: 600
textTransform: 'uppercase'
letterSpacing: '0.05em'
```

This is a major part of the admin-dashboard feel.

## 10. Header Styling

The header is a key signature element.

### Main Admin Header

Used on dashboard and most admin screens:

```tsx
background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
padding: '1.5rem 2rem'
boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)'
```

The shadow is subtle but colored, which makes the header glow slightly instead of casting a neutral shadow.

### Header Inner Layout

```tsx
maxWidth: '1400px'
margin: '0 auto'
display: 'flex'
justifyContent: 'space-between'
alignItems: 'center'
```

### Back Link Style

Back links are understated:

- `rgba(255,255,255,0.7)` text
- no underline
- around `0.9rem`
- displayed as block above the main title

## 11. Surface Styling

Most surfaces use a semi-transparent dark glass aesthetic.

### Standard Panel / Card

```tsx
background: 'rgba(255, 255, 255, 0.04)'
border: '1px solid rgba(255, 255, 255, 0.08)'
borderRadius: '16px'
```

### Sidebar Panel

Slightly subtler:

```tsx
background: 'rgba(255, 255, 255, 0.03)'
border: '1px solid rgba(255, 255, 255, 0.06)'
borderRadius: '10px'
```

### Frosted Login / Unauthorized Cards

These are more "hero" surfaces:

```tsx
background: 'rgba(255, 255, 255, 0.06)'
backdropFilter: 'blur(10px)'
border: '1px solid rgba(255, 255, 255, 0.08)'
borderRadius: '8px'
```

This gives the auth screens a more polished, almost glassmorphic feel compared to the admin tables.

## 12. Buttons

Buttons are color-driven and highly consistent.

### Create Button

Used at the top of manager screens:

```tsx
background: 'linear-gradient(135deg, #14b8a6, #0d9488)'
color: '#fff'
padding: '0.75rem 1.5rem'
borderRadius: '10px'
border: 'none'
fontWeight: '600'
display: 'flex'
alignItems: 'center'
gap: '0.5rem'
```

Meaning:

- add
- create
- positive forward action

### Primary Modal Submit Button

```tsx
background: 'linear-gradient(135deg, #a855f7, #ec4899)'
color: '#fff'
padding: '0.75rem'
borderRadius: '10px'
border: 'none'
fontWeight: '600'
```

Meaning:

- main action inside forms
- create or update

### Secondary Modal Cancel Button

```tsx
background: 'rgba(255, 255, 255, 0.08)'
color: '#f4f4f5'
border: '1px solid rgba(255, 255, 255, 0.1)'
padding: '0.75rem'
borderRadius: '10px'
fontWeight: '600'
```

### Edit Button

```tsx
background: '#a855f7'
color: '#fff'
padding: '0.5rem 0.75rem'
borderRadius: '8px'
fontSize: '0.85rem'
fontWeight: '600'
display: 'flex'
alignItems: 'center'
gap: '0.4rem'
```

### Delete Button

```tsx
background: '#f43f5e'
color: '#fff'
padding: '0.5rem 0.75rem'
borderRadius: '8px'
fontSize: '0.85rem'
fontWeight: '600'
display: 'flex'
alignItems: 'center'
gap: '0.4rem'
```

### Logout Button

The logout button is intentionally quieter than primary CTA buttons:

```tsx
background: 'rgba(255, 255, 255, 0.1)'
border: '1px solid rgba(255, 255, 255, 0.2)'
color: '#fff'
padding: '0.625rem 1.25rem'
borderRadius: '10px'
```

Hover:

```tsx
background: 'rgba(255, 255, 255, 0.15)'
```

## 13. Inputs and Form Controls

Inputs, selects, and textareas are intentionally similar so forms feel uniform.

### Standard Input Style

```tsx
width: '100%'
background: 'rgba(255, 255, 255, 0.04)'
border: '1px solid rgba(255, 255, 255, 0.08)' // sometimes 0.1
borderRadius: '8px' or '10px'
padding: '0.75rem'
color: '#f4f4f5'
```

### Search Input Style

```tsx
width: '100%'
background: 'rgba(255, 255, 255, 0.04)'
border: '1px solid rgba(255, 255, 255, 0.08)'
borderRadius: '10px'
padding: '0.75rem 1rem 0.75rem 2.5rem'
color: '#f4f4f5'
fontSize: '0.95rem'
```

### Labels

```tsx
color: '#a1a1aa'
fontSize: '0.9rem'
display: 'block'
marginBottom: '0.5rem'
```

### Checkboxes

Checkboxes use native controls with:

```tsx
accentColor: '#a855f7'
width: '18px'
height: '18px'
```

That small accentColor detail helps the forms stay on-brand.

## 14. Tables

Tables are a major part of the repo's style.

### Table Container

```tsx
background: 'rgba(255, 255, 255, 0.04)'
borderRadius: '16px'
overflow: 'hidden'
border: '1px solid rgba(255, 255, 255, 0.08)'
```

### Header Row

```tsx
background: 'rgba(255, 255, 255, 0.04)'
```

### Header Cell

```tsx
color: '#a1a1aa'
padding: '1rem'
fontWeight: 600
fontSize: '0.85rem'
textAlign: 'left'
```

### Body Row Divider

```tsx
borderTop: '1px solid rgba(255, 255, 255, 0.05)'
```

### Body Cell

Primary cell text:

```tsx
color: '#f4f4f5'
padding: '1rem'
```

Secondary cell text:

```tsx
color: '#d4d4d8'
padding: '1rem'
```

Muted metadata cell:

```tsx
color: '#a1a1aa'
padding: '1rem'
fontSize: '0.85rem'
```

### Table Personality

These tables do not feel enterprise-gray.

What makes them distinctive:

- dark translucent backgrounds
- soft borders instead of strong grid lines
- lots of rounded framing
- bright action buttons inside rows
- muted headers rather than stark white headers

## 15. Cards

The repo uses two main card styles.

### Metric Card

```tsx
background: 'rgba(accent, 0.1)'
border: '1px solid rgba(accent, 0.3)'
borderRadius: '12px'
padding: '1rem'
```

Text:

- label: `#a1a1aa`, `0.85rem`
- value: `#f4f4f5`, `2rem`, bold

### Content Card

Used for image cards and caption example cards:

```tsx
background: 'rgba(255, 255, 255, 0.04)'
border: '1px solid rgba(255, 255, 255, 0.08)'
borderRadius: '16px'
padding: '1rem' to `1.25rem`
```

When media is present:

- media block usually sits at the top
- content sits below with `padding`
- card content is stacked vertically

## 16. Badges and Pills

Badges are bright, compact, and highly legible.

### Standard Pill

```tsx
padding: '0.25rem 0.5rem'
borderRadius: '6px'
fontSize: '0.7rem'
fontWeight: 'bold'
color: '#fff'
```

Examples:

- public: teal
- common use: orange
- featured: yellow
- admin: purple
- study: teal
- matrix: orange
- counts: pink

### Softer Rounded Metadata Pills

Some newer pages use translucent colored backgrounds with pill radii:

```tsx
borderRadius: '999px'
padding: '0.3rem 0.55rem'
fontSize: '0.78rem'
```

This gives LLM-related audit screens a more token-like look.

## 17. Modals

Modals are extremely consistent and easy to reuse.

### Overlay

```tsx
position: 'fixed'
top: 0
left: 0
right: 0
bottom: 0
background: 'rgba(0, 0, 0, 0.8)'
display: 'flex'
alignItems: 'center'
justifyContent: 'center'
zIndex: 1000
```

### Modal Card

```tsx
background: '#1a1025'
borderRadius: '16px'
padding: '2rem'
maxWidth: '500px' // sometimes 520px
width: '90%'
border: '1px solid rgba(255, 255, 255, 0.1)'
```

For longer forms:

- `maxHeight: '90vh'`
- `overflowY: 'auto'`

### Modal Content Traits

- large bold title
- stacked fields with `1rem` to `1.5rem` vertical spacing
- two-button action row at the bottom
- dark inputs and bright submit button

This is one of the easiest patterns to transplant into another repo.

## 18. Authentication and Empty-State Style

The login and unauthorized pages are more centered and dramatic than the admin CRUD pages.

### Positioning

```tsx
minHeight: '100vh'
paddingTop: '15vh'
maxWidth: '700px'
margin: '0 auto'
padding: '0 1.5rem'
```

This intentionally places the auth card above center, which feels more like a landing panel than a centered modal.

### Unique Traits

- stronger gradient backgrounds
- frosted card
- top accent border
- icon on the left, content in the middle, CTA on the right

That arrangement makes the auth screens feel like polished system notices rather than plain forms.

## 19. Icons

The repo uses `lucide-react`.

### Icon Behavior

- small sizes, usually `13` to `18`
- icons often inherit accent colors
- icons are paired tightly with text
- icons are used for admin affordances, not decoration

Examples:

- search icon embedded inside search inputs
- metric icons in dashboard overview
- edit/delete icons in buttons
- status icons like lock, shield, thumbs up/down, activity

## 20. Motion and Hover Behavior

Animation is intentionally light.

Patterns:

- buttons use `transition: 'all 0.2s'` occasionally
- login / unauthorized CTAs translate upward by `1px` on hover
- logout button increases background opacity on hover

This small motion contributes to polish without making the UI feel animated.

## 21. Image and Media Treatment

Images in cards are treated carefully:

- media sits in a black frame when shown in image/caption cards
- `objectFit` varies between `cover` and `contain` based on context
- thumbnails use small rounded corners like `6px`

Common rules:

```tsx
background: '#000'
display: 'flex'
alignItems: 'center'
justifyContent: 'center'
```

Thumbnail:

```tsx
width: '36px'
height: '36px'
borderRadius: '6px'
objectFit: 'cover'
```

Large media:

```tsx
maxWidth: '100%'
maxHeight: '100%'
objectFit: 'contain'
```

## 22. What Makes This Repo Look Unique

If you want another project to feel "like this one," these are the non-negotiables:

1. Use the deep plum background `#0d0a1c` instead of generic black or slate.
2. Use the purple-to-pink gradient header.
3. Use translucent white-on-dark surfaces, not flat solid cards.
4. Keep corners rounded: `10px`, `12px`, `16px`.
5. Use `Space Grotesk` as the default font.
6. Use bright, section-specific accent colors for stats and navigation.
7. Keep tables dark and soft, not traditional white-grid admin tables.
8. Use bright edit and delete buttons inside rows.
9. Use compact uppercase micro-labels in sidebars and section headers.
10. Keep layouts centered and fixed-width, especially `maxWidth: '1400px'`.

Without those choices, the UI may still be dark, but it will not feel like this repo.

## 23. Reusable Token Set for Another Repo

If you want to transplant the visual language, start with these tokens.

```ts
export const styleGuide = {
  colors: {
    background: '#0d0a1c',
    surface: 'rgba(255, 255, 255, 0.04)',
    surfaceSoft: 'rgba(255, 255, 255, 0.03)',
    surfaceStrong: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderSoft: 'rgba(255, 255, 255, 0.05)',
    modal: '#1a1025',
    text: '#f4f4f5',
    textSecondary: '#d4d4d8',
    textMuted: '#a1a1aa',
    textQuiet: '#71717a',
    textFaint: '#52525b',
    purple: '#a855f7',
    pink: '#ec4899',
    teal: '#14b8a6',
    tealDark: '#0d9488',
    orange: '#f97316',
    red: '#f43f5e',
    yellow: '#eab308',
    cyan: '#22d3ee',
    indigo: '#818cf8',
  },
  gradients: {
    header: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    primary: 'linear-gradient(135deg, #a855f7, #ec4899)',
    create: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    danger: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    card: '16px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
}
```

## 24. Porting Checklist

To make another repo look similar:

1. Set the app background to `#0d0a1c`.
2. Load `Space Grotesk`.
3. Create a shared header using the purple-pink gradient.
4. Use centered content with `maxWidth: 1400px`.
5. Build translucent panel components using `rgba(255,255,255,0.03/0.04)`.
6. Use rounded corners across everything.
7. Style inputs with dark translucent fills and light borders.
8. Style create buttons teal and submit buttons purple-pink.
9. Style edit buttons purple and delete buttons rose.
10. Build tables with dark translucent containers and muted headers.
11. Add tinted metric cards using accent-color alpha backgrounds.
12. Keep metadata small and muted.
13. Use small uppercase labels for section headings.
14. Use Lucide icons in accent colors.

## 25. Suggested Refactor If You Want to Reuse This Style

If you plan to reuse this style in multiple repos, the best improvement would be to centralize it into:

- a token file for colors, spacing, radii, and gradients
- shared components for:
  - `PageShell`
  - `GradientHeader`
  - `MetricCard`
  - `DataTableShell`
  - `PrimaryButton`
  - `SecondaryButton`
  - `EditButton`
  - `DeleteButton`
  - `ModalShell`
  - `SearchToolbar`

That would preserve the visual identity while making the system much easier to maintain.

## 26. Summary

This repo’s look is defined by:

- dark plum background
- purple/pink gradient headers
- translucent white overlays
- soft borders
- heavy rounding
- bright semantic accent colors
- compact admin spacing
- `Space Grotesk` typography
- dark tables and polished modals

If you preserve those ingredients, another repo will feel very close to this one even if the exact content changes.
