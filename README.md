# Tractions 0→MAX

PWA mobile-first de suivi d'entraînement aux tractions, basée sur le programme
« Performer en tractions en partant de 0 » (rbt_pau), en 3 niveaux progressifs
(Débutant / Intermédiaire / Avancé). Utilisable à la salle, à une main, entre
deux séries.

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

- **Test initial (Workout Test)** : échelle ascendante 1 traction / 30 s de
  repos / 2 tractions / 30 s / 3 tractions... prise pronation obligatoire,
  jusqu'à l'échec. Le score (dernier palier réussi) assigne le niveau :
  ≤ 3 → Débutant, 4 à 10 → Intermédiaire, 11 et plus → Avancé.
- **Séance du jour** : checklist d'échauffement en 3 étapes (cardio,
  mobilité articulaire, activation musculaire), déroulé exercice par
  exercice (Séance A/B/C selon le niveau) avec timer de récupération plein
  écran (vibration + bip, résistant au verrouillage de l'écran via
  horodatage), saisie des reps réelles, RPE et note en fin de séance.
- **Semaine** : suivi des 3 séances du cycle (S1→S4) et d'une variable de
  progression par semaine (reps, récup, tempo ou lest).
- **Progression** : graphique des re-tests, volume hebdomadaire, historique.
- **Challenges** : Demi-BBR, On the bar, The 100, Pharaon — chrono intégré
  et meilleurs scores.
- **Mouvements** : glossaire technique (pronation, supination, clean form,
  isométriques, scapula, excentriques, chin-up, élastique aide/résistance,
  lestées, dead hang, australiennes, toes to bar, tractions hautes).
- **Réglages** : re-test manuel, changement de niveau manuel, export/import
  JSON, réinitialisation.

Le programme (séances A/B/C, séries/reps/récup par niveau) est dans
`src/data/programme.json`, transcrit depuis le livret source (pages 11-18).
Le glossaire des mouvements est dans `src/data/mouvements.json` (pages
19-22). La logique de persistance et de cycle est dans `src/lib/`.
