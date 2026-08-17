# 06 — De twee oefeningen naast elkaar

Wat elke oefening vroeg, wat je eruit moest leren, en hoe ze samen het examenterrein
afdekken.

---

## Overzicht

| | Oefening 1 — Couch Potato | Oefening 2 — Box Configurator |
|---|---|---|
| Onderwerp | sociaal netwerk voor luiheid | configurator voor dozen |
| Schermen | 6 | 4 |
| Tests | 48 | 14 |
| Aangepaste bestanden | 13 | 7 |
| Zwaartepunt | React Router | React Router **en** React-state |
| Layout-route | ja, met `<Outlet />` | nee |
| Collecties | users, categories, sessions, follows | boxes |
| Id-type | strings (`"1"`) | getallen (`1`) |
| Nieuw hierin | loaders, actions, fetchers, optimistic UI, intent-patroon | controlled inputs, state optillen, live preview, `formAction` |

---

## Oefening 1 — Couch Potato

### De schermen

| Route | Bestand | Wat het doet |
|---|---|---|
| `/` | `feed.jsx` | sessies van jou + wie je volgt, nieuwste eerst |
| `/sessions/:sessionId` | `sessionDetail.jsx` | één sessie, met link naar de eigenaar |
| `/track` | `track.jsx` | formulier om een sessie te loggen |
| `/sessions/:sessionId/edit` | `editSession.jsx` | dezelfde sessie bewerken, alleen als eigenaar |
| `/friends` | `friends.jsx` | volgen en ontvolgen, met zoekveld |
| `/users/:userId` | `userProfile.jsx` | profiel, past zich aan wie je bekijkt |

Alles zat in één `AppLayout` met header en onderste navigatiebalk.

### Wat je moest bouwen

- **Layout**: een `clientLoader` voor de ingelogde gebruiker en `<Outlet />`
- **Navigatie**: `<a href>` overal vervangen door `Link` en `NavLink`
- **Feed**: drie service-calls achter elkaar, met de spread-truc
  `[currentUserId, ...follows.map(f => f.followingId)]`
- **Detail**: `params.sessionId`, `navigate(-1)` op de terugknop
- **Track**: eerste `clientAction` met `redirect("/")`
- **Edit**: een guard in de loader die niet-eigenaars wegstuurt
- **Friends**: loader met `Promise.all`, action met het `intent`-patroon,
  zoekveld met `useState`
- **Profiel**: één scherm dat zich aanpast aan eigen versus andermans profiel

### De drie dingen die je hieruit meeneemt

**1. Het intent-patroon.** Eén action, twee bewerkingen, uit elkaar gehouden door
een verborgen veld.

```jsx
<input type="hidden" name="intent" value="follow" />
```

**2. Optimistic UI met een fetcher.** De knop klapt om vóór de server antwoordt.

```jsx
if (fetcher.state !== "idle" && fetcher.formData) {
  optimisticFollowing = fetcher.formData.get("intent") === "follow";
}
```

**3. Data vormgeven in de loader.** Niet het ruwe follow-object doorgeven, maar
precies wat de component nodig heeft:

```jsx
return {
  isFollowing: Boolean(follow),
  followId: follow?.id ?? null,
  …
};
```

### Wat de services al deden

De queryparameters zaten al in de service-laag. Zie je die, dan hoef je in je
component niet meer te filteren of sorteren:

```js
`${BASE_URL}/sessions?_where=${where}&_embed=user&_embed=category&_sort=-date`
```

- `_where` filtert (`eq` voor gelijk, `in` voor "zit in deze lijst")
- `_embed` plakt gerelateerde objecten erin
- `_sort=-date` sorteert aflopend

---

## Oefening 2 — Box Configurator

### De schermen

| Route | Bestand | Wat het doet |
|---|---|---|
| `/` | `home.jsx` | lijst met dozen, of een lege staat |
| `/boxes/:id` | `detailBox.jsx` | één doos met afmetingen en berekeningen |
| `/boxes/new` | `newBox.jsx` | nieuwe doos, met live preview |
| `/boxes/edit/:id` | `editBox.jsx` | bestaande doos bewerken, met live preview |

Geen layout-route: elk scherm staat op zichzelf.

### Wat je moest bouwen

- **Home**: `clientLoader` met `getAllBoxes`, en de kapotte `EmptyState` repareren
  (die miste een `return`)
- **BoxCard**: de ontbrekende `Link`-import
- **BoxVisualizer**: `({ box })` als prop aannemen — precies één regel
- **Detail**: foute import weg, loader met `params.id`
- **BoxForm**: props `box` en `setBox`, controlled inputs, de 150mm-regel,
  twee submit-knoppen
