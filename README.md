# Auto Repair Emmanuel — autorepairemmanuel.com

Статический сайт автосервиса Auto Repair Emmanuel LLC (Charlotte, NC): HTML + CSS + JS (ES-модули), без сборки.
Английский — в корне, испанский — в `/es/`. Заявки — Firebase (тариф Spark, бесплатный), как в AUTO-REMAR.

Пока `assets/js/firebase-config.js` пустой, форма в **демо-режиме**: показывает «спасибо (demo)» и пишет заявку в консоль.

## Локально

```bash
python3 -m http.server 8000
```

Открыть http://localhost:8000 (ES-модули не работают через `file://`).

## Подключение заявок (Firebase)

То же, что в README AUTO-REMAR, разделы «Подключение Firebase», «App Check», «EmailJS»:
1. Новый проект Firebase → Firestore (регион `us-east1`) → Authentication Email/Password, выключить sign-up.
2. Конфиг web-приложения → `assets/js/firebase-config.js`.
3. Почту владельца добавить в Authentication и в `isAdmin()` в `firestore.rules`, затем
   `firebase deploy --only firestore:rules --project <project-id>`.
4. Заявки владелец смотрит в `/admin.html` (интерфейс на испанском).
5. EmailJS (по желанию): письмо о каждой заявке, переменные `{{service}} {{car}} {{year}} {{date}} {{name}} {{phone}} {{email}} {{comment}} {{lang}}`.

## Хостинг и домен

GitHub Pages, как AUTO-REMAR. Домен в канонических ссылках, `sitemap.xml` и `robots.txt` — `www.autorepairemmanuel.com`
(на 7.11.2026 свободен). Если клиент выберет другой — заменить во всех `*.html`, `sitemap.xml`, `robots.txt`.
Сейчас это превью для клиента: на 4 публичных страницах стоит `<meta name="robots" content="noindex, nofollow">`.
При запуске — удалить эту строку и комментарий над ней во всех `*.html`.
После запуска: ссылку на сайт добавить в карточку Google Business; домен — в Search Console и отправить `sitemap.xml`.

## Откуда контент (7.11.2026)

Google Places API и карточка Google Maps: адрес, телефон, часы, оплата картами, парковка, доступность,
«Latino-owned», «women-owned», рейтинг 4.8 / 522 отзыва, темы отзывов (brake repair, 1-year warranty, rotor repair,
misfire repair), ответ владелицы про диагностику $120 и «never touch a car without the customer's authorization».
Отзывы на сайте пересказаны своими словами, без цитат и имён. Фото из Google не используются (права у авторов).

## Подтвердить с клиентом до запуска

- **Гарантия 1 год** — упоминается в отзывах, но условия (срок, пробег, на что) не известны. Сейчас в 4 местах на каждом языке.
- **Цена диагностики $120** и засчитывается ли она в ремонт — блок «How it works».
- **Список услуг** — собран по отзывам; кондиционер, шины, трансмиссию, сход-развал добавить, если делают.
- **Наличные** — принимают ли? Сейчас на сайте только карты (как в Google).
- **Часы** 6:00–21:00, вс до 17:00 — в `assets/js/site.js` (HOURS), в таблицах часов и в JSON-LD обеих версий.
- **Рейтинг** 4.8 / 522 — обновлять вручную в `index.html` и `es/index.html`.
- **Фото** мастерской и команды — нет; когда пришлют, добавить галерею и `og:image`.
- **Логотип** — сейчас временный знак «E»; если у клиента есть свой, заменить `assets/img/favicon.svg` и символ `i-logo`.
- **Политика конфиденциальности** — срок хранения 24 месяца взят по умолчанию.
- Куда слать уведомления о заявках: почта или SMS (SMS потребует Twilio или похожий сервис).

## Структура

| Файл | Что |
| --- | --- |
| `index.html`, `privacy.html` | Страницы EN; копии на ES в `es/` |
| `admin.html` | Панель заявок (noindex, на испанском) |
| `404.html` | Страница 404 для GitHub Pages |
| `assets/js/site.js` | Меню, шапка, статус «Open now» по времени Charlotte |
| `assets/js/booking.js` | Форма записи |
| `assets/js/admin.js` | Логика панели |
| `assets/js/firebase-config.js` | Ключи Firebase / App Check / EmailJS |
| `firestore.rules`, `firebase.json` | Правила Firestore и их деплой |
