# 02 — React Router 7, framework mode

Alles wat je nodig hebt over routes, loaders, actions, navigatie en formulieren.
Alle imports komen uit `react-router`. In versie 7 bestaat `react-router-dom` niet meer.

---

## 1. De opzet van een project

```
client/
├── react-router.config.ts    ssr aan of uit
├── vite.config.ts            de reactRouter()-plugin
├── .env                      VITE_API_BASE_URL=http://localhost:3000
└── app/
    ├── root.jsx              het html-skelet + ErrorBoundary + HydrateFallback
    ├── routes.js             de routetabel
    ├── routes/               één bestand per scherm
    ├── layouts/              layouts met <Outlet />
    ├── components/           herbruikbare stukjes UI
    ├── services/             alle fetch-calls
    └── utils/                hulpfuncties
```

### `react-router.config.ts`

```ts
export default {
  ssr: false,   // SPA-mode: alles draait in de browser
};
```

**Dit ene regeltje bepaalt hoe je loaders heten.**

| | `ssr: true` | `ssr: false` |
|---|---|---|
| data ophalen | `loader` | `clientLoader` |
| data wegschrijven | `action` | `clientAction` |
| waar draait het | server | browser |

In beide oefeningen stond `ssr: false`. **Kijk dit altijd na als eerste.** Schrijf je
`loader` waar `clientLoader` hoort, dan gebeurt er niets en zie je een lege pagina.

### `root.jsx`

Het buitenste bestand. Bevat de `<html>`, `<head>` en `<body>`. Meestal hoef je hier
niets aan te doen. Vier exports die je kunt tegenkomen:

```jsx
export function Layout({ children }) { … }   // het html-skelet
export default function App() { return <Outlet />; }
export function ErrorBoundary({ error }) { … }   // toont fouten
export function HydrateFallback() { return <p>Loading...</p>; }  // tijdens eerste laden
```

`HydrateFallback` is verplicht in SPA-mode zodra er een loader draait bij het eerste
laden van de pagina. Hij staat er meestal al.

---

## 2. De routetabel

`app/routes.js` beschrijft welke URL bij welk bestand hoort.

```js
import { index, layout, route, prefix } from "@react-router/dev/routes";

export default [
  layout("layouts/AppLayout.jsx", [
    index("routes/feed.jsx"),                          // /
    route("track", "routes/track.jsx"),                // /track
    route("sessions/:sessionId", "routes/detail.jsx"), // /sessions/12
    route("users/:userId", "routes/profile.jsx"),      // /users/3
  ]),
];
```

| Functie | Betekenis |
|---|---|
| `route(pad, bestand)` | een gewone route |
| `index(bestand)` | de route op het pad van de ouder zelf (`/`) |
| `layout(bestand, [kinderen])` | een omhulling zonder eigen pad |
| `prefix("admin", [routes])` | zet `admin/` voor een groep routes |

### Parameters

Alles met een dubbele punt is een parameter:

```js
route("boxes/:id", "routes/detailBox.jsx")        // params.id
route("sessions/:sessionId", "routes/detail.jsx") // params.sessionId
```

**De naam in de routetabel is de naam die je in `params` terugkrijgt.** Typ je
`params.id` terwijl de route `:sessionId` heet, dan krijg je `undefined`.

Parameters zijn **altijd strings**, ook als het in de database een getal is.
`/boxes/7` geeft `params.id === "7"`.

### Layouts en `<Outlet />`

Een layout is een component die om alle kinderen heen zit:

```jsx
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="app">
      <AppHeader />
      <main>
        <Outlet />     {/* hier komt het actieve kind-scherm */}
      </main>
      <BottomNav />
    </div>
  );
}
```

Vergeet je `<Outlet />`, dan zie je alleen de header en de navbar en blijft de rest
leeg — zonder foutmelding. Dat is een klassieke tijdvreter.

Een layout mag zelf ook een loader hebben. Die draait bij élke navigatie binnen de
layout, dus zet er niets zwaars in.

---

## 3. Het routebestand: drie exports

```jsx
export async function clientLoader({ params, request }) { … }  // GET
export async function clientAction({ params, request }) { … }  // POST/PATCH/DELETE
export default function Scherm() { … }                          // de JSX
```

De volgorde waarin ze draaien:

```
URL verandert
   ↓
clientLoader draait  (die van de layout en die van het kind, parallel)
   ↓
component rendert met useLoaderData()
   ↓
gebruiker verstuurt een <Form method="post">
   ↓
clientAction draait
   ↓
alle loaders draaien opnieuw  ← revalidatie, gebeurt automatisch
   ↓
component rendert met verse data
```