- **NewBox**: `useState(defaultBox)`, action met `addBox`
- **EditBox**: loader, state uit de loaderdata, action met `updateBox`

### De drie dingen die je hieruit meeneemt

**1. Live preview betekent controlled inputs.** Zodra iets naast het formulier
moet meebewegen, moet React de waarde bezitten.

```jsx
<input value={box.width} onChange={(e) => handleChange("width", e)} name="width" />
```

Het `name`-attribuut blijft staan, dus verzenden werkt nog gewoon via `formData`.

**2. State optillen.** De `box`-state staat in de route, niet in het formulier,
omdat de preview er ook bij moet.

```jsx
const [box, setBox] = useState(defaultBox);

<BoxForm box={box} setBox={setBox} />
<BoxVisualizer box={box} />
```

**3. `formAction` splitst twee knoppen.** Het formulier staat op `/boxes/edit/1`,
maar "Save as new" stuurt naar de action van `/boxes/new`.

```jsx
<button type="submit">Save box</button>
<button type="submit" formAction="/boxes/new">Save as new</button>
```

### Extra details die punten waren

- één `handleBoxValueChange(key, e)` met een computed property `[key]` voor alle velden
- `parseInt(..., 10) || 0` om `NaN` te vermijden bij een leeg veld
- `e.preventDefault()` bij Shift + pijltje, anders telt de browser er óók bij op
- één boolean `isDepthSufficient` die de checkbox uitschakelt, het label grijs maakt
  én de hint toont

---

## Wat in beide oefeningen terugkwam

Dit is het gemeenschappelijke deel. Als je maar één ding oefent, oefen dan dit.

| Onderwerp | Waar |
|---|---|
| `clientLoader` schrijven en `useLoaderData()` gebruiken | elk scherm |
| `params` uit de URL halen | detail- en editschermen |
| `clientAction` met `await request.formData()` | elk formulier |
| Strings converteren naar getallen | elk formulier |
| `return redirect(...)` na opslaan | elk formulier |
| `<a href>` vervangen door `<Link to>` | alle componenten |
| `<form>` vervangen door `<Form>` | alle formulieren |
| Cancel/Back met `navigate(-1)` of een `Link` | overal |
| Lege staat tonen | feed, home, profiel |
| Voorwaardelijk renderen met `?:` en `&&` | overal |
| Lijsten met `map` en `key` | feed, home, friends |
| Eén formuliercomponent voor twee schermen | `SessionForm`, `BoxForm` |

---

## Verschillen om op te letten

| | Oefening 1 | Oefening 2 |
|---|---|---|
| Formuliervelden | uncontrolled, `defaultValue` | controlled, `value` + `onChange` |
| Waar state leeft | alleen UI-state (zoekterm, accordion) | de hele formulierdata |
| Twee bewerkingen | verborgen `intent`-veld | `formAction` per knop |
| Id-type | strings — `===` werkt direct | getallen — let op bij vergelijken |
| Redirect na bewerken | naar het eigen profiel | naar de lijst |
| Route-guard | ja, in `editSession` | nee |

**De les:** de opdracht bepaalt welke variant je nodig hebt. Uncontrolled is de
standaard; ga pas naar controlled als er iets live moet meebewegen. Het intent-veld
gebruik je als de bewerkingen bij dezelfde route horen; `formAction` als ze bij
verschillende routes horen.

---

## Zelftest

Kun je deze tien vragen beantwoorden zonder te kijken, dan zit je goed.

1. Waarom heet het `clientLoader` en niet `loader` in deze projecten?
2. Wat gebeurt er automatisch nadat een action klaar is?
3. Waar haal je het id vandaan in een action, als het niet in het formulier staat?
4. Wat is het verschil tussen `Link` en `NavLink`, en waar dient `end` voor?
5. Wanneer gebruik je `defaultValue` en wanneer `value`?
6. Waarom staat de `box`-state in de route en niet in `BoxForm`?
7. Hoe laat je twee knoppen in één formulier verschillende dingen doen? Noem twee manieren.
8. Wat geeft `formData.get("mijnCheckbox")` terug als de checkbox uit staat?
9. Hoe scherm je een pagina af zodat alleen de eigenaar erbij kan?
10. Waarom is `navigate(-1)` meestal beter dan `navigate("/")` voor een terugknop?

*Antwoorden staan in hoofdstuk 02, 03 en de twee COACH-LOG-bestanden.*
