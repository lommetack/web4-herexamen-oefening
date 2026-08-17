# 🛋️ COACH-LOG — Couch Potato (Web4 herexamen-oefening)

> **Wat is dit document?**
> Een volledig uitgeschreven logboek van hoe deze examenopdracht opgelost werd, met
> *alles* uitgelegd alsof je nog nooit React Router hebt gezien. Elke stap, elke regel
> code, elke fout die je kán maken.
>
> **Status:** ✅ alle **48** Playwright-tests slagen (chromium).
> **Gewijzigde bestanden:** 13 (7 routes/layouts + 6 componenten). Services, tests,
> CSS, `routes.js` en `root.jsx` zijn **niet** aangepast.

---

## 📑 Inhoudstafel

| # | Hoofdstuk | Waarvoor |
|---|-----------|----------|
| 0 | [Hoe gebruik je deze log](#0-hoe-gebruik-je-deze-log) | Leeswijzer |
| 1 | [De opdracht in mensentaal](#1-de-opdracht-in-mensentaal) | Context |
| 2 | [Het mentale model](#2-het-mentale-model-loader--component--action) | ⭐ Belangrijkste hoofdstuk |
| 3 | [De 12 gouden regels](#3-de-12-gouden-regels-spiekbriefje) | Spiekbriefje |
| 4 | [Werklog: stap voor stap](#4-werklog-stap-voor-stap) | Het echte logboek |
| 5 | [Alle 48 tests ontcijferd](#5-alle-48-tests-ontcijferd) | Checklist |
| 6 | [Foutmeldingen-decoder](#6-foutmeldingen-decoder) | Debuggen |
| 7 | [Examenstrategie](#7-examenstrategie-volgorde--timing) | Tactiek |
| 8 | [Indien-checklist](#8-indien-checklist) | Afwerken |
| 9 | [Oefenopdrachten voor jezelf](#9-oefenopdrachten-voor-jezelf) | Trainen |

---

## 0. Hoe gebruik je deze log

Er zijn drie manieren om dit document te gebruiken. Kies er één:

**A. Als student die wil léren (aanbevolen)**
1. Lees hoofdstuk 2 en 3 (het model + de regels). Dat is ±15 min.
2. Doe hoofdstuk 9: gooi de `start/`-map opnieuw in een lege folder en probeer het zélf.
3. Loop vast? Zoek het scherm op in hoofdstuk 4 en lees enkel dát blok.

**B. Als student die snel wil controleren**
Spring naar hoofdstuk 5. Daar staat per test wat er getest wordt en welke regel code
hem groen maakt. Loop je eigen code af tegen die lijst.

**C. Als naslagwerk tijdens het examen**
Hoofdstuk 3 (de 12 gouden regels) en hoofdstuk 6 (foutmeldingen) zijn de twee
hoofdstukken die je op het examen effectief zult raadplegen.

**Notatie in dit document**

- 🔴 = de beginstaat (de code zoals ze in `start/` stond)
- 🟢 = de oplossing
- 💡 = waarom het zo moet
- ⚠️ = veelgemaakte fout

---

## 1. De opdracht in mensentaal

### 1.1 Wat is Couch Potato?

Een mini social network voor luiheid. Je logt "couch sessions" (tv kijken, gamen,
dutten), je volgt vrienden, en je ziet een feed van ieders luie momenten.

### 1.2 Wat kreeg je?

```
start/
├── README.md              ← de opdracht (schermen + welke data elke pagina nodig heeft)
├── screencapture.mp4      ← filmpje van de werkende app
├── server/                ← json-server + db.json   (NIET aanpassen)
└── client/
    ├── tests/             ← 48 Playwright-tests     (NIET aanpassen)
    └── app/
        ├── app.css        ← alle styling            (klaar)
        ├── root.jsx       ← html-skelet             (klaar)
        ├── routes.js      ← routetabel              (klaar)
        ├── services/      ← alle fetch-calls        (klaar — niet aanpassen)
        ├── utils/         ← formatDate/formatDuration (klaar)
        ├── components/    ← 7 componenten           ⚠️ deels kapot gemaakt
        ├── layouts/       ← AppLayout               ⚠️ deels kapot gemaakt
        └── routes/        ← 6 schermen              ⚠️ deels kapot gemaakt
```

### 1.3 Wat moest jij doen?

**Exact één ding: de brug leggen tussen de `services/` en de componenten.**

De componenten zijn al geschreven — ze verwachten data via props of via
destructuring. De services zijn al geschreven — ze halen data op. Wat ontbreekt
zijn de **loaders** (data binnenhalen), de **actions** (data wegschrijven) en de
**React Router navigatie** (`Link` i.p.v. `<a>`, `Form` i.p.v. `<form>`).

Het herkenningsteken van de "kapotte" plekken is telkens hetzelfde patroon:

```jsx
const { feedSessions } = {};          // ← lege object = "hier hoort een loader"
/* onClick={() => navigate to previous route} */   // ← comment = "hier hoort code"
<a href="/track">                     // ← gewone <a> = "moet een Link worden"
<form method="post">                  // ← gewone <form> = "moet een Form worden"
const query = "";                     // ← hardcoded = "moet useState worden"
const setQuery = undefined;
```

> 💡 **Coach-tip:** doe op het examen als allereerste een zoekactie (Ctrl+Shift+F in
> VS Code) op deze vijf patronen. Je hebt dan binnen 2 minuten je volledige to-do-lijst.

### 1.4 De datamodellen (uit het hoofd kennen)

| Collectie | Velden | Betekenis |
|-----------|--------|-----------|
| `users` | `id`, `name`, `avatar` | een persoon |
| `categories` | `id`, `name`, `emoji` | soort luie activiteit |
| `sessions` | `id`, `userId`, `categoryId`, `date`, `duration`, `notes` | één gelogde sessie |
| `follows` | `id`, `followerId`, `followingId` | wie volgt wie |

⚠️ **Alle id's zijn STRINGS**, niet nummers. `"1"`, niet `1`. Dit is de #1 oorzaak
van "waarom is mijn lijst leeg?" — een `===` tussen `"1"` en `1` is `false`.

### 1.5 De routetabel (gegeven, niet aanpassen)

```js
// app/routes.js
export default [
  layout("layouts/AppLayout.jsx", [        // ← ouder van alles
    index("routes/feed.jsx"),               // /
    route("track", "routes/track.jsx"),                        // /track
    route("sessions/:sessionId", "routes/sessionDetail.jsx"),  // /sessions/1
    route("sessions/:sessionId/edit", "routes/editSession.jsx"),
    route("friends", "routes/friends.jsx"),                    // /friends
    route("users/:userId", "routes/userProfile.jsx"),          // /users/2
  ]),
];
```

Lees dit als een boom:

```
AppLayout          ← draait ALTIJD (header + nav + <Outlet/>)
 ├── /                      → feed.jsx
 ├── /track                 → track.jsx
 ├── /sessions/:sessionId   → sessionDetail.jsx
 ├── /sessions/:sessionId/edit → editSession.jsx
 ├── /friends               → friends.jsx
 └── /users/:userId         → userProfile.jsx
```

De **namen van de parameters** staan hier: `:sessionId` en `:userId`. Die namen
gebruik je straks als `params.sessionId` en `params.userId`. Typ je `params.id`,
dan krijg je `undefined` — en dus een lege pagina. ⚠️

---

## 2. Het mentale model: loader → component → action

Dit is het hoofdstuk dat je moet snappen. De rest volgt daaruit.

### 2.1 Eén route-bestand = drie exports

Een routebestand in React Router 7 (framework mode) mag maximaal drie dingen
exporteren die er toe doen:

```jsx
export async function clientLoader({ params, request }) { … }  // 1. data OPHALEN (GET)
export async function clientAction({ params, request }) { … }  // 2. data WEGSCHRIJVEN (POST)
export default function Scherm() { … }                          // 3. data TONEN (JSX)
```

De volgorde waarin React Router ze uitvoert:

```
Gebruiker typt /users/2
        │
        ▼
┌───────────────────────┐
│ clientLoader draait   │  ← async, mag await gebruiken, fetch alles wat je nodig hebt
│ (van layout én kind,  │
│  parallel)            │
└───────────┬───────────┘
            │ return { user, sessions, … }
            ▼
┌───────────────────────┐
│ component rendert     │  ← useLoaderData() geeft je exact wat de loader teruggaf
└───────────┬───────────┘
            │ gebruiker klikt op "Follow" in een <Form method="post">
            ▼
┌───────────────────────┐
│ clientAction draait   │  ← POST/PATCH/DELETE naar de server
└───────────┬───────────┘
            │ return null  of  return redirect("/ergens")
            ▼
┌───────────────────────┐
│ ALLE loaders draaien  │  ← "revalidation": React Router ververst automatisch
│ opnieuw               │     Jij hoeft NIETS te doen. Geen useState, geen refresh.
└───────────────────────┘
```

> 💡 **Dit laatste blok is de hele reden waarom React Router loaders/actions heeft.**
> In "gewoon React" zou je na een POST zelf `setState` moeten doen om de UI te
> verversen. Hier gebeurt dat automatisch. Als je jezelf `useEffect` +
> `useState` ziet schrijven om data op te halen, zit je op het verkeerde spoor.

### 2.2 `client`Loader of gewoon `loader`?

In deze opdracht staat in `react-router.config.ts`:

```ts
export default { ssr: false };   // ← SPA-mode, geen server-side rendering
```

`ssr: false` betekent: **alles draait in de browser**. Dus gebruik je de
`client`-varianten:

| SSR aan (`ssr: true`) | SSR uit (`ssr: false`) ← **hier** |
|---|---|
| `export async function loader()` | `export async function clientLoader()` |
| `export async function action()` | `export async function clientAction()` |

⚠️ Schrijf je `loader` in plaats van `clientLoader` in deze opdracht, dan krijg je
een build-error of een lege pagina. **Onthoud: `ssr: false` → altijd `client` ervoor.**

### 2.3 Data uit de loader halen: twee manieren

Beide werken, kies er één en blijf consequent:

```jsx
// Manier A — de hook (gebruikt in deze oplossing)
import { useLoaderData } from "react-router";
export default function Feed() {
  const { feedSessions } = useLoaderData();
}

// Manier B — de prop
export default function Feed({ loaderData }) {
  const { feedSessions } = loaderData;
}
```

💡 Deze log gebruikt overal **manier A** omdat je dan meteen ziet dát er een loader
is, ook als je alleen naar de component kijkt.

### 2.4 Wat is `params`?

```jsx
// route("sessions/:sessionId", …)  +  URL /sessions/7
export async function clientLoader({ params }) {
  console.log(params);            // { sessionId: "7" }
  console.log(params.sessionId);  // "7"   ← altijd een STRING
}
```

### 2.5 Wat is `request` in een action?

```jsx
export async function clientAction({ request }) {
  const formData = await request.formData();  // ⚠️ await NIET vergeten
  formData.get("date");      // de waarde van <input name="date">
  formData.get("duration");  // ⚠️ ALTIJD een string! "45", niet 45
}
```

⚠️ **`formData.get()` geeft altijd een string terug.** Voor `duration` (een getal
in de database) moet je zelf converteren: `Number(formData.get("duration"))`.
Doe je dat niet, dan sla je `"45"` op in plaats van `45`.

### 2.6 De vier navigatie-gereedschappen

| Wat je wil | Gebruik | Voorbeeld |
|---|---|---|
| Klikbare link in JSX | `<Link to="…">` | `<Link to="/friends">Friends</Link>` |
| Link die "actief" kan zijn (nav) | `<NavLink to="…">` | `<NavLink to="/" end>Feed</NavLink>` |
| Navigeren vanuit code/onClick | `useNavigate()` | `onClick={() => navigate(-1)}` |
| Navigeren vanuit een loader/action | `redirect("…")` | `return redirect("/");` |

⚠️ `redirect()` werkt **alleen** binnen een loader of action (je moet hem
`return`en). `useNavigate()` werkt **alleen** binnen een component.

### 2.7 `<Form>` versus `<form>`

```jsx
<form method="post">    // 🔴 volledige page reload, action draait NIET
<Form method="post">    // 🟢 fetch onder water, clientAction draait, geen reload
```

De hoofdletter `F` is letterlijk het verschil tussen slagen en zakken op de tests
die zeggen *"Full page reload detected"*.

### 2.8 `useFetcher` — het formulier dat niet navigeert

```jsx
const fetcher = useFetcher();
<fetcher.Form method="post" action="/friends"> … </fetcher.Form>
```

Verschil met gewone `<Form>`:

| | `<Form>` | `<fetcher.Form>` |
|---|---|---|
| Navigeert de pagina? | ja (of via redirect) | **nee**, je blijft staan |
| Kan naar een ándere route posten? | ja, via `action=` | ja, via `action=` |
| Loaders verversen na afloop? | ja | ja |
| Typisch gebruik | opslaan-formulier | like-knop, follow-knop |

De follow/unfollow-knop staat op twee plaatsen (`/friends` én `/users/:id`), maar
de action staat maar op één plaats (`/friends`). `action="/friends"` op de
`fetcher.Form` zorgt dat beide knoppen dezelfde action aanroepen.

### 2.9 Optimistic UI in 3 regels

```jsx
let optimisticFollowing = isFollowing;                       // waarheid van de server
if (fetcher.state !== "idle" && fetcher.formData) {          // er loopt een request
  optimisticFollowing = fetcher.formData.get("intent") === "follow";  // doe alsof het al lukte
}
```

💡 `fetcher.state` is `"idle"`, `"submitting"` of `"loading"`. Zodra de gebruiker
klikt, is `state !== "idle"` en kun je in `fetcher.formData` al zien wát er
verstuurd wordt — nog vóór de server antwoordt. Zo flipt de knop onmiddellijk.
Deze code was al gegeven in `UserCard.jsx`; je moest hem enkel laten wérken.

---

## 3. De 12 gouden regels (spiekbriefje)

Print dit. Dit is 90% van de punten.

1. **`ssr: false` → altijd `clientLoader` / `clientAction`**, nooit `loader`/`action`.
2. **Loader = GET**, action = POST/PATCH/DELETE. Nooit iets wegschrijven in een loader.
3. **Loader returnt een object**, component leest het met `useLoaderData()`.
4. **`<a href>` → `<Link to>`** overal. Ook binnen componenten.
5. **`<form>` → `<Form>`** (hoofdletter F, import uit `react-router`).
6. **`useNavigate()` voor Cancel/Back:** `navigate(-1)` = één stap terug.
7. **`redirect("/pad")` in een action/loader — vergeet de `return` niet.**
8. **`params.sessionId`, `params.userId`** — exact de naam uit `routes.js`.
9. **`await request.formData()`** — en `Number(...)` rond numerieke velden.
10. **UI-state (zoekveld, accordion open/dicht) hoort in `useState`,** niet in de loader.
11. **Na een action verversen loaders automatisch.** Niet zelf refreshen.
12. **`<Outlet />` in een layout,** anders blijft je pagina leeg.

---

## 4. Werklog: stap voor stap

Hieronder per bestand: wat er stond (🔴), wat het werd (🟢), en waarom (💡).
De volgorde is de volgorde waarin ik het effectief heb aangepakt — die volgorde
is niet toevallig (zie hoofdstuk 7).

---

### STAP 1 — `app/layouts/AppLayout.jsx` (het fundament)

**Waarom eerst?** Deze layout is de ouder van *alle* schermen. Zolang hij kapot is,
is elke pagina leeg en debug je in het duister.

🔴 **Beginstaat:**

```jsx
export default function AppLayout() {
  const { currentUser } = {};                              // ← geen data

  return (
    <div className="app">
      <AppHeader currentUser={currentUser} />
      <main className="app-content">{/** something is missing here... */}</main>
      <BottomNav />                                        // ← geen <Outlet/>
    </div>
  );
}
```

Twee problemen: (a) `currentUser` is `undefined`, (b) er staat geen `<Outlet />`
dus geen enkel kind-scherm wordt getekend.

🟢 **Oplossing:**

```jsx
import { Outlet, useLoaderData } from "react-router";
import { AppHeader } from "../components/AppHeader.jsx";
import { BottomNav } from "../components/BottomNav.jsx";
import { getCurrentUserId } from "../services/auth.js";
import { getUser } from "../services/users.js";

export async function clientLoader() {
  const currentUser = await getUser(await getCurrentUserId());
  return { currentUser };
}

export default function AppLayout() {
  const { currentUser } = useLoaderData();

  return (
    <div className="app">
      <AppHeader currentUser={currentUser} />
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
```

💡 **Uitleg regel per regel:**

- `getCurrentUserId()` is de nep-login uit `services/auth.js`; hij geeft altijd `"1"`.
- `await getUser(await getCurrentUserId())` — dubbele `await`. De binnenste levert
  het id, de buitenste het volledige user-object. Dit is exact de "code hint" uit
  de README.
- `return { currentUser }` — de loader geeft altijd een **object** terug, zodat je
  in de component kunt destructureren.
- `<Outlet />` is de "gaatje-in-de-layout" waar het actieve kind-scherm in getekend
  wordt. Zonder `<Outlet />` is je app een header + navbar met niets ertussen.

⚠️ **Val:** een layout-loader draait bij **élke** navigatie binnen de layout. Zet er
dus niets zwaars in. Hier is één `getUser`-call prima.

---

### STAP 2 — `app/components/AppHeader.jsx` + `BottomNav.jsx` (navigatie)

🔴 **Beginstaat (AppHeader):**

```jsx
<a href="/" className="app-header__title">Couch Potato</a>
<a href={`/users/${currentUser?.id}`} …>
```

🔴 **Beginstaat (BottomNav):**

```jsx
<a href="/" end className="bottom-nav__item" data-testid="nav-feed">
```

Let op dat rare `end`-attribuut op een `<a>`. Dat is een verklikker: `end` bestaat
alleen op `NavLink`. De opdracht laat je hier zien wat het had moeten zijn.

🟢 **Oplossing:** `<a href>` → `<Link to>` in de header, `<a href>` → `<NavLink to>`
in de bottom nav.

```jsx
// AppHeader.jsx
import { Link } from "react-router";
<Link to="/" className="app-header__title">Couch Potato</Link>
<Link to={`/users/${currentUser?.id}`} className="app-header__me" data-testid="nav-profile">…</Link>

// BottomNav.jsx
import { NavLink } from "react-router";
<NavLink to="/" end className="bottom-nav__item" data-testid="nav-feed">…</NavLink>
<NavLink to="/track" className="bottom-nav__item bottom-nav__item--track" data-testid="nav-track">…</NavLink>
<NavLink to="/friends" className="bottom-nav__item" data-testid="nav-friends">…</NavLink>
```

💡 **`Link` vs `NavLink`:** `NavLink` is een `Link` die extra weet of hij "actief" is.
Hij zet automatisch de class `active` op het `<a>` dat hij rendert, zodat CSS de
huidige tab kan highlighten. Voor een navbar wil je `NavLink`, elders volstaat `Link`.

💡 **Wat doet `end`?** Zonder `end` is `<NavLink to="/">` óók actief op `/track` en
`/friends` (want elk pad begint met `/`). Met `end` moet het pad **exact** `/` zijn.
Vandaar dat alleen de Feed-tab `end` heeft.

💡 **Waarom faalt `<a href>`?** Een `<a>` doet een volledige browser-navigatie: de
hele JS-app wordt opnieuw ingeladen, state gaat verloren, en de test
`page.on("load", () => { throw … })` slaat alarm. `Link` onderschept de klik en
laat React Router alleen het nodige stukje opnieuw renderen.

⚠️ Beide componenten renderen nog steeds een `<a>` in de HTML — dat moet ook, want
de test telt `bottom-nav.locator("a")` en verwacht er 3. `NavLink` rendert intern
gewoon een `<a>`, dus dat komt goed.

---

### STAP 3 — `app/routes/feed.jsx` + `components/FeedItem.jsx` (eerste echte scherm)

🔴 **Beginstaat:**

```jsx
export default function Feed() {
  const { feedSessions } = {};        // ← TypeError: kan .length niet lezen
  if (feedSessions.length === 0) { … }
```

🟢 **Oplossing:**

```jsx
import { useLoaderData } from "react-router";
import { getCurrentUserId } from "../services/auth.js";
import { getFollows } from "../services/follows.js";
import { getFeedSessions } from "../services/sessions.js";

export async function clientLoader() {
  const currentUserId = await getCurrentUserId();
  const follows = await getFollows(currentUserId);
  const feedSessions = await getFeedSessions([
    currentUserId,
    ...follows.map((f) => f.followingId),
  ]);

  return { feedSessions };
}

export default function Feed() {
  const { feedSessions } = useLoaderData();
  …
}
```

💡 **Waarom deze drie calls in deze volgorde?**

1. `getCurrentUserId()` → wie ben ik? (`"1"`)
2. `getFollows("1")` → wie volg ik? → `[{id:"1", followerId:"1", followingId:"2"}, …]`
3. `getFeedSessions([...])` → geef mij de sessies van deze lijst gebruikers.

Ze zijn **sequentieel** (elke stap heeft het resultaat van de vorige nodig), dus
hier kun je géén `Promise.all` gebruiken. Op de Friends-pagina wel — zie stap 6.

💡 **De spread-truc:**

```js
[currentUserId, ...follows.map((f) => f.followingId)]
// → ["1", "2", "3"]     mijn eigen id + de id's van wie ik volg
```

Vergeet je `currentUserId` toe te voegen, dan zie je je eigen sessies niet →
test *"feed shows own sessions"* faalt.

💡 **Waarom `getFeedSessions` en niet `getSessions`?** Kijk naar de service:

```js
`${BASE_URL}/sessions?_where=…&_embed=user&_embed=category&_sort=-date`
```

`_embed=user` plakt het volledige user-object ín elke sessie, `_embed=category`
idem voor de categorie, en `_sort=-date` sorteert nieuw→oud. `FeedItem` doet
`const { user, category } = session;` — die velden bestáán alleen door die embeds.
Sorteren en filteren gebeurt dus op de **server**, niet in je component. 🎯

🔴🟢 **FeedItem.jsx:** enkel het buitenste `<a href>` → `<Link to>`:

```jsx
import { Link } from "react-router";
<Link to={`/sessions/${session.id}`} className="feed-item" data-testid={`feed-item-${session.id}`}>
```

De rest van het component (avatar, badge, `formatDuration`, notes) was al correct.

---

### STAP 4 — `app/routes/sessionDetail.jsx` (params + navigate(-1))

🔴 **Beginstaat:**

```jsx
const { session, currentUserId } = {};
…
<button type="button" className="btn btn--ghost"
  /* onClick={() => navigate to previous route} */ >Back</button>
```

🟢 **Oplossing:**

```jsx
import { Link, useLoaderData, useNavigate } from "react-router";
import { getSessionWithRelations } from "../services/sessions.js";
import { getCurrentUserId } from "../services/auth.js";

export async function clientLoader({ params }) {
  const session = await getSessionWithRelations(params.sessionId);
  const currentUserId = await getCurrentUserId();

  return { session, currentUserId };
}

export default function SessionDetail() {
  const { session, currentUserId } = useLoaderData();
  const navigate = useNavigate();

  const { user, category } = session;
  const isOwn = session.userId === currentUserId;
  …
  <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
    Back
  </button>
```

💡 **`params.sessionId`** komt letterlijk uit `route("sessions/:sessionId", …)`.
Zou de routetabel `:id` zeggen, dan was het `params.id`. Kijk het altijd na.

💡 **`getSessionWithRelations`** (met `_embed=user&_embed=category`) i.p.v. `getSession`,
want dit scherm toont de categorienaam én de naam van de eigenaar. Gebruik je de
"kale" `getSession`, dan crasht `const { user, category } = session;` op `undefined`.

💡 **`navigate(-1)`** = de terugknop van de browser, maar dan vanuit code. Dat is
precies wat de test verwacht: van feed → detail → Back → terug op de feed, zonder
page reload. `navigate("/")` zou óók op `/` uitkomen maar is fout: dan werkt "Back"
niet meer wanneer je vanaf een profiel binnenkomt.

💡 **`isOwn`** bepaalt of de Edit-knop verschijnt. `session.userId === currentUserId`
— beide strings, dus `===` is veilig. De test opent `/sessions/4` (van user 2) en
verwacht dat er dan géén Edit-link is.

---

### STAP 5 — `app/routes/track.jsx` (eerste action)

🔴 **Beginstaat:** `const { categories } = {};`, `<form method="post">`, Cancel-knop
zonder onClick.

🟢 **Oplossing (de drie exports):**

```jsx
import { Form, redirect, useLoaderData, useNavigate } from "react-router";
import { getCategories } from "../services/categories.js";
import { getCurrentUserId } from "../services/auth.js";
import { createSession } from "../services/sessions.js";

export async function clientLoader() {
  const categories = await getCategories();
  return { categories };
}

export async function clientAction({ request }) {
  const formData = await request.formData();
  const currentUserId = await getCurrentUserId();

  await createSession({
    userId: currentUserId,                        // ← komt NIET uit het formulier
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    duration: Number(formData.get("duration")),   // ← string → number
    notes: formData.get("notes"),
  });

  return redirect("/");
}

export default function Track() {
  const { categories } = useLoaderData();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  …
  <Form method="post" className="session-form">   // ← hoofdletter F
    …
    <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
      Cancel
    </button>
  </Form>
```

💡 **De koppeling formulier ↔ action gebeurt via `name=`.** Elk `<input name="x">`
wordt `formData.get("x")`. Ze moeten letterlijk overeenkomen:

| JSX | action |
|---|---|
| `<select name="categoryId">` | `formData.get("categoryId")` |
| `<input name="date">` | `formData.get("date")` |
| `<input name="duration">` | `formData.get("duration")` |
| `<textarea name="notes">` | `formData.get("notes")` |

💡 **`userId` zit bewust niet in het formulier.** Je haalt hem in de action op via
`getCurrentUserId()`. De README zegt dit expliciet. Logisch ook: je wilt niet dat
een gebruiker via de HTML een sessie op andermans naam kan zetten.

💡 **`Number(formData.get("duration"))`.** In de database is `duration` een getal
(`180`). `formData.get` geeft `"180"`. Zonder conversie sla je een string op. Dit
breekt niet direct een test, maar wél `formatDuration()`: `"180" % 60` werkt nog
door type-coercion, maar `Math.floor("180"/60)` ook — het is *fragiel*. Doe het netjes.
(`parseInt(x, 10)` mag ook.)

💡 **`return redirect("/")`.** Na het opslaan wil je naar de feed. `redirect` is een
speciaal Response-object dat React Router herkent. Vergeet je `return`, dan gebeurt
er niets en blijf je op `/track` staan.

💡 **`today`:** `new Date().toISOString().slice(0, 10)` → `"2026-08-17"`. Dat is exact
het formaat dat `<input type="date">` verwacht. De test vergelijkt met precies
dezelfde uitdrukking, dus dit móét zo.

⚠️ **Val:** het label van de submit-knop. De test zoekt `{ name: /log it/i }`. De
knop heet "Log it" — laat dat staan.

---

### STAP 6 — `app/routes/editSession.jsx` + `components/SessionForm.jsx`

Dit scherm heeft één extra dimensie: **beveiliging**. Alleen de eigenaar mag editen.

🔴 **Beginstaat:** `const { session } = {};` en verder niets.

🟢 **Oplossing:**

```jsx
import { redirect, useLoaderData } from "react-router";
import { SessionForm } from "../components/SessionForm.jsx";
import { getSession, updateSession } from "../services/sessions.js";
import { getCurrentUserId } from "../services/auth.js";

export async function clientLoader({ params }) {
  const session = await getSession(params.sessionId);
  const currentUserId = await getCurrentUserId();

  if (session.userId !== currentUserId) {
    return redirect("/");          // ← niet van jou → wegwezen
  }

  return { session };
}

export async function clientAction({ request, params }) {
  const formData = await request.formData();
  const currentUserId = await getCurrentUserId();

  await updateSession({
    id: params.sessionId,          // ← id uit de URL, niet uit het formulier
    date: formData.get("date"),
    duration: Number(formData.get("duration")),
    notes: formData.get("notes"),
  });

  return redirect(`/users/${currentUserId}`);
}

export default function EditSession() {
  const { session } = useLoaderData();
  return (
    <div className="form-page">
      <h2 className="form-page__title">Edit Session</h2>
      <SessionForm session={session} submitLabel="Save" />
    </div>
  );
}
```

💡 **`redirect()` mag ook uit een loader.** Dat is dé manier om "route guards" te
schrijven: haal op wat je nodig hebt, controleer, en stuur weg vóór er iets
gerenderd wordt. Test: `/sessions/4/edit` (sessie van user 2) → belandt op `/`.

💡 **`getSession` (kaal) volstaat hier**, want het formulier toont enkel date,
duration en notes — geen user of categorie. Minder ophalen = sneller.

💡 **`params.sessionId` in de action.** Het id staat niet in het formulier (er is
geen `<input name="id">`), dus haal je het uit de URL. `clientAction` krijgt
`params` net zo goed als `clientLoader`.

💡 **Redirect naar je eigen profiel** (`/users/${currentUserId}`), niet naar de feed —
de README schrijft dat voor en de test controleert het (`toHaveURL(/\/users\/1$/)`).

**SessionForm.jsx:**

```jsx
import { Form, useNavigate } from "react-router";

export function SessionForm({ session, submitLabel = "Save" }) {
  const navigate = useNavigate();
  return (
    <Form method="post" className="session-form">
      …
      <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
        Cancel
      </button>
    </Form>
  );
}
```

💡 Twee wijzigingen: `<form>` → `<Form>` en de Cancel-knop krijgt `navigate(-1)`.
De velden gebruikten al `defaultValue={session?.date ?? ""}` — dat is precies wat
"pre-filled" betekent. `defaultValue` (niet `value`) omdat het een *uncontrolled*
formulier is: de browser beheert de waarde, jij leest hem pas bij submit uit de
FormData. Zou je `value` gebruiken zonder `onChange`, dan kun je niets meer typen.

💡 **Er staat bewust géén categorie-veld in dit formulier.** De test controleert
dat expliciet (`select[name='categoryId']` mag niet bestaan). Categorie ligt vast
bij het aanmaken.

---

### STAP 7 — `app/routes/friends.jsx` + `components/UserCard.jsx`

Het meest complexe scherm: loader **én** action **én** lokale UI-state.

🔴 **Beginstaat:**

```jsx
const { users, follows, currentUserId } = {};

/* query and setQuery should be declared in another way...  */
const query = "";
const setQuery = undefined;      // ← onChange crasht hierop
```

🟢 **Oplossing:**

```jsx
import { useState } from "react";
import { useLoaderData } from "react-router";
import { getCurrentUserId } from "../services/auth.js";
import { getUsers } from "../services/users.js";
import { createFollow, deleteFollow, getFollows } from "../services/follows.js";

export async function clientLoader() {
  const currentUserId = await getCurrentUserId();
  const [users, follows] = await Promise.all([
    getUsers(),
    getFollows(currentUserId),
  ]);

  return { users, follows, currentUserId };
}

export async function clientAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "follow") {
    await createFollow({
      followerId: await getCurrentUserId(),
      followingId: formData.get("followingId"),
    });
  } else if (intent === "unfollow") {
    await deleteFollow(formData.get("followId"));
  }

  return null;
}

export default function Friends() {
  const { users, follows, currentUserId } = useLoaderData();
  const [query, setQuery] = useState("");
  …
}
```

💡 **`Promise.all` mag hier wél**, want `getUsers()` en `getFollows()` hebben elkaar
niet nodig. Ze draaien parallel → sneller. Vergelijk met de feed-loader, waar elke
stap op de vorige wacht.

💡 **Het "intent"-patroon.** Eén action, twee betekenissen. In het formulier zit
een verborgen veld:

```jsx
<input type="hidden" name="intent" value="follow" />    // of "unfollow"
```

De action leest dat veld en kiest de juiste service. Dit is een standaardpatroon
in React Router — onthoud het, het komt vaak terug (bv. één action voor
"opslaan"/"verwijderen" op dezelfde pagina).

💡 **`return null`.** Een action *moet* iets teruggeven. Wil je geen redirect en
geen data, dan `return null`. Daarna verversen alle loaders automatisch, dus de
lijst klopt weer.

💡 **`useState` voor de zoekterm.** Waarom niet in de loader? Omdat de zoekterm
**geen serverdata** is. Hij verandert bij elke toetsaanslag; je wilt daarvoor geen
netwerkcall. Vuistregel:

> Komt het van de server? → loader. Bestaat het alleen in de browser? → `useState`.

💡 **De filterlogica** (was al gegeven, maar snap ze):

```js
const otherUsers  = users.filter((u) => u.id !== currentUserId);   // jezelf eruit
const followingIds = new Set(follows.map((f) => f.followingId));   // Set = snel opzoeken

const filtered = query.trim()
  ? otherUsers.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))  // zoeken: iedereen
  : otherUsers.filter((u) => followingIds.has(u.id));                             // default: enkel gevolgden
```

Twee gedragingen in één expressie: leeg zoekveld → alleen wie je volgt; iets
getypt → alle gebruikers die matchen (ook niet-gevolgden). Precies wat de README
en twee tests vragen.

**UserCard.jsx:** één wijziging — de naam moet een `Link` worden:

```jsx
import { Link, useFetcher } from "react-router";
<Link to={`/users/${user.id}`} className="user-card__name">{user.name}</Link>
```

De hele `fetcher.Form` met de optimistische knop was al gegeven. Die werkt nu
omdat de `clientAction` op `/friends` eindelijk bestaat.

---

### STAP 8 — `app/routes/userProfile.jsx` (één scherm, twee gezichten)

🔴 **Beginstaat:** `const { user, currentUserId, isOwnProfile, isFollowing, followId, sessions } = {};`

🟢 **Oplossing:**

```jsx
import { useFetcher, useLoaderData } from "react-router";
import { getCurrentUserId } from "../services/auth.js";
import { getUser } from "../services/users.js";
import { getFollow } from "../services/follows.js";
import { getSessionsByUser } from "../services/sessions.js";

export async function clientLoader({ params }) {
  const currentUserId = await getCurrentUserId();
  const userId = params.userId ?? currentUserId;
  const isOwnProfile = userId === currentUserId;

  const [user, follow, sessions] = await Promise.all([
    getUser(userId),
    isOwnProfile ? Promise.resolve(null) : getFollow(currentUserId, userId),
    getSessionsByUser(userId),
  ]);

  return {
    user,
    currentUserId,
    isOwnProfile,
    isFollowing: Boolean(follow),
    followId: follow?.id ?? null,
    sessions,
  };
}

export default function UserProfile() {
  const { user, currentUserId, isOwnProfile, isFollowing, followId, sessions } =
    useLoaderData();
  …
}
```

💡 **`params.userId ?? currentUserId`.** De `??` (nullish coalescing) vangt het geval
op waarin de route zónder id wordt gebruikt (bv. een toekomstige `/profile`-route).
Op `/users/2` is `params.userId` gewoon `"2"`.

💡 **`isOwnProfile ? Promise.resolve(null) : getFollow(...)`.** Slim: op je eigen
profiel heeft "volg ik mezelf?" geen betekenis, dus je slaat die netwerkcall over.
`Promise.all` wil wél een promise op die plek, dus geef je `Promise.resolve(null)`.

💡 **`isFollowing: Boolean(follow)` en `followId: follow?.id ?? null`.** De component
wil geen follow-object, maar een boolean (welke knop?) en een id (wat moet ik
verwijderen bij unfollow?). Vorm je data in de loader zó dat de component dom kan
blijven. Dat is een echt goede gewoonte.

💡 **`getSessionsByUser`** heeft `_sort=-date` in de query → nieuw eerst. De test
controleert dat May 7 boven May 5 staat. Nogmaals: sorteren doet de server.

💡 **Hoe past dit scherm zich aan?** Drie ternaries, alle drie al gegeven:

| Wat | Code | Eigen profiel | Ander profiel |
|---|---|---|---|
| Follow-knop | `{!isOwnProfile && <fetcher.Form>…}` | verborgen | zichtbaar |
| Sectietitel | `{isOwnProfile ? "Your Sessions" : "Recent Sessions"}` | "Your Sessions" | "Recent Sessions" |
| test-id | `isOwnProfile ? "my-sessions" : "user-sessions"` | `my-sessions` | `user-sessions` |

En in `SessionAccordion` bepaalt `session.userId === currentUserId` of de
Edit-link verschijnt.

---

### STAP 9 — `app/components/SessionAccordion.jsx` (de laatste `<a>`)

🔴 **Beginstaat:** de accordion-logica (`useState` voor `expandedId`) was al correct,
maar de Edit-knop was een gewone `<a href>`.

🟢 **Oplossing:**

```jsx
import { Link } from "react-router";
…
<Link to={`/sessions/${session.id}/edit`} className="btn btn--ghost">
  Edit
</Link>
```

💡 Deze ene wijziging maakt de test *"edit session — cancel returns to previous page"*
groen: die klikt op Edit en daarna op Cancel, met een `page.on("load")`-alarm actief.
Met een `<a href>` herlaadt de pagina, wordt de history gewist, en werkt
`navigate(-1)` niet meer zoals verwacht.

💡 **De accordion zelf** (`const [expandedId, setExpandedId] = useState(null)` +
`setExpandedId(isOpen ? null : session.id)`) is puur UI-state — precies zoals
gouden regel 10 zegt. Eén `expandedId` in plaats van een boolean per item zorgt
ervoor dat er maar één paneel tegelijk open kan staan.

---

### STAP 10 — Testen

```bash
# terminal 1 — backend (voor handmatig testen in de browser)
cd server && npm install && npm start        # json-server op :3000

# terminal 2 — frontend
cd client && npm install
cp .env.example .env                          # en zet: VITE_API_BASE_URL=http://localhost:3000
npm run dev                                   # app op :5173

# tests (starten zelf een dev-server op :5174, backend is gemockt)
npm run test:chrome     # enkel chromium — snelst
npm run test:all        # chromium + firefox + webkit
npm run test:ui         # visuele test-runner, ideaal om te debuggen
```

**Resultaat van deze oplossing:**

```
  48 passed (51.8s)
```

En `npx eslint app` geeft nul waarschuwingen.

> ℹ️ In deze sessie draaide ik de tests in een Linux-container met een aparte
> Playwright-config (`playwright.local.config.js`), omdat daar een andere
> Chromium-build stond. Dat bestand is **niet** naar jouw `development/`-map
> gekopieerd — jij gebruikt gewoon `npm run test:chrome`.

---

## 5. Alle 48 tests ontcijferd

Gebruik deze tabel als checklist. Kolom "sleutel" = wat de test in feite controleert.

### `00-general.spec.js` (2 tests)

| Test | Sleutel |
|---|---|
| page has title Couch Potato | AppHeader rendert + `<Outlet/>` staat er |
| bottom nav has 3 tabs | `BottomNav` rendert 3 `<a>` (NavLink telt mee) |

### `01-feed.spec.js` (9 tests)

| Test | Sleutel |
|---|---|
| feed shows sessions from followed users | `getFollows` + spread in `getFeedSessions` |
| feed shows own sessions | `currentUserId` staat **vooraan** in de array |
| does not show non-followed | filteren gebeurt server-side via `_where` |
| feed items show category badge | `_embed=category` (zit in `getFeedSessions`) |
| most recent session first | `_sort=-date` (zit in de service) |
| clicking a feed item navigates without reload | `FeedItem` gebruikt `<Link>` |
| formatted duration | `formatDuration(180)` → `"3h"` |
| shows notes when present | `{session.notes && …}` |
| empty state when no sessions | `feedSessions.length === 0` → `<EmptyState testId="empty-feed">` |

### `02-sessions.spec.js` (13 tests)

| Test | Sleutel |
|---|---|
| profile page shows session list | `userProfile` loader + `SessionAccordion` |
| clicking a session expands | `useState` accordion (was gegeven) |
| detail shows duration + notes | `formatDuration` in accordion |
| track form submits and redirects | `clientAction` + `redirect("/")` + `<Form>` |
| cancel track returns to previous page | `navigate(-1)` **en** `nav-track` is een `NavLink` |
| edit save redirects to profile | `redirect(`/users/${currentUserId}`)` |
| edit cancel returns to previous page | `Link` op Edit in accordion + `navigate(-1)` |
| own session shows Edit link | `session.userId === currentUserId` |
| other user's session hides Edit | idem, negatief |
| category dropdown populated | `getCategories()` in loader → 3 options |
| date defaults to today | `new Date().toISOString().slice(0,10)` |
| edit form pre-filled | `defaultValue={session?.…}` + loader levert session |
| edit form has no category field | niets toevoegen aan `SessionForm` |

### `03-friends.spec.js` (16 tests)

| Test | Sleutel |
|---|---|
| only followed users by default | `followingIds.has(u.id)` bij lege query |
| search shows all matching | `query.trim()` → filter op naam |
| click friend → profile, no reload | `Link` in `UserCard` |
| profile shows name | `getUser(userId)` |
| Following button when following | `getFollow` → `isFollowing: true` |
| Follow button when not following | `getFollow` → `null` |
| follow action works | `clientAction` intent `"follow"` → `createFollow` |
| unfollow action works | intent `"unfollow"` → `deleteFollow(followId)` |
| other profile: no Edit on sessions | `currentUserId` doorgeven aan accordion |
| direct nav to other's edit redirects | guard in `editSession` `clientLoader` |
| own profile: no follow button | `{!isOwnProfile && …}` |
| own title "Your Sessions" | ternary op `isOwnProfile` |
| other title "Recent Sessions" | idem |
| sessions sorted newest first | `_sort=-date` in `getSessionsByUser` |
| empty state when no sessions | `sessions.length === 0` → `empty-user-sessions` |
| follow flips optimistically | `fetcher.state`/`fetcher.formData` (was gegeven) |

### `04-session-detail.spec.js` (8 tests)

| Test | Sleutel |
|---|---|
| shows category name | `getSessionWithRelations` (`_embed=category`) |
| shows formatted date | `formatDate` → "Thursday, May 7, 2026" |
| shows duration + raw minutes | `{formatDuration(d)} ({d} minutes)` |
| shows notes | `{session.notes && …}` |
| links to owner profile | `<Link to={`/users/${user.id}`}>` (`_embed=user`) |
| Edit visible for own session | `isOwn` |
| Edit hidden for other's session | `isOwn` |
| Back returns without reload | `navigate(-1)` |

---

## 6. Foutmeldingen-decoder

| Wat je ziet | Wat er aan de hand is | Fix |
|---|---|---|
| `Cannot destructure property 'x' of '{}'` / `Cannot read properties of undefined` | Je component leest data die de loader niet (of niet zo) teruggeeft | Loader schrijven, of `useLoaderData()` toevoegen |
| Test: `Full page reload detected` | Ergens staat nog een `<a href>` of `<form>` | Zoek op `<a href` en `<form ` en vervang door `Link`/`Form` |
| Pagina blijft leeg, geen fout | `<Outlet />` ontbreekt in de layout | `<Outlet />` in `<main>` |
| Formulier submit maar er gebeurt niets | `<form>` i.p.v. `<Form>`, of `action` i.p.v. `clientAction` | hoofdletter F + `client`-prefix |
| Action draait, maar de lijst ververst niet | Je hebt `return` vergeten in de action | altijd `return null` of `return redirect(...)` |
| `params.id is undefined` | Naam komt niet overeen met `routes.js` | `params.sessionId` / `params.userId` |
| Lijst is leeg terwijl er data is | String-vs-number vergelijking | id's zijn strings: `"1" === "1"` |
| `fetch failed` / CORS | backend draait niet of `.env` ontbreekt | `cd server && npm start` + `.env` met `VITE_API_BASE_URL=http://localhost:3000` |
| `redirect is not a function` | verkeerde import | `import { redirect } from "react-router"` |
| Je kunt niet typen in een input | `value=` zonder `onChange` | `defaultValue=` gebruiken (uncontrolled) |
| Feed toont eigen sessies niet | `currentUserId` niet in de array bij `getFeedSessions` | `[currentUserId, ...follows.map(...)]` |
| Tests hangen op poort 5174 | oude dev-server draait nog | proces killen of `reuseExistingServer` |

---

## 7. Examenstrategie (volgorde & timing)

### 7.1 De volgorde die ik gebruikt heb (en waarom)

```
1. AppLayout          ← zonder Outlet werkt niets. ALTIJD eerst.
2. AppHeader/BottomNav ← navigatie werkend maken, anders kun je niet klikken om te testen
3. Feed (/)           ← het scherm dat je het vaakst ziet
4. SessionDetail      ← leert je params + navigate(-1)
5. Track              ← je eerste action
6. EditSession        ← action + guard (bouwt voort op 5)
7. Friends            ← loader + action + useState (moeilijkste)
8. UserProfile        ← hergebruikt alles
9. Losse <a>'s opruimen (SessionAccordion, UserCard, FeedItem)
10. Tests draaien, lint draaien
```

Regel: **van buiten naar binnen, van simpel naar complex.** De layout is de romp;
zonder romp kun je geen ledematen testen.

### 7.2 Tijdsindicatie (bij ±3 uur examentijd)

| Fase | Tijd |
|---|---|
| README lezen + filmpje bekijken | 10 min |
| Zoeken naar `= {}`, `<a href`, `<form `, `/* onClick` | 5 min |
| Stap 1–3 (layout, nav, feed) | 30 min |
| Stap 4–6 (detail, track, edit) | 45 min |
| Stap 7–8 (friends, profile) | 45 min |
| Tests draaien + fixen | 30 min |
| Opruimen + inleveren | 15 min |

### 7.3 Als je vastloopt

1. **Lees de test.** De tests zijn de meest exacte specificatie die er is. Zoek de
   falende test op en lees letterlijk wat hij verwacht.
2. **`console.log` in je loader.** Zie je de data binnenkomen? Zo niet: netwerktab.
3. **Netwerktab in de browser.** Wordt de fetch gedaan? Wat is de URL? Wat komt terug?
4. **Vergelijk met een scherm dat wél werkt.** Alle zes de schermen volgen exact
   hetzelfde patroon.
5. **`npm run test:ui`** — daar kun je per test stap voor stap terugspoelen en de
   DOM inspecteren op elk moment.

### 7.4 Wat je NIET moet doen

- ❌ De tests aanpassen. (Uitdrukkelijk verboden.)
- ❌ De `services/` aanpassen. Ze zijn compleet; als je denkt dat er iets ontbreekt,
  lees dan de JSDoc-comments opnieuw.
- ❌ `useEffect` + `useState` gebruiken om data op te halen. Dat is het oude patroon;
  hier is het gewoon fout.
- ❌ Data filteren/sorteren in je component als de service het al kan
  (`_where`, `_sort`, `_embed`).
- ❌ De CSS aanpassen om iets "mooier" te maken. Geen punten, wel risico.

---

## 8. Indien-checklist

Uit de README:

- [ ] Enkel de **client**-map indienen (server niet).
- [ ] `node_modules` verwijderen.
- [ ] Map hernoemen naar `2DEV-VOORNAAM-ACHTERNAAM`.
- [ ] Zippen en uploaden naar Leho.

Extra, vóór je zipt:

- [ ] `npm run test:chrome` → alles groen.
- [ ] `npx eslint app` → geen fouten.
- [ ] Geen `console.log`-restanten in je code.
- [ ] `.env` bestaat lokaal (mag mee, bevat geen geheimen) — `.env.example` sowieso.
- [ ] Handmatig doorklikken met de echte backend: feed → detail → edit → save →
      profiel → friends → follow/unfollow. Zie je nergens een volledige page reload
      (het browser-tabje mag niet "laden")?

---

## 9. Oefenopdrachten voor jezelf

Wil je dit écht in de vingers krijgen, doe dan het volgende:

### Ronde 1 — blind natypen (30 min)

Kopieer `start/` naar een nieuwe map `oefening-1/` en los de opdracht op **zonder**
in deze log te kijken. Draai daarna de tests. Elke falende test = een stukje dat je
nog niet automatisch kunt.

### Ronde 2 — de checkpoints (per scherm)

Los per scherm op en draai enkel dat testbestand:

```bash
npx playwright test tests/01-feed.spec.js --project=chromium
```

### Ronde 3 — variaties (voor als de examenvraag nét anders is)

Probeer deze uitbreidingen zelf; ze gebruiken exact dezelfde bouwstenen:

1. **Verwijderknop op je eigen sessie.** Nieuwe intent `"delete"` in een action +
   een `deleteSession`-service. → oefent het intent-patroon.
2. **Filter de feed op categorie** via een querystring (`/?category=2`).
   Tip: `clientLoader({ request })` → `new URL(request.url).searchParams`.
   → oefent zoekparameters in loaders.
3. **Toon "X volgers" op een profiel.** Een extra call in de profile-loader.
   → oefent `Promise.all` uitbreiden.
4. **Maak de Track-categorie voorselecteerbaar** via `/track?category=3`.
   → oefent `defaultValue` op een `<select>`.
5. **Voeg een `HydrateFallback` per route toe** en kijk wat er verandert bij
   traag netwerk (Network throttling in DevTools). → oefent loading states.

### Ronde 4 — leg het uit

De beste test of je het snapt: leg aan iemand anders (of aan jezelf, hardop) uit
wat er gebeurt tussen het klikken op "Follow" en het moment dat de knop
"Following" toont. Als je daarbij de woorden *fetcher*, *action*, *intent*,
*revalidatie* en *optimistic UI* in de juiste volgorde gebruikt, zit het goed.

---

## 📎 Bijlage A — de 13 gewijzigde bestanden

| # | Bestand | Wat er veranderde |
|---|---|---|
| 1 | `app/layouts/AppLayout.jsx` | `clientLoader` (currentUser) + `<Outlet />` |
| 2 | `app/components/AppHeader.jsx` | `<a>` → `<Link>` (2×) |
| 3 | `app/components/BottomNav.jsx` | `<a>` → `<NavLink>` (3×) |
| 4 | `app/routes/feed.jsx` | `clientLoader` (follows + feedSessions) + `useLoaderData` |
| 5 | `app/components/FeedItem.jsx` | `<a>` → `<Link>` |
| 6 | `app/routes/sessionDetail.jsx` | `clientLoader` (params) + `navigate(-1)` op Back |
| 7 | `app/routes/track.jsx` | `clientLoader` + `clientAction` + `<Form>` + `navigate(-1)` |
| 8 | `app/routes/editSession.jsx` | `clientLoader` met guard + `clientAction` + redirect |
| 9 | `app/components/SessionForm.jsx` | `<form>` → `<Form>` + `navigate(-1)` op Cancel |
| 10 | `app/routes/friends.jsx` | `clientLoader` (Promise.all) + `clientAction` (intent) + `useState` |
| 11 | `app/components/UserCard.jsx` | `<a>` → `<Link>` |
| 12 | `app/routes/userProfile.jsx` | `clientLoader` (params + Promise.all + vormgeven) |
| 13 | `app/components/SessionAccordion.jsx` | `<a>` → `<Link>` op Edit |

**Niet aangeraakt:** `app/routes.js`, `app/root.jsx`, `app/app.css`,
`app/utils/index.js`, `app/services/*`, `app/components/EmptyState.jsx`,
`tests/*`, `server/*`.

---

## 📎 Bijlage B — importspiekbriefje

Alles komt uit `"react-router"` (geen `react-router-dom` meer in v7):

```jsx
import {
  Link,          // klikbare link
  NavLink,       // link die weet of hij actief is (+ `end`)
  Form,          // formulier dat de clientAction aanroept
  Outlet,        // gaatje in een layout
  redirect,      // return redirect("/") in loader/action
  useLoaderData, // data uit de clientLoader
  useNavigate,   // navigate(-1), navigate("/pad")
  useFetcher,    // formulier zonder navigatie (follow-knop)
  useParams,     // params in een component (in een loader krijg je ze als argument)
  useSearchParams, // ?query=... lezen/schrijven
} from "react-router";

import { useState } from "react";   // enkel voor UI-state
```

En de skeletten:

```jsx
export async function clientLoader({ params, request }) {
  const data = await getIets(params.someId);
  return { data };
}

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  await doeIets({ id: params.someId, veld: formData.get("veld") });
  return redirect("/ergens");   // of: return null;
}

export default function Scherm() {
  const { data } = useLoaderData();
  const navigate = useNavigate();
  return <div>…</div>;
}
```

---

*Coach-log opgesteld op 17 augustus 2026. Alle code in `development/client/app`
is geverifieerd met `playwright test` (48/48 groen) en `eslint` (0 problemen).*
