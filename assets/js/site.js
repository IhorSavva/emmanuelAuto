// Menu, sticky header and the "Open now" badge.
const es = document.documentElement.lang === "es";

const btn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
const setOpen = (open) => { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); };
if (btn && nav) {
  btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => e.target.closest("a") && setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); btn.focus(); }
  });
}

const head = document.querySelector(".site-head");
const onScroll = () => head.classList.toggle("scrolled", scrollY > 4);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Opening hours in the shop's own time zone (Charlotte = America/New_York). Keep in sync with the hours table and JSON-LD.
export const HOURS = [[6, 17], [6, 21], [6, 21], [6, 21], [6, 21], [6, 21], [6, 21]]; // Sun..Sat

export function shopNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")), hour: +get("hour") + get("minute") / 60 };
}

export function status({ day, hour }) {
  const [from, to] = HOURS[day];
  const t = (h) => (h % 12 || 12) + (es ? (h < 12 ? " a. m." : " p. m.") : (h < 12 ? " AM" : " PM"));
  if (hour >= from && hour < to) return { open: true, text: (es ? "Abierto ahora · hasta las " : "Open now · until ") + t(to) };
  const today = hour < from;
  const opens = today ? from : HOURS[(day + 1) % 7][0];
  return { open: false, text: es ? `Cerrado · abre ${today ? "hoy" : "mañana"} a las ${t(opens)}` : `Closed · opens ${today ? "today" : "tomorrow"} at ${t(opens)}` };
}

const now = shopNow();
const s = status(now);
document.querySelectorAll("[data-status]").forEach((el) => {
  el.classList.add(s.open ? "is-open" : "is-closed");
  el.querySelector("[data-status-text]").textContent = s.text;
});
document.querySelector(`.hours tr[data-day="${now.day}"]`)?.classList.add("today");
