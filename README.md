# Les outils · Skazy Formation

La page d’accueil qui présente les sept outils de Skazy Formation, avec un accès direct à chacun :

| Outil                  | Couleur | Pour quoi faire                                           | Adresse                                 |
| ---------------------- | ------- | --------------------------------------------------------- | --------------------------------------- |
| Quiz                   | rouge   | Évaluer : quiz interactifs à projeter, façon Kahoot       | https://gharel.github.io/quiz/          |
| Mini-jeux              | orange  | Animer : mini-jeux pour réveiller une séance              | https://gharel.github.io/jeu-formation/ |
| Vigie                  | jaune   | Veiller : appels d’offres de Nouvelle-Calédonie et autour | https://gharel.github.io/scraping/      |
| Atelier d’exercices IA | vert    | Pratiquer : près de 300 exercices d’IA par métier         | https://gharel.github.io/exercices-ia/  |
| Comprendre l’IA        | bleu    | Comprendre : 9 fiches interactives en FALC                | https://gharel.github.io/simulateur-ia/ |
| Captif                 | indigo  | Composer : copie numérique des évaluations, rendue en PDF | https://gharel.github.io/captif/        |
| Prompthèque            | violet  | S’inspirer : techniques de prompt prêtes à copier         | https://gharel.github.io/prompts/       |

**En ligne : https://gharel.github.io/home/**

Dans le nouvel onglet de l’extension (dossier `www/extension`, qui ouvre la page avec `?equipe`), une partie « Pour l’équipe » s’ajoute, en vert Skazy :

| Outil               | Pour quoi faire                                       | Adresse                                         |
| ------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| Dashboard Formation | Piloter : sessions, documents, Qualiopi (Apps Script) | déploiement `/exec` du projet `gas/Claude Code` |
| Mini CRM            | Relancer : brouillons Gmail des relances clients      | déploiement de test `/dev` du projet `my-crm`   |
| Skills IA           | Produire : plan, support et quiz avec les assistants  | https://gharel.github.io/skills/                |
| Design Skazy        | Concevoir : le design system (dépôt privé)            | https://github.com/gharel/design-skazy          |

Elle est masquée, pas secrète : ses liens sont dans le code de la page, et ces outils demandent le compte de Guillaume.

- Charte du design system **Skazy Formation** (Claude Design), reprise de l’Atelier d’exercices IA : police Georama, vert `#50967c`, cartes à barre de couleur de 6 px, badges en majuscules, héros sombre.
- Thème clair et sombre (celui du système, ou choisi avec le bouton du bandeau : système, clair, sombre), pensé pour le téléphone ; le choix est commun à tous les outils (clé `skazy-outils:theme` du `localStorage`), suivi en direct d’un onglet à l’autre et au retour en arrière, et le clair choisi résiste au mode nuit de Brave et à Dark Reader.
- Chaque outil garde la couleur de son favicon (dégradé de l’arc-en-ciel Skazy Formation). Les outils de l’équipe ont tous le vert Skazy (aplat et icône Lucide, règle de design-skazy). Le favicon de l’accueil est la roue des outils sur fond blanc : un anneau de sept arcs, un par outil dans le dégradé de son favicon, du rouge du Quiz (en haut) au violet de la Prompthèque, dans le sens des aiguilles d’une montre.
- Bandeau commun à tous les outils : à gauche la pastille et le nom (lien vers l’accueil), à droite les actions, un filet et le logo Skazy Formation (lien vers formation.skazy.nc). Les six premiers outils y ajoutent le lien « Les outils » vers cette page.
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
npm run icones                    # régénère les PNG du favicon et ceux des applis Apps Script
```

Un push sur `main` relance les vérifications puis publie le dossier `site/` sur GitHub Pages ([.github/workflows/publier.yml](.github/workflows/publier.yml)).
