# 03 — React

Alleen wat je in deze opdrachten nodig hebt. Geen theorie die je niet gebruikt.

---

## 1. Componenten

Een component is een functie die JSX teruggeeft. De naam begint met een hoofdletter.

```jsx
function BoxCard() {
  return <div className="box-card">Hallo</div>;
}
```

Pijlfunctie mag ook, maar let op de haakjes:

```jsx
const BoxCard = () => <div>Hallo</div>;              // impliciete return

const BoxCard = () => {
  return <div>Hallo</div>;                            // accolades → return verplicht
};

const BoxCard = () => {
  <div>Hallo</div>;                                   // ❌ geeft undefined terug
};
```

Die laatste is een echte valstrik. Er komt geen foutmelding — er verschijnt gewoon
niets op het scherm. In oefening 2 stond precies deze fout in de `EmptyState`-component.

### Exporteren

```jsx
export default function Home() { … }     // één per bestand
export function BoxCard() { … }          // named, meerdere per bestand

import Home from "./home.jsx";           // default → naam kiest de importeur
import { BoxCard } from "./BoxCard.jsx"; // named → exacte naam, met accolades
```

Routebestanden gebruiken altijd een **default export** voor de component.

---

## 2. JSX-regels

| Regel | Voorbeeld |
|---|---|
| `className` in plaats van `class` | `<div className="card">` |
| `htmlFor` in plaats van `for` | `<label htmlFor="width">` |
| attributen in camelCase | `onClick`, `defaultValue`, `formAction`, `strokeWidth` |
| JavaScript tussen accolades | `<p>{box.width}mm</p>` |
| één root-element per component | wikkel in `<div>` of `<>…</>` |
| tags altijd sluiten | `<input />`, `<br />` |
| commentaar in JSX | `{/* zo */}` |

### Fragment

Als je meerdere elementen wilt teruggeven zonder extra `<div>`:

```jsx
<>
  <button>Save box</button>
  <button>Save as new</button>
</>
```

### Speciale tekens

`'` in tekst geeft een lint-fout. Schrijf `&apos;` of gebruik accolades:

```jsx
<p>You haven&apos;t created any boxes yet.</p>
<p>{"You haven't created any boxes yet."}</p>
```

---

## 3. Props

Data die van boven naar beneden gaat.

```jsx
// doorgeven
<BoxCard box={box} showEdit={true} onSave={handleSave} />

// aannemen, met destructuring
const BoxCard = ({ box, showEdit, onSave }) => { … };

// of alles ineens
const BoxCard = (props) => { props.box; };
```

Uitpakken kun je stapelen:

```jsx
const BoxCard = ({ box }) => {
  const { id, width, height, depth } = box;
};
```

Hernoemen tijdens uitpakken:

```jsx
const { box: loadedBox } = useLoaderData();
```

Dat is handig als de naam al bezet is — bijvoorbeeld omdat je de geladen doos in
state wilt stoppen die óók `box` heet.

Standaardwaarde:

```jsx
const BoxForm = ({ submitLabel = "Save" }) => { … };
```

**Props gaan één kant op.** Wil een kind iets veranderen dat de ouder bezit, dan
geeft de ouder een functie mee (`setBox`, `onChange`) die het kind aanroept.

---

## 4. State met `useState`

State is data die verandert en waarbij het scherm mee moet veranderen.

```jsx
import { useState } from "react";

const [query, setQuery] = useState("");        // beginwaarde ""
const [box, setBox] = useState(defaultBox);    // beginwaarde een object
const [open, setOpen] = useState(null);
```

### De regels

**1. Nooit rechtstreeks aanpassen.** Maak een nieuw object of een nieuwe array.

```jsx
box.width = 300;                                   // ❌ React ziet dit niet
setBox({ ...box, width: 300 });                    // ✅
```

**2. Bij afhankelijkheid van de vorige waarde: de functievorm.**

```jsx
setBox((prev) => ({ ...prev, width: prev.width + 10 }));
```

Dit is veiliger dan `setBox({ ...box, … })`, want je krijgt gegarandeerd de meest
recente waarde.

**3. De beginwaarde geldt alleen de eerste keer.**

```jsx
const [box, setBox] = useState(loadedBox);
```

Verandert `loadedBox` later, dan verandert `box` niet mee. In de oefeningen is dat
precies wat je wilt: de doos wordt één keer geladen en daarna bewerk je hem lokaal.

