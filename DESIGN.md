# Design Brief

## Direction

Aesthetic Street Wear — modern luxury mens fashion e-commerce with vibrant purple identity and clean white clarity.

## Tone

Refined minimalism with confident purple accents. Bold typography hierarchy and generous spacing over decoration, designed for premium retail impact.

## Differentiation

Vibrant purple CTAs commanding clean white surfaces. Sharp micro-interactions (add-to-cart pulse, wishlist heart) create memorable moments without noise.

## Color Palette

| Token          | OKLCH            | Role                           |
| -------------- | ---------------- | ------------------------------ |
| background     | 0.99 0.004 0     | Clean white page base          |
| foreground     | 0.15 0.01 0      | Near-black body text           |
| primary        | 0.52 0.21 290    | Vibrant purple CTAs & buttons  |
| accent         | 0.52 0.21 290    | Purple emphasis & highlights   |
| card           | 1.0 0.0 0        | Pure white product cards       |
| muted          | 0.95 0.01 0      | Light grey secondary surfaces  |
| destructive    | 0.55 0.22 25     | Red for delete/remove actions  |
| border         | 0.9 0.004 0      | Subtle borders & dividers      |

## Typography

- Display: Satoshi — friendly, modern, distinctive headings
- Body: Plus Jakarta Sans — contemporary, highly legible UI copy
- Scale: hero `text-5xl md:text-7xl font-bold`, h2 `text-3xl md:text-5xl font-bold`, label `text-sm font-semibold tracking-widest`, body `text-base md:text-lg`

## Elevation & Depth

Subtle card shadows (0 1px 3px @ 6%) for surface layering. Product cards elevate on hover with smooth 0.2s transition. Minimal shadow vocabulary keeps design clean.

## Structural Zones

| Zone    | Background      | Border              | Notes                                  |
| ------- | --------------- | ------------------- | -------------------------------------- |
| Header  | White (bg)      | Subtle grey (b-b)   | Logo, search, nav icons, account menu  |
| Hero    | White (bg)      | —                   | Large hero type, optional hero image   |
| Grid    | White (bg)      | —                   | Card-based product grid, gap-6 md:gap-8 |
| Footer  | Muted grey      | Subtle grey (b-t)   | Contact info, social links, nav        |
| Admin   | White/Grey      | Border cards        | Dashboard with data tables & forms     |

## Spacing & Rhythm

8px base unit. Section gaps 6rem–8rem. Card padding 1.5rem–2rem. Typography uses tracking-tight on display, tracking-widest on labels. Responsive: 4px padding mobile, 6px tablet, 8px desktop.

## Component Patterns

- Buttons: Purple (primary), white background (secondary), rounded-lg, px-6 py-3, font-semibold, hover:opacity-90, active:scale-95
- Cards: White bg, subtle border & shadow, rounded-lg, hover:shadow-elevated transition-smooth
- Forms: White input borders, purple focus ring, label text-label, helper text text-muted-foreground

## Motion

- Entrance: fade-in 0.3s on page load, products stagger 50ms
- Hover: button color shift 0.2s, card shadow lift 0.2s, icon rotate/scale 0.15s
- Decorative: pulse-soft 2s on new arrivals badge, wishlist heart bounce on toggle

## Constraints

- No gradients (except subtle background if needed)
- No neon or glow effects
- Purple used sparingly: CTAs, focus states, accents only
- Typography hierarchy enforced: no smaller than text-xs
- All interactive elements keyboard-accessible (focus ring visible)

## Signature Detail

Vibrant purple against pure white with generous breathing room. Every micro-interaction (add-to-cart, wishlist toggle, hover states) choreographed for premium retail feel without visual noise.


