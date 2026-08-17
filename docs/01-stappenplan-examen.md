# 01 — Stappenplan examen

Van voorbereiding tot indienen. Volg dit als draaiboek.

---

## Deel A — Vooraf (vraagt internet, doe dit thuis)

Het examen zelf gaat zonder internet. Alles wat een download nodig heeft, moet
daarvóór gebeuren. Loop deze lijst een paar dagen op voorhand af, niet de avond ervoor.

### A1. Controleer je gereedschap

```bash
node -v      # 20 of hoger
npm -v
git --version
code -v      # VS Code
```

### A2. Zorg dat npm offline kan installeren

De examenopdracht komt als een map zonder `node_modules`. Zonder internet kan
`npm install` alleen slagen als de pakketten in je lokale npm-cache zitten.

```bash
# in een kopie van een oefening, mét internet:
cd client
npm install            # vult meteen je npm-cache

# controleer waar de cache staat
npm config get cache
```

Test daarna of het echt offline werkt:

```bash
rm -rf node_modules             # Windows: rmdir /s /q node_modules
npm install --offline
```

Slaagt dat, dan kun je op het examen `npm install --offline` doen. Slaagt het niet,
dan mis je pakketten in je cache — installeer dan eerst nog eens met internet.

> **Veiliger nog:** houd een map klaar met een volledig geïnstalleerde
> `node_modules` van een oefening. Heeft de examenopdracht dezelfde `package.json`,
> dan kun je die map gewoon kopiëren. Dat kost seconden in plaats van minuten.

### A3. Zorg dat Playwright kan draaien

`npx playwright install` downloadt browsers en heeft internet nodig. Doe dat vooraf:

```bash
npx playwright install chromium
```

De browsers komen in een cachemap buiten het project (op Windows onder
`%USERPROFILE%\AppData\Local\ms-playwright`), dus ze blijven beschikbaar voor elk
nieuw project.

Test daarna offline:

```bash
npm run test:chrome
```

### A4. Zet deze docs lokaal klaar

Deze map (`docs/`) hoort op je examenmachine te staan. Ook de twee `COACH-LOG.md`'s
en beide uitgewerkte oefeningen. Dat is je enige naslagwerk als er geen internet is.

### A5. Oefen de twee oefeningen opnieuw

Kopieer `start/` naar een lege map en los op zonder naar de uitwerking te kijken.
Doe dat minstens één keer per oefening. Wat je moet opzoeken, schrijf je op — dat
wordt jouw persoonlijke spiekbriefje bovenop hoofdstuk 07.

---

## Deel B — De eerste 15 minuten van het examen

Niet meteen beginnen typen. Deze kwartier verdient zichzelf dubbel terug.

### B1. Zet het draaiend (5 min)

```bash
cd server
npm install --offline
npm start                       # meestal json-server op poort 3000
```

```bash
cd client
npm install --offline
cp .env.example .env            # Windows: copy .env.example .env
npm run dev
```

Open de app in de browser. Waarschijnlijk crasht ze meteen — dat is normaal, dat is
de opdracht. Maar je weet nu dat je toolchain werkt.

Controleer `.env`: er moet iets in staan als

```
VITE_API_BASE_URL=http://localhost:3000
```

Test de backend los in de browser: `http://localhost:3000/boxes` of welke collectie
er ook is. Zie je JSON, dan staat je fundament goed.

### B2. Lees de README en bekijk het filmpje (5 min)

De README zegt per scherm welke data nodig is en geeft vaak letterlijk de code van
de loaders. Het filmpje toont hoe de app hoort te werken. Kijk er vooral naar
*wanneer* de pagina verandert, *wat* er live meebeweegt en *welke* knoppen er zijn.

Noteer voor jezelf per scherm: welke route, welke service-calls, welke knoppen.

### B3. Maak je to-do-lijst (5 min)

Zoek in VS Code (Ctrl+Shift+F) door de `app`-map naar deze patronen. Elk resultaat
is een taak:

| Zoek op | Betekent |
|---|---|
| `= {};` | hier hoort data uit een loader te komen |
| `<a href` | moet een `Link` of `NavLink` worden |
| `<form ` | moet een `Form` worden (hoofdletter F) |
| `// ...` of `/* onClick` | hier ontbreekt code |
| `TODO` | idem |
| `useState` | staat het er al, of moet het er komen? |

Open daarna deze drie bestanden en lees ze helemaal:

- `app/routes.js` — welke routes bestaan er en hoe heten de parameters
- `app/services/*.js` — welke functies mag je gebruiken, en wat geven ze terug
- `app/utils/index.js` — hulpfuncties en standaardwaarden die de tests gebruiken

Draai ten slotte één keer de tests om te zien waar je staat:

```bash
npm run test:chrome
```

Alles rood is prima. Je hebt nu een lijst van wat er moet gebeuren, in de taal van
de opdrachtgever.

---

## Deel C — De volgorde van werken

Werk van buiten naar binnen en van simpel naar complex. In beide oefeningen bleek
deze volgorde de snelste:

```
1. Layout            zonder <Outlet /> werkt geen enkel scherm
2. Navigatie         Link / NavLink, zodat je kunt doorklikken om te testen
3. Lijstscherm       de eenvoudigste loader
4. Detailscherm      leert je params en navigate(-1)
5. Aanmaakformulier  je eerste action
6. Bewerkformulier   action + eventuele beveiliging
7. Complexe schermen zoekvelden, fetchers, live previews
8. Losse <a> en <form> opruimen in de componenten
9. Tests draaien, lint draaien, opruimen
```

