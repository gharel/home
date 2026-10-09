# Les outils · Skazy Formation

La page d’accueil qui présente les six outils de Skazy Formation, avec un accès direct à chacun :

| Outil                  | Couleur | Pour quoi faire                                           | Adresse                                 |
| ---------------------- | ------- | --------------------------------------------------------- | --------------------------------------- |
| Quiz                   | rouge   | Évaluer : quiz interactifs à projeter, façon Kahoot       | https://gharel.github.io/quiz/          |
| Mini-jeux              | orange  | Animer : mini-jeux pour réveiller une séance              | https://gharel.github.io/jeu-formation/ |
| Vigie                  | jaune   | Veiller : appels d’offres de Nouvelle-Calédonie et autour | https://gharel.github.io/scraping/      |
| Atelier d’exercices IA | vert    | Pratiquer : près de 300 exercices d’IA par métier         | https://gharel.github.io/exercices-ia/  |
| Comprendre l’IA        | bleu    | Comprendre : 9 fiches interactives en FALC                | https://gharel.github.io/simulateur-ia/ |
| Prompthèque            | violet  | S’inspirer : techniques de prompt prêtes à copier         | https://gharel.github.io/prompts/       |

**En ligne : https://gharel.github.io/home/**

- Charte du design system **Skazy Formation** (Claude Design), reprise de l’Atelier d’exercices IA : police Georama, vert `#50967c`, cartes à barre de couleur de 6 px, badges en majuscules, héros sombre.
- Thème clair et sombre (celui du système, ou choisi avec le bouton du bandeau), pensé pour le téléphone.
- Chaque outil garde la couleur de son favicon (dégradé de l’arc-en-ciel Skazy Formation). Le favicon de l’accueil est la roue des outils sur fond blanc : un anneau de six arcs, un par outil dans le dégradé de son favicon, du rouge du Quiz (en haut) au violet de la Prompthèque, dans le sens des aiguilles d’une montre.
- Bandeau commun à tous les outils : à gauche la pastille et le nom (lien vers l’accueil), à droite les actions, un filet et le logo Skazy Formation (lien vers formation.skazy.nc). Les six outils y ajoutent le lien « Les outils » vers cette page.
- Bouton « Remonter en haut » sur les pages longues.
- Titre d’onglet selon la règle commune des outils : « Les outils · Skazy Formation ».
- Aucune dépendance à l’exécution, aucun CDN : HTML, CSS et un petit module JavaScript pour le thème.

## Développement

```bash
npm install
npx playwright install chromium   # une seule fois
npm run dev                       # http://localhost:4180
npm run check                     # format (Prettier) + validation HTML
npm test                          # mise en page (5 écrans, clair et sombre), accessibilité axe, thème
npm run icones                    # régénère favicon-32.png et apple-touch-icon.png depuis favicon.svg
```

Un push sur `main` relance les vérifications puis publie le dossier `site/` sur GitHub Pages ([.github/workflows/publier.yml](.github/workflows/publier.yml)).
