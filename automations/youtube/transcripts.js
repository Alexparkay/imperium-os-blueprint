// YouTube transcript fetcher via the Apify "karamelo~youtube-transcripts" actor.
// This is the ONLY sanctioned way the OS reads YouTube content (never page scraping).
//
// Usage:
//   node transcripts.js "https://www.youtube.com/watch?v=VIDEO_ID"
//
// Configuration (repo root .env):
//   APIFY_API_TOKEN  your Apify API token (apify.com -> Settings -> Integrations)

const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env'), quiet: true }); // quiet: suppress dotenv's banner + promo tips in buyer-facing output

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const ACTOR_ID = 'karamelo~youtube-transcripts';

async function getTranscript(videoUrl) {
  if (!APIFY_TOKEN) {
    throw new Error('APIFY_API_TOKEN not set in the repo root .env');
  }

  console.log(`Fetching transcript for: ${videoUrl}`);

  const runRes = await axios.post(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    { urls: [videoUrl] },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000,
    }
  );

  const runId = runRes.data.data.id;
  console.log(`Actor run started: ${runId}`);

  let status = 'RUNNING';
  let attempts = 0;
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 3000));
    const statusRes = await axios.get(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    status = statusRes.data.data.status;
    attempts++;
    if (attempts > 40) throw new Error('Actor run timed out after 2 minutes');
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Actor run failed with status: ${status}`);
  }

  const datasetId = runRes.data.data.defaultDatasetId;
  const dataRes = await axios.get(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
  );

  const results = dataRes.data;
  if (!results || results.length === 0) {
    console.log('');
    console.log('This video has no transcript available - usually it simply has no captions in any language.');
    console.log('That happens; it is not a setup problem. Try another link to confirm the connector works.');
    console.log('(More: docs/connectors/apify-youtube.md, "What can go wrong".)');
    process.exit(0);
  }

  return results;
}

async function getTranscriptText(videoUrl) {
  const results = await getTranscript(videoUrl);
  const item = results[0];
  if (!item) return null;

  // Karamelo actor returns { captions: ["line1", "line2", ...] }
  if (item.captions && Array.isArray(item.captions)) {
    return {
      title: item.title || '',
      channel: item.channelName || '',
      videoId: item.videoId || '',
      published: item.datePublished || '',
      text: item.captions.join(' ').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
    };
  }

  return { title: item.title, text: JSON.stringify(item) };
}

async function getBulkTranscripts(videoUrls) {
  if (!APIFY_TOKEN) {
    throw new Error('APIFY_API_TOKEN not set in the repo root .env');
  }

  console.log(`Fetching transcripts for ${videoUrls.length} videos...`);

  const runRes = await axios.post(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    { urls: videoUrls },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000,
    }
  );

  const runId = runRes.data.data.id;
  console.log(`Bulk actor run started: ${runId}`);

  let status = 'RUNNING';
  let attempts = 0;
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 5000));
    const statusRes = await axios.get(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    status = statusRes.data.data.status;
    attempts++;
    if (attempts > 60) throw new Error('Bulk actor run timed out');
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Bulk actor run failed with status: ${status}`);
  }

  const datasetId = runRes.data.data.defaultDatasetId;
  const dataRes = await axios.get(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
  );

  // Clean up HTML entities
  const results = dataRes.data.map(item => ({
    title: item.title || '',
    channel: item.channelName || '',
    videoId: item.videoId || '',
    published: item.datePublished || '',
    text: (item.captions || []).join(' ')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>'),
  }));

  console.log(`Got transcripts for ${results.length} videos`);
  return results;
}

module.exports = { getTranscript, getTranscriptText, getBulkTranscripts };

if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.log('Usage: node transcripts.js <youtube-url>');
    console.log('Example: node transcripts.js https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    process.exit(1);
  }

  getTranscriptText(url)
    .then(result => {
      if (result) {
        console.log(`\n=== ${result.title} ===\n`);
        console.log(result.text);
      } else {
        console.log('No transcript available.');
      }
    })
    .catch(err => {
      const status = err.response && err.response.status;
      if (status === 401) console.error('Error: Apify rejected the API token (401). Check APIFY_API_TOKEN in the root .env (apify.com -> Settings -> Integrations).');
      else if (status === 402 || status === 403) console.error(`Error: Apify refused the request (${status}) - usually plan limits or credits. Check your Apify account.`);
      else console.error('Error:', err.message);
      process.exit(1);
    });
}
