// Snapshots the Cat API breed list into src/data/cat-breeds.json, since the
// breed endpoints now require an API key. Run with:
//   node --env-file=.env scripts/fetch-cat-breeds.js
const fs = require('fs')
const path = require('path')

async function main() {
  const key = process.env.CAT_API_KEY
  if (!key) {
    throw new Error('CAT_API_KEY is not set (put it in .env)')
  }

  const response = await fetch('https://api.thecatapi.com/v1/breeds', {
    headers: { 'x-api-key': key },
  })
  if (!response.ok) {
    throw new Error(`Cat API returned ${response.status}: ${await response.text()}`)
  }

  // Only keep the fields cat-api.tsx uses
  const breeds = (await response.json()).map(breed => ({
    name: breed.name,
    reference_image_id: breed.reference_image_id || null,
    description: breed.description,
  }))

  const outPath = path.resolve(__dirname, '../src/data/cat-breeds.json')
  fs.writeFileSync(outPath, JSON.stringify(breeds, null, 2) + '\n')
  console.log(`Wrote ${breeds.length} breeds to ${outPath}`)
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
