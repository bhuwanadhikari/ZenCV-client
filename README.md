# GenCV

GenCV is a Chrome extension that reads the active job page and generates a tailored CV and cover letter inside the popup.

## What It Does

- Extracts job description text from the current tab
- Generates a CV preview
- Generates a cover letter
- Exports both through the browser print flow

## Tech

- React + TypeScript
- Vite + CRXJS
- Chrome Extension Manifest V3
- Tailwind CSS
- React Query
- Zustand

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Required env:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_AI_MODEL_NAME=gpt-4.1-mini
```

## Build

```bash
npm run build
```

Then load the `dist` folder in `chrome://extensions` using `Load unpacked`.
