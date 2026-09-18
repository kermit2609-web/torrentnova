import { useMemo, useState, type ReactNode } from 'react'
import { categories, demoTorrents, initialPlugins, type Category, type Plugin, type SortOption, type Torrent, type View } from './data'
import { DemoDiscoveryProvider, ResultAggregator, type DownloadTask, type SearchFilters } from './services'
import './styles.css'

const nav: { id: View; label: string; icon: string }[] = [
  { id: 'discover', label: 'Discover', icon: '✦' },
  { id: 'search', label: 'Search', icon: '⌕' },
  { id: 'downloads', label: 'Downloads', icon: '↓' },
  { id: 'library', label: 'Library', icon: '▣' },
  { id: 'plugins', label: 'Plugins', icon: '⌘' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
]

const feeds = [
  { id: 'today', label: "Today's Torrents" },
  { id: 'recent', label: 'Recently Added' },
  { id: 'trending', label: 'Trending' },
  { id: 'seeded', label: 'Most Seeded' },
  { id: 'updated', label: 'Recently Updated' }
] as const

const categoryClass = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export default function App() {
  const [view, setView] = useState<View>('discover')
  const [dark, setDark] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('All')
  const [sort, setSort] = useState<SortOption>('relevance')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [provider, setProvider] = useState('')
  const [selected, setSelected] = useState<Torrent | null>(null)
  const [plugins, setPlugins] = useState<Plugin[]>(initialPlugins)
  const [downloads, setDownloads] = useState<DownloadTask[]>([])
  const [searchError, setSearchError] = useState('')

  const aggregator = useMemo(() => new ResultAggregator([new DemoDiscoveryProvider(demoTorrents)]), [])

  const filters: SearchFilters = { query, category, sort, verifiedOnly, provider }

  const filtered = useMemo(
    () =>
      demoTorrents
        .filter((item) => (category === 'Adult' ? item.category === 'Adult' : item.category !== 'Adult'))
        .filter((item) => category === 'All' || item.category === category)
        .filter((item) => !query || `${item.title} ${item.category} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())),
    [category, query],
  )

  const startDownload = (torrent: Torrent) => {
    if (!downloads.some((item) => item.id === torrent.id)) {
      setDownloads([
        ...downloads,
        {
          id: torrent.id,
          torrent,
          status: 'queued',
          progress: 0,
          downloadSpeed: 'Placeholder',
          uploadSpeed: 'Placeholder',
          eta: 'Placeholder',
          priority: 'normal',
          fileSelection: 'all files',
          bandwidthLimit: 'Unlimited (placeholder)'
        }
      ])
    }
    setSelected(null)
    setView('downloads')
  }

  const togglePlugin = (id: string) => {
    setPlugins((current) => current.map((plugin) => (plugin.id === id ? { ...plugin, enabled: !plugin.enabled } : plugin)))
  }

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <aside className="sidebar">
        <div className="brand" onClick={() => setView('discover')}>
          <span className="brand-mark">✦</span>
          <span>
            Torrent<span>Nova</span>
          </span>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map((item) => (
            <button key={item.id} className={view === item.id ? 'nav-item active' : 'nav-item'} onClick={() => setView(item.id)}>
              <b>{item.icon}</b>
              {item.label}
              {item.id === 'downloads' && downloads.length > 0 && <em>{downloads.length}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="connection">
            <span className="pulse" /> Demo mode
            <small>Local catalog only</small>
          </div>
          <button className="user-card">
            <span className="avatar">K</span>
            <span>
              <strong>Local workspace</strong>
              <small>Personal library</small>
            </span>
            <b>•••</b>
          </button>
        </div>
      </aside>

      <main className="main">
        <header>
          <button className="mobile-brand" onClick={() => setView('discover')}>✦ Nova</button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <b>/</b>
            <strong>{nav.find((item) => item.id === view)?.label}</strong>
          </div>
          <div className="header-actions">
            <button className="icon-button" onClick={() => setDark((current) => !current)} title="Toggle theme">
              {dark ? '☼' : '☾'}
            </button>
            <button className="help">?</button>
          </div>
        </header>

        <div className="content">
          {view === 'discover' && <Discover setView={setView} query={query} setQuery={setQuery} setSelected={setSelected} startDownload={startDownload} />}
          {view === 'search' && (
            <Search
              filters={filters}
              setQuery={setQuery}
              setCategory={setCategory}
              setSort={setSort}
              setVerifiedOnly={setVerifiedOnly}
              setProvider={setProvider}
              setSelected={setSelected}
              startDownload={startDownload}
              aggregator={aggregator}
              searchError={searchError}
            />
          )}
          {view === 'downloads' && <Downloads tasks={downloads} setSelected={setSelected} />}
          {view === 'library' && <Library tasks={downloads} setSelected={setSelected} />}
          {view === 'plugins' && <Plugins plugins={plugins} togglePlugin={togglePlugin} />}
          {view === 'settings' && <Settings dark={dark} setDark={setDark} />}
        </div>
      </main>

      {selected && <Details torrent={selected} close={() => setSelected(null)} startDownload={startDownload} />}
    </div>
  )
}

function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  )
}

type CardProps = { torrent: Torrent; setSelected: (torrent: Torrent) => void; startDownload: (torrent: Torrent) => void }

function TorrentCard({ torrent, setSelected, startDownload }: CardProps) {
  return (
    <article className="torrent-card">
      <div className="card-top">
        <span className={`cover ${categoryClass(torrent.category)}`}>
          {torrent.category === 'Movies' ? '◉' : torrent.category === 'Music' ? '♫' : torrent.category === 'Books' ? '▤' : '✦'}
        </span>
        <span className="category">{torrent.category}</span>
        <span className="verified">{torrent.verified ? '✓ Verified' : 'Demo'}</span>
      </div>
      <h3 onClick={() => setSelected(torrent)}>{torrent.title}</h3>
      <div className="stats">
        <span>↓ {torrent.size}</span>
        <span className="seed">▲ {torrent.seeders}</span>
        <span className="leech">▼ {torrent.leechers}</span>
      </div>
      <div className="card-foot">
        <span>
          {torrent.provider} · {torrent.age}
        </span>
        <button onClick={() => startDownload(torrent)}>Add to downloads</button>
      </div>
    </article>
  )
}

function Discover({ setView, query, setQuery, setSelected, startDownload }: any) {
  const [feed, setFeed] = useState<(typeof feeds)[number]['id']>('today')
  const feedItems = [...demoTorrents]
    .filter((item) => item.category !== 'Adult')
    .sort((a, b) => (feed === 'seeded' || feed === 'trending' ? b.seeders - a.seeders : b.addedAt.localeCompare(a.addedAt)))

  return (
    <>
      <PageTitle eyebrow="DISCOVERY CENTER" title="Good evening, explorer.">
        <button className="primary" onClick={() => setView('search')}>⌕ Search catalog</button>
      </PageTitle>

      <section className="hero">
        <div>
          <span className="hero-kicker">DISCOVERY CENTER</span>
          <h2>
            Find your next <i>favorite.</i>
          </h2>
          <p>Explore a curated demo catalog built for a faster, calmer way to discover content.</p>
          <div className="hero-search">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setView('search')
              }}
              placeholder="Search titles, creators, or tags..."
            />
            <kbd>⌘ K</kbd>
          </div>
        </div>
        <div className="orbit">
          <span>✦</span>
          <span>◌</span>
          <span>✧</span>
        </div>
      </section>

      <div className="feed-tabs">
        {feeds.map((item) => (
          <button className={feed === item.id ? 'feed-tab active' : 'feed-tab'} onClick={() => setFeed(item.id)} key={item.id}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {feedItems.slice(0, 4).map((item) => (
          <TorrentCard key={item.id} torrent={item} setSelected={setSelected} startDownload={startDownload} />
        ))}
      </div>
    </>
  )
}

function Search({ filters, setQuery, setCategory, setSort, setVerifiedOnly, setProvider, setSelected, startDownload, aggregator, searchError }: any) {
  const [results, setResults] = useState<Torrent[]>([])
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const result = await aggregator.search(filters)
    setResults(result.results)
    setSearchError(result.errors.map((error: { message: string }) => error.message).join('; '))
    setLoading(false)
  }

  return (
    <>
      <PageTitle eyebrow="UNIVERSAL SEARCH" title="Search catalog">
        <span className="result-count">{loading ? 'Searching…' : `${results.length} results`}</span>
      </PageTitle>

      <div className="large-search">
        <span>⌕</span>
        <input
          autoFocus
          value={filters.query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void run()
            }
          }}
          placeholder="Try “aurora”, “music”, or “open license”"
        />
        <button onClick={() => { setQuery(''); setResults([]) }}>Clear</button>
      </div>

      <div className="search-controls">
        <select value={filters.category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={filters.sort} onChange={(event) => setSort(event.target.value)}>
          <option value="relevance">Sort: Relevance</option>
          <option value="seeders">Sort: Seeders</option>
          <option value="leechers">Sort: Leechers</option>
          <option value="size">Sort: Size</option>
          <option value="date">Sort: Date added</option>
        </select>
        <select value={filters.provider} onChange={(event) => setProvider(event.target.value)}>
          <option value="">All providers</option>
          {aggregator.listProviders().map((item: { id: string; name: string }) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <label>
          <input type="checkbox" checked={filters.verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} /> Verified only
        </label>
        <button className="primary" onClick={() => void run()}>
          Search
        </button>
      </div>

      {searchError && <div className="error-state">Provider warning: {searchError}</div>}
      <div className="provider-note">Using {aggregator.listProviders().length} demo provider · Safe offline data · Adult content is opt-in</div>

      <div className="result-list">
        {loading && <div className="loading-state">Searching enabled providers…</div>}
        {!loading && results.map((item) => <TorrentCard key={item.id} torrent={item} setSelected={setSelected} startDownload={startDownload} />)}
        {!loading && results.length === 0 && (
          <div className="empty">
            <span>⌕</span>
            <h3>Ready to search</h3>
            <p>Enter a query or press Search to browse enabled providers.</p>
          </div>
        )}
      </div>
    </>
  )
}

function Downloads({ tasks, setSelected }: any) {
  return (
    <>
      <PageTitle eyebrow="YOUR ACTIVITY" title="Downloads">
        <span className="result-count">{tasks.length} demo tasks</span>
      </PageTitle>

      {tasks.length ? (
        <div className="download-list">
          {tasks.map((task: DownloadTask) => (
            <div className="download-row" key={task.id}>
              <span className="download-icon">↓</span>
              <div>
                <strong>{task.torrent.title}</strong>
                <small>
                  {task.torrent.size} · {task.status} · P2P transfer disabled
                </small>
              </div>
              <div className="progress">
                <span style={{ width: `${task.progress}%` }} />
              </div>
              <b>{task.progress}%</b>
              <button onClick={() => setSelected(task.torrent)}>Details</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <span>↓</span>
          <h3>Your demo queue is clear</h3>
          <p>Add a result from Discover or Search. No files will be transferred.</p>
        </div>
      )}
    </>
  )
}

function Library({ tasks, setSelected }: any) {
  return (
    <>
      <PageTitle eyebrow="YOUR COLLECTION" title="Library">
        <button className="secondary">+ Create collection</button>
      </PageTitle>

      <div className="library-banner">
        <span>▣</span>
        <div>
          <strong>Keep your discoveries close.</strong>
          <p>Saved demo records and collections will appear here.</p>
        </div>
      </div>

      <div className="card-grid">
        {tasks.map((task: DownloadTask) => (
          <TorrentCard key={task.id} torrent={task.torrent} setSelected={setSelected} startDownload={() => {}} />
        ))}
      </div>

      {!tasks.length && (
        <div className="empty compact">
          <h3>No saved items</h3>
          <p>Build your library from the Discovery Center.</p>
        </div>
      )}
    </>
  )
}

function Plugins({ plugins, togglePlugin }: any) {
  return (
    <>
      <PageTitle eyebrow="EXTEND NOVA" title="Plugin Manager">
        <button className="primary">+ Browse providers</button>
      </PageTitle>

      <div className="notice">
        <span>✦</span>
        <p>
          <strong>Provider safety first.</strong> TorrentNova only ships with offline demo data. Review and explicitly authorize any provider added later.
        </p>
      </div>

      <div className="plugin-list">
        {plugins.map((plugin: Plugin) => (
          <div className="plugin-row" key={plugin.id}>
            <span className="plugin-logo">{plugin.name[0]}</span>
            <div className="plugin-copy">
              <strong>
                {plugin.name} <small>v{plugin.version}</small>
              </strong>
              <p>{plugin.description}</p>
              <em>{plugin.kind}</em>
            </div>
            <button className={plugin.enabled ? 'toggle on' : 'toggle'} onClick={() => togglePlugin(plugin.id)}>
              <span />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

function Settings({ dark, setDark }: any) {
  return (
    <>
      <PageTitle eyebrow="PREFERENCES" title="Settings">
        <button className="primary">Save changes</button>
      </PageTitle>

      <div className="settings-grid">
        <section className="settings-card">
          <h3>Appearance</h3>
          <p>Make Nova feel like your workspace.</p>
          <label className="setting-row">
            <span>
              <strong>Dark interface</strong>
              <small>Use the low-light color palette.</small>
            </span>
            <button className={dark ? 'toggle on' : 'toggle'} onClick={() => setDark(!dark)}>
              <span />
            </button>
          </label>
          <label className="setting-row">
            <span>
              <strong>Adult content</strong>
              <small>Keep restricted category hidden by default.</small>
            </span>
            <button className="toggle">
              <span />
            </button>
          </label>
        </section>

        <section className="settings-card">
          <h3>Download engine</h3>
          <p>Engine integration is intentionally not enabled.</p>
          <label className="select-row">
            <span>Transfer mode</span>
            <select disabled>
              <option>Demo only — no network</option>
            </select>
          </label>
          <label className="select-row">
            <span>Bandwidth limits</span>
            <select disabled>
              <option>Placeholder</option>
            </select>
          </label>
        </section>
      </div>
    </>
  )
}

function Details({ torrent, close, startDownload }: { torrent: Torrent; close: () => void; startDownload: (torrent: Torrent) => void }) {
  return (
    <div className="modal-backdrop" onClick={close}>
      <section className="details" onClick={(event) => event.stopPropagation()}>
        <button className="close" onClick={close}>×</button>
        <span className={`detail-cover cover ${categoryClass(torrent.category)}`}>✦</span>
        <div className="eyebrow">
          {torrent.category} · {torrent.provider}
        </div>
        <h2>{torrent.title}</h2>
        <div className="detail-meta">
          <span>{torrent.size}</span>
          <span>▲ {torrent.seeders}</span>
          <span>▼ {torrent.leechers}</span>
          <span>{torrent.age}</span>
          <span>{torrent.verified ? '✓ Verified' : 'Demo record'}</span>
        </div>
        <p className="detail-description">{torrent.description}</p>
        <div className="tag-list">
          {torrent.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="placeholder-panel">
          <strong>Technical details — placeholders</strong>
          <p>Files: Not implemented</p>
          <p>Info-hash: Not available in demo data</p>
          <p>Magnet link: Not implemented</p>
          <p>.torrent file: Not available</p>
        </div>
        <button className="primary full" onClick={() => startDownload(torrent)}>
          ↓ Add demo task
        </button>
        <p className="disclaimer">No external torrent data, peer connection, or file transfer is initiated.</p>
      </section>
    </div>
  )
}

