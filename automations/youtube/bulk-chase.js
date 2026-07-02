// One-shot bulk transcript fetch (Apify) for a list of URLs -> save each to a file.
// Usage: node bulk-chase.js <outDir> <url1> <url2> ...
const fs = require('fs');
const path = require('path');
const { getBulkTranscripts } = require('./transcripts');

function slug(s) {
  return (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

(async () => {
  const args = process.argv.slice(2);
  const outDir = args[0];
  const urls = args.slice(1);
  if (!outDir || urls.length === 0) {
    console.log('Usage: node bulk-chase.js <outDir> <url1> <url2> ...');
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const results = await getBulkTranscripts(urls);
  const index = [];
  for (const r of results) {
    const name = `${slug(r.title)}-${r.videoId}.md`;
    const file = path.join(outDir, name);
    const header = `# ${r.title}\n\n- Channel: ${r.channel}\n- Video ID: ${r.videoId}\n- Published: ${r.published}\n- URL: https://www.youtube.com/watch?v=${r.videoId}\n- Transcript chars: ${r.text.length}\n\n---\n\n`;
    fs.writeFileSync(file, header + r.text, 'utf8');
    index.push({ title: r.title, videoId: r.videoId, published: r.published, chars: r.text.length, file: name });
  }
  console.log('\n=== TRANSCRIPTS SAVED ===');
  for (const i of index) {
    console.log(`${i.chars.toString().padStart(7)} chars | ${i.published?.slice(0,10) || '????'} | ${i.file} | ${i.title}`);
  }
  fs.writeFileSync(path.join(outDir, '_index.json'), JSON.stringify(index, null, 2));
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
