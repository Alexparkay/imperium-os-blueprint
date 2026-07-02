#!/usr/bin/env node
// Thin wrapper so docs and rules can call `node scripts/notify.js` from anywhere.
// The canonical implementation lives in automations/notify/notify.js.
require(require('path').join(__dirname, '..', 'automations', 'notify', 'notify.js'));
