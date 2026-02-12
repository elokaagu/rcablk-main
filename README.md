# RCA BLK

Royal College of Art Association of Black Students, Alumni & Friends website.

## Tech Stack

- **Next.js 15** (App Router)
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- TanStack Query

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
