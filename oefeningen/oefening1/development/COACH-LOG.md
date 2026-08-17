# Couch Potato — uitgewerkt, met uitleg per stap

De opdracht is volledig af. Alle 48 tests slagen, ESLint geeft geen fouten.
Dit document loopt in 10 stappen door wat er gebouwd is en waarom.

---

## Wat er nu klaar staat

| | |
|---|---|
| Locatie | `development/client` |
| Tests | 48/48 groen (chromium) |
| ESLint | geen fouten |
| Aangepaste bestanden | 13 |
| Niet aangeraakt | `routes.js`, `root.jsx`, `app.css`, `utils/`, `services/`, `tests/`, `server/` |

`node_modules` en `.env` staan er al in, voor zowel client als server. Je kunt meteen starten.

---

## Starten

Twee terminals:

```bash
# terminal 1 — backend
cd development/server
npm start                  # json-server op http://localhost:3000
```

```bash
# terminal 2 — frontend
cd development/client
npm run dev                # app op http://localhost:5173
```

De tests draaien los daarvan (die mocken de backend zelf):

```bash
cd development/client
npm run test:chrome        # snelste
npm run test:ui            # visuele runner, handig om stap voor stap te kijken
```

---

## De vier begrippen

Meer dan dit heb je niet nodig om de rest te lezen.

**`clientLoader`** — een functie die data ophaalt vóórdat het scherm getekend wordt.
Hij returnt een object; het scherm leest dat met `useLoaderData()`.

**`clientAction`** — een functie die draait als een formulier verstuurd wordt. Hij
schrijft weg naar de server en returnt daarna `null` of een `redirect(...)`.
Zodra hij klaar is, draaien alle loaders opnieuw. Je hoeft de UI dus niet zelf te verversen.

**`Link` / `NavLink`** — vervangen `<a href>`. Een `<a>` herlaadt de hele app; een
`Link` wisselt alleen het stukje scherm dat verandert. `NavLink` doet hetzelfde
maar weet ook of hij de actieve pagina is (voor de onderste navbar).

**`Form`** (met hoofdletter) — vervangt `<form>`. Alleen deze roept de `clientAction`
aan. Een gewone `<form>` doet een volledige page reload en de action draait niet.

> In `react-router.config.ts` staat `ssr: false`. Daarom heet het overal
> `clientLoader` en `clientAction`, niet `loader` en `action`.

---

## Stap 1 — `app/layouts/AppLayout.jsx`

De omhulling van elk scherm: header boven, navbar onder, scherm ertussen.

**Wat erbij kwam:** een loader die de ingelogde gebruiker ophaalt, en `<Outlet />`.

```jsx
import { Outlet, useLoaderData } from "react-router";
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

`<Outlet />` is het gat waar het actieve scherm in getekend wordt. Stond het er niet,
dan zag je alleen een header en een navbar met niets ertussen.

`getCurrentUserId()` is de nep-login uit `services/auth.js` en geeft altijd `"1"` terug.
De dubbele `await` haalt eerst het id op, dan de volledige gebruiker.

Deze loader draait bij elke navigatie binnen de layout, dus bij elk scherm.

---

## Stap 2 — `app/components/AppHeader.jsx` en `BottomNav.jsx`

De navigatie.

**Wat er veranderde:** `<a href>` werd `<Link to>` in de header en `<NavLink to>` in de navbar.

```jsx
// AppHeader.jsx
import { Link } from "react-router";

<Link to="/" className="app-header__title">Couch Potato</Link>
<Link to={`/users/${currentUser?.id}`} data-testid="nav-profile">…</Link>
```

```jsx
// BottomNav.jsx
import { NavLink } from "react-router";

<NavLink to="/" end className="bottom-nav__item" data-testid="nav-feed">…</NavLink>
<NavLink to="/track" …>…</NavLink>
<NavLink to="/friends" …>…</NavLink>
```

De navbar gebruikt `NavLink` omdat die automatisch een `active`-class krijgt op de
pagina waar je bent. De CSS gebruikt dat om de tab op te lichten.

`end` op de Feed-tab betekent: alleen actief als het pad exact `/` is. Zonder `end`
zou de Feed-tab ook oplichten op `/track` en `/friends`, want elk pad begint met `/`.

---

## Stap 3 — `app/routes/feed.jsx` en `components/FeedItem.jsx`

Het startscherm: jouw sessies plus die van iedereen die je volgt, nieuwste eerst.

```jsx
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

