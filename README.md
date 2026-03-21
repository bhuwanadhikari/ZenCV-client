# GenCV Browser Extension

GenCV is a Chrome extension that reads the active job page, extracts the visible job description, and uses a backend AI service to generate tailored application assets inside the popup UI.

The extension is built around a simple workflow:

1. Open a job posting in Chrome.
2. Launch the GenCV popup.
3. Review the extracted page text in the `Job Description` tab.
4. Generate a tailored CV preview in the `CV` tab.
5. Generate a tailored cover letter in the `Cover Letter` tab.
6. Export the result through the browser print flow as PDF.

## Product Overview

GenCV is designed for fast application prep directly from a job listing. Instead of copying a role description into a separate app, the extension reads the active page and keeps the job context available across the popup.

Current popup areas:

- `Job Description`: displays the text extracted from the active browser tab.
- `CV`: requests generated CV data from the backend, renders a formatted preview, and supports PDF export through the print dialog.
- `Cover Letter`: requests a generated cover letter, shows it in a readable preview, supports Gmail compose, and supports PDF export through print.
- `Setting`: shows the build-time API base URL and AI model configured through `.env`.

## Key Features

- Reads visible page text from the active Chrome tab using the `chrome.scripting` API.
- Generates CV content from a backend endpoint and normalizes flexible response payloads into a consistent UI model.
- Generates cover letters from a dedicated backend endpoint.
- Shows generation state with retry controls and endpoint visibility in the UI.
- Scales the CV preview to fit the popup while preserving A4-style output for printing.
- Uses browser-native print/export flows instead of bundling a PDF library.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Chrome Extension Manifest V3
- `@crxjs/vite-plugin` for extension bundling
- Tailwind CSS for styling
- React Query for async API state
- Zustand for popup tab state
- Lucide React for icons

## Architecture Notes

The extension is a popup-first app with no background service worker in this repo yet. The popup bootstraps React from [`src/popup/main.tsx`](src/popup/main.tsx), creates a shared React Query client, and renders the main tabbed interface in [`src/popup/App.tsx`](src/popup/App.tsx).


This normalization allows the backend to evolve without forcing a strict one-shape-only frontend contract.

## Environment Variables

Copy `.env.example` to `.env` and adjust values for your backend.

```bash
cp .env.example .env
```

Supported variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_AI_MODEL_NAME=gpt-4.1-mini
```

`VITE_API_BASE_URL` is also used to build the extension host permission at build time.

## Local Development

Install dependencies:

```bash
npm install
```

Run the extension build in watch mode:

```bash
npm run dev
```

This produces an updated extension build you can load in Chrome.

For a regular browser preview of the popup UI:

```bash
npm run web
```

Note: the plain Vite web page does not expose Chrome extension APIs, so active-tab text extraction will not work there.

## Build and Load in Chrome

Create a production build:

```bash
npm run build
```

Then load the generated extension in Chrome:

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the generated `dist` directory.

After changing `.env`, rebuild the extension so the popup and manifest pick up the new values.


## Scripts

- `npm run dev`: watch build for extension development
- `npm run build`: type-check and create a production build
- `npm run web`: run the popup UI as a regular Vite app
- `npm run preview`: preview the production Vite build
