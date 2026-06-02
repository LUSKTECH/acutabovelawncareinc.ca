# Subtle motion design — A Cut Above Lawn Care

**Date:** 2026-06-02
**Status:** Approved (design); pending implementation plan

## Goal

The WordPress→Next.js migration dropped the small amount of animation the old
site had, which made the new site feel flatter / more static. Add tasteful,
modern motion that reinforces content hierarchy without feeling busy, and
without regressing accessibility or the Lighthouse performance budget.

Approved motion level: "richer / noticeable" — scroll reveals, a hero entrance,
animated stats, and hero parallax.

## Non-negotiable constraints

- **Native, zero new dependencies.** No Framer Motion / Motion One. ~2–3KB of
  our own client JS total.
- **`prefers-reduced-motion` is honored** for every effect — reduced-motion
  users get the final state instantly (content visible, stats at final value,
  no drift).
- **No-JS safe.** If JS never runs, no content is trapped behind an animation.
- **No CLS / no scroll jank.** Transform/opacity only; CountUp reserves space;
  parallax runs off the main thread.

## Core mechanism — progressive enhancement

A single client component, `ScrollReveal`, is mounted once in the marketing
layout. On mount:

1. If `matchMedia('(prefers-reduced-motion: reduce)').matches` → do nothing and
   return. (No class added → nothing is hidden.)
2. Otherwise add a `js-reveal` class to `<html>`, then create one
   `IntersectionObserver` that adds `.reveal-in` to every `[data-reveal]`
   element as it enters the viewport, unobserving each after it fires (one-shot).
3. Disconnect the observer on unmount. Renders `null`.

The pre-reveal hidden state is **scoped to `html.js-reveal`** and gated by the
reduced-motion media query:

```css
@media (prefers-reduced-motion: no-preference) {
  html.js-reveal [data-reveal] {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .5s ease-out, transform .5s ease-out;
  }
  html.js-reveal [data-reveal].reveal-in { opacity: 1; transform: none; }
  /* stagger for grid children */
  html.js-reveal [data-reveal-delay="1"] { transition-delay: .06s; }
  html.js-reveal [data-reveal-delay="2"] { transition-delay: .12s; }
  html.js-reveal [data-reveal-delay="3"] { transition-delay: .18s; }
  html.js-reveal [data-reveal-delay="4"] { transition-delay: .24s; }
}
```

Consequence: without JS, or with reduced-motion, `html.js-reveal` is never
present → elements keep their natural (visible) state. Server components stay
server components; they only add `data-reveal` (and optional `data-reveal-delay`).

## Components (units)

### `components/motion/ScrollReveal.tsx` (client)
- Purpose: enable scroll reveals via one shared observer.
- Interface: no props; render `null`; mount once in `app/(marketing)/layout.tsx`.
- Depends on: DOM `IntersectionObserver`, `matchMedia`.

### `components/motion/CountUp.tsx` (client)
- Purpose: animate a number from 0 → target when first scrolled into view.
- Props: `to: number`, `decimals?: number` (default 0), `suffix?: string`
  (e.g. `"+"`, `"★"`), `durationMs?: number` (default ~1200).
- Behavior: IntersectionObserver (one-shot) triggers a `requestAnimationFrame`
  ease-out tween. Reduced-motion → render the final value immediately, no tween.
- CLS guard: container uses `tabular-nums` and reserves the final width (render
  the final string in a visually-hidden sizer, or `min-width`), so the digit
  changes never shift layout.
- Depends on: DOM `IntersectionObserver`, `requestAnimationFrame`, `matchMedia`.

### CSS (`app/globals.css`)
- Reveal base/visible/stagger rules (above).
- Hero entrance: keyframes + helper classes, gated by `no-preference`.
- Parallax: gated by `no-preference` **and** `@supports (animation-timeline: view())`.

## The four effects

1. **Scroll reveals** — section wrappers and grid cards fade in + rise 12px on
   entry, staggered ~60ms across a row. Applied across homepage, service detail,
   services index, gallery, about, service-areas, and city pages.
2. **Hero entrance** — CSS-only, one-time staggered fade/rise of eyebrow →
   headline → subtitle → CTAs on load. Homepage `Hero` and city page hero.
   Implemented with keyframes + `animation-delay`; no JS, no observer.
3. **CountUp stats** — `SocialProof` stats become
   `<CountUp to={27} suffix="+" />` and `<CountUp to={4.4} decimals={1} suffix="★" />`.
4. **Hero parallax** — subtle (~±4%) vertical drift on the hero image via a CSS
   **scroll-driven** animation (`animation-timeline: view()`), with a slight
   `scale(1.05)` so edges never gap. Chromium animates it; browsers without
   scroll-driven-animation support simply render a static hero (graceful, no
   harm). Homepage `Hero` and city hero image.

## Files touched (server-side: attributes only)

- `app/(marketing)/layout.tsx` — mount `<ScrollReveal />`.
- `app/globals.css` — reveal, hero-entrance, parallax CSS.
- `components/home/Hero.tsx` — entrance classes on text; parallax class on image.
- `app/(marketing)/areas/[city]/page.tsx` — same hero entrance + parallax.
- `components/home/ValueProps.tsx`, `FeaturedServices.tsx`, `SocialProof.tsx`,
  `ClosingCta.tsx`, `ServiceAreasStrip.tsx` — `data-reveal` (+ delay on grid items).
- `components/service/ServiceCard.tsx` — accept an optional reveal-delay passthrough if needed for staggering grids.
- Section wrappers on services index, service detail, gallery, about,
  service-areas pages — `data-reveal`.
- `components/motion/ScrollReveal.tsx`, `components/motion/CountUp.tsx` — new.

## Accessibility & performance

- Every effect gated behind `prefers-reduced-motion: no-preference`.
- Transform/opacity only → composited; no reflow.
- Observers are one-shot (unobserve after firing).
- CountUp reserves width → CLS unaffected.
- Parallax via scroll-driven animation → no scroll listeners, no main-thread work.
- Target: Lighthouse performance score unchanged from current; CLS < 0.1.

## Testing

- Re-run the full suite after: `npm run lint`, `typecheck`, `test` (unit),
  `test:e2e` (248), `a11y` (pa11y-ci), and a local Lighthouse pass.
- Existing e2e should be unaffected: Playwright `toBeVisible()` ignores opacity,
  and in-viewport `[data-reveal]` elements reveal on load.
- Add light coverage: SocialProof renders the final stat values (27, 4.4); hero
  content present and reaches full opacity.
- Manual: dev server at 375 / 768 / 1280 widths, plus one pass with
  reduced-motion forced on (content visible, stats final, no drift).

## Out of scope (YAGNI)

- Carousels, page-transition animations, marquee/ticker effects.
- CountUp anywhere except the hero stats; parallax anywhere except the hero(es).
- Any animation library.
