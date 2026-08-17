# Box Configurator — uitgewerkt, met uitleg per stap

De opdracht is volledig af. Alle 14 tests slagen, ESLint geeft geen fouten.
Dit document loopt in 8 stappen door wat er gebouwd is en waarom.

---

## Wat er nu klaar staat

| | |
|---|---|
| Locatie | `oefening2/development/client` |
| Tests | 14/14 groen (chromium), 4× na elkaar gedraaid |
| ESLint | geen fouten |
| Aangepaste bestanden | 7 |
| Niet aangeraakt | `routes.js`, `root.jsx`, alle CSS, `utils/`, `services/`, `tests/`, `server/` |

---

## Starten

`node_modules` staat er nog niet in, dus de eerste keer:

```bash
cd oefening2/development/client
npm install

cd ../server
npm install
```

Daarna, twee terminals:

```bash
# terminal 1 — backend
cd oefening2/development/server
npm start                  # json-server op http://localhost:3000
```

```bash
# terminal 2 — frontend
cd oefening2/development/client
npm run dev                # app op http://localhost:5173
```

De tests draaien los daarvan (die mocken de backend zelf):

```bash
cd oefening2/development/client
npm run test:chrome        # snelste
npm run test:ui            # visuele runner
```

`.env` staat er al in en wijst naar `http://localhost:3000`.

---

## Wat deze opdracht anders maakt dan oefening 1

Oefening 1 ging bijna volledig over React Router: loaders, actions, `Link`, `Form`.
Die dingen komen hier ook terug, maar er zit een tweede laag bovenop: **echte React**.

Het nieuwe scherm heeft een live preview. Terwijl je in het formulier typt, tekent
de 3D-doos ernaast zich meteen opnieuw en verandert de tekst "Width: 200mm". Dat kan
niet met een formulier dat pas bij het versturen iets doet — daar heb je React-state
voor nodig die het formulier én de preview aanstuurt.

Dus twee mechanismen naast elkaar:

- **React Router** zorgt voor het laden en opslaan (loader, action, redirect).
- **React state** zorgt voor wat er gebeurt terwijl je aan het typen bent.

Ze bijten elkaar niet. De inputs hebben nog steeds een `name`, dus als je op
verzenden klikt, verzamelt de browser gewoon alle waarden en krijgt de action ze
via `formData`.

---

## De begrippen die je nodig hebt

**`clientLoader`** — haalt data op vóór het scherm getekend wordt. Returnt een object,
het scherm leest het met `useLoaderData()`. In `react-router.config.ts` staat
`ssr: false`, daarom `clientLoader` en niet `loader`.

**`clientAction`** — draait bij het versturen van een `<Form>`. Schrijft weg en
returnt daarna `redirect(...)` of iets anders. Daarna verversen alle loaders vanzelf.

**Controlled input** — een `<input>` met `value={...}` plus `onChange`. React bepaalt
wat er in het veld staat. Dat is wat je nodig hebt als iets anders op het scherm
moet meebewegen met wat je typt.

> In oefening 1 stond bij het editformulier `defaultValue=` in plaats van `value=`.
> Dat is een *uncontrolled* input: de browser beheert de waarde en React kijkt niet mee.
> Prima als je alleen bij het versturen de waarde nodig hebt. Hier kan dat niet, want
> de preview moet bij elke toetsaanslag mee veranderen.

**State optillen** — de `box`-state staat niet in `BoxForm`, maar in de route
(`newBox.jsx` / `editBox.jsx`). Reden: de preview staat *náást* het formulier, en
twee componenten die dezelfde data nodig hebben, moeten die van hun gemeenschappelijke
ouder krijgen. De route geeft `box` en `setBox` als props door.

**`formAction`** — een submit-knop mag zeggen naar welke route hij het formulier
stuurt, los van waar het formulier zelf naartoe wijst. Daarmee kunnen twee knoppen
in hetzelfde formulier twee verschillende dingen doen.

---

## Stap 1 — `app/routes/home.jsx`

De lijst met alle dozen.

**Wat er mis was:** de component kreeg de dozen als prop (`({box})`) terwijl niemand
die prop doorgaf, en de `EmptyState`-component had geen `return` — die gaf dus altijd
`undefined` terug en werd nergens gebruikt.