**4. Hooks staan altijd bovenaan de component.** Nooit in een `if`, een lus of een
geneste functie.

### Een sleutel dynamisch zetten

```jsx
const handleChange = (key, e) => {
  setBox((prev) => ({ ...prev, [key]: e.target.value }));
};

handleChange("width", e);   // → { ...prev, width: … }
```

De vierkante haken maken van de *waarde* van `key` de sleutel. Zo kun je met één
functie alle velden van een formulier afhandelen.

---

## 5. Controlled inputs

Dit is het onderwerp waar in oefening 2 de meeste punten zaten.

### Uncontrolled — de browser beheert de waarde

```jsx
<input name="date" defaultValue={session.date} />
```

React kijkt niet mee terwijl je typt. Je leest de waarde pas bij het verzenden, uit
de `formData`. Gebruik dit als standaard.

### Controlled — React beheert de waarde

```jsx
<input
  name="width"
  value={box.width}
  onChange={(e) => setBox({ ...box, width: parseInt(e.target.value, 10) || 0 })}
/>
```

Elke toets gaat door React heen. Nodig zodra iets anders op het scherm moet
meebewegen — een preview, een berekend totaal, een teller.

### Vergelijking

| | uncontrolled | controlled |
|---|---|---|
| attribuut | `defaultValue` | `value` + `onChange` |
| waarde staat in | de DOM | React-state |
| live meekijken | nee | ja |
| gebruik | gewoon opslaanformulier | live preview, validatie tijdens typen |

⚠️ `value` zonder `onChange` bevriest het veld. Je kunt dan niets meer typen.

### Per veldtype

```jsx
// tekst en getal
<input type="number" value={box.width} onChange={(e) => …e.target.value} />

// checkbox — checked, niet value; en e.target.checked
<input type="checkbox" checked={box.handles} onChange={(e) => …e.target.checked} />

// select — value op de select zelf, niet op de option
<select value={box.thickness} onChange={(e) => …}>
  <option value="1">1 mm</option>
</select>

// textarea — value als prop, geen kind
<textarea value={notes} onChange={(e) => …} />
```

### Getallen

`e.target.value` is altijd een string. Voor rekenwerk converteren:

```jsx
parseInt(e.target.value, 10) || 0
```

De `|| 0` vangt het lege veld op: `parseInt("")` is `NaN`, en met `NaN` gaat de
rest van je scherm rekenen op onzin.

---

## 6. State optillen

Twee componenten die dezelfde data nodig hebben, krijgen die van hun gemeenschappelijke
ouder. Dat heet *lifting state up*.

In oefening 2 stonden het formulier en de preview naast elkaar:

```jsx
// newBox.jsx — de ouder bezit de state
const NewBox = () => {
  const [box, setBox] = useState(defaultBox);

  return (
    <>
      <BoxForm box={box} setBox={setBox} />       {/* mag wijzigen */}
      <BoxVisualizer box={box} />                 {/* mag alleen tonen */}
      <p>Width: {box.width}mm</p>
    </>
  );
};
```

`BoxForm` bezit niets. Hij krijgt de doos en de setter, en geeft wijzigingen door
naar boven. Daardoor kan hij ongewijzigd hergebruikt worden voor het nieuwe én het
bewerkscherm.

Zou de state in `BoxForm` staan, dan zou de preview er niet bij kunnen.

---

## 7. Voorwaardelijk renderen

### Ternary — kies tussen twee dingen

```jsx
{boxes.length === 0 ? <EmptyState /> : <BoxGrid boxes={boxes} />}
{isOwnProfile ? "Your Sessions" : "Recent Sessions"}
```

### `&&` — toon of toon niet

```jsx
{session.notes && <p>{session.notes}</p>}
{!isDepthSufficient && <span className="hint">Minimaal 150mm</span>}
```

⚠️ Val: met een getal links van `&&` kan er een `0` op het scherm belanden.

```jsx
{boxes.length && <List />}          // ❌ toont "0" bij een lege lijst
{boxes.length > 0 && <List />}      // ✅
```

### Vroeg teruggeven

Voor grote verschillen is een aparte return leesbaarder:

```jsx
if (feedSessions.length === 0) {
  return <EmptyState testId="empty-feed" />;
}

return <div className="feed">…</div>;
```

