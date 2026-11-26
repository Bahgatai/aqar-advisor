# مستشار عقار — Aqar Advisor

A hybrid-AI real-estate assistant for Egyptian property seekers, built for
**Google #BuildHybridAI 2026** with **Firebase AI Logic hybrid inference**
(Web / Chrome).

- **On-device (Gemini Nano via Chrome's Prompt API):** fast, private tasks —
  understanding your question into a structured search intent (budget, area,
  rooms) — run entirely on your device when Chrome's built-in model is
  available. Nothing leaves the browser.
- **Cloud (Gemini via Firebase AI Logic):** deep answers — comparisons, price
  reasoning, area advice — fall back automatically to a cloud-hosted Gemini
  model when on-device isn't available, and are used for heavier reasoning.
- **A visible source badge on every answer** (⚡ on-device / ☁️ cloud), driven
  by the SDK's own `response.inferenceSource`, makes the hybrid split obvious
  and honest.

## Why hybrid matters here

A buyer's budget, family needs, and preferred districts are sensitive.
Aqar Advisor keeps the *understanding* of those preferences on the user's own
device whenever possible, and only sends a question to the cloud when deep
reasoning actually needs it — or when the device can't run a local model at
all (then the same SDK call transparently falls back to the cloud, which is
itself the hybrid story: one code path, every device).

## The app

Egyptian-Arabic (RTL) one-page app:

1. Browse 12 sample Cairo-area listings (clearly labeled as illustrative
   sample data, not real offers).
2. Ask in Egyptian Arabic: "عايز شقة ٣ غرف في التجمع بحد أقصى ٥ مليون".
3. Intent extraction runs `PREFER_ON_DEVICE` (structured JSON out).
4. Listings filter locally; matching cards highlight.
5. The advisor answer streams back with its source badge and latency.
6. A status bar shows the on-device model state and lets the user preload it
   (`initializeDeviceModel`, with live download progress).
7. A running counter shows how many answers came from device vs cloud.

## Tech

- Plain HTML/CSS/JS, no build step. Firebase JS SDK v13 loaded as ES modules
  from the official CDN.
- `firebase/ai`: `getAI(app, { backend: new GoogleAIBackend() })`,
  `getGenerativeModel(ai, { mode: InferenceMode.PREFER_ON_DEVICE, ... })`.
- Firebase App Check (required by Firebase AI Logic) with reCAPTCHA
  Enterprise for the hosted demo.
- Gemini Developer API provider (no-cost tier, no billing).

## Run locally

1. Create a Firebase project (Spark plan is fine), enable **AI Logic** with
   the **Gemini Developer API** provider, and register a web app.
2. Fill `firebase-config.js` with your web app config and App Check key
   (or a console-registered debug token — accepted by the hackathon rules).
3. Serve statically, e.g. `npx serve .` or `python3 -m http.server`.
4. Open in **Chrome Desktop 139+** for the on-device path (first use may
   download the on-device model). Any other browser shows the automatic
   cloud fallback — same code, no changes.

## Project structure

- `index.html`, `styles.css` — RTL Egyptian-Arabic UI.
- `app.js` — hybrid inference logic, badges, filtering, compare.
- `data.js` — 12 sample listings (illustrative only).
- `firebase-config.js` — Firebase web config + App Check key.

## Notes & limits

- On-device inference requires Chrome Desktop 139+; other browsers fall back
  to the cloud model automatically (that difference is the demo).
- Multi-turn chat is emulated by packing context into single-turn prompts
  (the on-device Prompt API is single-turn).
- All listings are fictional samples in EGP; no real-market claims.

## License

Apache-2.0 — see [LICENSE](LICENSE).
