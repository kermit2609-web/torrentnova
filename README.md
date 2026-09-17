# TorrentNova

TorrentNova is an original, responsive torrent discovery and media workspace foundation. This milestone is intentionally safe: it uses a local fictional catalog and does not connect to torrent indexes, download peers, or external content sources.

## Features in this milestone

- Vite + React + TypeScript application shell with original Nova branding
- Responsive desktop/mobile navigation for Discover, Search, Downloads, Library, Plugins, and Settings
- Dark/light theme toggle
- Discovery Center with category filters and demo catalog
- Search results, torrent detail modal, and safe demo download queue
- Provider and plugin registry interfaces for future lawful/authorized integrations
- Settings foundation and library/download states

## Run locally

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```bash
npm run build
npm run preview
```

## Testing

`npm run build` is the current smoke test: it runs TypeScript compilation and creates a production bundle. Manual test coverage should include navigation, theme switching, search/filtering, opening details, adding a demo item to Downloads, and responsive layouts.

## Safety and provider model

`src/services.ts` defines `DiscoveryProvider`, `DemoDiscoveryProvider`, `DownloadTask`, and `PluginRegistry`. Future integrations should be opt-in, documented, lawful, and restricted to authorized sources. The demo provider is offline and fictional.

## Roadmap

Persistent downloads, real provider permission UX, plugin sandboxing/signing, media playback, durable storage, automated component tests, and an OS-level download engine remain to be built.
