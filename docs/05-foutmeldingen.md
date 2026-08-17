# 05 — Foutmeldingen en symptomen

Van wat je ziet naar wat er aan de hand is. Zoek eerst in de eerste tabel op de
letterlijke tekst; staat hij er niet, kijk dan bij de symptomen zonder foutmelding.

---

## 1. Foutmeldingen in de browserconsole

| Melding | Oorzaak | Oplossing |
|---|---|---|
| `Cannot destructure property 'x' of '{}' as it is undefined` | de component leest data die er niet is, meestal `const { x } = {}` in de startcode | schrijf de `clientLoader` en gebruik `useLoaderData()` |
| `Cannot read properties of undefined (reading 'name')` | je leest een veld van iets dat `undefined` is | check of de loader dat veld teruggeeft; gebruik de service mét embeds |
| `X is not defined` | import vergeten | voeg de import bovenaan toe, bijvoorbeeld `import { Link } from "react-router"` |
| `X is not a function` | verkeerde import of typefout in de naam | vergelijk letterlijk met de export in `services/` |
| `Objects are not valid as a React child` | je zet een object in JSX | kies een veld: `{user.name}` in plaats van `{user}` |
| `Each child in a list should have a unique "key" prop` | `key` ontbreekt bij een `map` | `key={item.id}` |
| `Rendered more hooks than during the previous render` | een hook staat in een `if` of een lus | zet alle hooks bovenaan de component |
| `A component is changing an uncontrolled input to be controlled` | `value` gaat van `undefined` naar een waarde | geef altijd een beginwaarde: `value={box.width ?? ""}` |
| `useNavigate() may be used only in the context of a Router` | je gebruikt de hook buiten de app, of in een loader | hooks alleen in componenten |
| `redirect is not defined` | import vergeten | `import { redirect } from "react-router"` |
| `Failed to fetch` / `net::ERR_CONNECTION_REFUSED` | backend draait niet | `cd server && npm start` |
| `404 (Not Found)` op een fetch | verkeerde URL of verkeerd id | kijk in het netwerktabblad naar de volledige URL |
| `Unexpected token '<' ... is not valid JSON` | de server stuurt HTML terug, meestal een 404-pagina | zelfde als hierboven |
| `import.meta.env.VITE_API_BASE_URL is undefined` | `.env` ontbreekt of de naam begint niet met `VITE_` | maak `.env` aan en herstart de dev-server |

---

## 2. Symptomen zonder foutmelding

Dit zijn de duurste, want er is niets om op te zoeken.

| Symptoom | Oorzaak | Oplossing |
|---|---|---|
| Pagina blijft leeg, header en navbar staan er wel | `<Outlet />` ontbreekt in de layout | zet `<Outlet />` in de `<main>` |
| Een component tekent niets | pijlfunctie met accolades zonder `return` | `const X = () => { return <div/>; }` |
| Formulier verstuurt, er gebeurt niets | `<form>` in plaats van `<Form>` | hoofdletter F, import uit `react-router` |
| Action wordt niet aangeroepen | `loader`/`action` in plaats van `clientLoader`/`clientAction` bij `ssr: false` | zet `client` ervoor |
| Action draait, maar de pagina navigeert niet | `return` vergeten voor `redirect()` | `return redirect("/")` |
| Lijst ververst niet na opslaan | de action geeft niets terug | `return null` of `return redirect(...)` |
| Je kunt niets typen in een veld | `value` zonder `onChange` | voeg `onChange` toe, of gebruik `defaultValue` |
| Preview beweegt niet mee | state staat in het formulier in plaats van in de route | til de state op naar de ouder |
| Formulier is leeg terwijl er data is | `value` gebruikt waar `defaultValue` hoort, of de loader levert niets | controleer beide |
| Lijst is leeg terwijl er records zijn | id's vergeleken als string tegen getal | kijk in `db.json` welk type het is |
| `params.id` is `undefined` | de naam komt niet overeen met `routes.js` | gebruik exact `:sessionId` → `params.sessionId` |
| Getallen komen als tekst in de database | `Number(...)` of `parseInt(...)` vergeten | converteer in de action |
| Checkbox komt altijd als `false` binnen | vergeleken met `true` in plaats van `"on"` | `formData.get("x") === "on"` |
| Een veld ontbreekt in de `formData` | het veld is `disabled`, of heeft geen `name` | geef het een `name` en zet `disabled` uit |
| Navigatiebalk licht overal op | `end` ontbreekt op `<NavLink to="/">` | voeg `end` toe |
| Er verschijnt een `0` op het scherm | `{lijst.length && …}` | `{lijst.length > 0 && …}` |
| Waarde springt met 11 in plaats van 10 | `e.preventDefault()` ontbreekt bij een pijltoets | voeg hem toe |
| Cancel-knop verstuurt het formulier | `type="button"` ontbreekt | binnen een `<Form>` is `type="submit"` de standaard |

