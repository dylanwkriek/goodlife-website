# GoodLife → DwK lead capture foundation

This repository now opens through `index.html`, which preserves the approved original GoodLife website inside a same-origin frame and attaches the DwK lead-capture bridge.

## What works in this test stage

- Existing visual design and embedded imagery remain unchanged.
- The existing WhatsApp quotation flow remains intact.
- Quote submissions produce structured `dwk.lead.v1` records.
- Google, Facebook, Instagram, campaign and direct-source attribution is recorded when available.
- Call, WhatsApp and email button clicks are counted as contact events.
- A quotation-purpose consent checkbox is added.
- Records are queued locally when no secure backend exists.
- The bridge avoids embedding database credentials in public website code.

## Test it

Open `index.html`, complete the quotation form and submit it. The WhatsApp flow continues normally.

In the browser developer console, run:

```js
DwKGoodLife.exportQueue()
```

This downloads the queued test leads and contact events as JSON.

## Production connection still required

Set `CONFIG.webhook` in `dwk-lead-bridge.js` only after a secure HTTPS ingestion endpoint exists. The endpoint must validate requests, rate-limit abuse, sanitise fields, write to the private database and create an audit event.

Never put a database service key, GitHub token, Hub password or other privileged secret in this repository's browser code.
