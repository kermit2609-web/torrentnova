export type Category = 'All' | 'Movies' | 'Series' | 'Music' | 'Books' | 'Software'
export type View = 'discover' | 'search' | 'downloads' | 'library' | 'plugins' | 'settings'
export type Torrent = { id: string; title: string; category: Exclude<Category, 'All'>; size: string; seeders: number; leechers: number; age: string; provider: string; verified: boolean; description: string; tags: string[] }
export type Plugin = { id: string; name: string; description: string; version: string; enabled: boolean; kind: string }

export const demoTorrents: Torrent[] = [
  { id: 'tn-001', title: 'The Aurora Files — Season 01', category: 'Series', size: '4.8 GB', seeders: 842, leechers: 38, age: '2h ago', provider: 'Nova Demo', verified: true, description: 'A fictional, public-domain sci-fi anthology for testing TorrentNova discovery flows.', tags: ['1080p', 'HEVC', 'Public domain'] },
  { id: 'tn-002', title: 'Midnight Transit (Restored)', category: 'Movies', size: '2.1 GB', seeders: 514, leechers: 12, age: '5h ago', provider: 'Nova Demo', verified: true, description: 'Demo metadata for an original film entry. No real torrent source is contacted.', tags: ['4K', 'Restored', 'CC'] },
  { id: 'tn-003', title: 'Signal / Noise — Live Sessions', category: 'Music', size: '684 MB', seeders: 207, leechers: 9, age: '1d ago', provider: 'Open Archive Demo', verified: false, description: 'A sample music collection used to exercise search and library states.', tags: ['FLAC', 'Live', 'Audio'] },
  { id: 'tn-004', title: 'Field Notes for a Small Planet', category: 'Books', size: '18 MB', seeders: 96, leechers: 3, age: '2d ago', provider: 'Nova Demo', verified: true, description: 'A fictional open-license book record for the discovery center.', tags: ['EPUB', 'Open license'] },
  { id: 'tn-005', title: 'Nebula Toolkit 1.4', category: 'Software', size: '126 MB', seeders: 71, leechers: 7, age: '3d ago', provider: 'Authorized Lab', verified: true, description: 'Placeholder software package from an authorized provider integration.', tags: ['Linux', 'Tools', 'x64'] },
  { id: 'tn-006', title: 'Cosmic Gardens — Season 02', category: 'Series', size: '7.3 GB', seeders: 364, leechers: 29, age: '4d ago', provider: 'Nova Demo', verified: false, description: 'Demo series result with realistic-looking but entirely fictional metadata.', tags: ['720p', 'Documentary'] }
]

export const categories: Category[] = ['All', 'Movies', 'Series', 'Music', 'Books', 'Software']
export const initialPlugins: Plugin[] = [
  { id: 'demo', name: 'Nova Demo Provider', description: 'Safe, offline sample catalog for development and demos.', version: '0.1.0', enabled: true, kind: 'Discovery provider' },
  { id: 'archive', name: 'Authorized Archive Adapter', description: 'Provider interface placeholder for future lawful integrations.', version: '0.1.0', enabled: false, kind: 'Discovery provider' }
]
