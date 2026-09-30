import fs from 'fs'
import path from 'path'

const ROOT = 'outputs/overworld'
const patterns = [
  /http:\/\/localhost(:\d+)?/g,
  /http:\/\/127\.0\.0\.1(:\d+)?/g,
  /https?:\/\/127\.0\.0\.1(:\d+)?/g
]
const replacement = 'https://overworldaudio.com'

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.isFile()) fixFile(p)
  }
}

function fixFile(file) {
  try {
    const ext = path.extname(file).toLowerCase()
    if (!['.js', '.css', '.html', '.json'].includes(ext)) return
    let txt = fs.readFileSync(file, 'utf-8')
    let changed = false
    for (const pat of patterns) {
      if (pat.test(txt)) {
        txt = txt.replace(pat, replacement)
        changed = true
      }
    }
    if (changed) {
      fs.writeFileSync(file, txt, 'utf-8')
      console.log('Patched', file)
    }
  } catch (err) {
    console.error('Error patching', file, err.message)
  }
}

walk(ROOT)
console.log('Done')