**Regel van één scherm tegelijk.** Maak één scherm helemaal af, draai zijn tests,
en ga dan pas verder. Vijf halve schermen levert nul punten op.

Als een testbestand per scherm is opgedeeld, draai dan gericht:

```bash
npx playwright test tests/01-feed.spec.js --project=chromium
```

---

## Deel D — Werkritme per scherm

Voor élk scherm doorloop je dezelfde vier vragen. Dit is het hart van het examen.

### D1. Welke data heeft dit scherm nodig?

Kijk naar de JSX. Elke variabele die de component gebruikt maar niet zelf maakt,
moet uit de loader komen.

```jsx
const { user, sessions, isOwnProfile } = useLoaderData();
```

Zoek in `services/` de functies die dat leveren. Sequentieel als de ene het
resultaat van de andere nodig heeft, `Promise.all` als ze onafhankelijk zijn.

```jsx
export async function clientLoader({ params }) {
  const [user, sessions] = await Promise.all([
    getUser(params.userId),
    getSessionsByUser(params.userId),
  ]);
  return { user, sessions };
}
```

### D2. Schrijft dit scherm iets weg?

Zo ja, dan is er een `<Form method="post">` en een `clientAction`.

```jsx
export async function clientAction({ request, params }) {
  const formData = await request.formData();
  await slaOp({ … });
  return redirect("/ergens");
}
```

Controleer drie dingen:

- elk formulierveld heeft een `name` die overeenkomt met `formData.get("…")`
- getallen worden geconverteerd: `Number(...)` of `parseInt(..., 10)`
- checkboxes vergelijk je met `"on"`

### D3. Beweegt er iets terwijl je typt?

Zo ja, dan heb je `useState` nodig en controlled inputs (`value` + `onChange`).
Zet die state in de route als meerdere componenten hem nodig hebben.

Zo nee, laat het formulier uncontrolled met `defaultValue`. Dat is minder code
en minder kans op fouten.

### D4. Klopt de navigatie?

- elke `<a href>` binnen de app is een `Link`
- Cancel- en Back-knoppen gebruiken `useNavigate()` en `navigate(-1)`
- na opslaan `return redirect("…")` in de action

---

## Deel E — Tijdsverdeling

Bij ongeveer drie uur:

| Fase | Tijd | Cumulatief |
|---|---|---|
| Opstarten en lezen (Deel B) | 15 min | 0:15 |
| Layout en navigatie | 20 min | 0:35 |
| Lijst- en detailscherm | 30 min | 1:05 |
| Aanmaak- en bewerkformulier | 45 min | 1:50 |
| Complexe schermen | 45 min | 2:35 |
| Tests fixen | 15 min | 2:50 |
| Opruimen en indienen | 10 min | 3:00 |

**Harde regel:** stop uiterlijk 20 minuten voor het einde met nieuwe functionaliteit.
Gebruik die tijd om te zorgen dat wat er staat ook echt werkt en ingediend geraakt.

---

## Deel F — Als je vastzit

In deze volgorde, en niet langer dan vijf minuten per stap:

1. **Lees de falende test.** De test is de exactste beschrijving van wat er hoort
   te gebeuren die je hebt. Vaak staat het antwoord er letterlijk in.
2. **Zet een `console.log` in je loader.** Komt de data binnen? Wat is de vorm?
3. **Kijk in het netwerktabblad.** Wordt de fetch gedaan? Naar welke URL? Wat komt
   er terug? Een 404 betekent een verkeerde URL, lege array betekent een verkeerd filter.
4. **Vergelijk met een scherm dat wél werkt.** Alle schermen volgen hetzelfde patroon.
5. **Draai `npm run test:ui`.** Daar kun je per test terugspoelen en de DOM bekijken
   op elk moment van de test.
6. **Sla het over.** Ga naar het volgende scherm en kom later terug. Eén vastgelopen
   test mag nooit de rest van je examen opeten.

---

## Deel G — Wat je niet moet doen

- de tests aanpassen (meestal expliciet verboden)
- de `services/` aanpassen — die zijn compleet, lees de JSDoc opnieuw
- data ophalen met `useEffect` + `useState` in plaats van een loader
- in je component sorteren of filteren wat de service al kan
- CSS mooier maken; dat levert geen punten op
- alles tegelijk half afwerken

---

## Deel H — Afwerken en indienen

```bash
npm run test:chrome        # alles groen?
npx eslint app             # geen fouten?
```

Klik daarna handmatig de app door met de echte backend. Let erop dat het browsertabje
nergens opnieuw laadt — dat betekent een vergeten `<a href>` of `<form>`.

Ruim op:

- `console.log`-restanten weg
- geen ongebruikte imports
- `node_modules` verwijderen als dat gevraagd wordt

Volg dan letterlijk de instructies uit de README over inleveren. In de oefeningen was
dat: alleen de `client`-map, `node_modules` eruit, hernoemen naar
`2DEV-VOORNAAM-ACHTERNAAM`, zippen, uploaden.

**Controleer je zip nog één keer.** Pak hem uit in een tijdelijke map en kijk of de
`app`-map er echt in zit. Een lege of verkeerde zip is de duurste fout van allemaal.
