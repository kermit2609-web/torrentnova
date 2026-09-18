import type { Category, SortOption, Torrent } from './data'

export type ProviderStatus = 'available' | 'disabled' | 'error'
export type ProviderCapability = 'search' | 'feeds' | 'categories'
export type ProviderError = { providerId: string; message: string }
export type DiscoveryFeed = 'today' | 'recent' | 'trending' | 'seeded' | 'updated'
export type ProviderResult = { providerId: string; providerName: string; results: Torrent[]; error?: ProviderError }
export type SearchFilters = { query: string; category: Category; sort: SortOption; verifiedOnly: boolean; provider: string }

export interface DiscoveryProvider {
  id: string
  name: string
  status: ProviderStatus
  capabilities: ProviderCapability[]
  categories: Category[]
  search(query: string, category?: Category): Promise<Torrent[]>
  feed(feed: DiscoveryFeed): Promise<Torrent[]>
}

export type DownloadStatus = 'queued' | 'downloading' | 'paused' | 'stopped' | 'completed' | 'failed'

export interface DownloadTask {
  id: string
  torrent: Torrent
  status: DownloadStatus
  progress: number
  downloadSpeed?: string
  uploadSpeed?: string
  eta?: string
  priority: 'low' | 'normal' | 'high'
  fileSelection?: 'all files' | 'custom (placeholder)'
  bandwidthLimit?: string
}

export class DemoDiscoveryProvider implements DiscoveryProvider {
  id = 'nova-demo'
  name = 'Nova Demo Provider'
  status: ProviderStatus = 'available'
  capabilities: ProviderCapability[] = ['search', 'feeds', 'categories']
  categories: Category[]

  constructor(private catalog: Torrent[]) {
    this.categories = [...new Set(catalog.map((item) => item.category))]
  }

  async search(query: string, category: Category = 'All') {
    const needle = query.trim().toLowerCase()

    return this.catalog
      .filter((item) => item.category !== 'Adult' || category === 'Adult')
      .filter((item) => category === 'All' || item.category === category)
      .filter((item) => !needle || `${item.title} ${item.category} ${item.tags.join(' ')}`.toLowerCase().includes(needle))
  }

  async feed(feed: DiscoveryFeed) {
    const visible = this.catalog.filter((item) => item.category !== 'Adult')

    if (feed === 'seeded' || feed === 'trending') {
      return [...visible].sort((a, b) => b.seeders - a.seeders)
    }

    if (feed === 'updated') {
      return [...visible].sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    }

    return [...visible].sort((a, b) => b.addedAt.localeCompare(a.addedAt))
  }
}

export class ResultAggregator {
  constructor(private providers: DiscoveryProvider[]) {}

  listProviders() {
    return this.providers
  }

  async search(filters: SearchFilters): Promise<{ results: Torrent[]; errors: ProviderError[] }> {
    const availableProviders = this.providers.filter((provider) => provider.status === 'available')
    const settled = await Promise.allSettled(
      availableProviders.map((provider) => provider.search(filters.query, filters.category)),
    )

    const errors: ProviderError[] = []
    const unique = new Map<string, Torrent>()

    settled.forEach((outcome, index) => {
      const provider = availableProviders[index]

      if (outcome.status === 'rejected') {
        errors.push({
          providerId: provider.id,
          message: outcome.reason instanceof Error ? outcome.reason.message : 'Provider request failed'
        })
        return
      }

      outcome.value.forEach((item) => unique.set(item.id, item))
    })

    let results = [...unique.values()]
      .filter((item) => !filters.verifiedOnly || item.verified)
      .filter((item) => !filters.provider || item.providerId === filters.provider)

    if (filters.sort === 'seeders') {
      results.sort((a, b) => b.seeders - a.seeders)
    } else if (filters.sort === 'leechers') {
      results.sort((a, b) => b.leechers - a.leechers)
    } else if (filters.sort === 'size') {
      results.sort((a, b) => a.sizeBytes - b.sizeBytes)
    } else if (filters.sort === 'date') {
      results.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    }

    return { results, errors }
  }
}

export class PluginRegistry {
  private providers = new Map<string, DiscoveryProvider>()

  register(provider: DiscoveryProvider) {
    this.providers.set(provider.id, provider)
  }

  list() {
    return [...this.providers.values()]
  }
}