```jsx
import { Link, useLoaderData } from "react-router";
import BoxCard from "../components/BoxCard/BoxCard";
import { getAllBoxes } from "../services/boxService";
import "./home.css";

export const clientLoader = async () => {
  const boxes = await getAllBoxes();
  return { boxes };
};

const EmptyState = () => {
  return (
    <div className="empty-state">
      <p>You haven&apos;t created any boxes yet.</p>
      <Link to="/boxes/new" className="button button-secondary">
        Create Your First Box
      </Link>
    </div>
  );
};

const HomePage = () => {
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
        <EmptyState />
      ) : (
        <div className="box-grid">
          {boxes.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      )}
    </div>
  );
};
```

Een pijlfunctie met accolades heeft een expliciete `return` nodig. Zonder die
`return` geeft `EmptyState` niets terug en rendert React niets — geen foutmelding,
gewoon een lege plek. Dat soort fouten kost je op een examen het meeste tijd, omdat
er niets ontploft.

De header blijft altijd staan, ook als de lijst leeg is. Dat is bewust: de test
controleert dat `h1` "Box Configurator" bevat én dat `.empty-state` zichtbaar is.

`boxes.map(...)` heeft een `key` nodig zodat React weet welke kaart bij welke doos
hoort als de lijst verandert.

---

## Stap 2 — `app/components/BoxCard/BoxCard.jsx`

Eén kaart in de lijst.

**Wat er mis was:** het component gebruikte `<Link>` maar importeerde het niet. Dat
geeft meteen een crash: "Link is not defined".

```jsx
import { Link } from "react-router";
import BoxVisualizer from "../BoxVisualizer/BoxVisualizer";
import "./BoxCard.css";

const BoxCard = ({ box }) => {
  const { id, width, height, depth, thickness, includeDragHandles } = box;
  const dimensionsString = `${width}×${height}×${depth}`;

  return (
    <Link to={`/boxes/${id}`} className="box-card" id={`box-${id}`}>
      …
      <BoxVisualizer box={box} />
      …
    </Link>
  );
};
```

Verder ongewijzigd. De hele kaart is één grote link naar het detailscherm.

De tests zoeken deze kaarten op via hun toegankelijke naam: alle tekst binnen de
link achter elkaar, dus "Box #1 100×100×80 Thickness: 5mm". Daarom moeten die drie
regels tekst in die volgorde blijven staan.

---

## Stap 3 — `app/components/BoxVisualizer/BoxVisualizer.jsx`

De SVG-tekening van de doos. 470 regels wiskunde die je niet hoeft te begrijpen.

**Wat er mis was:** precies één regel. De component nam geen props aan, maar gebruikte
op regel 4 wel een variabele `box`.

```jsx
const BoxVisualizer = ({ box }) => {          // was: const BoxVisualizer = () => {
  const { width, height, depth, thickness, includeDragHandles } = box;
```

Meer niet. De rest van het bestand werkte al.

Twee dingen die dit component zelf al regelt, en waar je dus niks voor hoeft te doen:

- De handvatten worden alleen getekend als `includeDragHandles` aan staat **én**
  `depth >= 150`. Zet je de diepte later terug naar 100, dan verdwijnen ze vanzelf.
- Alles schaalt automatisch naar de grootste afmeting, dus de doos past altijd in beeld.

---

## Stap 4 — `app/routes/detailBox.jsx`

Eén doos in detail.

**Wat er mis was:** bovenaan stond `import box from "../routes/editBox";`. Dat haalde
de *component* van de editpagina binnen en noemde die `box`. Nergens werd de echte
doos opgehaald.

```jsx
import { Link, useLoaderData } from "react-router";
import BoxVisualizer from "../components/BoxVisualizer/BoxVisualizer";
import { getBoxById } from "../services/boxService";
import "./detailBox.css";

export const clientLoader = async ({ params }) => {
  const box = await getBoxById(params.id);
  return { box };
};

const DetailBoxPage = () => {
  const { box } = useLoaderData();

  const formattedDate = box.createdAt
    ? new Date(box.createdAt).toLocaleString("en-GB", { … })
    : "-";
  …
};
```

`params.id` komt uit de routetabel: `route("/boxes/:id", "routes/detailBox.jsx")`.
De naam achter de dubbele punt is de naam die je in `params` terugkrijgt.