**Die laatste stap is de reden dat loaders en actions bestaan.** Je hoeft na een
POST niets zelf te verversen. Geen `useEffect`, geen handmatige refetch.

---

## 4. De loader

### Basisvorm

```jsx
export async function clientLoader() {
  const boxes = await getAllBoxes();
  return { boxes };
}
```

Geef altijd een **object** terug, dan kun je in de component destructureren.

### Met parameters

```jsx
export async function clientLoader({ params }) {
  const box = await getBoxById(params.id);
  return { box };
}
```

### Sequentieel versus parallel

Sequentieel als de tweede call het resultaat van de eerste nodig heeft:

```jsx
const currentUserId = await getCurrentUserId();
const follows = await getFollows(currentUserId);
const sessions = await getFeedSessions([currentUserId, ...follows.map(f => f.followingId)]);
```

Parallel als ze onafhankelijk zijn — dat is sneller:

```jsx
const [users, follows] = await Promise.all([
  getUsers(),
  getFollows(currentUserId),
]);
```

Een call overslaan binnen een `Promise.all` doe je met `Promise.resolve(null)`:

```jsx
const [user, follow, sessions] = await Promise.all([
  getUser(userId),
  isOwnProfile ? Promise.resolve(null) : getFollow(currentUserId, userId),
  getSessionsByUser(userId),
]);
```

### Data alvast vormgeven

Een loader mag meer doen dan ophalen. Geef terug wat de component écht nodig heeft:

```jsx
return {
  user,
  isOwnProfile,
  isFollowing: Boolean(follow),     // component wil een ja/nee
  followId: follow?.id ?? null,     // en een id om te verwijderen
  sessions,
};
```

Zo blijft de component simpel en staat de logica op één plek.

### Query-parameters lezen

```jsx
export async function clientLoader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const boxes = await searchBoxes(q);
  return { boxes, q };
}
```

### Afschermen met redirect

Een loader mag `redirect()` teruggeven. Dat is de manier om een pagina te bewaken:

```jsx
export async function clientLoader({ params }) {
  const session = await getSession(params.sessionId);
  const currentUserId = await getCurrentUserId();

  if (session.userId !== currentUserId) {
    return redirect("/");        // niet van jou → wegwezen
  }

  return { session };
}
```

### Een fout gooien

```jsx
if (!box) {
  throw new Response("Not Found", { status: 404 });
}
```

Dat komt terecht bij de `ErrorBoundary` in `root.jsx`.

---

## 5. De action

### Basisvorm

```jsx
export async function clientAction({ request, params }) {
  const formData = await request.formData();

  await addBox({
    width: parseInt(formData.get("width"), 10),
    includeDragHandles: formData.get("includeDragHandles") === "on",
  });

  return redirect("/");
}
```

### Wat je moet onthouden over `formData`

| Regel | Gevolg |
|---|---|
| `await request.formData()` | zonder `await` krijg je een Promise, geen data |
| `formData.get(name)` gebruikt het `name`-attribuut | `<input name="width">` → `get("width")` |
| de waarde is **altijd een string** | `Number(...)` of `parseInt(..., 10)` voor getallen |
| een niet-aangevinkte checkbox stuurt **niets** | `get(...)` geeft `null` |
| een aangevinkte checkbox stuurt `"on"` | `get("x") === "on"` |
| een `disabled` veld wordt niet verstuurd | let op bij voorwaardelijk uitgeschakelde velden |
| meerdere waarden met dezelfde naam | `formData.getAll("tags")` |

### Wat een action teruggeeft

```jsx
return redirect("/boxes");        // navigeer ergens heen
return null;                      // blijf staan, loaders verversen wel
return { error: "Te breed" };     // lees uit met useActionData()
```

**Vergeet de `return` niet.** Zonder `return` doet je `redirect()` niets.

### Eén action, meerdere bewerkingen

Twee manieren, allebei in de oefeningen gebruikt.

**Manier 1 — een verborgen `intent`-veld.** Handig als de bewerkingen dicht bij
elkaar liggen.

```jsx
// in het formulier
<input type="hidden" name="intent" value="follow" />

// in de action
const intent = formData.get("intent");
if (intent === "follow") {
  await createFollow({ … });
} else if (intent === "unfollow") {
  await deleteFollow(formData.get("followId"));
}
return null;
```

**Manier 2 — `formAction` op de knop.** Handig als de bewerkingen bij verschillende
routes horen.

```jsx
<button type="submit">Save box</button>                          {/* → action van deze route */}
<button type="submit" formAction="/boxes/new">Save as new</button> {/* → action van /boxes/new */}
```

