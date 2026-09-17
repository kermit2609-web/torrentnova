import type { Torrent } from './data'

export interface DiscoveryProvider { id: string; name: string; search(query: string): Promise<Torrent[]> }
export interface DownloadTask { id: string; torrent: Torrent; status: 'queued' | 'downloading' | 'paused' | 'complete'; progress: number; speed: string }

export class DemoDiscoveryProvider implements DiscoveryProvider {
  id = 'nova-demo'; name = 'Nova Demo Provider'
  constructor(private catalog: Torrent[]) {}
  async search(query: string) { const needle = query.trim().toLowerCase(); return needle ? this.catalog.filter(t => `${t.title} ${t.category} ${t.tags.join(' ')}`.toLowerCase().includes(needle)) : this.catalog }
}

export class PluginRegistry {
  private providers = new Map<string, DiscoveryProvider>()
  register(provider: DiscoveryProvider) { this.providers.set(provider.id, provider) }
  list() { return [...this.providers.values()] }
  async search(query: string) { const results = await Promise.all([...this.providers.values()].map(p => p.search(query))); return results.flat() }
}
