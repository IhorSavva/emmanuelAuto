import { configured, getApp, firestore, emailjs } from "./firebase-config.js";

const form = document.getElementById("booking");
const es = document.documentElement.lang === "es";
const T = es
  ? {
      ok: "¡Gracias! Le llamaremos pronto para confirmar la cita.",
      demo: "(Modo demo: la solicitud no se guardó.)",
      err: "No se pudo enviar la solicitud. Llámenos al (980) 531-2447.",
      phone: "Escriba un número de teléfono de 10 dígitos.",
      sunday: "Domingo: abierto de 6 a. m. a 5 p. m.",
      hours: "Abierto todos los días · lun–sáb 6 a. m.–9 p. m., dom 6 a. m.–5 p. m.",
    }
  : {
      ok: "Thank you! We'll call you shortly to confirm your visit.",
      demo: "(Demo mode: the request was not saved.)",
      err: "Sorry, we couldn't send your request. Please call us at (980) 531-2447.",
      phone: "Please enter a 10-digit phone number.",
      sunday: "Sunday hours: 6 AM–5 PM.",
      hours: "Open every day · Mon–Sat 6 AM–9 PM, Sun 6 AM–5 PM",
    };

if (form) {
  const f = form.elements;
  const msg = form.querySelector(".form-msg");
  const hint = document.getElementById("date-hint");
  const submit = form.querySelector("[type=submit]");

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  f.date.min = now.toISOString().slice(0, 10);

  f.date.addEventListener("change", () => {
    const sunday = f.date.value && new Date(f.date.value + "T12:00").getDay() === 0;
    hint.textContent = sunday ? T.sunday : T.hours;
  });
  f.phone.addEventListener("input", () => f.phone.setCustomValidity(""));

  const show = (cls, text) => { msg.className = "form-msg " + cls; msg.textContent = text; };
  const val = (el, max) => el.value.trim().slice(0, max);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // US numbers: 10 digits, optionally with a leading 1.
    const digits = f.phone.value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
    f.phone.setCustomValidity(digits.length === 10 ? "" : T.phone);
    if (!form.reportValidity()) return;

    const done = () => {
      show("ok", configured ? T.ok : `${T.ok} ${T.demo}`);
      form.reset();
      hint.textContent = T.hours;
    };
    if (f.website.value) return done(); // honeypot: bots get a fake success

    // Keys and limits must match firestore.rules.
    const data = {
      service: val(f.service, 100), car: val(f.car, 100), year: val(f.year, 4), date: val(f.date, 10),
      name: val(f.name, 100), phone: val(f.phone, 30), email: val(f.email, 120), comment: val(f.comment, 1000),
      lang: es ? "es" : "en",
    };

    submit.disabled = true;
    try {
      if (configured) {
        const { getFirestore, collection, addDoc, serverTimestamp } = await firestore();
        await addDoc(collection(getFirestore(await getApp()), "bookings"), { ...data, status: "new", createdAt: serverTimestamp() });
        notify(data);
      } else {
        console.info("[demo] Request:", data);
      }
      done();
    } catch (err) {
      console.error(err);
      show("err", T.err);
    } finally {
      submit.disabled = false;
    }
  });
}

// The request is already saved; a failed e-mail must not show an error to the customer.
function notify(data) {
  if (!emailjs.serviceId || !emailjs.templateId || !emailjs.publicKey) return;
  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: emailjs.serviceId, template_id: emailjs.templateId, user_id: emailjs.publicKey,
      template_params: data,
    }),
  }).catch((e) => console.warn("EmailJS:", e));
}
