# 07 — Spiekbriefje

Print dit. Twee pagina's, alles wat je uit het hoofd wilt kennen.

---

## Het skelet van een routebestand

```jsx
import { Form, Link, redirect, useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import { haalOp, slaOp } from "../services/xService";

export async function clientLoader({ params, request }) {
  const ding = await haalOp(params.id);
  return { ding };
}

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  await slaOp({
    id: params.id,
    naam: formData.get("naam"),
    aantal: Number(formData.get("aantal")),
    aan: formData.get("aan") === "on",
  });
  return redirect("/");
}

export default function Scherm() {
  const { ding } = useLoaderData();
  const navigate = useNavigate();
  return <div>…</div>;
}
```

---

## De imports

```jsx
import {
  Link,            // <Link to="/pad">
  NavLink,         // navigatiebalk, + end
  Form,            // hoofdletter F
  Outlet,          // gat in een layout
  redirect,        // return redirect("/")
  useLoaderData,   // data uit de loader
  useActionData,   // wat de action teruggaf
  useNavigate,     // navigate(-1)
  useNavigation,   // navigation.state === "submitting"
  useParams,       // params in een component
  useSearchParams, // ?q=... lezen en schrijven
  useFetcher,      // versturen zonder navigeren
} from "react-router";

import { useState } from "react";
```

---

## De twaalf regels

1. `ssr: false` → **`clientLoader`** en **`clientAction`**, nooit `loader`/`action`.
2. Loader = ophalen. Action = wegschrijven. Nooit omgekeerd.
3. Loader returnt een **object**; component leest met `useLoaderData()`.
4. `<a href>` → **`<Link to>`**. Overal, ook in componenten.
5. `<form>` → **`<Form>`**. Hoofdletter F.
6. Cancel/Back → `useNavigate()` + `navigate(-1)`. Knop krijgt `type="button"`.
7. `return redirect("/pad")` — de **`return`** is niet optioneel.
8. `params.sessionId` — exact de naam uit `routes.js`.
9. `await request.formData()` — en `Number(...)` rond getallen.
10. UI-state (zoekterm, accordion) → `useState`. Serverdata → loader.
11. Na een action verversen loaders **automatisch**. Niet zelf refreshen.
12. `<Outlet />` in elke layout, anders blijft de pagina leeg.

---

## formData-tabel

| | Waarde |
|---|---|
| tekstveld | `"hallo"` — altijd een string |
| getalveld | `"42"` → `Number(...)` of `parseInt(..., 10)` |
| checkbox aan | `"on"` |
| checkbox uit | `null` — het veld wordt niet verstuurd |
| select | de `value` van de gekozen `<option>` |
| `disabled` veld | wordt **niet** verstuurd |

```jsx
formData.get("naam")
formData.getAll("tags")
Number(formData.get("aantal"))
formData.get("aan") === "on"
```

---

## Navigatie

| Situatie | Gereedschap |
|---|---|
| link in JSX | `<Link to="/pad">` |
| link in navbar | `<NavLink to="/" end>` |
| vanuit `onClick` | `const navigate = useNavigate(); navigate(-1)` |
| vanuit loader/action | `return redirect("/pad")` |

---

## Inputs

```jsx
// uncontrolled — standaard, voor gewone formulieren
<input name="date" defaultValue={item.date} />

// controlled — als iets live moet meebewegen
<input name="width" value={box.width} onChange={(e) => …} />
<input type="checkbox" name="aan" checked={box.aan} onChange={(e) => …} />
<select name="dikte" value={box.dikte} onChange={(e) => …}>…</select>
```

`e.target.value` voor tekst en getallen, `e.target.checked` voor checkboxes.

---

## State bijwerken

```jsx
const [box, setBox] = useState(defaultBox);

setBox({ ...box, width: 300 });
setBox((prev) => ({ ...prev, width: prev.width + 10 }));
setBox((prev) => ({ ...prev, [key]: value }));       // dynamische sleutel
```

---

## Loaders

```jsx
// sequentieel — als de tweede de eerste nodig heeft
const id = await getCurrentUserId();
const follows = await getFollows(id);

// parallel — sneller als ze onafhankelijk zijn
const [users, follows] = await Promise.all([getUsers(), getFollows(id)]);

// een call overslaan binnen Promise.all
isOwn ? Promise.resolve(null) : getFollow(a, b)

// queryparameter lezen
const q = new URL(request.url).searchParams.get("q") ?? "";

// afschermen
if (item.userId !== currentUserId) return redirect("/");
```

---

## Twee knoppen, twee bewerkingen

```jsx
// manier 1 — intent (zelfde route)
<input type="hidden" name="intent" value="follow" />
const intent = formData.get("intent");

// manier 2 — formAction (andere route)
<button type="submit">Save</button>
<button type="submit" formAction="/boxes/new">Save as new</button>
```

---

## Fetcher en optimistic UI

```jsx
const fetcher = useFetcher();

<fetcher.Form method="post" action="/friends">…</fetcher.Form>

let optimistisch = vanDeServer;
if (fetcher.state !== "idle" && fetcher.formData) {
  optimistisch = fetcher.formData.get("intent") === "follow";
}
```

---

## JSX-patronen

```jsx
{lijst.length === 0 ? <Leeg /> : <Lijst items={lijst} />}
{item.notes && <p>{item.notes}</p>}
{lijst.length > 0 && <Lijst />}                 // > 0, anders verschijnt er "0"
{items.map((i) => <Card key={i.id} item={i} />)}
<div className={actief ? "tab tab--on" : "tab"}>
<label htmlFor="width">…</label>  <input id="width" name="width" />
```

---

## Commando's

```bash
cd server && npm start                # backend, poort 3000
cd client && npm run dev              # frontend, poort 5173

npm run test:chrome                   # tests, snelst
npm run test:ui                       # visuele runner
npx playwright test tests/01-x.spec.js --project=chromium   # één bestand

npx eslint app                        # linten
```

`.env`:

```
VITE_API_BASE_URL=http://localhost:3000
```

---

## Eerste 10 minuten van het examen

1. `server`: `npm install --offline` en `npm start`
2. `client`: `npm install --offline`, `.env` aanmaken, `npm run dev`
3. README lezen, filmpje bekijken
4. Ctrl+Shift+F op `= {};`, `<a href`, `<form `, `// ...`
5. `routes.js`, `services/` en `utils/` doorlezen
6. `npm run test:chrome` — nu weet je waar je staat

Daarna in deze volgorde: layout → navigatie → lijst → detail → aanmaken → bewerken
→ de rest → opruimen.

---

## Laatste controle vóór indienen

- [ ] `npm run test:chrome` alles groen
- [ ] `npx eslint app` geen fouten
- [ ] handmatig doorgeklikt, nergens een page reload
- [ ] `console.log`'s weg
- [ ] `node_modules` verwijderd
- [ ] map hernoemd zoals de README vraagt
- [ ] zip uitgepakt gecontroleerd
