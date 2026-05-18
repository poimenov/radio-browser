# Radio Browser

A lightweight React + Vite application for browsing and listening to online radio stations using the [Radio Browser](https://www.radio-browser.info/)  API.

## Features

- Browse and filter radio stations by name, country, tag, clicks, and votes
- View station details and open station homepage
- Mark stations as favorites

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Notes

- The app uses `HashRouter` for routing.
- Local storage is used for application settings and volume persistence.
- Favorites data are stored in the browser's IndexedDB.

## Deployment

This repo is configured for GitHub Pages deployment.

```bash
npm run deploy
```

Make sure `homepage` in `package.json` is set to the correct GitHub Pages URL.