Het formulier staat op `/boxes/edit/1`, maar de tweede knop stuurt naar de action van
`/boxes/new`. Zo doen twee knoppen in hetzelfde formulier iets anders, zonder
if-constructies.

### Fouten opvangen

```jsx
export async function clientAction({ request }) {
  const formData = await request.formData();
  try {
    await addBox({ … });
    return redirect("/");
  } catch (error) {
    return { error: error.message };
  }
}

// in de component
const actionData = useActionData();
{actionData?.error && <p className="error">{actionData.error}</p>}
```

---

## 6. Data in je component

### `useLoaderData()`

```jsx
import { useLoaderData } from "react-router";

export default function Home() {
  const { boxes } = useLoaderData();
}
```

### De prop-variant

Werkt ook, kies er één en blijf consequent:

```jsx
export default function Home({ loaderData }) {
  const { boxes } = loaderData;
}
```

### `useActionData()`

Geeft terug wat de action returnde, of `undefined` als er nog niets verstuurd is.

### `useParams()`

Parameters in de component zelf (in een loader krijg je ze als argument):

```jsx
const { id } = useParams();
```

### `useNavigation()`

De status van een lopende navigatie. Voor "bezig met opslaan…"-knoppen:

```jsx
const navigation = useNavigation();
const isSubmitting = navigation.state === "submitting";

<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Bezig…" : "Opslaan"}
</button>
```

`navigation.state` is `"idle"`, `"loading"` of `"submitting"`.

### `useSearchParams()`

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get("q") ?? "";

<input value={q} onChange={(e) => setSearchParams({ q: e.target.value })} />
```

Gebruik dit als het filter in de URL moet staan (deelbaar, bewaard bij terugnavigeren).
Voor een filter dat puur op het scherm leeft, is `useState` eenvoudiger.

### `useRevalidator()`

Loaders handmatig opnieuw laten draaien. Zelden nodig, want een action doet dat al.

```jsx
const revalidator = useRevalidator();
revalidator.revalidate();
```

---

## 7. Navigatie

### `Link`

Vervangt `<a href>`. Zonder `Link` herlaadt de hele app.

```jsx
import { Link } from "react-router";

<Link to="/boxes/new">Nieuwe doos</Link>
<Link to={`/boxes/${box.id}`}>Bekijk</Link>
<Link to=".." relative="path">Omhoog</Link>
<Link to="/boxes" replace>Vervang de huidige stap in de geschiedenis</Link>
```

### `NavLink`

Een `Link` die weet of hij de actieve pagina is. Voor navigatiebalken.

```jsx
import { NavLink } from "react-router";

<NavLink to="/" end className="nav__item">Feed</NavLink>
```

- `end` betekent: alleen actief als het pad **exact** klopt. Zonder `end` is
  `to="/"` op elke pagina actief, want elk pad begint met `/`.
- Er komt automatisch een class `active` op wanneer hij actief is.
- Je kunt `className` ook als functie schrijven:

```jsx
<NavLink to="/friends" className={({ isActive }) => isActive ? "tab tab--on" : "tab"}>
  Friends
</NavLink>
```

`NavLink` rendert onder water gewoon een `<a>`.

### `useNavigate`

Navigeren vanuit code, bijvoorbeeld in een `onClick`.

```jsx
import { useNavigate } from "react-router";

const navigate = useNavigate();

navigate(-1);                 // één stap terug, zoals de browserknop
navigate("/boxes");           // naar een pad
navigate("/boxes", { replace: true });
```

Cancel- en Back-knoppen gebruiken bijna altijd `navigate(-1)`. Dat is beter dan
`navigate("/")`, want dan kom je terug waar je vandaan kwam, niet altijd op de home.

### `redirect`

Alleen in een loader of action, en altijd met `return`.

```jsx
import { redirect } from "react-router";
return redirect("/boxes");
```

### Overzicht

| Situatie | Gereedschap |
|---|---|
| link in JSX | `<Link to>` |
| link in een navigatiebalk | `<NavLink to>` |
| vanuit een `onClick` | `useNavigate()` |
| vanuit een loader of action | `return redirect()` |

---

## 8. Formulieren

### `<Form>` versus `<form>`

```jsx
<form method="post">   ❌ volledige page reload, de action draait niet
<Form method="post">   ✅ fetch onder water, clientAction draait
```

De hoofdletter F is het hele verschil.

```jsx
import { Form } from "react-router";

<Form method="post">
  <input name="width" type="number" />
  <button type="submit">Opslaan</button>
