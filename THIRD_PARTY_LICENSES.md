# TorrentNova

TorrentNova Phase 2 is an original, responsive discovery workspace using a fictional offline catalog. It does not connect to torrent indexes, peer networks, or external content sources.

## Implemented

- Vite + React + TypeScript application shell and original Nova branding
- Responsive desktop/mobile navigation for Discover, Search, Downloads, Library, Plugins, and Settings
- Dark/light theme toggle
- Discovery Center feeds: Today's Torrents, Recently Added, Trending, Most Seeded, and Recently Updated
- Categories: All, Movies, TV / Series, Music, Games, Software, Books, Other, and separated Adult
- Universal search controls for query, category, sort, provider, and verified status
- Torrent details with metadata, tags, and clearly labeled files/info-hash/magnet/.torrent placeholders
- Provider contracts for identity, status, capabilities, categories, search, feeds, and errors
- Result aggregation with deduplication, attribution, and provider failure isolation
- Demo download-task architecture covering queued, downloading, paused, stopped, completed, and failed statuses
- Plugin enable/disable foundation and settings foundation

## Run

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Production smoke build:

```bash
npm run build
npm run preview
```

## Safety boundary

Only `Nova Demo Provider` is active. All records are fictional and local. The download queue is a UI/state architecture only; it never opens peer connections or transfers files. Future providers must be opt-in, lawful, authorized, and documented. No DRM, access-control, or authentication bypass functionality is included.

## Testing

The build command is the current automated smoke test. Manual checks should cover all navigation, theme switching, category filtering including Adult opt-in, search sorting/filter controls, detail placeholders, demo queue states, plugin toggles, and responsive layouts. Automated unit tests remain a follow-up because no test runner dependency was added in this phase.

## Remaining work

Persistent storage, a real download engine, file selection, bandwidth enforcement, plugin sandboxing/signing, provider authorization UX, media playback, automated component tests, and production accessibility review remain unimplemented.