De datum kreeg een controle erbij. Dozen die via `addBox` zijn aangemaakt hebben een
`createdAt`, maar de dozen uit de testdata niet. Zonder controle staat er dan
"Invalid Date" op het scherm. Nu staat er een streepje.

De rest van het scherm — afmetingen, volume, oppervlakte — was al af en rekent
gewoon met de velden van `box`.

---

## Stap 5 — `app/components/BoxForm/BoxForm.jsx`

Het formulier. Dit is het grootste stuk werk, en het wordt door twee schermen gebruikt.

**Wat er mis was:** het component gebruikte `box` en `setBox` zonder ze te krijgen of
te maken, de inputs hadden geen `value`, de checkbox-regel voor de handvatten was
uitgecommentarieerd, en de twee opslaan-knoppen deden allebei hetzelfde.

### De props

```jsx
const BoxForm = ({ box, setBox }) => {
```

De doos en de setter komen van de route. Zo blijft `BoxForm` zelf dom: hij toont wat
hij krijgt en geeft wijzigingen door naar boven.

### Waarden wijzigen

```jsx
const handleBoxValueChange = (key, e) => {
  const value =
    key === "includeDragHandles"
      ? e.target.checked
      : parseInt(e.target.value, 10) || 0;

  setBox((prev) => ({ ...prev, [key]: value }));
};
```

Eén functie voor alle velden. `key` is de naam van het veld dat verandert.

`[key]` tussen vierkante haken is een *computed property*: de sleutel wordt bepaald
door de waarde van de variabele. `handleBoxValueChange("width", e)` levert dus
`{ ...prev, width: 205 }`.

`e.target.checked` voor een checkbox, `e.target.value` voor de rest. Dat laatste is
altijd een string, vandaar `parseInt`. De `|| 0` erachter vangt het geval op waarin
je het veld leegmaakt: `parseInt("")` is `NaN`, en met `NaN` kan de tekening niet rekenen.

`setBox((prev) => ...)` in plaats van `setBox({...box, ...})`: je krijgt de meest
recente state mee, ook als er net iets anders veranderd is.

### Shift + pijltje

```jsx
const handleKeyDown = (dimension, e) => {
  if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
    e.preventDefault();
    …
    setBox((prev) => ({ ...prev, [dimension]: newValue }));
  }
};
```

Deze functie stond er al. Ze doet alleen iets als Shift ingedrukt is; een gewoon
pijltje omhoog laat de browser zelf afhandelen (die telt er dan 1 bij op en dat komt
via `onChange` alsnog in de state terecht).

`e.preventDefault()` voorkomt dat de browser er óók nog 1 bij optelt bovenop jouw 10.

### De regel voor de handvatten

```jsx
const isDepthSufficient = box.depth >= 150;
```

```jsx
<input
  type="checkbox"
  id="dragHandlesToggle"
  name="includeDragHandles"
  checked={box.includeDragHandles}
  disabled={!isDepthSufficient}
  onChange={(e) => handleBoxValueChange("includeDragHandles", e)}
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

Drie dingen hangen aan diezelfde ene boolean: de checkbox gaat op slot, het label
wordt grijs, en de uitlegtekst verschijnt.

`{voorwaarde && <span>…</span>}` betekent: alleen tonen als de voorwaarde waar is.
Is ze onwaar, dan staat de tekst niet in de HTML — dat is wat de test controleert.

De grijze class was in de startcode hardcoded (`className={"checkbox-label--disabled"}`),
dus het label was altijd grijs, ook als je gewoon kon klikken.

### De inputs zelf

Alle drie de maatvelden zien er zo uit:

```jsx
<input
  type="number"
  id="widthInput"
  name="width"
  value={box.width}
  onChange={(e) => handleBoxValueChange("width", e)}
  onKeyDown={(e) => handleKeyDown("width", e)}
  min="10"
  max="1000"
  required
