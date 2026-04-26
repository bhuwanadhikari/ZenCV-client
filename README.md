# ZenCV

ZenCV is a Chrome extension that reads the active tab, turns the page HTML into a cleaned job description, and then generates a tailored CV and cover letter inside the popup.

Backend Repo: https://github.com/bhuwanadhikari/ZenCV-server

## How To Run Locally

1. Copy the example file and adjust values as needed:

```bash
cp .env.example .env
```

Supported variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000
VITE_AI_MODEL_NAME=gpt-4.1-mini
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_FILE_NAME_PREFIX=my
```

These are build-time values: `VITE_API_BASE_URL` (or `VITE_BACKEND_URL`) powers API calls and host permissions, `VITE_AI_MODEL_NAME` is used for CV generation, `VITE_GOOGLE_CLIENT_ID` enables Google sign-in from the Settings tab, and `VITE_FILE_NAME_PREFIX` sets the default export filename prefix. Rebuild and reload the extension after changing `.env`.

2. Install dependencies:

```bash
npm install
```

3. Build in watch mode for extension development:

```bash
npm run dev
```

4. Open `chrome://extensions`, turn on Developer mode, then use `Load unpacked` to load `dist/`.

5. Reload the extension after rebuilds when needed.

If you want to work on the popup UI in a regular browser tab, you can also run:

```bash
npm run web
```

That mode is useful for styling, but Chrome tab APIs are unavailable there, so reading the active page HTML only works in the installed extension.

For a production build:

```bash
npm run build
```

The production extension is emitted to `dist/`.

The extension expects a backend that exposes:

- `POST /api/auth/google/callback`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/job-description/process`
- `POST /api/cv/generate`
- `POST /api/cover-letter/generate`

By default it points to `http://localhost:8000`.

## Features

- Job Description tab that reads the current page HTML with the Chrome `scripting` API and sends it to the backend for processing
- CV tab that generates a structured CV from the processed job description, previews it in the popup, and exports it through the browser print dialog
- Cover Letter tab that generates a cover letter, opens a Gmail compose draft, or exports through the browser print dialog
- Settings tab that shows the API base URL and AI model baked in at build time

## Adding More CV Templates

To add a new CV template:

1. Create a new template component file in `src/popup/cv/cv-templates`, for example `CVTemplate7.tsx`.
2. Follow the shape used by an existing template such as `CVTemplate6.tsx`.
3. Register the new template in `cvTemplates.tsx` by importing it, adding its ID to `CvTemplateId`, and appending it to the `cvTemplates` array with a label and description.

You can also ask ChatGPT to draft `CVTemplate7.tsx` for you. The easiest way is to give it a strong prompt describing the visual style you want and include one existing file, like `CVTemplate6.tsx`, as the reference example so it preserves the current component structure and prop contract.

Sample prompt:

```text
Create a new React component called CVTemplate7.tsx for this project.

Use CVTemplate6.tsx as the reference for component structure, prop names, typing, and overall conventions. Keep the same input contract so it works with the existing cvTemplates registry.

Design goal:
- Make it visually distinct from the existing templates
- Keep it professional and printable on A4
- Preserve good spacing and readability for long experience sections
- Use the provided cv data only; do not invent new fields
- Respect previewZoom like the existing templates do

Output:
- Return the full contents of CVTemplate7.tsx only
- Keep imports consistent with the current codebase
- Make sure it can be dropped into src/popup/cv/cv-templates and then registered in cvTemplates.tsx

Reference file:
- src/popup/cv/cv-templates/CVTemplate6.tsx
```

## Usage Flow

1. Open a job posting page in Chrome.
2. Open the ZenCV extension popup.
3. Review the processed text in the Job Description tab.
4. Open the CV tab to preview and export the generated CV.
5. Open the Cover Letter tab to preview, print, or open a Gmail compose draft.

## Known Constraints

- The extension cannot read restricted Chrome pages such as `chrome://*`, the Chrome Web Store, or other extension pages
- Changing the API origin requires rebuilding so the manifest host permissions stay in sync
- Export uses the browser print flow rather than generating PDF files directly

Open work is tracked in [TODO.md](https://github.com/bhuwanadhikari/ZenCV-client/blob/main/TODO.md).

## Preview

### Job Description

![Job Description Preview](./src/images/Screenshot%202026-04-02%20at%2016.36.16.png)

### CV Workspace

![CV Workspace Preview](./src/images/Screenshot%202026-04-02%20at%2016.36.54.png)

### Cover Letter

![Cover Letter Preview](./src/images/Screenshot%202026-04-02%20at%2016.37.15.png)
