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

// App Check. The #BuildHybridAI 2026 rules explicitly accept debug tokens in
// submissions, so the hosted demo ships with this console-registered debug
// token (Firebase console > App Check > Apps > Manage debug tokens).
// For a production release, replace with a reCAPTCHA Enterprise site key.
export const APPCHECK_SITE_KEY = "";
export const APPCHECK_DEBUG_TOKEN = "3ef62a3f-ff68-4666-a78d-85d530b299ca";
