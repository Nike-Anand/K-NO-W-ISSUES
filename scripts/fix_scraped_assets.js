import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'

const BASE = 'https://overworldaudio.com'

function makeAbsolute(url) {
  if (!url) return url
  url = url.trim()
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url
  if (url.startsWith('//')) return 'https:' + url
  if (url.startsWith('/')) return BASE + url
  // relative paths
  return BASE + '/' + url.replace(/^\.\/?/, '')
}

function fixSrcset(val) {
  return val.split(',').map(part => {
    const p = part.trim()
    const space = p.lastIndexOf(' ')
    if (space === -1) return makeAbsolute(p)
    const url = p.slice(0, space)
    const descriptor = p.slice(space + 1)
    return `${makeAbsolute(url)} ${descriptor}`
  }).join(', ')
}

async function main() {
  const [,, input, output] = process.argv
  if (!input || !output) {
    console.error('Usage: node scripts/fix_scraped_assets.js <in.html> <out.html>')
    process.exit(1)
  }
  const html = await fs.promises.readFile(input, 'utf-8')
  const $ = cheerio.load(html, { decodeEntities: false })

  // Attributes to rewrite
  const attrMap = ['src', 'href', 'poster']
  $('*').each((i, el) => {
    for (const a of attrMap) {
      const val = $(el).attr(a)
      if (val && typeof val === 'string') {
        if (a === 'src' || a === 'href' || a === 'poster') {
          if (!val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('javascript:')) {
            $(el).attr(a, makeAbsolute(val))
          }
        }
      }
    }
    // srcset handling
    const ss = $(el).attr('srcset')
    if (ss) $(el).attr('srcset', fixSrcset(ss))
    // inline style url(...) patterns
    const style = $(el).attr('style')
    if (style && style.includes('url(')) {
      $(el).attr('style', style.replace(/url\(([^)]+)\)/g, (_, u) => `url(${makeAbsolute(u.replace(/['"]+/g, '').trim())})`))
    }
  })

  // Fix URL() in style tags and inline <style>
  $('style').each((i, el) => {
    const txt = $(el).html() || ''
    const fixed = txt.replace(/url\(([^)]+)\)/g, (_, u) => `url(${makeAbsolute(u.replace(/['"]+/g, '').trim())})`)
    $(el).html(fixed)
  })

  // Also replace common payload/preload links that point to localhost (remove them)
  $('link[rel="preload"]').remove()

  const outHtml = $.html()
  await fs.promises.mkdir(path.dirname(output), { recursive: true })
  await fs.promises.writeFile(output, outHtml, 'utf-8')
  console.log('Wrote', output)
}

main().catch(err => { console.error(err); process.exit(2) })