---

## 3. Testfouten van Playwright

| Melding | Betekenis | Oplossing |
|---|---|---|
| `Full page reload detected` / `Cannot accept a page refresh` | ergens staat nog een `<a href>` of `<form>` | zoek op `<a href` en `<form ` in `app/` |
| `strict mode violation: locator resolved to N elements` | de zoekterm past op meerdere elementen | maak de tekst of het testid unieker; dit betekent meestal dat je iets dubbel rendert |
| `expected visible, received hidden` | het element bestaat niet of staat er niet | controleer of je voorwaarde klopt |
| `Timed out 5000ms waiting for expect(locator)` | het element komt nooit | staat de loader wel data terug te geven? kijk in de trace |
| `toHaveValue` faalt met lege string | input heeft geen `value` of `defaultValue` | vul het in vanuit de loader of de state |
| `toHaveCount` klopt niet | er wordt te veel of te weinig gerenderd | controleer je filter |
| `expect(page).toHaveURL` faalt | verkeerde redirect | controleer het pad in `redirect(...)` |
| Tests hangen op poort 5174 | er draait nog een oude dev-server | sluit die af, of gebruik `reuseExistingServer` |

### Hoe je een falende test leest

1. Lees de testnaam. Die zegt wat er hoort te gebeuren.
2. Lees de laatste `await expect(...)` vóór de fout. Dat is het punt waar het misging.
3. Kijk welke locator gebruikt wordt: `getByTestId`, `getByRole`, `getByLabel`.
   Zoek dat testid of die tekst in je code — bestaat het?
4. Draai `npm run test:ui` en spoel terug tot dat moment. Je ziet dan de DOM zoals
   Playwright hem zag.

### Wat de locators betekenen

| Locator | Zoekt naar |
|---|---|
| `getByTestId("feed")` | `data-testid="feed"` |
| `getByRole("link", { name: "Edit" })` | een `<a>` waarvan de tekst "Edit" bevat |
| `getByRole("button", { name: /save/i })` | een `<button>`, hoofdletterongevoelig |
| `getByRole("spinbutton", …)` | `<input type="number">` |
| `getByRole("searchbox")` | `<input type="search">` |
| `getByRole("checkbox", …)` | `<input type="checkbox">` |
| `getByLabel("Date")` | een veld waarvan het `<label htmlFor>` "Date" is |
| `getByText("Category A")` | een element met die tekst |

De naam bij `getByRole` is standaard een **deel** van de toegankelijke naam, niet het
geheel. Bij een link is dat alle tekst binnen de link achter elkaar geplakt.

---

## 4. ESLint

| Melding | Oplossing |
|---|---|
| `'x' is defined but never used` | verwijder de import of de variabele |
| `react/no-unescaped-entities` | `'` vervangen door `&apos;` |
| `react-hooks/rules-of-hooks` | hooks staan niet bovenaan de component |
| `react-hooks/exhaustive-deps` | dependency-array van een `useEffect` klopt niet |
| `react/prop-types` | meestal uitgeschakeld in deze projecten; anders negeerbaar |

---

## 5. Vaste debugroutine

Loop dit af, in deze volgorde. Meestal ben je er binnen twee stappen.

**1. Wat zegt de console?** Rode fout → tabel 1 hierboven.

**2. Komt de data binnen?**

```jsx
export async function clientLoader() {
  const boxes = await getAllBoxes();
  console.log("loader boxes:", boxes);
  return { boxes };
}
```

Zie je niets in de console, dan draait je loader niet. Controleer de naam
(`clientLoader`) en of het bestand echt aan die route hangt in `routes.js`.

**3. Wat gebeurt er op het netwerk?** Open het netwerktabblad, ververs, en kijk:

- wordt de call gedaan?
- klopt de volledige URL, inclusief queryparameters?
- wat is de statuscode?
- wat staat er in de response?

**4. Wat krijgt de component?**

```jsx
const data = useLoaderData();
console.log("component data:", data);
```

**5. Vergelijk met een scherm dat werkt.** Alle schermen in deze opdrachten volgen
hetzelfde patroon. Zet de twee bestanden naast elkaar en zoek het verschil.
