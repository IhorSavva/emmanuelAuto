// Paste the web app config from Firebase console → Project settings → Your apps.
// While apiKey/projectId are empty the site runs in demo mode (the form logs to the console, nothing is saved).
export const firebaseConfig = {
  apiKey: "AIzaSyC3wTVb54iYkuGErqA7mqPr3Ya3JsiOTAE",
  authDomain: "emmanuel-auto-repair.firebaseapp.com",
  projectId: "emmanuel-auto-repair",
  storageBucket: "emmanuel-auto-repair.firebasestorage.app",
  messagingSenderId: "928372380203",
  appId: "1:928372380203:web:ee67303283dffa03f4106e",
};

// Optional: reCAPTCHA v3 site key for Firebase App Check. Empty = App Check off.
export const appCheckSiteKey = "";

// Optional: e-mail about every new request via EmailJS. Empty = no e-mail.
export const emailjs = { serviceId: "", templateId: "", publicKey: "" };

// ---- no need to edit below ----
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
export const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let appPromise;
export function getApp() {
  return (appPromise ??= (async () => {
    const { initializeApp } = await import(SDK + "firebase-app.js");
    const app = initializeApp(firebaseConfig);
    if (appCheckSiteKey) {
      const { initializeAppCheck, ReCaptchaV3Provider } = await import(SDK + "firebase-app-check.js");
      initializeAppCheck(app, { provider: new ReCaptchaV3Provider(appCheckSiteKey), isTokenAutoRefreshEnabled: true });
    }
    return app;
  })());
}
export const firestore = () => import(SDK + "firebase-firestore.js");
export const auth = () => import(SDK + "firebase-auth.js");