Drie calls achter elkaar, want elke stap heeft het resultaat van de vorige nodig:
wie ben ik → wie volg ik → geef me de sessies van die lijst mensen.

`[currentUserId, ...follows.map(...)]` maakt er `["1", "2", "3"]` van: jezelf plus
de mensen die je volgt. Je eigen id moet erbij, anders zie je je eigen sessies niet.

`getFeedSessions` vraagt de server om `_embed=user&_embed=category&_sort=-date`.
De server plakt dus het user- en categorie-object in elke sessie en sorteert meteen
nieuw naar oud. Daarom kan `FeedItem` gewoon `session.user.name` en
`session.category.emoji` gebruiken, en hoef je in de component niets te sorteren.

In `FeedItem.jsx` werd de buitenste `<a href>` een `<Link to>`, zodat klikken naar
het detailscherm geen page reload veroorzaakt.

---

## Stap 4 — `app/routes/sessionDetail.jsx`

Eén sessie in detail, met een link naar de eigenaar en een Back-knop.

```jsx
export async function clientLoader({ params }) {
  const session = await getSessionWithRelations(params.sessionId);
  const currentUserId = await getCurrentUserId();

  return { session, currentUserId };
}

export default function SessionDetail() {
  const { session, currentUserId } = useLoaderData();
  const navigate = useNavigate();

  const isOwn = session.userId === currentUserId;
  …
  <button type="button" onClick={() => navigate(-1)}>Back</button>
}
```

`params.sessionId` komt uit de routetabel: `route("sessions/:sessionId", …)`.
De naam achter de dubbele punt is exact de naam die je in `params` terugvindt.

Hier `getSessionWithRelations` in plaats van `getSession`, want dit scherm toont de
categorienaam en de naam van de eigenaar. Die zitten alleen in de versie met embeds.

`navigate(-1)` is één stap terug in de geschiedenis, net als de terugknop van de
browser. Dat is beter dan `navigate("/")`: kom je hier vanaf een profiel, dan ga je
ook netjes terug naar dat profiel.

`isOwn` bepaalt of de Edit-knop verschijnt. Beide id's zijn strings, dus `===` klopt.

---

## Stap 5 — `app/routes/track.jsx`

Het formulier om een nieuwe sessie te loggen.

```jsx
export async function clientLoader() {
  const categories = await getCategories();
  return { categories };
}

export async function clientAction({ request }) {
  const formData = await request.formData();
  const currentUserId = await getCurrentUserId();

  await createSession({
    userId: currentUserId,
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    duration: Number(formData.get("duration")),
    notes: formData.get("notes"),
  });

  return redirect("/");
}
```

En in de JSX: `<form>` werd `<Form>`, en de Cancel-knop kreeg `onClick={() => navigate(-1)}`.

De koppeling tussen formulier en action loopt via `name`. `<input name="date">`
wordt `formData.get("date")`. Die namen moeten letterlijk overeenkomen.

`userId` staat bewust niet in het formulier — die haalt de action zelf op via
`getCurrentUserId()`. Zo kan niemand via de HTML een sessie op andermans naam zetten.

`formData.get()` geeft altijd een string. `duration` is in de database een getal,
vandaar `Number(...)` eromheen.

`return redirect("/")` stuurt je na het opslaan naar de feed. Zonder `return` gebeurt er niets.

De datum staat standaard op vandaag via `new Date().toISOString().slice(0, 10)`,
wat `"2026-08-17"` oplevert — precies het formaat dat `<input type="date">` wil.

---

## Stap 6 — `app/routes/editSession.jsx` en `components/SessionForm.jsx`

Hetzelfde formulier, maar dan voorgevuld — en alleen voor de eigenaar.

