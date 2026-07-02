#!/usr/bin/env node
// Telegram completion notifier: ping the owner's phone when a task finishes.
//
// Usage:
//   node automations/notify/notify.js "Research complete: 5 competitor channels analysed"
//   node automations/notify/notify.js "Weekly report built" --summary "Highlights:\n- Pipeline up\n- 2 drafts ready"
//
// Configuration (repo root .env, wired during onboarding Phase 4):
//   TELEGRAM_BOT_TOKEN  bot token from @BotFather
//   TELEGRAM_CHAT_ID    the owner's chat id with that bot
//
// If the env vars are missing the script exits cleanly (code 0) so that
// unconfigured installs never fail a calling workflow.
//
// No dependencies: the .env is parsed inline and the message goes out over
// Node's built-in https module.

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- load repo root .env (minimal parser, no dotenv dependency) ---
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    const key = m[1];
    let value = m[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TOKEN || !CHAT_ID) {
  console.log('Notify not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing in root .env). Skipping notification.');
  console.log('To set it up, see automations/notify/README.md or docs/connectors/telegram-notify.md.');
  process.exit(0);
}

// --- parse args: message [--summary "details"] [--file <path>] ---
const rawArgs = process.argv.slice(2);
let filePath = '';
const fileIdx = rawArgs.indexOf('--file');
if (fileIdx >= 0) {
  filePath = rawArgs[fileIdx + 1] || '';
  rawArgs.splice(fileIdx, 2);
}
const summaryIdx = rawArgs.indexOf('--summary');
let message = '';
let summary = '';

if (summaryIdx >= 0) {
  message = rawArgs.slice(0, summaryIdx).join(' ');
  summary = rawArgs.slice(summaryIdx + 1).join(' ');
} else {
  message = rawArgs.join(' ');
}

if (!message && !filePath) {
  console.error('Usage: node notify.js "message" [--summary "details"] [--file <path>]');
  process.exit(1);
}
if (filePath && !fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

// --- build the Telegram message ---
let text = `✅ Task complete\n\n${message}`;
if (summary) {
  text += `\n\n---\n${summary.replace(/\\n/g, '\n')}`;
}

// Telegram caps messages at 4096 chars
if (text.length > 4000) {
  text = text.slice(0, 3997) + '...';
}

function send(payloadObj, isRetry) {
  const payload = JSON.stringify(payloadObj);
  const req = https.request({
    hostname: 'api.telegram.org',
    path: `/bot${TOKEN}/sendMessage`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('Notification sent via Telegram.');
      } else if (!isRetry && res.statusCode === 400) {
        // Markdown parse failures return 400; retry as plain text
        send({ chat_id: CHAT_ID, text }, true);
      } else {
        console.error(`Telegram API error (${res.statusCode}):`, data);
        process.exit(1);
      }
    });
  });

  req.on('error', (err) => {
    console.error('Network error:', err.message);
    process.exit(1);
  });

  req.write(payload);
  req.end();
}

// --- file delivery: sendDocument with the message as caption (multipart, no deps) ---
function sendFile(p) {
  const boundary = '----ImperiumOSNotify' + Date.now();
  const fileName = path.basename(p);
  const caption = text.slice(0, 1000); // Telegram caption cap is 1024
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${CHAT_ID}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="${fileName}"\r\n` +
    `Content-Type: application/octet-stream\r\n\r\n`
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([head, fs.readFileSync(p), tail]);

  const req = https.request({
    hostname: 'api.telegram.org',
    path: `/bot${TOKEN}/sendDocument`,
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length },
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`File sent via Telegram: ${fileName}`);
      } else {
        console.error(`Telegram API error (${res.statusCode}):`, data);
        process.exit(1);
      }
    });
  });
  req.on('error', (err) => { console.error('Network error:', err.message); process.exit(1); });
  req.write(body);
  req.end();
}

if (filePath) {
  sendFile(filePath);
} else {
  send({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }, false);
}