/>
```

`value` + `onChange` samen maken het een controlled input. Zet je alleen `value`
zonder `onChange`, dan kun je niets meer typen — het veld springt bij elke toets
terug naar de waarde uit de state.

`name="width"` blijft nodig, want daarmee komt het veld straks in `formData` terecht.

De thickness-select werkt net zo, met `value={box.thickness}`.

### De twee opslaan-knoppen

```jsx
<div className="form-actions">
  {box.id ? (
    <>
      <button type="submit" className="button button-primary">
        Save box
      </button>
      <button
        type="submit"
        className="button button-success"
        formAction="/boxes/new"
      >
        Save as new
      </button>
    </>
  ) : (
    <button type="submit" className="button button-primary">
      Create new box
    </button>
  )}
</div>
```

`box.id` bestaat alleen bij een bestaande doos. Nieuwe doos → één knop "Create new box".
Bestaande doos → twee knoppen.

De truc zit in `formAction`. Het formulier zelf staat op `/boxes/edit/1`, dus
"Save box" gaat naar de `clientAction` van `editBox.jsx` en die doet een update.
De knop "Save as new" zegt met `formAction="/boxes/new"`: stuur mij naar de action
van het *nieuwe-doos*-scherm. Die doet een `addBox` en er ontstaat een tweede doos,
terwijl de originele ongewijzigd blijft.

Zo krijg je twee verschillende bewerkingen uit één formulier, zonder verborgen velden
of if-jes in de action. Dit is de hint uit de README.

---

## Stap 6 — `app/routes/newBox.jsx`

Nieuwe doos maken, met live preview ernaast.

**Wat er mis was:** drie imports die niet bestaan (`{ formData }` uit een map,
`{ box }` uit `react-router`), een action die `formData` nooit uitleest en niets
opslaat, en een `box` in de JSX die nergens vandaan komt.

```jsx
import { useState } from "react";
import { Link, redirect } from "react-router";
import BoxForm from "../components/BoxForm/BoxForm";
import BoxVisualizer from "../components/BoxVisualizer/BoxVisualizer";
import { addBox } from "../services/boxService";
import { defaultBox } from "../utils";
import "./newBox.css";

export const clientAction = async ({ request }) => {
  const formData = await request.formData();

  const box = {
    width: parseInt(formData.get("width"), 10),
    height: parseInt(formData.get("height"), 10),
    depth: parseInt(formData.get("depth"), 10),
    thickness: parseInt(formData.get("thickness"), 10),
    includeDragHandles: formData.get("includeDragHandles") === "on",
  };

  try {
    await addBox(box);
    return redirect("/");
  } catch (error) {
    console.error("Error creating box:", error);
    return { error: error.message };
  }
};

const NewBox = () => {
  const [box, setBox] = useState(defaultBox);

  return (
    …
    <BoxForm box={box} setBox={setBox} />
    …
    <BoxVisualizer box={box} />

    <div className="dimensions-display">
      <p>Width: {box.width}mm</p>
      <p>Height: {box.height}mm</p>
      <p>Depth: {box.depth}mm</p>
      <p>Thickness: {box.thickness}mm</p>
    </div>
  );
};
```

`formData` komt uit `await request.formData()`, niet uit een import. In de startcode
stond `import { formData } from "../components/BoxForm"` — dat bestaat niet.

`useState(defaultBox)` vult het formulier meteen met 200 × 150 × 180, dikte 3.
Die waarden staan in `app/utils/index.js` en de tests rekenen erop.

Eén `box` in state voedt drie dingen tegelijk: het formulier, de tekening en het
lijstje afmetingen. Typ je iets, dan verandert de state en tekenen alle drie zich
opnieuw. Dat is de hele live preview.

`formData.get()` geeft strings, dus `parseInt` rond elke maat.

Een checkbox stuurt alleen iets mee als hij aangevinkt is, en dan is de waarde `"on"`.
Vandaar `formData.get("includeDragHandles") === "on"` — staat hij uit, dan is de
waarde `null` en wordt het `false`.

`return redirect("/")` stuurt je na het opslaan naar de lijst. Daar draait de loader
van de homepagina opnieuw, dus de nieuwe doos staat er meteen bij.

---

## Stap 7 — `app/routes/editBox.jsx`

Bestaande doos bewerken. Combineert alles uit stap 4 en stap 6.

```jsx
export const clientLoader = async ({ params }) => {
  const box = await getBoxById(params.id);
  return { box };
};

