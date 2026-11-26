// Aqar Advisor — hybrid inference demo for Google #BuildHybridAI 2026.
//
// Hybrid pattern (Firebase AI Logic, Web SDK):
//   - Intent extraction: PREFER_ON_DEVICE, small structured JSON task.
//     On Chrome Desktop 139+ with the built-in model it runs fully on-device
//     (Gemini Nano via the Prompt API); elsewhere the SDK falls back to the
//     cloud-hosted model automatically.
//   - Deep answers / comparisons: PREFER_ON_DEVICE with Arabic output.
//   - Every rendered answer carries a badge driven by the SDK's own
//     `response.inferenceSource` ("ON_DEVICE" | "IN_CLOUD"), so the split
//     between device and cloud is real, not simulated.

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import {
  getAI, getGenerativeModel, GoogleAIBackend, InferenceMode
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-ai.js";
import {
  initializeAppCheck, ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app-check.js";

import { firebaseConfig, APPCHECK_SITE_KEY, APPCHECK_DEBUG_TOKEN } from "./firebase-config.js";
import { LISTINGS, AREAS_INDEX } from "./data.js";

/* ================= Firebase + hybrid models ================= */

let intentModel = null;      // fast structured task, on-device friendly
let advisorModel = null;     // deep Arabic answers (hybrid)
let advisorCloudOnly = null; // explicit cloud fallback
let firebaseReady = false;
let firebaseError = null;

// Note: we do NOT restrict expectedOutputs languages. Declaring "ar" as an
// expected output language makes Chrome's availability probe wait/fail on
// some versions and the SDK never falls back. The Arabic instruction lives
// in the prompt itself, which works on-device and in-cloud.
const JSON_OUTPUT = {
  expectedInputs: [{ type: "text", languages: ["en", "ar"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }]
};

function initFirebase() {
  try {
    const app = initializeApp(firebaseConfig);

    // App Check is required by Firebase AI Logic. Production demo uses
    // reCAPTCHA Enterprise; a console-registered debug token is the fallback
    // (explicitly accepted by the hackathon rules).
    try {
      if (APPCHECK_SITE_KEY) {
        initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(APPCHECK_SITE_KEY),
          isTokenAutoRefreshEnabled: true
        });
      } else if (APPCHECK_DEBUG_TOKEN) {
        // Debug flow documented by Firebase: set the global debug token before
        // initializeAppCheck; the SDK then attests through the debug exchange.
        // Debug tokens are explicitly accepted by the #BuildHybridAI rules.
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = APPCHECK_DEBUG_TOKEN;
        initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider("debug"),
          isTokenAutoRefreshEnabled: true
        });
      }
    } catch (e) {
      console.warn("App Check init warning:", e);
    }

    const ai = getAI(app, { backend: new GoogleAIBackend() });

    intentModel = getGenerativeModel(ai, {
      mode: InferenceMode.PREFER_ON_DEVICE,
      onDeviceParams: { createOptions: JSON_OUTPUT },
      inCloudParams: {
        model: "gemini-3.5-flash-lite",
        generationConfig: { maxOutputTokens: 400, temperature: 0.2 }
      }
    });

    // Explicit onDeviceParams are REQUIRED: without createOptions the SDK's
    // availability probe can wait on an on-device model download that never
    // finishes (observed on Chrome without the built-in model), hanging the
    // request instead of falling back. With explicit options the probe
    // resolves immediately and the fallback works as designed.
    advisorModel = getGenerativeModel(ai, {
      mode: InferenceMode.PREFER_ON_DEVICE,
      onDeviceParams: { createOptions: JSON_OUTPUT },
      inCloudParams: {
        model: "gemini-3.5-flash-lite",
        generationConfig: { maxOutputTokens: 1500, temperature: 0.7 }
      }
    });

    // Explicit cloud-only fallback model (default fallback model) used when
    // the hybrid call stalls or the configured cloud model is unavailable.
    advisorCloudOnly = getGenerativeModel(ai, {
      mode: InferenceMode.ONLY_IN_CLOUD
    });

    firebaseReady = true;
  } catch (e) {
    firebaseError = e;
    console.error("Firebase init failed:", e);
  }
}

/* ================= on-device availability ================= */

const dot = document.getElementById("onDeviceDot");
const dotText = document.getElementById("onDeviceText");
const initBtn = document.getElementById("initDeviceBtn");
const progressWrap = document.getElementById("downloadProgress");
const progressBar = document.getElementById("downloadBar");