```jsx
export async function clientLoader({ params }) {
  const session = await getSession(params.sessionId);
  const currentUserId = await getCurrentUserId();

  if (session.userId !== currentUserId) {
    return redirect("/");
  }

  return { session };
}

export async function clientAction({ request, params }) {
  const formData = await request.formData();
  const currentUserId = await getCurrentUserId();

  await updateSession({
    id: params.sessionId,
    date: formData.get("date"),
    duration: Number(formData.get("duration")),
    notes: formData.get("notes"),
  });

  return redirect(`/users/${currentUserId}`);
}
```

`redirect()` mag ook vanuit een loader. Dat is de manier om een pagina af te
schermen: haal op wat je nodig hebt, controleer, en stuur weg voordat er iets
gerenderd wordt. Typ je `/sessions/4/edit` in (een sessie van iemand anders), dan
beland je op de feed.

Hier volstaat de kale `getSession`, want het formulier toont alleen datum, duur en
notities — geen gebruiker of categorie.

Het id staat niet in het formulier, dus de action haalt het uit `params.sessionId`.

Na opslaan ga je naar je eigen profiel, niet naar de feed. Zo staat het in de README.

In `SessionForm.jsx` werd `<form>` een `<Form>` en kreeg Cancel zijn `navigate(-1)`.
De velden gebruiken `defaultValue` en niet `value`: de browser beheert de waarde en
de action leest hem pas bij het versturen uit. Met `value` zonder `onChange` zou je
niets meer kunnen typen.

Er zit bewust geen categorieveld in dit formulier — de categorie ligt vast bij het aanmaken.

---

## Stap 7 — `app/routes/friends.jsx` en `components/UserCard.jsx`

Volgen en ontvolgen, plus een zoekveld.

```jsx
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

`Promise.all` kan hier omdat `getUsers()` en `getFollows()` elkaar niet nodig hebben.
Ze draaien tegelijk. In de feed-loader kon dat niet, daar wacht elke stap op de vorige.

Eén action doet twee dingen. Het formulier stuurt een verborgen veld mee:

```jsx
<input type="hidden" name="intent" value="follow" />   // of "unfollow"
```

De action leest dat veld en kiest de juiste service. `return null` betekent: geen
redirect, blijf staan. Daarna verversen de loaders vanzelf, dus de lijst klopt weer.

De zoekterm zit in `useState`, niet in de loader. Hij verandert bij elke toetsaanslag
en komt niet van de server — daar wil je geen netwerkcall voor. Vuistregel: komt het
van de server, dan loader; bestaat het alleen in de browser, dan `useState`.

Het filter zelf stond er al:

```js
const filtered = query.trim()
  ? otherUsers.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
  : otherUsers.filter((u) => followingIds.has(u.id));
```

Leeg zoekveld toont alleen wie je volgt; zodra je typt, zoek je door iedereen.

In `UserCard.jsx` werd de naam een `Link`. De rest van die component — de
follow-knop die meteen omklapt — werkte al zodra de action bestond.

---

## Stap 8 — `app/routes/userProfile.jsx`

Eén scherm dat zowel je eigen profiel als dat van iemand anders toont.

```jsx
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
```

Op je eigen profiel heeft "volg ik mezelf?" geen betekenis, dus die call wordt
overgeslagen. `Promise.all` verwacht wel een promise op die plek, vandaar
`Promise.resolve(null)`.

De loader geeft geen follow-object terug maar een boolean en een id. De component
wil namelijk maar twee dingen weten: welke knop moet ik tonen, en welk record moet
ik verwijderen als er op Unfollow geklikt wordt. Data alvast in die vorm gieten
houdt de component simpel.

`getSessionsByUser` sorteert al op `-date`, dus nieuwste sessie staat bovenaan.

De drie verschillen tussen eigen en andermans profiel zaten al in de JSX:

| | Eigen profiel | Ander profiel |
|---|---|---|
| Follow-knop | verborgen | zichtbaar |
| Titel | "Your Sessions" | "Recent Sessions" |
| Edit-link op sessies | zichtbaar | verborgen |

---

## Stap 9 — `app/components/SessionAccordion.jsx`

De uitklapbare sessielijst op een profiel.

De accordion-logica was al af. Alleen de Edit-knop was nog een gewone `<a href>`:

```jsx
import { Link } from "react-router";