export const clientAction = async ({ request, params }) => {
  const formData = await request.formData();

  const box = { width: …, height: …, depth: …, thickness: …, includeDragHandles: … };

  try {
    await updateBox(params.id, box);
    return redirect("/");
  } catch (error) {
    console.error("Error updating box:", error);
    return { error: error.message };
  }
};

const EditBoxPage = () => {
  const { box: loadedBox } = useLoaderData();
  const [box, setBox] = useState(loadedBox);
  …
};
```

`const { box: loadedBox } = useLoaderData()` hernoemt bij het uitpakken. Zo botst de
doos uit de loader niet met de doos in de state.

`useState(loadedBox)` gebruikt de geladen doos als startwaarde. Vanaf dat moment leeft
de state los van de loader: jij past aan in het formulier, de preview volgt, en pas
bij het versturen gaat het naar de server.

`updateBox(params.id, box)` — het id komt uit de URL, want het staat niet in het
formulier. Na het opslaan ga je naar de lijst.

De Cancel-link gaat naar `/boxes/${box.id}`, dus terug naar het detailscherm.

---

## Stap 8 — Controle

```
14 passed
```

Vier keer na elkaar gedraaid, telkens groen. `npx eslint app` geeft nul waarschuwingen.

---

## Wat de 14 tests controleren

| Groep | Test | Waar het op steunt |
|---|---|---|
| General | homepagina toont titel | loader op `/` |
| General | lege staat bij nul dozen | `EmptyState` met `return` |
| Navigation | lijst toont beide dozen | `getAllBoxes` + `BoxCard` |
| Navigation | doorklikken naar detail | `Link` in `BoxCard` |
| Navigation | terug naar de lijst | "Back to List"-link |
| Navigation | naar nieuwe doos | "Create New Box"-link |
| Navigation | annuleren op nieuwe doos | Cancel-link naar `/` |
| Navigation | naar de editpagina | "Edit Box"-link |
| Navigation | annuleren op editpagina | Cancel-link naar `/boxes/:id` |
| Create | doos aanmaken | `clientAction` + `addBox` + `redirect("/")` |
| Create | preview loopt mee | state in de route + controlled inputs |
| Create | 150mm-regel voor handvatten | `isDepthSufficient` |
| Edit | doos bewerken | `updateBox(params.id, …)` |
| Edit | opslaan als nieuwe doos | `formAction="/boxes/new"` |

---

## Als er toch iets stukgaat

| Wat je ziet | Wat er aan de hand is |
|---|---|
| `Link is not defined` | import vergeten bovenaan het bestand |
| Component rendert niets, geen fout | pijlfunctie met accolades zonder `return` |
| `Cannot read properties of undefined` | prop niet doorgegeven, of loader ontbreekt |
| Je kunt niet typen in een veld | `value=` zonder `onChange` |
| Preview beweegt niet mee | state staat in `BoxForm` in plaats van in de route |
| Getallen worden strings in de database | `parseInt` vergeten rond `formData.get(...)` |
| Checkbox komt altijd als `false` binnen | vergelijken met `"on"`, niet met `true` |
| Test zegt "Cannot accept a page refresh" | ergens nog een `<a href>` of een `<form>` |
| Beide knoppen doen hetzelfde | `formAction` ontbreekt op "Save as new" |
| `fetch failed` | backend draait niet, of `.env` ontbreekt |

---

## De 7 gewijzigde bestanden

| Bestand | Wat er veranderde |
|---|---|
| `routes/home.jsx` | `clientLoader` met `getAllBoxes`, `EmptyState` met `return`, lijst-of-lege-staat |
| `components/BoxCard/BoxCard.jsx` | ontbrekende `Link`-import, `box` doorgeven aan de visualizer |
| `components/BoxVisualizer/BoxVisualizer.jsx` | `({ box })` als prop aannemen (één regel) |
| `routes/detailBox.jsx` | foute import weg, `clientLoader` met `params.id`, datum afgeschermd |
| `components/BoxForm/BoxForm.jsx` | props `box`/`setBox`, controlled inputs, 150mm-regel, twee knoppen met `formAction` |
| `routes/newBox.jsx` | foute imports weg, `useState(defaultBox)`, werkende `clientAction` met `addBox` |
| `routes/editBox.jsx` | `clientLoader`, state uit loaderdata, `clientAction` met `updateBox` |