function setDot(cls, text) {
  dot.className = "dot " + cls;
  dotText.textContent = text;
}

async function checkOnDevice() {
  const LM = self.LanguageModel || (self.ai && self.ai.languageModel);
  if (!LM) {
    setDot("dot-off", "النموذج المحلي غير متاح في هذا المتصفح — كل الإجابات هتيجي من السحابة (ده نفسه مثال على فائدة النمط الهجين).");
    return;
  }
  try {
    const availability = await LM.availability(
      LM === self.LanguageModel ? { expectedOutputs: [{ type: "text", languages: ["ar", "en"] }] } : undefined
    ).catch(() => LM.availability());
    if (availability === "available") {
      setDot("dot-ok", "النموذج المحلي جاهز ✅ — المهام السريعة هتتنفذ على جهازك بالكامل.");
    } else if (availability === "downloadable" || availability === "downloading") {
      setDot("dot-warn", "النموذج المحلي متاح للتحميل. اضغط «تجهيز النموذج المحلي» (أو أول سؤال هيبدأ التحميل لوحده ويرجع للسحابة لحد ما يخلص).");
      initBtn.hidden = false;
    } else {
      setDot("dot-off", "النموذج المحلي مش متاح على الجهاز ده — الرجوع التلقائي للسحابة شغال.");
    }
  } catch (e) {
    setDot("dot-off", "تعذّر فحص النموذج المحلي — الرجوع التلقائي للسحابة شغال.");
  }
}

initBtn?.addEventListener("click", () => {
  if (!advisorModel) return;
  progressWrap.hidden = false;
  // Must be called on a user gesture (Chrome requirement).
  advisorModel.initializeDeviceModel((val) => {
    progressBar.style.width = Math.round(val * 100) + "%";
    if (val >= 1) {
      setDot("dot-ok", "النموذج المحلي جاهز ✅ — المهام السريعة هتتنفذ على جهازك بالكامل.");
      progressWrap.hidden = true;
      initBtn.hidden = true;
    }
  });
});

/* ================= stats + badges ================= */

const stats = { device: 0, cloud: 0 };
const statsEl = document.getElementById("stats");

function recordSource(src) {
  if (src === "ON_DEVICE") stats.device++; else stats.cloud++;
  statsEl.textContent = `⚡ ${stats.device} على الجهاز · ☁️ ${stats.cloud} سحابة`;
}

function badgeHTML(src, ms) {
  const onDevice = src === "ON_DEVICE";
  const cls = onDevice ? "badge-device" : "badge-cloud";
  const label = onDevice ? "⚡ إجابة من جهازك — بياناتك ماسابتش المتصفح" : "☁️ إجابة من السحابة — Firebase AI Logic";
  const lat = ms != null ? `<span class="latency">(${Math.round(ms)}ms)</span>` : "";
  return `<span class="badge ${cls}">${label} ${lat}</span>`;
}

/* ================= listings UI ================= */

const listingsEl = document.getElementById("listings");
const selected = new Map(); // id -> listing

function fmtPrice(p) {
  if (p >= 1000000) return (p / 1000000).toLocaleString("ar-EG", { maximumFractionDigits: 2 }) + " مليون جنيه";
  return p.toLocaleString("ar-EG") + " جنيه";
}

function renderListings(highlightIds = []) {
  listingsEl.innerHTML = "";
  for (const l of LISTINGS) {
    const card = document.createElement("div");
    card.className = "card" + (selected.has(l.id) ? " selected" : "") + (highlightIds.includes(l.id) ? " highlight" : "");
    card.innerHTML = `
      <div class="id">${l.id} · ${l.city} — ${l.district}</div>
      <h3>${l.title}</h3>
      <div class="price">${fmtPrice(l.price)}</div>
      <div class="meta">${l.rooms} غرف · ${l.baths} حمام · ${l.size} م² · ${l.finishing}<br>${l.payment}${l.years ? ` · مقدم ${fmtPrice(l.downPayment)} على ${l.years} سنين` : ""}</div>
      <div class="features">${l.features.join(" · ")}</div>`;
    card.addEventListener("click", () => toggleSelect(l));
    listingsEl.appendChild(card);
  }
}

const compareTray = document.getElementById("compareTray");
const compareChips = document.getElementById("compareChips");

