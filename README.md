# Prépa Test Militaire — 6 semaines

Application mobile-first de suivi d'un programme de préparation physique militaire
(tractions max · pompes 2 min · abdos 2 min), 100 % poids de corps, construite
autour du programme Armstrong de tractions (5 jours/semaine).

## Stack

React 18 · Vite · TypeScript · TailwindCSS 4 — persistance 100 % locale (localStorage), aucune API.

## Lancer

```bash
npm install
npm run dev       # développement
npm run build     # type-check + build production (dist/)
npm run preview   # servir le build
```

## Fonctionnement

Tout le programme est dérivé de 3 maxes de référence, modifiables à tout moment
dans l'onglet **Réglages** (défaut : 12 tractions / 45 pompes / 50 abdos) :

- **Chiffre J4 (CE)** = `floor(maxTractions × 0.5)`, min 2
- **EMOM pompes** = `round(maxPompes2min × 0.12)` reps/minute, min 4
- **Sit-ups par tour** = `round(maxAbdos2min × 0.35)`, min 10
- **Modulation hebdo** : S1-S2 base (Installation) · S3-S4 CE +1, EMOM +1
  (Montée en charge) · S5 CE +2, EMOM +2, planche 60 s (Pic) · S6 CE +1, EMOM −1 (Affûtage)
- **Simulations S4-S6** : tractions = max + (semaine − 3) ;
  pompes/abdos = max × (1 + 0,03 × (semaine − 3))

La programmation v2 « prépa élite » s'inspire des références du marché
(Frankton Tactical, prépas type Invictus / Forces Spéciales Coaching,
méthodes calisthénics, hybride Hyrox) : échauffements structurés, pompes
tempo et variantes, grip hebdomadaire (suspensions progressives 30 → 50 s),
prehab coudes/épaules, WOD dont la durée suit les phases, épreuve chiffrée
à valider chaque samedi (S1-S3), autorégulation du J4 (9 séries validées =
+1 au CE, cumulable jusqu'à +3), et récupération active guidée le dimanche.

Onglets : **Programme** (semaine par semaine, jour par jour, séances validables),
**Tests réf.** (protocole des tests de référence), **Historique** (log des
simulations + graphe de progression vers l'objectif du test), **Réglages**.

La course à pied est volontairement absente (gérée par un autre plan) ; l'app
signale seulement les jours où éviter une séance intense.

Le moteur de calcul est dans `src/lib/program.ts`.
