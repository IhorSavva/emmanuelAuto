# Auto Repair Emmanuel — autorepairemmanuel.com

Статический сайт автосервиса Auto Repair Emmanuel LLC (Charlotte, NC): HTML + CSS + JS (ES-модули), без сборки.
Английский — в корне, испанский — в `/es/`. Заявки — Firebase (тариф Spark, бесплатный), как в AUTO-REMAR.
Превью: https://ihorsavva.github.io/emmanuelAuto/

## Локально

```bash
python3 -m http.server 8000
```

Открыть http://localhost:8000 (ES-модули не работают через `file://`).

## Заявки (Firebase) — подключено

Проект `emmanuel-auto-repair` (консоль: https://console.firebase.google.com/project/emmanuel-auto-repair),
Firestore `nam5`, правила из `firestore.rules` задеплоены, конфиг в `assets/js/firebase-config.js`. Заявки с формы уже пишутся
в коллекцию `bookings` (одна тестовая — «TEST (Claude check)», удалить в админке).

Осталось сделать в консоли (руками, нужен пароль):
1. **Authentication → Get started → Email/Password → Enable**; **Settings → User actions**: снять «Enable create (sign-up)».
2. **Users → Add user**: аккаунт владелицы (и/или `savva.ihor@gmail.com`). Почту владелицы дописать в `isAdmin()` в `firestore.rules`,
   затем `firebase deploy --only firestore:rules`.
3. **Authentication → Settings → Authorized domains**: `ihorsavva.github.io`, позже `autorepairemmanuel.com`.
4. Заявки смотреть в `/admin.html` (интерфейс на испанском).
5. Уведомление о заявке: EmailJS, как в AUTO-REMAR (`emailjs` в `firebase-config.js`), переменные
   `{{service}} {{car}} {{year}} {{date}} {{name}} {{phone}} {{email}} {{comment}} {{lang}}`.

## Живые фото и отзывы из Google

`assets/js/google-live.js` при открытии страницы берёт из Places API (New) рейтинг, число отзывов, 5 фото (сначала фото владелицы)
и до 4 отзывов на 4–5★ — на языке страницы, с подписью авторов. Хранить фото и отзывы у себя Google запрещает, поэтому только вживую.
Пока ключа нет, на странице статичный рейтинг и пересказ отзывов, галерея скрыта.

Ключ (отдельный от серверного в lead-finder!):
1. Google Cloud Console, проект с включённым «Places API (New)» → **Credentials → Create credentials → API key**.
2. **Application restrictions → Websites**: `https://ihorsavva.github.io/*`, `https://www.autorepairemmanuel.com/*`,
   `https://autorepairemmanuel.com/*`, `http://localhost:8000/*`.
3. **API restrictions** → только «Places API (New)».
4. **APIs & Services → Places API (New) → Quotas**: ограничить запросы в день (например 300), чтобы чужой трафик не съел деньги.
5. Вписать ключ в `mapsApiKey` в `assets/js/google-config.js`.

Стоимость: 1 запрос Place Details (Enterprise + Atmosphere) + до 5 фото (Place Photo) на просмотр главной; фото грузятся лениво.
У каждого SKU 1000 бесплатных запросов в месяц — для автосервиса с сотнями визитов в месяц обычно хватает, но проверить в Billing через месяц.

## Хостинг и домен

GitHub Pages. Домен в канонических ссылках, `sitemap.xml` и `robots.txt` — `www.autorepairemmanuel.com` (на 7.11.2026 свободен).

Чек-лист запуска:
- Удалить `<meta name="robots" content="noindex, nofollow">` и комментарий над ним во всех `*.html` (кроме `admin.html`, `404.html`).
- `og:image` сейчас указывает на `ihorsavva.github.io/emmanuelAuto/assets/img/og.png` — заменить на домен.
- Если домен другой — заменить `autorepairemmanuel.com` во всех `*.html`, `sitemap.xml`, `robots.txt`.
- Файл `CNAME` с доменом, DNS как в README AUTO-REMAR, Enforce HTTPS; домен — в ключ Google и Firebase Authorized domains.
- Ссылку на сайт добавить в карточку Google Business; домен — в Search Console, отправить `sitemap.xml`.

## Откуда контент (7.11.2026)

Google Places API и карточка Google Maps: адрес, телефон, часы, оплата картами, парковка, доступность,
«Latino-owned», «women-owned», рейтинг 4.8 / 522 отзыва, темы отзывов (brake repair, 1-year warranty, rotor repair,
misfire repair), ответ владелицы про диагностику $120 и «never touch a car without the customer's authorization».
Фото владелицы (просмотрены, не скопированы): ремонт двигателей, тормоза, подвеска, RAM 2500, Toyota Tacoma, Cadillac —
отсюда «engine rebuilds» и список марок. Статичные отзывы пересказаны своими словами, без цитат и имён.

## Подтвердить с клиентом до запуска

- **WhatsApp** — сейчас кнопки ведут на `wa.me/19805312447` (основной номер). Есть ли на нём WhatsApp? Если номер другой — заменить
  во всех `*.html` (поиск `wa.me/`).
- **Гарантия 1 год** — упоминается в отзывах, но условия (срок, пробег, на что) не известны. Встречается на главной, в FAQ и на страницах услуг.
- **Цена диагностики $120** и засчитывается ли она в ремонт — «How it works», FAQ, страница check engine.
- **Марки** — «Toyota, Honda, RAM, Cadillac … and most other makes»: первые четыре видны на фото и в отзывах, «most other makes» — уточнить.
- **Список услуг** — собран по отзывам и фото; кондиционер, шины, трансмиссию, сход-развал добавить, если делают.
- **Наличные** — принимают ли? Сейчас на сайте только карты (как в Google).
- **Часы** 6:00–21:00, вс до 17:00 — в `assets/js/site.js` (HOURS), в таблицах часов, FAQ и JSON-LD обеих версий.
- **Рейтинг** 4.8 / 522 — статичный запасной вариант в `index.html` и `es/index.html`; с ключом Google обновляется сам.
- **Свои фото** — когда пришлют оригиналы, положить в `assets/img/` и заменить живую галерею статичной.
- **Логотип** — сейчас временный знак «E»; если у клиента есть свой, заменить `assets/img/favicon.svg`, символ `i-logo` и `og.png`.
- **Политика конфиденциальности** — срок хранения 24 месяца взят по умолчанию.

## Структура

| Файл | Что |
| --- | --- |
| `index.html`, `privacy.html` | Главная и политика, EN; копии на ES в `es/` |
| `brakes.html`, `check-engine.html`, `suspension.html` | Страницы услуг EN; ES: `es/frenos.html`, `es/check-engine.html`, `es/suspension.html` |
| `admin.html` | Панель заявок (noindex, на испанском) |
| `404.html` | Страница 404 для GitHub Pages |
| `assets/js/site.js` | Меню, шапка, статус «Open now» по времени Charlotte |
| `assets/js/booking.js` | Форма записи |
| `assets/js/google-live.js`, `google-config.js` | Живые рейтинг, фото и отзывы из Google; ключ |
| `assets/js/admin.js` | Логика панели |
| `assets/js/firebase-config.js` | Ключи Firebase / App Check / EmailJS |
| `assets/img/og.png` | Картинка для превью ссылки (1200×630) |
| `firestore.rules`, `firebase.json`, `.firebaserc` | Правила Firestore и их деплой |
