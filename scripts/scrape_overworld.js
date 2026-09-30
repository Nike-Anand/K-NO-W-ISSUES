import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

const URL = 'https://overworldaudio.com/'

async function fetchHtml(url) {
  const res = await axios.get(url, { timeout: 20000, headers: { 'User-Agent': 'node-scraper/1.0' } })
  return res.data
}

function extract({ html, url }) {
  const $ = cheerio.load(html)
  const title = $('head > title').text().trim() || null
  const description = $('meta[name="description"]').attr('content') || null
  const links = Array.from($('a[href]')).map(a => ({ href: $(a).attr('href'), text: $(a).text().trim() }))
  const headings = []
  $('h1,h2,h3').each((i, el) => headings.push({ tag: el.tagName, text: $(el).text().trim() }))
  const images = Array.from($('img[src]')).map(img => ({ src: $(img).attr('src'), alt: $(img).attr('alt') || '' }))
  return { url, title, description, links, headings, images }
}

async function save(outputDir, name, html, data) {
  await fs.promises.mkdir(outputDir, { recursive: true })
  const htmlPath = path.join(outputDir, `${name}.html`)
  const jsonPath = path.join(outputDir, `${name}.json`)
  await fs.promises.writeFile(htmlPath, html, 'utf-8')
  await fs.promises.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8')
  return { htmlPath, jsonPath }
}

async function main() {
  try {
    console.log('Fetching', URL)
    const html = await fetchHtml(URL)
    console.log('Extracting data')
    const data = extract({ html, url: URL })
    console.log('Saving outputs to outputs/overworld')
    const out = await save('outputs/overworld', 'index', html, data)
    console.log('Saved:', out)
  } catch (err) {
    console.error('Error scraping:', err.message || err)
    process.exitCode = 2
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('scrape_overworld.js')) {
  main()
}
