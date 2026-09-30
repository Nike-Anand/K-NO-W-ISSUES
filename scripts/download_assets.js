import fs from 'fs'
import path from 'path'
import axios from 'axios'
import * as cheerio from 'cheerio'

const [, , inputHtml, outputHtml, assetsDir] = process.argv

if (!inputHtml || !outputHtml || !assetsDir) {
  console.error('Usage: node scripts/download_assets.js <in.html> <out.html> <assetsDir>')
  process.exit(1)
}

function isHttp(u) {
  return u && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('//'))
}

function normalizeUrl(u, base = 'https://overworldaudio.com') {
  if (!u) return null
  u = u.trim()
  if (u.startsWith('//')) return 'https:' + u
  if (u.startsWith('/')) return base.replace(/\/$/, '') + u
  if (/^https?:\/\//.test(u)) return u
  // relative path
  return base.replace(/\/$/, '') + '/' + u.replace(/^\.\//, '')
}

function localPathForUrl(u, assetsRoot) {
  const urlObj = new URL(u)
  let pathname = decodeURIComponent(urlObj.pathname)
  if (pathname.endsWith('/')) pathname += 'index'
  const out = path.join(assetsRoot, urlObj.hostname, pathname)
  const dir = path.dirname(out)
  fs.mkdirSync(dir, { recursive: true })
  // ensure file has extension
  const base = path.basename(out)
  if (!path.extname(base)) {
    return out + '.bin'
  }
  return out
}

async function downloadTo(u, outPath) {
  try {
    const res = await axios.get(u, { responseType: 'stream', timeout: 30000, headers: { 'User-Agent': 'node-scraper/1.0' } })
    await new Promise((resolve, reject) => {
      const w = fs.createWriteStream(outPath)
      res.data.pipe(w)
      w.on('finish', resolve)
      w.on('error', reject)
    })
    return true
  } catch (err) {
    console.error('Failed to download', u, err.message || err)
    return false
  }
}

function makeRelative(from, to) {
  const rel = path.relative(path.dirname(from), to)
  // ensure unix-style paths for HTML
  return rel.split(path.sep).join('/')
}

async function main() {
  const html = fs.readFileSync(inputHtml, 'utf-8')
  const $ = cheerio.load(html, { decodeEntities: false })

  const attrNames = ['src', 'href', 'poster']
  const tasks = []
  const mapping = new Map()

  $('*').each((i, el) => {
    for (const a of attrNames) {
      const val = $(el).attr(a)
      if (val && typeof val === 'string') {
        // skip javascript:, mailto:, data: etc.
        if (/^(javascript:|data:|mailto:|tel:)/i.test(val)) continue
        const abs = normalizeUrl(val)
        if (isHttp(abs)) mapping.set(val, abs)
      }
    }
    const ss = $(el).attr('srcset')
    if (ss) {
      ss.split(',').forEach(part => {
        const url = part.trim().split(' ')[0]
        if (url && !/^(data:|javascript:)/i.test(url)) {
          const abs = normalizeUrl(url)
          if (isHttp(abs)) mapping.set(url, abs)
        }
      })
    }
    const style = $(el).attr('style')
    if (style && style.includes('url(')) {
      const re = /url\(([^)]+)\)/g
      let m
      while ((m = re.exec(style)) !== null) {
        const u = m[1].replace(/['"]/g, '').trim()
        if (!/^(data:|javascript:)/i.test(u)) {
          const abs = normalizeUrl(u)
          if (isHttp(abs)) mapping.set(u, abs)
        }
      }
    }
  })

  // Also capture URLs inside style tags
  $('style').each((i, el) => {
    const txt = $(el).html() || ''
    const re = /url\(([^)]+)\)/g
    let m
    while ((m = re.exec(txt)) !== null) {
      const u = m[1].replace(/['"]/g, '').trim()
      if (!/^(data:|javascript:)/i.test(u)) {
        const abs = normalizeUrl(u)
        if (isHttp(abs)) mapping.set(u, abs)
      }
    }
  })

  // Unique absolute URLs
  const unique = Array.from(new Set(mapping.values()))

  console.log('Found', unique.length, 'assets to download')

  for (const abs of unique) {
    const outPath = localPathForUrl(abs, assetsDir)
    tasks.push({ abs, outPath })
  }

  for (const t of tasks) {
    console.log('Downloading', t.abs, '->', t.outPath)
    await downloadTo(t.abs, t.outPath)
  }

  // Now rewrite HTML to local paths
  $('*').each((i, el) => {
    for (const a of attrNames) {
      const val = $(el).attr(a)
      if (val && typeof val === 'string') {
        if (/^(javascript:|data:|mailto:|tel:)/i.test(val)) continue
        const abs = mapping.get(val) || normalizeUrl(val)
        if (abs && isHttp(abs)) {
          const local = localPathForUrl(abs, assetsDir)
          const rel = makeRelative(outputHtml, local)
          $(el).attr(a, rel)
        }
      }
    }

    const ss = $(el).attr('srcset')
    if (ss) {
      const parts = ss.split(',').map(part => {
        const [u, descriptor] = part.trim().split(/\s+/, 2)
        const abs = mapping.get(u) || normalizeUrl(u)
        if (abs && isHttp(abs)) {
          const local = localPathForUrl(abs, assetsDir)
          const rel = makeRelative(outputHtml, local)
          return descriptor ? `${rel} ${descriptor}` : rel
        }
        return part.trim()
      })
      $(el).attr('srcset', parts.join(', '))
    }

    const style = $(el).attr('style')
    if (style && style.includes('url(')) {
      const fixed = style.replace(/url\(([^)]+)\)/g, (_, u) => {
        const raw = u.replace(/['"]/g, '').trim()
        const abs = mapping.get(raw) || normalizeUrl(raw)
        if (abs && isHttp(abs)) {
          const local = localPathForUrl(abs, assetsDir)
          const rel = makeRelative(outputHtml, local)
          return `url(${rel})`
        }
        return `url(${raw})`
      })
      $(el).attr('style', fixed)
    }
  })

  // style tags
  $('style').each((i, el) => {
    const txt = $(el).html() || ''
    const fixed = txt.replace(/url\(([^)]+)\)/g, (_, u) => {
      const raw = u.replace(/['"]/g, '').trim()
      const abs = mapping.get(raw) || normalizeUrl(raw)
      if (abs && isHttp(abs)) {
        const local = localPathForUrl(abs, assetsDir)
        const rel = makeRelative(outputHtml, local)
        return `url(${rel})`
      }
      return `url(${raw})`
    })
    $(el).html(fixed)
  })

  // write output
  fs.writeFileSync(outputHtml, $.html(), 'utf-8')
  console.log('Wrote', outputHtml)
}

main().catch(err => { console.error(err); process.exit(2) })