<Link to={`/sessions/${session.id}/edit`} className="btn btn--ghost">Edit</Link>
```

Met een `<a>` herlaadde de app bij het klikken op Edit, waardoor Cancel daarna niet
meer terugkon naar het profiel.

Het openklappen zelf gebeurt met één `expandedId` in `useState`. Eén waarde in
plaats van een boolean per rij, zodat er nooit twee panelen tegelijk openstaan.

---

## Stap 10 — Controle

```
48 passed (51.8s)
```

`npx eslint app` geeft nul waarschuwingen.

---

## Naslag: de imports

Alles komt uit `react-router` — in versie 7 bestaat `react-router-dom` niet meer.

```jsx
import {
  Link,           // klikbare link
  NavLink,        // link die weet of hij actief is (+ `end`)
  Form,           // formulier dat de clientAction aanroept
  Outlet,         // het gat in een layout
  redirect,       // return redirect("/") vanuit loader of action
  useLoaderData,  // data uit de clientLoader
  useNavigate,    // navigate(-1) of navigate("/pad")
  useFetcher,     // formulier zonder navigatie (de follow-knop)
} from "react-router";

import { useState } from "react";   // alleen voor dingen die niet van de server komen
```

De skeletten:

```jsx
export async function clientLoader({ params, request }) {
  const data = await haalIetsOp(params.someId);
  return { data };
}

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  await schrijfIetsWeg({ id: params.someId, veld: formData.get("veld") });
  return redirect("/ergens");        // of: return null;
}

export default function Scherm() {
  const { data } = useLoaderData();
  const navigate = useNavigate();
  return <div>…</div>;
}
```

---

## Als er toch iets stukgaat

| Wat je ziet | Wat er aan de hand is |
|---|---|
| `Cannot read properties of undefined` | het scherm leest data die de loader niet teruggeeft |
| Test zegt "Full page reload detected" | er staat ergens nog een `<a href>` of een `<form>` |
| Pagina blijft leeg, geen foutmelding | `<Outlet />` ontbreekt in de layout |
| Formulier submit maar er gebeurt niets | `<form>` in plaats van `<Form>`, of `action` in plaats van `clientAction` |
| Action draait maar de lijst ververst niet | de `return` in de action ontbreekt |
| `params.id is undefined` | de naam komt niet overeen met `routes.js` (`sessionId`, `userId`) |
| Lijst leeg terwijl er data is | id's vergeleken als getal — het zijn strings |
| `fetch failed` | backend draait niet, of `.env` ontbreekt |
| Je kunt niet typen in een veld | `value=` zonder `onChange`; gebruik `defaultValue=` |

---

## Inleveren

Uit de README:

- alleen de map `client` indienen, niet de server
- `node_modules` eruit
- map hernoemen naar `2DEV-VOORNAAM-ACHTERNAAM`
- zippen en uploaden naar Leho

Vóór het zippen even `npm run test:chrome` draaien en door de app klikken met de
echte backend: feed → detail → edit → save → profiel → friends → follow/unfollow.

---

## De 13 gewijzigde bestanden

| Bestand | Wat er veranderde |
|---|---|
| `layouts/AppLayout.jsx` | loader voor de huidige gebruiker + `<Outlet />` |
| `components/AppHeader.jsx` | `<a>` → `<Link>` (2×) |
| `components/BottomNav.jsx` | `<a>` → `<NavLink>` (3×) |
| `routes/feed.jsx` | loader met follows + feedSessions |
| `components/FeedItem.jsx` | `<a>` → `<Link>` |
| `routes/sessionDetail.jsx` | loader met `params` + `navigate(-1)` op Back |
| `routes/track.jsx` | loader + action + `<Form>` + `navigate(-1)` op Cancel |
| `routes/editSession.jsx` | loader met eigenaarscontrole + action + redirect |
| `components/SessionForm.jsx` | `<form>` → `<Form>` + `navigate(-1)` op Cancel |
| `routes/friends.jsx` | loader met `Promise.all` + action met `intent` + `useState` |
| `components/UserCard.jsx` | `<a>` → `<Link>` |
| `routes/userProfile.jsx` | loader met `params`, `Promise.all` en klaargezette data |
| `components/SessionAccordion.jsx` | `<a>` → `<Link>` op Edit |