### Voorwaardelijke class

```jsx
<label className={isDepthSufficient ? "" : "label--disabled"}>
<button className={`btn ${isActive ? "btn--on" : ""}`}>
```

---

## 8. Lijsten

```jsx
{boxes.map((box) => (
  <BoxCard key={box.id} box={box} />
))}
```

**`key` is verplicht** en moet uniek en stabiel zijn. Gebruik het id uit de database.
De index van de array is een noodoplossing en gaat mis zodra de lijst van volgorde
verandert.

Handige array-methodes:

```jsx
users.filter((u) => u.id !== currentUserId)          // eruit gooien
follows.map((f) => f.followingId)                    // omvormen
sessions.find((s) => s.id === id)                    // eerste treffer
users.some((u) => u.name === "Alex")                 // ja/nee
[...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))
```

`sort` past de originele array aan, daarom eerst kopiëren met `[...array]`.

Snel opzoeken in een grote lijst gaat met een `Set`:

```jsx
const followingIds = new Set(follows.map((f) => f.followingId));
followingIds.has(user.id);        // true of false
```

---

## 9. Events

```jsx
<button onClick={() => navigate(-1)}>Terug</button>
<button onClick={handleClick}>Terug</button>          // functie, niet aanroepen
<button onClick={handleClick()}>Terug</button>        // ❌ draait meteen bij renderen
```

Het event-object:

```jsx
const handleChange = (e) => {
  e.target.value;      // tekst, getal, select
  e.target.checked;    // checkbox
  e.key;               // "ArrowUp", "Enter", …
  e.shiftKey;          // true als Shift ingedrukt is
  e.preventDefault();  // voorkom het standaardgedrag van de browser
};
```

Voorbeeld uit oefening 2 — Shift + pijltje verandert met 10 in plaats van 1:

```jsx
const handleKeyDown = (dimension, e) => {
  if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
    e.preventDefault();     // anders telt de browser er óók nog 1 bij
    const delta = e.key === "ArrowUp" ? 10 : -10;
    setBox((prev) => ({ ...prev, [dimension]: Math.max(10, prev[dimension] + delta) }));
  }
};
```

Zonder `preventDefault` gebeuren beide dingen: jouw +10 én de browser-eigen +1.

---

## 10. `useEffect` — en waarom je hem hier bijna niet nodig hebt

`useEffect` draait code ná het renderen. Het klassieke gebruik is data ophalen:

```jsx
useEffect(() => {
  fetch("/api/boxes").then(r => r.json()).then(setBoxes);
}, []);
```

**In deze opdrachten is dat fout.** Data ophalen doe je in de loader. Die draait
vóór het renderen, kent geen laadflikkering en wordt automatisch ververst na een
action. Zie je jezelf `useEffect` schrijven om te fetchen, dan zit je op het
verkeerde spoor.

Legitiem gebruik zou zijn: focus zetten op een veld, een timer starten, naar een
event op `window` luisteren. Dat kwam in beide oefeningen niet voor.

---

## 11. Moderne JavaScript die je constant gebruikt

```jsx
// spread — kopiëren en overschrijven
const nieuw = { ...box, width: 300 };
const lijst = [currentUserId, ...ids];

// destructuring
const { width, height } = box;
const [eerste, tweede] = array;

// optional chaining — stopt bij undefined in plaats van te crashen
user?.id
follow?.id ?? null

// nullish coalescing — alleen bij null of undefined
params.userId ?? currentUserId
// let op het verschil met ||, dat ook bij 0 en "" inspringt

// template literals
`/boxes/${box.id}`
`${width}×${height}×${depth}`

// ternary
const titel = isOwn ? "Jouw sessies" : "Recente sessies";

// pijlfuncties
const verdubbel = (x) => x * 2;
const maakBox = (w) => ({ width: w });     // object teruggeven → haakjes eromheen
```

### Strings versus getallen

```jsx
"1" === 1        // false ⚠️
"1" == 1         // true, maar gebruik == niet
Number("1")      // 1
parseInt("1", 10)  // 1
String(1)        // "1"
```

Id's uit een URL zijn strings. Id's uit een JSON-database kunnen strings óf getallen
zijn — kijk het na in `db.json` of in de testdata voordat je met `===` vergelijkt.
In oefening 1 waren het strings (`"1"`), in oefening 2 getallen (`1`).
