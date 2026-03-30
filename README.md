# CBrIM

## Stack

- Drizzle ORM ([Neon](https://neon.com/) as Serverless PostgreSQL)

## Bridge Viewer (Next.js + TypeScript + React Three Fiber + shadcn/ui)

This package is a multi-file viewer module for the `xara-bridge-model-export/v2` schema.

### Stack

- Next.js
- TypeScript
- @react-three/fiber
- @react-three/drei
- three
- zustand
- shadcn/ui

### Expected shadcn/ui components

Generate or ensure these exist in your app:

- button
- card
- tabs
- scroll-area
- separator
- badge
- checkbox
- switch
- slider
- input
- select
- accordion

### Suggested install

```bash
npm install three @react-three/fiber @react-three/drei zustand
```

### Suggested file placement

- `app/bridge-viewer/page.tsx`
- `components/bridge-viewer/*`
- `components/bridge-viewer/layers/*`
- `components/bridge-viewer/panels/*`
- `components/bridge-viewer/primitives/*`
- `lib/bridge-viewer/*`

### Notes

- This first version uses centerline rendering for line elements.
- Deck shells are rendered as quads with optional technical edges.
- Supports are symbolic.
- Bearings are shown as links plus compact box markers.
- Pile caps are rendered as explicit boxes.
- Selection, hover, filtering, load case switching, legend, tree, and report panels are included.
- The viewer can load a single local JSON now and can be swapped to API data later.