</Form>
```

Belangrijkste props:

| Prop | Betekenis |
|---|---|
| `method` | `"post"`, `"put"`, `"patch"`, `"delete"` — laat weg voor een GET |
| `action` | naar welke route het formulier gaat; standaard de huidige |
| `replace` | vervangt de huidige stap in de geschiedenis |
| `reloadDocument` | forceert het klassieke gedrag met page reload |

### Uncontrolled versus controlled

**Uncontrolled** — de browser beheert de waarde, jij leest hem pas bij verzenden.
Gebruik dit als standaard: minder code, minder fouten.

```jsx
<input name="date" defaultValue={session.date} />
```

**Controlled** — React beheert de waarde. Nodig zodra er iets anders op het scherm
moet meebewegen met wat je typt.

```jsx
<input name="width" value={box.width} onChange={(e) => …} />
```

⚠️ `value` zonder `onChange` maakt het veld onbruikbaar: het springt bij elke toets
terug naar de oude waarde.

### `useFetcher` — versturen zonder te navigeren

Voor knoppen die iets bijwerken terwijl je op dezelfde pagina blijft: een
volg-knop, een like, een verwijderknop in een lijst.

```jsx
import { useFetcher } from "react-router";

const fetcher = useFetcher();

<fetcher.Form method="post" action="/friends">
  <input type="hidden" name="intent" value="follow" />
  <button type="submit">Volgen</button>
</fetcher.Form>
```

| | `<Form>` | `<fetcher.Form>` |
|---|---|---|
| navigeert | ja | nee |
| kan naar een andere route posten | ja, via `action` | ja, via `action` |
| loaders verversen erna | ja | ja |
| typisch gebruik | opslaanformulier | knop in een lijst |

Andere mogelijkheden van een fetcher:

```jsx
fetcher.state      // "idle" | "submitting" | "loading"
fetcher.formData   // wat er op dit moment verstuurd wordt
fetcher.data       // wat de action teruggaf
fetcher.load("/some/route")             // een loader aanroepen zonder navigatie
fetcher.submit(formData, { method: "post", action: "/friends" })
```

### Optimistic UI

De knop meteen laten omklappen, nog voordat de server geantwoord heeft:

```jsx
let optimisticFollowing = isFollowing;                     // waarheid van de server
if (fetcher.state !== "idle" && fetcher.formData) {        // er loopt een verzoek
  optimisticFollowing = fetcher.formData.get("intent") === "follow";
}
```

Zolang er iets onderweg is, lees je uit `fetcher.formData` wat de gebruiker wilde
en toon je dat alvast. Is het verzoek klaar, dan is `fetcher.state` weer `"idle"`
en neemt de echte data het over.

---

## 9. Revalidatie

Na elke action draaien standaard **alle** loaders van de actieve routes opnieuw.
Dat is waarom een lijst automatisch klopt na een verwijdering.

Wil je dat aanpassen, dan exporteer je `shouldRevalidate`:

```jsx
export function shouldRevalidate({ formMethod, defaultShouldRevalidate }) {
  if (formMethod === "get") return false;
  return defaultShouldRevalidate;
}
```

Je hebt dit zelden nodig. Ken het vooral zodat je weet dat het bestaat.

---

## 10. Praktische zaken

### Omgevingsvariabelen

```
# .env
VITE_API_BASE_URL=http://localhost:3000
```

```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

Alleen namen die met `VITE_` beginnen zijn zichtbaar in de browser. Na het wijzigen
van `.env` moet je de dev-server herstarten.

### json-server-queryparameters

In de oefeningen zaten deze al kant-en-klaar in de services. Herken ze, dan weet je
dat je in je component niet meer hoeft te filteren of sorteren.

| Parameter | Betekenis |
|---|---|
| `?_sort=-date` | sorteer op datum, aflopend (nieuwste eerst) |
| `?_embed=user` | plak het volledige user-object in elk record |
| `?_where={"userId":{"eq":"1"}}` | filter op gelijkheid |
| `?_where={"userId":{"in":["1","2"]}}` | filter op "zit in deze lijst" |

De `_where`-waarde wordt met `encodeURIComponent(JSON.stringify(...))` in de URL gezet.

### npm-scripts die je tegenkomt

```json
"dev": "react-router dev",                       // ontwikkelserver, poort 5173
"dev:test": "react-router dev --port 5174",      // wat Playwright start
"build": "react-router build",
"test:chrome": "playwright test --project=chromium",
"test:all": "playwright test",
"test:ui": "playwright test --ui",
"typecheck": "react-router typegen && tsc"
```
