/**
 * Auto-linkify plain URLs in text to markdown link syntax.
 *
 * Uses a 3-pass placeholder approach:
 * 1. Extract protected zones (code blocks, inline code, markdown links/images)
 * 2. Convert plain URLs to [url](url) markdown
 * 3. Restore protected content
 */

const KNOWN_TLDS =
  'com|org|net|io|me|dev|app|xyz|co|ai|gg|cc|us|uk|ca|de|fr|jp|au|in|edu|gov|info|biz'

// Protected zone patterns (ordered by priority)
const PROTECTED_RE = new RegExp(
  [
    '```[\\s\\S]*?```',           // fenced code blocks
    '`[^`]+`',                     // inline code
    '!\\[[^\\]]*\\]\\([^)]*\\)',   // markdown images
    '\\[[^\\]]*\\]\\([^)]*\\)',    // markdown links
  ].join('|'),
  'g',
)

// URL patterns
const PROTOCOL_URL_RE = /https?:\/\/[^\s<]+[^\s.,;:!?'")\]}<]/g
const WWW_URL_RE = /(?<![/\w])www\.[^\s<]+[^\s.,;:!?'")\]}<]/g
const BARE_DOMAIN_RE = new RegExp(
  `(?<![/@\\w])([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.(?:${KNOWN_TLDS})(?:\\/[^\\s<]*[^\\s.,;:!?'"\\)\\]}<])?)`,
  'g',
)

export function linkifyText(text: string): string {
  // Pass 1: extract protected zones
  const placeholders: string[] = []
  let processed = text.replace(PROTECTED_RE, (match) => {
    const idx = placeholders.length
    placeholders.push(match)
    return `\x00PROTECTED${idx}\x00`
  })

  // Pass 2: linkify URLs (protocol first, then www, then bare domains)
  processed = processed.replace(PROTOCOL_URL_RE, (url) => {
    const idx = placeholders.length
    placeholders.push(`[${url}](${url})`)
    return `\x00PROTECTED${idx}\x00`
  })

  processed = processed.replace(WWW_URL_RE, (url) => {
    const idx = placeholders.length
    placeholders.push(`[${url}](https://${url})`)
    return `\x00PROTECTED${idx}\x00`
  })

  processed = processed.replace(BARE_DOMAIN_RE, (url) => {
    const idx = placeholders.length
    placeholders.push(`[${url}](https://${url})`)
    return `\x00PROTECTED${idx}\x00`
  })

  // Pass 3: restore protected content
  processed = processed.replace(/\x00PROTECTED(\d+)\x00/g, (_, idx) => {
    return placeholders[Number(idx)]
  })

  return processed
}
