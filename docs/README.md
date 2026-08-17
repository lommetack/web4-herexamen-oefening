# Web4 — Handboek React & React Router

Alles wat in de oefeningen aan bod kwam, in één set documenten die je zonder
internet kunt gebruiken. Geschreven voor React 19 en React Router 7 in
framework mode met `ssr: false`.

---

## De hoofdstukken

| Bestand | Waarvoor | Wanneer lezen |
|---|---|---|
| [01-stappenplan-examen.md](01-stappenplan-examen.md) | Wat je doet vóór, tijdens en na het examen | Vooraf één keer, en tijdens het examen als checklist |
| [02-react-router.md](02-react-router.md) | Volledige referentie: routes, loaders, actions, navigatie, formulieren | Als naslag |
| [03-react.md](03-react.md) | Volledige referentie: state, props, events, lijsten, controlled inputs | Als naslag |
| [04-recepten.md](04-recepten.md) | Kant-en-klare patronen om over te typen | Tijdens het bouwen |
| [05-foutmeldingen.md](05-foutmeldingen.md) | Van foutmelding naar oorzaak naar oplossing | Als er iets stukgaat |
| [06-oefeningen.md](06-oefeningen.md) | Wat oefening 1 en 2 precies vroegen, naast elkaar | Om te herhalen |
| [07-spiekbriefje.md](07-spiekbriefje.md) | Eén pagina, alles wat je uit het hoofd wilt kennen | Printen |

---

## Hoe je dit gebruikt

**Twee weken voor het examen.** Lees 02 en 03 helemaal door. Doe daarna de twee
oefeningen opnieuw vanaf de `start`-map, zonder de oplossingen erbij. Wat je niet
weet, zoek je op in 04.

**De dag voor het examen.** Lees 01 en zorg dat je machine klaar staat (dat
hoofdstuk begint met een offline-checklist die je echt vooraf moet doen — een deel
ervan vraagt internet). Print 07.

**Tijdens het examen.** Volg 01 als draaiboek. Gebruik 04 om te typen en 05 als er
iets kapot is. In VS Code werkt Ctrl+Shift+F om door deze hele map te zoeken.

---

## Waar de oefeningen staan

```
web4-herexamen-oefening/
├── docs/                    ← dit handboek
├── start/                   oefening 1: Couch Potato — beginstaat
├── development/             oefening 1: uitgewerkt + COACH-LOG.md
└── oefeningen/
    └── oefening2/
        ├── start/           oefening 2: Box Configurator — beginstaat
        └── development/     oefening 2: uitgewerkt + COACH-LOG.md
```

De twee `COACH-LOG.md`-bestanden lopen per oefening stap voor stap door de
oplossing. Dit handboek generaliseert wat daar in staat.

---

## Wat je moet kunnen na dit handboek

- Een lijst laden en tonen, inclusief lege staat
- Een detailpagina maken met een parameter uit de URL
- Een formulier maken dat iets aanmaakt, en er daarna naartoe navigeren
- Een formulier maken dat iets bewerkt, voorgevuld met bestaande data
- Een pagina afschermen zodat alleen de eigenaar erbij kan
- Navigeren zonder page reload, en terug naar het vorige scherm
- Twee knoppen in één formulier die verschillende dingen doen
- Een knop die meteen omklapt en pas daarna de server bijwerkt
- Een formulier waarbij een preview live meebeweegt met wat je typt
- Een zoekveld dat filtert
