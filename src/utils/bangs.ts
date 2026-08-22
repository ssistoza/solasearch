export interface Bang {
  key: string;
  name: string;
  site: string;
  url: string;
  aliases?: string[];
}

export const BANGS: Bang[] = [
  { key: 'g', name: 'Google', site: 'https://www.google.com', url: 'https://www.google.com/search?q={{{s}}}', aliases: ['google'] },
  { key: 'd', name: 'DuckDuckGo', site: 'https://duckduckgo.com', url: 'https://duckduckgo.com/?q={{{s}}}', aliases: ['dd', 'ddg'] },
  { key: 'b', name: 'Bing', site: 'https://www.bing.com', url: 'https://www.bing.com/search?q={{{s}}}' },
  { key: 'br', name: 'Brave Search', site: 'https://search.brave.com', url: 'https://search.brave.com/search?q={{{s}}}' },
  { key: 'kag', name: 'Kagi', site: 'https://kagi.com', url: 'https://kagi.com/search?q={{{s}}}' },
  { key: 'sch', name: 'Google Scholar', site: 'https://scholar.google.com', url: 'https://scholar.google.com/scholar?q={{{s}}}' },
  { key: 'bi', name: 'Google Images', site: 'https://images.google.com', url: 'https://www.google.com/search?tbm=isch&q={{{s}}}', aliases: ['i'] },
  { key: 'bv', name: 'Google Videos', site: 'https://videos.google.com', url: 'https://www.google.com/search?tbm=vid&q={{{s}}}' },
  { key: 'm', name: 'Google Maps', site: 'https://maps.google.com', url: 'https://www.google.com/maps/search/{{{s}}}', aliases: ['gm'] },
  { key: 'tr', name: 'Google Translate', site: 'https://translate.google.com', url: 'https://translate.google.com/?sl=auto&tl=en&text={{{s}}}&op=translate' },
  { key: 'w', name: 'Wikipedia', site: 'https://en.wikipedia.org', url: 'https://en.wikipedia.org/wiki/Special:Search?search={{{s}}}', aliases: ['wikipedia', 'wiki'] },
  { key: 'yt', name: 'YouTube', site: 'https://www.youtube.com', url: 'https://www.youtube.com/results?search_query={{{s}}}', aliases: ['youtube'] },
  { key: 'v', name: 'Vimeo', site: 'https://vimeo.com', url: 'https://vimeo.com/search?q={{{s}}}' },
  { key: 'sp', name: 'Spotify', site: 'https://open.spotify.com', url: 'https://open.spotify.com/search/{{{s}}}' },
  { key: 'sc', name: 'SoundCloud', site: 'https://soundcloud.com', url: 'https://soundcloud.com/search?q={{{s}}}' },
  { key: 'gh', name: 'GitHub', site: 'https://github.com', url: 'https://github.com/search?q={{{s}}}', aliases: ['github'] },
  { key: 'gl', name: 'GitLab', site: 'https://gitlab.com', url: 'https://gitlab.com/search?q={{{s}}}' },
  { key: 'so', name: 'Stack Overflow', site: 'https://stackoverflow.com', url: 'https://stackoverflow.com/search?q={{{s}}}', aliases: ['stackoverflow'] },
  { key: 'se', name: 'Stack Exchange', site: 'https://stackexchange.com', url: 'https://stackexchange.com/search?q={{{s}}}' },
  { key: 'mdn', name: 'MDN Web Docs', site: 'https://developer.mozilla.org', url: 'https://developer.mozilla.org/en-US/search?q={{{s}}}' },
  { key: 'devdocs', name: 'DevDocs', site: 'https://devdocs.io', url: 'https://devdocs.io/#q={{{s}}}' },
  { key: 'caniuse', name: 'Can I Use', site: 'https://caniuse.com', url: 'https://caniuse.com/?search={{{s}}}', aliases: ['ciu'] },
  { key: 'npm', name: 'npm', site: 'https://www.npmjs.com', url: 'https://www.npmjs.com/search?q={{{s}}}' },
  { key: 'pip', name: 'PyPI', site: 'https://pypi.org', url: 'https://pypi.org/search/?q={{{s}}}', aliases: ['pypi'] },
  { key: 'py', name: 'Python Docs', site: 'https://docs.python.org', url: 'https://docs.python.org/3/search.html?q={{{s}}}&check_keywords=yes' },
  { key: 'cr', name: 'crates.io', site: 'https://crates.io', url: 'https://crates.io/search?q={{{s}}}', aliases: ['crates'] },
  { key: 'rs', name: 'Rust Docs', site: 'https://doc.rust-lang.org', url: 'https://doc.rust-lang.org/std/?search={{{s}}}', aliases: ['rustdoc'] },
  { key: 'go', name: 'Go Packages', site: 'https://pkg.go.dev', url: 'https://pkg.go.dev/search?q={{{s}}}', aliases: ['godoc'] },
  { key: 'ts', name: 'TypeScript', site: 'https://www.typescriptlang.org', url: 'https://www.typescriptlang.org/search?q={{{s}}}' },
  { key: 'react', name: 'React', site: 'https://react.dev', url: 'https://react.dev/search?q={{{s}}}' },
  { key: 'arch', name: 'Arch Wiki', site: 'https://wiki.archlinux.org', url: 'https://wiki.archlinux.org/index.php?search={{{s}}}' },
  { key: 'aur', name: 'AUR', site: 'https://aur.archlinux.org', url: 'https://aur.archlinux.org/packages?K={{{s}}}' },
  { key: 'hn', name: 'Hacker News', site: 'https://news.ycombinator.com', url: 'https://hn.algolia.com/?q={{{s}}}' },
  { key: 'r', name: 'Reddit', site: 'https://www.reddit.com', url: 'https://www.reddit.com/search/?q={{{s}}}', aliases: ['rd', 'reddit'] },
  { key: 'tw', name: 'X (Twitter)', site: 'https://x.com', url: 'https://x.com/search?q={{{s}}}', aliases: ['t', 'x'] },
  { key: 'ph', name: 'Product Hunt', site: 'https://www.producthunt.com', url: 'https://www.producthunt.com/search?q={{{s}}}' },
  { key: 'am', name: 'Amazon', site: 'https://www.amazon.com', url: 'https://www.amazon.com/s?k={{{s}}}', aliases: ['amzn'] },
  { key: 'st', name: 'Steam', site: 'https://store.steampowered.com', url: 'https://store.steampowered.com/search/?term={{{s}}}' },
  { key: 'im', name: 'IMDb', site: 'https://www.imdb.com', url: 'https://www.imdb.com/find/?q={{{s}}}', aliases: ['imdb'] },
  { key: 'rt', name: 'Rotten Tomatoes', site: 'https://www.rottentomatoes.com', url: 'https://www.rottentomatoes.com/search?search={{{s}}}' },
  { key: 'tmdb', name: 'TMDB', site: 'https://www.themoviedb.org', url: 'https://www.themoviedb.org/search?query={{{s}}}' },
  { key: 'wa', name: 'Wolfram Alpha', site: 'https://www.wolframalpha.com', url: 'https://www.wolframalpha.com/input?i={{{s}}}', aliases: ['wolfram'] },
  { key: 'mw', name: 'Merriam-Webster', site: 'https://www.merriam-webster.com', url: 'https://www.merriam-webster.com/dictionary/{{{s}}}' },
  { key: 'ud', name: 'Urban Dictionary', site: 'https://www.urbandictionary.com', url: 'https://www.urbandictionary.com/define.php?term={{{s}}}' },
];

const BANG_LOOKUP = new Map<string, Bang>();

for (const bang of BANGS) {
  BANG_LOOKUP.set(bang.key, bang);
  for (const alias of bang.aliases ?? []) {
    BANG_LOOKUP.set(alias, bang);
  }
}

const BANG_TOKEN = /(?:^|\s)!([a-z0-9]+)(?=\s|$)/i;

export interface ResolvedBang {
  bang: Bang;
  query: string;
  url: string;
}

export function resolveBang(rawQuery: string): ResolvedBang | null {
  const match = rawQuery.match(BANG_TOKEN);
  if (!match) return null;

  const bang = BANG_LOOKUP.get(match[1].toLowerCase());
  if (!bang) return null;

  const query = rawQuery.replace(BANG_TOKEN, ' ').replace(/\s+/g, ' ').trim();
  const url = query
    ? bang.url.replaceAll('{{{s}}}', encodeURIComponent(query))
    : bang.site;

  return { bang, query, url };
}
