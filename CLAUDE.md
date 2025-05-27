# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AITuber List (https://aituberlist.net/) - A directory website for AI VTubers built with Next.js 14, TypeScript, and Tailwind CSS. The site uses static site generation and is deployed on Vercel/Cloudflare Pages.

## Common Development Commands

```bash
# Development
npm run dev        # Start development server on localhost:3000
npm run build      # Build static site to /out directory
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
- **AituberList Component** (`components/aituber-list.tsx`): Main listing component with filtering, sorting, and display modes
- **Language Context** (`contexts/LanguageContext.tsx`): Manages Japanese/English translations
- **i18n System** (`lib/i18n.ts`): Translation strings for UI elements

### Key Configuration
- **Static Export**: Site generates static HTML (`output: 'export'` in next.config.mjs)
- **Image Optimization**: YouTube thumbnails configured with specific domains
- **Path Aliases**: Use `@/*` for imports from project root
- **UI Components**: shadcn/ui components in `components/ui/`

### API Keys & Environment
- YouTube API key required for data updates (set in GitHub Actions)
- No frontend environment variables needed for development

### Deployment
- Main deployment on Vercel
- Cloudflare Pages compatibility via `wrangler.toml`
- Static files output to `/out` directory