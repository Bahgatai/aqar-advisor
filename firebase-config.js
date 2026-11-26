// Firebase web app configuration for Aqar Advisor.
// Firebase web config values are identifiers, not secrets:
// https://firebase.google.com/docs/projects/api-keys
// Security is enforced by Firebase App Check (see app.js).
export const firebaseConfig = {
  apiKey: "AIzaSyCJpzj6SJhz_Jo4EqRd2rPG6K1QJnnW0_M",
  authDomain: "aqar-advisor.firebaseapp.com",
  projectId: "aqar-advisor",
  storageBucket: "aqar-advisor.firebasestorage.app",
  messagingSenderId: "1057278780612",
  appId: "1:1057278780612:web:3309f339ae20db346a5591"
};

// App Check: production reCAPTCHA Enterprise (Fraud Defense) site key,
// registered in Firebase console > App Check > Apps. The console-registered
// debug token below is kept for local development only (the #BuildHybridAI
// 2026 rules explicitly accept debug tokens in submissions).
export const APPCHECK_SITE_KEY = "6LduQTQuAAAAAN5Rc-pDxXE88mu_kB3imeYi65Dx";
export const APPCHECK_DEBUG_TOKEN = ""; // set a console-registered debug token here for local dev only, never commit a real one