function toggleSelect(l) {
  if (selected.has(l.id)) selected.delete(l.id);
  else {
    if (selected.size >= 3) return;
    selected.set(l.id, l);
  }
  renderCompareTray();
  renderListings();
}

function renderCompareTray() {
  compareTray.hidden = selected.size === 0;
  compareChips.innerHTML = "";
  for (const [id] of selected) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${id} <button title="شيل">✕</button>`;
    chip.querySelector("button").addEventListener("click", () => { selected.delete(id); renderCompareTray(); renderListings(); });
    compareChips.appendChild(chip);
  }
}

/* ================= intent extraction ================= */

function listingsSummary(list = LISTINGS) {
  return list.map(l =>
    `${l.id}: ${l.title} | ${l.city}/${l.district} | ${l.type} | ${l.price} EGP | ${l.rooms}br/${l.baths}ba | ${l.size}m2 | ${l.finishing} | ${l.payment}${l.years ? ` down ${l.downPayment} over ${l.years}y` : ""} | ${l.features.join(", ")}`
  ).join("\n");
}

async function extractIntent(question) {
  const prompt =
`You extract a structured search intent from an Egyptian-Arabic real-estate question.
Reply with ONLY a compact JSON object, no markdown, with these keys:
{"budget_max_egp": number|null, "rooms_min": number|null, "rooms_max": number|null,
 "areas": [string], "question_type": "search"|"compare"|"general"}
Convert Arabic-Indic digits. "مليون" = 1000000. "حد أقصى/بحدود/في حدود" = budget_max.
Map area mentions to these cities only: القاهرة الجديدة, مدينة المستقبل, العاصمة الإدارية, 6 أكتوبر, الشيخ زايد, المعادي, مدينة نصر, مصر الجديدة.
Question: "${question.replace(/"/g, "'")}"`;
  const t0 = performance.now();
  const result = await intentModel.generateContent(prompt);
  const ms = performance.now() - t0;
  const src = result.response.inferenceSource;
  let intent = null;
  try {
    const m = result.response.text().match(/\{[\s\S]*\}/);
    if (m) intent = JSON.parse(m[0]);
  } catch (_) { /* keep null */ }
  return { intent, src, ms };
}

function localFallbackIntent(q) {
  // Tiny offline parser so the app still filters when AI is unreachable.
  const digits = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
  const norm = q.replace(/[٠-٩]/g, d => digits[d] || d);
  let budget = null;
  const m = norm.match(/(\d+(?:\.\d+)?)\s*(?:مليون|million)/i);
  if (m) budget = parseFloat(m[1]) * 1000000;
  const rm = norm.match(/(\d)\s*(?:غرف|غرفة|اوض|أوض)/);
  const rooms = rm ? parseInt(rm[1], 10) : null;
  const areas = Object.keys(AREAS_INDEX).filter(k => q.includes(k)).map(k => AREAS_INDEX[k][0]);
  return { budget_max_egp: budget, rooms_min: rooms, rooms_max: rooms, areas: [...new Set(areas)], question_type: "search" };
}

function filterListings(intent) {
  if (!intent) return [];
  return LISTINGS.filter(l => {
    if (intent.budget_max_egp && l.price > intent.budget_max_egp * 1.05) return false;
    if (intent.rooms_min && l.rooms < intent.rooms_min) return false;
    if (intent.rooms_max && l.rooms > intent.rooms_max) return false;
    if (intent.areas && intent.areas.length && !intent.areas.includes(l.city)) return false;
    return true;
  });
}

function intentChipHTML(intent, src, ms, matched) {
  if (!intent) return "";
  const parts = [];
  if (intent.budget_max_egp) parts.push("ميزانية حتى " + fmtPrice(intent.budget_max_egp));
  if (intent.rooms_min) parts.push((intent.rooms_min === intent.rooms_max ? intent.rooms_min : `${intent.rooms_min}-${intent.rooms_max || "?"}`) + " غرف");
  if (intent.areas && intent.areas.length) parts.push(intent.areas.join("، "));
  parts.push(`${matched} عقار مطابق`);
  return `<span class="intent-chip">فهمت إنك بتدور على: ${parts.join(" · ")}</span>`;
}

/* ================= deep answer ================= */

