// Live rating, owner photos and reviews from Google Places API (New).
// Google's terms allow showing this content live with attribution but not copying it, so nothing is stored here.
import { mapsApiKey, placeId, ownerName } from "./google-config.js";

const lang = document.documentElement.lang;
const PHOTOS = 5; // 1 large + 4 small; each photo view is a billed request
const REVIEWS = 4;
const T = lang === "es"
  ? { photo: "Foto", translated: "Traducido por Google", stars: (n) => `${n} de 5 estrellas` }
  : { photo: "Photo", translated: "Translated by Google", stars: (n) => `${n} out of 5 stars` };

if (mapsApiKey) load().catch((e) => console.warn("Google Places:", e));

async function load() {
  const r = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=${lang}`, {
    headers: { "X-Goog-Api-Key": mapsApiKey, "X-Goog-FieldMask": "rating,userRatingCount,reviews,photos" },
  });
  if (!r.ok) throw new Error(r.status + " " + (await r.text()).slice(0, 200));
  render(await r.json());
}

// Exported so the rendering can be checked with sample data without an API key.
export function render(place) {
  if (place.rating) document.querySelectorAll("[data-rating]").forEach((el) => (el.textContent = place.rating.toFixed(1)));
  if (place.userRatingCount) document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = place.userRatingCount));
  renderPhotos(place.photos || []);
  renderReviews((place.reviews || []).filter((rv) => rv.rating >= 4).slice(0, REVIEWS));
}

const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...kids);
  return n;
};

function attribution(a) {
  if (!a) return "";
  return a.uri ? el("a", { href: a.uri, target: "_blank", rel: "noopener", textContent: a.displayName }) : a.displayName;
}

function renderPhotos(photos) {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  const isOwner = (p) => p.authorAttributions?.some((a) => a.displayName === ownerName);
  const pick = [...photos.filter(isOwner), ...photos.filter((p) => !isOwner(p))].slice(0, PHOTOS);
  if (pick.length < 3) return;
  grid.replaceChildren(...pick.map((p, i) => {
    const img = el("img", {
      src: `https://places.googleapis.com/v1/${p.name}/media?maxWidthPx=${i ? 600 : 1200}&key=${mapsApiKey}`,
      alt: "", loading: "lazy", decoding: "async",
    });
    return el("figure", {}, img, el("figcaption", {}, `${T.photo}: `, attribution(p.authorAttributions?.[0])));
  }));
  document.getElementById("gallery").hidden = false;
}

function renderReviews(reviews) {
  const list = document.getElementById("quotes");
  if (!list || reviews.length < 2) return;
  const star = () => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.innerHTML = '<use href="#i-star"/>'; return s; };
  list.replaceChildren(...reviews.map((rv) => {
    const a = rv.authorAttribution || {};
    const who = el("div", { className: "who" });
    if (a.photoUri) who.append(el("img", { src: a.photoUri, alt: "", loading: "lazy", referrerPolicy: "no-referrer" }));
    who.append(el("span", {}, attribution(a), el("br"), el("small", { textContent: rv.relativePublishTimeDescription || "" })));
    const stars = el("div", { className: "stars" }, ...Array.from({ length: rv.rating }, star));
    stars.setAttribute("role", "img");
    stars.setAttribute("aria-label", T.stars(rv.rating));
    const translated = rv.originalText && rv.text && rv.originalText.languageCode !== rv.text.languageCode;
    const li = el("li", {}, who, stars, el("p", { className: "text", textContent: rv.text?.text || rv.originalText?.text || "" }));
    if (translated) li.append(el("small", { className: "hint", textContent: T.translated }));
    return li;
  }));
  list.after(el("p", { className: "g-attr", textContent: lang === "es" ? "Reseñas de Google Maps" : "Reviews from Google Maps" }));
}
