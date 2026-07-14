# Tractions 0→MAX

PWA mobile-first de suivi d'entraînement aux tractions, en 3 niveaux progressifs
(0-3 / 4-8 / 8+ répétitions), 100 % poids de corps au départ. Utilisable à la
salle, à une main, entre deux séries.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS 4 · Recharts · `vite-plugin-pwa` —
persistance 100 % locale (localStorage), aucune API, installable sur téléphone.

## Lancer

```bash
npm install
npm run dev       # développement
npm run build     # type-check + build production (dist/)
npm run preview   # servir le build
```

## Fonctionnement

- **Test initial** : max de tractions pronation en one shot → assignation
  automatique du niveau (0-3 → niveau 1, 4-8 → niveau 2, 8+ → niveau 3).
- **Séance du jour** : checklist d'échauffement obligatoire, déroulé
  exercice par exercice avec timer de récupération plein écran (vibration +
  bip, résistant au verrouillage de l'écran via horodatage), saisie des reps
  réelles, RPE et note en fin de séance.
- **Semaine** : suivi des 3 séances du cycle (S1→S4) et de l'unique variable
  de progression autorisée par semaine (reps, récup, tempo ou lest).
- **Progression** : graphique des re-tests, volume hebdomadaire, historique.
- **Challenges** : max one shot, 50 tractions chrono, échelle 1→10, hold
  menton, dead hang — chrono intégré et meilleurs scores.
- **Mouvements** : glossaire des prises et techniques.
- **Réglages** : re-test manuel, changement de niveau manuel, export/import
  JSON, réinitialisation.

Le programme (séries/reps/récup par niveau et par séance) est dans
`src/data/programme.json`, transcrit depuis le programme source. Le
glossaire des mouvements est dans `src/data/mouvements.json`. La logique de
persistance et de cycle est dans `src/lib/`.