const ADVISOR_SYSTEM =
`أنت «مستشار عقار»، مستشار عقارات مصري خبرته ١٤ سنة في السوق. اتكلم بالعامية المصرية المحترمة، باختصار ووضوح، من غير حشو.
قواعد صارمة:
- استخدم فقط بيانات العقارات المرفقة تحت. كلها بيانات تجريبية توضيحية — لو سألك عن السوق عموماً قول إن الأرقام أمثلة مش أسعار حقيقية.
- متخترعش عقارات أو أسعار مش موجودة.
- رتّب إجابتك: ترشيح واضح أولاً، بعدين ليه (٣ أسباب كحد أقصى)، بعدين نصيحة عملية واحدة.
- لو مفيش عقار مطابق تماماً، اقترح الأقرب وقول ليه.
- الأسعار بالجنيه المصري.
العقارات المتاحة:
${listingsSummary()}`;

async function askAdvisor(question, contextNote) {
  const prompt = ADVISOR_SYSTEM + "\n\n" + (contextNote ? contextNote + "\n\n" : "") + "سؤال العميل: " + question;
  const t0 = performance.now();
  try {
    const result = await withTimeout(advisorModel.generateContent(prompt), 25000);
    const ms = performance.now() - t0;
    return { text: result.response.text(), src: result.response.inferenceSource, ms };
  } catch (e) {
    console.warn("hybrid advisor call failed, retrying cloud-only:", e);
    const result = await advisorCloudOnly.generateContent(prompt);
    const ms = performance.now() - t0;
    return { text: result.response.text(), src: "IN_CLOUD", ms };
  }
}

function withTimeout(p, ms) {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error("hybrid call timeout")), ms))
  ]);
}

/* ================= chat UI ================= */

const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
let busy = false;

function addMsg(role, html) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = `<div class="bubble">${html}</div>`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

async function handleQuestion(question, opts = {}) {
  if (busy) return;
  busy = true;
  chatForm.querySelector("button").disabled = true;
  addMsg("user", esc(question));
  const reply = addMsg("assistant", `<span class="typing">بفكر…</span>`);

  try {
    if (!firebaseReady) throw (firebaseError || new Error("Firebase not initialized"));

    // Stage 1: intent (on-device friendly, small structured task)
    let intentInfo = null;
    try {
      intentInfo = await extractIntent(question);
      recordSource(intentInfo.src);
    } catch (e) {
      console.warn("intent extraction failed, local parser used:", e);
    }
    const intent = intentInfo?.intent || localFallbackIntent(question);
    const matched = filterListings(intent);

    // Stage 2: deep answer
    const contextNote = matched.length
      ? `العقارات الأقرب لطلب العميل: ${matched.map(m => m.id).join(", ")}`
      : "مفيش عقار مطابق تماماً للفلاتر — اقترح الأقرب.";
    const ans = await askAdvisor(question, contextNote);
    recordSource(ans.src);

    reply.querySelector(".bubble").innerHTML =
      badgeHTML(ans.src, ans.ms) +
      (intentInfo ? intentChipHTML(intent, intentInfo.src, intentInfo.ms, matched.length) : "") +
      `<div class="answer-text">${esc(ans.text)}</div>`;

    if (matched.length) renderListings(matched.map(m => m.id));
  } catch (e) {
    console.error(e);
    reply.querySelector(".bubble").innerHTML =
      `<span style="color:var(--danger)">حصلت مشكلة في الاتصال بالنموذج: ${esc(String(e.message || e))}</span>`;
  } finally {
    busy = false;
    chatForm.querySelector("button").disabled = false;
    chatInput.focus();
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = chatInput.value.trim();
  if (!q) return;
  chatInput.value = "";
  handleQuestion(q);
});

document.querySelectorAll(".sugg").forEach(b =>
  b.addEventListener("click", () => handleQuestion(b.textContent.trim()))
);

document.getElementById("compareBtn").addEventListener("click", () => {
  const ids = [...selected.keys()];
  const q = ids.length >= 2
    ? `قارن بين ${ids.join(" و ")}: مين أحسن قيمة مقابل سعر، وليه؟ ولمين كل واحد مناسب؟`
    : `احكيلي بالتفصيل عن ${ids[0]} ومين المناسب ليه`;
  handleQuestion(q);
});

/* ================= boot ================= */

initFirebase();
renderListings();
checkOnDevice();
if (!firebaseReady) {
  setDot("dot-off", "إعداد Firebase ناقص (firebase-config.js) — راجع README لتعبئة الإعدادات.");
}
