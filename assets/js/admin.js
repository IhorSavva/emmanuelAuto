import { configured, getApp, firestore, auth } from "./firebase-config.js";

const $ = (id) => document.getElementById(id);
const msg = $("admin-msg");
const say = (text, ok = false) => { msg.textContent = text; msg.className = "form-msg" + (text ? (ok ? " ok" : " err") : ""); };
const STATUSES = { new: "Nueva", confirmed: "Confirmada", done: "Terminada" };

if (!configured) {
  say("Firebase no está configurado: complete assets/js/firebase-config.js (instrucciones en README.md).");
} else {
  start().catch((e) => { console.error(e); say("Error al cargar Firebase: " + e.message); });
}

async function start() {
  const app = await getApp();
  const [A, F] = await Promise.all([auth(), firestore()]);
  const au = A.getAuth(app);
  const db = F.getFirestore(app);
  let unsubscribe = null;

  $("login").hidden = false;
  $("login").addEventListener("submit", async (e) => {
    e.preventDefault();
    say("");
    try {
      await A.signInWithEmailAndPassword(au, e.target.email.value.trim(), e.target.password.value);
    } catch {
      say("Correo o contraseña incorrectos.");
    }
  });
  $("logout").addEventListener("click", () => A.signOut(au));

  A.onAuthStateChanged(au, (user) => {
    $("login").hidden = !!user;
    $("panel").hidden = !user;
    unsubscribe?.();
    unsubscribe = null;
    if (!user) return;
    say("");
    $("who").textContent = user.email;
    const q = F.query(F.collection(db, "bookings"), F.orderBy("createdAt", "desc"), F.limit(300));
    unsubscribe = F.onSnapshot(q, (snap) => renderBookings(snap, F, db),
      (err) => say("Sin acceso a las solicitudes (" + err.code + "). ¿Está esta cuenta en la lista de firestore.rules?"));
  });
}

// Booking fields come from the public form: only ever set them via textContent.
function renderBookings(snap, F, db) {
  const body = $("bookings");
  if (snap.empty) {
    body.innerHTML = '<tr><td colspan="7">No hay solicitudes.</td></tr>';
    return;
  }
  body.replaceChildren(...snap.docs.map((d) => {
    const b = d.data();
    const tr = document.createElement("tr");
    const cell = (...parts) => {
      const td = tr.insertCell();
      parts.filter(Boolean).forEach((p, i) => { if (i) td.append(document.createElement("br")); td.append(p); });
      return td;
    };
    const tel = document.createElement("a");
    tel.href = "tel:" + b.phone.replace(/[^\d+]/g, "");
    tel.textContent = b.phone;

    cell(b.createdAt ? b.createdAt.toDate().toLocaleString("es-US") : "…", b.lang === "en" ? "(EN)" : "");
    cell(b.name, tel, b.email);
    cell(b.car, b.year);
    cell(b.service);
    cell(b.date);
    cell(b.comment);

    const sel = document.createElement("select");
    sel.className = "status-" + b.status;
    sel.setAttribute("aria-label", "Estado de la solicitud");
    for (const [v, label] of Object.entries(STATUSES)) sel.add(new Option(label, v, false, v === b.status));
    sel.addEventListener("change", () =>
      F.updateDoc(F.doc(db, "bookings", d.id), { status: sel.value }).catch((e) => say("No se guardó el estado: " + e.code)));
    cell(sel);
    return tr;
  }));
}
