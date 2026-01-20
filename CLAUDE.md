# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AITuber List (https://aituberlist.net/) - A directory website for AI VTubers built with Next.js 14, TypeScript, and Tailwind CSS. The site uses static site generation and is deployed on Vercel/Cloudflare Pages.

## Common Development Commands

```bash
# Development
npm run dev        # Start development server on localhost:3000
npm run build      # Build static site to /out directory
npm run start      # Start production server
npm run lint       # Run ESLint

# Data Management (requires Python environment)
python scripts/update_aitubers.py  # Update AITuber data from YouTube API
python scripts/add_aitubers.py     # Add new AITubers to the list
```

## Architecture & Key Components

### Data Flow
1. AITuber data stored in `app/data/aitubers.json`
2. Data updates twice daily (9 AM and 21:00 JST) via GitHub Actions
3. Python scripts fetch data from YouTube Data API and TikTok
4. Static site regeneration on data updates

### Core Components
- **AituberList Component** (`components/aituber-list/index.tsx`): Main listing component with filtering, sorting, and display modes
  - Subcomponents: `FilterPanel`, `SortControls`, `AituberCard`, `AituberListItem`, `LazyVideo`, `AITuberImage`
  - Types defined in `components/aituber-list/types.ts`
- **Language Context** (`contexts/LanguageContext.tsx`): Manages multi-language support
- **i18n System** (`lib/i18n.ts`): Translation strings for 5 locales (ja, en, zh-CN, zh-TW, ko)

### Custom Hooks (`hooks/`)
- `useFavorites`: Manages favorite AITubers with localStorage persistence
- `useUrlState`: Syncs filter state with URL query parameters
- `useInfiniteScroll`: Handles pagination with Intersection Observer
- `useAituberFilters`: Centralizes filtering logic
- `useAituberSort`: Handles sorting logic with random shuffle support

### Key Configuration
- **Static Export**: Site generates static HTML (`output: 'export'` in next.config.mjs)
- **Image Optimization**: YouTube thumbnails configured with specific domains
- **Path Aliases**: Use `@/*` for imports from project root
- **UI Components**: shadcn/ui components in `components/ui/`

## Python Scripts

### update_aitubers.py
- Updates subscriber counts and latest video information
- Handles YouTube premieres and upcoming streams
- Requires `YOUTUBE_API_KEY` environment variable

### add_aitubers.py
- Adds new AITubers via OpenAI API or direct YouTube URLs
- Supports batch processing from files
- Falls back to `YOUTUBE_API_KEY2` if primary key exhausted
- Requires `OPENAI_API_KEY` for AI-powered data extraction

## API Keys & Environment
- **YOUTUBE_API_KEY**: Required for data updates
- **YOUTUBE_API_KEY2**: Fallback YouTube API key
- **OPENAI_API_KEY**: Required for AI-powered AITuber additions
- No frontend environment variables needed for development

## Deployment
- Main deployment on Vercel
- Cloudflare Pages compatibility via `wrangler.toml`
- Static files output to `/out` directory
- GitHub Actions handle automated updates and deployments