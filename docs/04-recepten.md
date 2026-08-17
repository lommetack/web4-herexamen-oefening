# 04 — Receptenboek

Kant-en-klare patronen. Zoek het scherm dat je moet bouwen en type het recept over.

**Inhoud**

1. [Lijstscherm met lege staat](#1-lijstscherm-met-lege-staat)
2. [Detailscherm met een parameter](#2-detailscherm-met-een-parameter)
3. [Aanmaakformulier](#3-aanmaakformulier)
4. [Bewerkformulier, voorgevuld](#4-bewerkformulier-voorgevuld)
5. [Pagina afschermen](#5-pagina-afschermen-route-guard)
6. [Verwijderknop](#6-verwijderknop)
7. [Eén action, twee bewerkingen (intent)](#7-één-action-twee-bewerkingen-intent)
8. [Twee knoppen, twee routes (formAction)](#8-twee-knoppen-twee-routes-formaction)
9. [Knop die meteen omklapt (optimistic UI)](#9-knop-die-meteen-omklapt-optimistic-ui)
10. [Zoekveld dat filtert](#10-zoekveld-dat-filtert)
11. [Formulier met live preview](#11-formulier-met-live-preview)
12. [Veld uitschakelen op basis van een ander veld](#12-veld-uitschakelen-op-basis-van-een-ander-veld)
13. [Accordion](#13-accordion)
14. [Layout met header en navigatie](#14-layout-met-header-en-navigatie)
15. [Cancel- en terugknop](#15-cancel--en-terugknop)
16. [Bezig-met-opslaan-knop](#16-bezig-met-opslaan-knop)
17. [Foutmelding uit een action tonen](#17-foutmelding-uit-een-action-tonen)
18. [Formulier dat één scherm deelt](#18-formulier-dat-twee-schermen-deelt)

---

## 1. Lijstscherm met lege staat

```jsx
import { Link, useLoaderData } from "react-router";
import BoxCard from "../components/BoxCard/BoxCard";
import { getAllBoxes } from "../services/boxService";

export const clientLoader = async () => {
  const boxes = await getAllBoxes();
  return { boxes };
};

export default function Home() {
  const { boxes } = useLoaderData();

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Box Configurator</h1>
        <Link to="/boxes/new" className="button button-primary">
          Create New Box
        </Link>
      </header>

      {boxes.length === 0 ? (
        <div className="empty-state">
          <p>Nog niets aangemaakt.</p>
          <Link to="/boxes/new">Maak je eerste doos</Link>
        </div>
      ) : (
        <div className="box-grid">
          {boxes.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      )}
    </div>
  );
}
```

De titel blijft staan, ook bij een lege lijst. Tests controleren dat vaak allebei.

---

## 2. Detailscherm met een parameter

Routetabel: `route("boxes/:id", "routes/detailBox.jsx")`

```jsx
import { Link, useLoaderData } from "react-router";
import { getBoxById } from "../services/boxService";

export const clientLoader = async ({ params }) => {
  const box = await getBoxById(params.id);
  return { box };
};

export default function DetailBox() {
  const { box } = useLoaderData();

  return (
    <div>
      <h1>Box #{box.id}</h1>
      <Link to={`/boxes/edit/${box.id}`}>Edit Box</Link>
      <Link to="/">Back to List</Link>
      <p>{box.width}×{box.height}×{box.depth} mm</p>
    </div>
  );
}
```

Heb je gerelateerde data nodig (de eigenaar, de categorie), kijk dan of er een
service met embeds bestaat — `getSessionWithRelations` in plaats van `getSession`.

---

## 3. Aanmaakformulier

```jsx
import { Form, redirect, useLoaderData } from "react-router";
import { getCategories } from "../services/categories";
import { createSession } from "../services/sessions";
import { getCurrentUserId } from "../services/auth";

export async function clientLoader() {
  const categories = await getCategories();
  return { categories };
}

export async function clientAction({ request }) {
  const formData = await request.formData();
  const currentUserId = await getCurrentUserId();

  await createSession({
    userId: currentUserId,                      // niet uit het formulier
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    duration: Number(formData.get("duration")),
    notes: formData.get("notes"),
  });

  return redirect("/");
}

export default function Track() {
  const { categories } = useLoaderData();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Form method="post">
      <label htmlFor="categoryId">Category</label>
      <select id="categoryId" name="categoryId" required>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
        ))}
      </select>

      <label htmlFor="date">Date</label>
      <input id="date" name="date" type="date" defaultValue={today} required />

      <button type="submit">Log it</button>
    </Form>
  );
}
```

`new Date().toISOString().slice(0, 10)` geeft `"2026-08-17"` — precies het formaat
dat `<input type="date">` verwacht.

---

## 4. Bewerkformulier, voorgevuld

```jsx
import { Form, redirect, useLoaderData } from "react-router";
import { getSession, updateSession } from "../services/sessions";

export async function clientLoader({ params }) {
  const session = await getSession(params.sessionId);
  return { session };
}

export async function clientAction({ request, params }) {
  const formData = await request.formData();

  await updateSession({
    id: params.sessionId,                       // id uit de URL
    date: formData.get("date"),
    duration: Number(formData.get("duration")),
    notes: formData.get("notes"),
  });

  return redirect("/");
}

export default function EditSession() {
  const { session } = useLoaderData();

  return (
    <Form method="post">
      <input name="date" type="date" defaultValue={session.date} required />
      <input name="duration" type="number" defaultValue={session.duration} required />
      <textarea name="notes" defaultValue={session.notes} />
      <button type="submit">Save</button>
    </Form>
  );
}
```

`defaultValue` en niet `value` — anders kun je niets meer typen.

---

## 5. Pagina afschermen (route guard)

```jsx
export async function clientLoader({ params }) {
  const session = await getSession(params.sessionId);
  const currentUserId = await getCurrentUserId();

  if (session.userId !== currentUserId) {
    return redirect("/");
  }

  return { session };
}
```

Controleer in de loader, niet in de component. Dan wordt er niets getekend dat de
gebruiker niet mag zien.

---

## 6. Verwijderknop

Met een fetcher zodat je op de pagina blijft:

```jsx
const fetcher = useFetcher();

<fetcher.Form method="post" action="/boxes">
  <input type="hidden" name="intent" value="delete" />
  <input type="hidden" name="id" value={box.id} />
  <button type="submit">Verwijderen</button>
</fetcher.Form>
```

```jsx
export async function clientAction({ request }) {
  const formData = await request.formData();
  if (formData.get("intent") === "delete") {
    await deleteBox(formData.get("id"));
  }
  return null;
}
```

Na de action verversen de loaders vanzelf, dus de rij verdwijnt uit de lijst.

---

## 7. Eén action, twee bewerkingen (intent)

```jsx
// formulier
<fetcher.Form method="post" action="/friends">
  <input type="hidden" name="intent" value="follow" />
  <input type="hidden" name="followingId" value={user.id} />
  <button type="submit">Follow</button>
</fetcher.Form>

<fetcher.Form method="post" action="/friends">
  <input type="hidden" name="intent" value="unfollow" />
  <input type="hidden" name="followId" value={followId} />
  <button type="submit">Following</button>
</fetcher.Form>
```

```jsx
// action
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
```

---

## 8. Twee knoppen, twee routes (formAction)

Voor knoppen die bij verschillende routes horen. Het formulier staat op
`/boxes/edit/1`; de tweede knop stuurt naar de action van `/boxes/new`.

```jsx
<Form method="post">
  …velden…
  <button type="submit">Save box</button>
  <button type="submit" formAction="/boxes/new">Save as new</button>
</Form>
```

```jsx
// editBox.jsx
export const clientAction = async ({ request, params }) => {
  const formData = await request.formData();
  await updateBox(params.id, { … });
  return redirect("/");
};

// newBox.jsx
export const clientAction = async ({ request }) => {
  const formData = await request.formData();
  await addBox({ … });
  return redirect("/");
};
```

Geen verborgen velden, geen if in de action. Elke knop wijst naar de action die er
al is.

---

## 9. Knop die meteen omklapt (optimistic UI)

```jsx
import { useFetcher } from "react-router";

export function UserCard({ user, isFollowing, followId }) {
  const fetcher = useFetcher();

  let optimisticFollowing = isFollowing;
  if (fetcher.state !== "idle" && fetcher.formData) {
    optimisticFollowing = fetcher.formData.get("intent") === "follow";
  }

  return (
    <fetcher.Form method="post" action="/friends">
      {optimisticFollowing ? (
        <>
          <input type="hidden" name="intent" value="unfollow" />
          <input type="hidden" name="followId" value={followId} />
          <button type="submit">Following</button>
        </>
      ) : (
        <>
          <input type="hidden" name="intent" value="follow" />
          <input type="hidden" name="followingId" value={user.id} />
          <button type="submit">Follow</button>
        </>
      )}
    </fetcher.Form>
  );
}
```

Zolang er iets onderweg is, lees je uit `fetcher.formData` wat de gebruiker wilde en
toon je dat alvast. Daarna neemt de echte data het over.

---

## 10. Zoekveld dat filtert

### Variant A — puur op het scherm, met `useState`

De eenvoudigste. Gebruik dit als de data al volledig geladen is.

```jsx
const { users, follows, currentUserId } = useLoaderData();
const [query, setQuery] = useState("");

const otherUsers = users.filter((u) => u.id !== currentUserId);
const followingIds = new Set(follows.map((f) => f.followingId));

const filtered = query.trim()
  ? otherUsers.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
  : otherUsers.filter((u) => followingIds.has(u.id));

<input
  type="search"
  placeholder="Search people…"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

### Variant B — in de URL, met `useSearchParams`

Gebruik dit als de zoekterm deelbaar moet zijn of de server moet filteren.

```jsx
export async function clientLoader({ request }) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const users = await searchUsers(q);
  return { users, q };
}

const [searchParams, setSearchParams] = useSearchParams();

<input
  type="search"
  value={searchParams.get("q") ?? ""}
  onChange={(e) => setSearchParams({ q: e.target.value })}
/>
```

---

## 11. Formulier met live preview

Het patroon uit oefening 2. State in de route, formulier en preview krijgen hem als prop.

```jsx
// route
import { useState } from "react";
import { defaultBox } from "../utils";

export default function NewBox() {
  const [box, setBox] = useState(defaultBox);

  return (
    <div className="new-box__content">
      <BoxForm box={box} setBox={setBox} />

      <div>
        <BoxVisualizer box={box} />
        <p>Width: {box.width}mm</p>
        <p>Height: {box.height}mm</p>
      </div>
    </div>
  );
}
```

```jsx
// formulier
const BoxForm = ({ box, setBox }) => {
  const handleChange = (key, e) => {
    const value =
      key === "includeDragHandles"
        ? e.target.checked
        : parseInt(e.target.value, 10) || 0;

    setBox((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Form method="post">
      <label htmlFor="widthInput">Width (mm)</label>
      <input
        type="number"
        id="widthInput"
        name="width"
        value={box.width}
        onChange={(e) => handleChange("width", e)}
        min="10"
        max="1000"
        required
      />
      …
    </Form>
  );
};
```

Drie dingen tegelijk gevoed door één stuk state: het formulier, de tekening en het
lijstje afmetingen. De `name`-attributen blijven staan, dus verzenden werkt gewoon.

---

## 12. Veld uitschakelen op basis van een ander veld

```jsx
const isDepthSufficient = box.depth >= 150;

<input
  type="checkbox"
  id="dragHandlesToggle"
  name="includeDragHandles"
  checked={box.includeDragHandles}
  disabled={!isDepthSufficient}
  onChange={(e) => handleChange("includeDragHandles", e)}
/>
<label
  htmlFor="dragHandlesToggle"
  className={isDepthSufficient ? "" : "checkbox-label--disabled"}
>
  Include drag handles
</label>

{!isDepthSufficient && (
  <span className="checkbox-hint">
    Depth must be at least 150mm for drag handles
  </span>
)}
```

Eén boolean stuurt drie dingen aan: het slot, de grijze kleur en de uitlegtekst.

⚠️ Een `disabled` veld wordt níét meegestuurd in de `formData`. Bedenk of dat erg is.

---

## 13. Accordion

```jsx
const [expandedId, setExpandedId] = useState(null);

{sessions.map((session) => {
  const isOpen = expandedId === session.id;
  return (
    <li key={session.id}>
      <button
        type="button"
        onClick={() => setExpandedId(isOpen ? null : session.id)}
        aria-expanded={isOpen}
      >
        {formatDate(session.date)}
      </button>

      {isOpen && (
        <div>
          <p>{session.duration} minuten</p>
          <Link to={`/sessions/${session.id}/edit`}>Edit</Link>
        </div>
      )}
    </li>
  );
})}
```

Eén `expandedId` in plaats van een boolean per rij: zo staat er nooit meer dan één
paneel open. Klik je op de open rij, dan wordt het weer `null`.

---

## 14. Layout met header en navigatie

```jsx
import { NavLink, Outlet, useLoaderData } from "react-router";

export async function clientLoader() {
  const currentUser = await getUser(await getCurrentUserId());
  return { currentUser };
}

export default function AppLayout() {
  const { currentUser } = useLoaderData();

  return (
    <div className="app">
      <header>
        <Link to="/">Couch Potato</Link>
        <Link to={`/users/${currentUser?.id}`}>{currentUser?.avatar} Me</Link>
      </header>

      <main>
        <Outlet />
      </main>

      <nav>
        <NavLink to="/" end>Feed</NavLink>
        <NavLink to="/track">Track</NavLink>
        <NavLink to="/friends">Friends</NavLink>
      </nav>
    </div>
  );
}
```

`end` alleen op de link naar `/`, anders licht die op elke pagina op.

---

## 15. Cancel- en terugknop

Als knop:

```jsx
import { useNavigate } from "react-router";

const navigate = useNavigate();

<button type="button" onClick={() => navigate(-1)}>Cancel</button>
```

Als link naar een vaste plek:

```jsx
<Link to="/" className="button button-secondary">Cancel</Link>
<Link to={`/boxes/${box.id}`} className="button button-secondary">Cancel</Link>
```

`navigate(-1)` als je terug moet naar waar je vandaan kwam, een `Link` als de
bestemming altijd dezelfde is. Let op: een Cancel-**knop** in een `<Form>` moet
`type="button"` hebben, anders verstuurt hij het formulier.

---

## 16. Bezig-met-opslaan-knop

```jsx
import { useNavigation } from "react-router";

const navigation = useNavigation();
const isSubmitting = navigation.state === "submitting";

<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Bezig…" : "Opslaan"}
</button>
```

---

## 17. Foutmelding uit een action tonen

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

export default function NewBox() {
  const actionData = useActionData();

  return (
    <Form method="post">
      {actionData?.error && <p className="error">{actionData.error}</p>}
      …
    </Form>
  );
}
```

---

## 18. Formulier dat twee schermen deelt

Eén component, twee gebruikers. Het verschil zit in wat er binnenkomt.

```jsx
const BoxForm = ({ box, setBox }) => {
  return (
    <Form method="post">
      …velden…

      <div className="form-actions">
        {box.id ? (
          <>
            <button type="submit">Save box</button>
            <button type="submit" formAction="/boxes/new">Save as new</button>
          </>
        ) : (
          <button type="submit">Create new box</button>
        )}
      </div>
    </Form>
  );
};
```

`box.id` bestaat alleen bij een bestaande doos, dus dat is genoeg om te weten in
welk scherm je zit. Een prop als `submitLabel` of `mode` mag ook:

```jsx
<SessionForm session={session} submitLabel="Save" />
<SessionForm submitLabel="Log it" />
```
