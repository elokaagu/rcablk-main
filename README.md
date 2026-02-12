# RCA BLK

Royal College of Art Association of Black Students, Alumni & Friends website.

## Tech Stack

- **Next.js 15** (App Router)
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- TanStack Query
- **Jubilat** (typography)

## Font Setup (Jubilat)

The site uses Jubilat throughout. To enable it:

1. **Adobe Fonts** (recommended): Create a web project at [fonts.adobe.com](https://fonts.adobe.com), add Jubilat, and copy your kit ID from the embed code. Add to `.env.local`:
   ```
   NEXT_PUBLIC_ADOBE_FONT_KIT_ID=your_kit_id
   ```

2. **Self-hosted**: Add Jubilat `.woff2` files to `public/fonts/` and uncomment the `@font-face` block in `src/app/globals.css`.

## Getting Started

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   ├── about/
│   ├── events/
│   ├── news/
│   └── ...
├── components/       # React components
├── data/            # Static data (events, news)
├── hooks/           # Custom hooks
└── lib/             # Utilities
```
