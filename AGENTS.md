# AGENTS.md : Les outils · Skazy Formation

Consignes pour les agents de code (Claude Code, Codex, Copilot…) et pour les humains qui travaillent sur ce dépôt.

## Le projet

Une page d’accueil statique qui présente les six outils Skazy Formation et y mène en un clic. Le dossier `site/` est publié tel quel sur GitHub Pages (https://gharel.github.io/home/) : pas d’étape de construction.

```
site/index.html                 La page : bandeau, héros (accès direct), une carte par outil, pied
site/favicon.svg                Favicon et pastille du bandeau : l'arc-en-ciel des six outils sur fond blanc
site/favicon-32.png             Dérivé du SVG par npm run icones
site/apple-touch-icon.png       Dérivé du SVG par npm run icones (fond blanc plein, 180 px)
site/assets/css/charte.css      Jetons du design system (clair et sombre) et couleurs des outils : seul fichier où une couleur est écrite
site/assets/css/accueil.css     Mise en page
site/assets/js/theme.js         Bouton du thème (système, clair, sombre), gardé dans localStorage
site/assets/img/outils/*.svg    Copies exactes des favicons des six outils (ne pas les modifier ici)
site/assets/fonts/              Georama (woff2), comme dans les autres outils
outils/dev.js                   Serveur local du dossier site/ (port 4180, refuse un port occupé)
outils/icones-png.js            Dérive les PNG du favicon
tests/accueil.spec.js           Playwright : ordre des outils, liens, images, thème, typographie, mise en page et axe sur 5 écrans × 2 thèmes
```

## Commandes

| Commande         | Rôle                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| `npm run dev`    | Serveur local sur http://localhost:4180                                |
| `npm run check`  | Prettier + validation HTML (**avant chaque commit**)                   |
| `npm test`       | Tests Playwright (**avant chaque push**) ; `PORT_E2E` change leur port |
| `npm run icones` | Régénère les PNG après une modification de `site/favicon.svg`          |

## Règles

- **En français** : identifiants, commentaires, textes affichés, messages de commit (Conventional Commits : `feat(cartes): …`, `fix: …`).
- **Charte Skazy Formation** (design system Claude Design, copie locale dans `exercices-ia/src/styles/`) : Georama, vert `#50967c` (texte blanc seulement sur `--primaire-fonce`), boutons en pilule, cartes de 16 px à barre de 6 px, badges en majuscules, héros sombre, pas d’emoji (icônes Font Awesome Free en sprite SVG dans `index.html`, décoratives).
- **L’arc-en-ciel des outils** : Quiz rouge, Mini-jeux orange, Vigie jaune, Atelier d’exercices IA vert, Comprendre l’IA bleu, Prompthèque violet. Toujours dans cet ordre. Les dégradés (`--<couleur>-a` → `--<couleur>-b`) sont ceux des favicons ; `--<couleur>-texte` est la teinte de texte au contraste AA (assombrie en clair, éclaircie en sombre). Si un outil change de favicon, recopier le fichier dans `site/assets/img/outils/` et ses deux couleurs dans `charte.css` (et dans `site/favicon.svg`).
- **Signature et titre** : bandeau « logo Skazy Formation │ pastille (le favicon) │ nom », le logo seul est un lien vers https://formation.skazy.nc (nouvel onglet). Titre d’onglet « Les outils · Skazy Formation ».
- **Un nouvel outil** : une entrée dans le lanceur du héros, une carte (même gabarit, badge = un verbe), une ligne dans `OUTILS` de `tests/accueil.spec.js` et dans le tableau du README.
- **Typographie** : espace insécable (`&nbsp;`) avant `? ! ; :` et le point médian `·`, après un nombre suivi de son unité ; un nom composé (Mini-jeux, Nouvelle-Calédonie) va dans `<span class="insecable">`. Le test « typographie » le vérifie.
- **Vérifier** à 1280 × 720, 1920 × 1080, 820 px, 390 px et 360 px, en clair et en sombre : pas de défilement horizontal, aucun texte coupé, axe sans violation (`npm test`).
- `<meta name="robots" content="noindex">` : comme les outils, la page n’apparaît pas dans les moteurs de recherche.
