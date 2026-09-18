# TorrentNova

TorrentNova Phase 2 is an original, responsive discovery workspace using a fictional offline catalog. It does not connect to torrent indexes, peer networks, or external content sources.

## Implemented

- Vite + React + TypeScript shell with original branding and responsive navigation
- Discover, Search, Downloads, Library, Plugins, and Settings sections
- Dark/light theme toggle
- Discovery Center feeds: Today's Torrents, Recently Added, Trending, Most Seeded, and Recently Updated
- Categories: All, Movies, TV / Series, Music, Games, Software, Books, Other, and separated Adult
- Universal search controls for text, category, sort, provider, and verified status
- Torrent details with metadata, tags, and clearly labeled technical placeholders
- Provider contracts and result aggregation with deduplication and error isolation
- Demo download-task architecture with lifecycle states and transfer placeholders

## Run

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. For a production smoke build:

```bash
npm run build
npm run preview
```

## Safety boundary

Only `Nova Demo Provider` is active. Records are fictional and local. The download queue never opens peer connections or transfers files. Future providers must be opt-in, lawful, authorized, and documented. No DRM, access-control, or authentication bypass functionality is included.

## Remaining work

Persistent storage, a real download engine, file selection, bandwidth enforcement, plugin sandboxing/signing, provider authorization UX, media playback, automated tests, and production accessibility review remain unimplemented.
