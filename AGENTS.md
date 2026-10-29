# AGENTS.md : Les outils · Skazy Formation

Consignes pour les agents de code (Claude Code, Codex, Copilot…) et pour les humains qui travaillent sur ce dépôt.

## Le projet

Une page d’accueil statique qui présente les sept outils Skazy Formation et y mène en un clic ; dans l’extension (nouvel onglet du navigateur, dossier `www/extension`, hors dépôt), elle montre aussi les outils de l’équipe. Le dossier `site/` est publié tel quel sur GitHub Pages (https://gharel.github.io/home/) : pas d’étape de construction.

```
site/index.html                 La page : bandeau, héros (accès direct), une carte par outil, « Pour l’équipe » (extension), pied
site/favicon.svg                Favicon et pastille du bandeau : la roue des sept outils sur fond blanc (un arc par outil, dans le dégradé de son favicon)
site/favicon-32.png             Dérivé du SVG par npm run icones
site/apple-touch-icon.png       Dérivé du SVG par npm run icones (fond blanc plein, 180 px)
site/assets/css/charte.css      Jetons du design system (clair et sombre) et couleurs des outils : seul fichier où une couleur est écrite
site/assets/css/accueil.css     Mise en page
site/assets/js/theme.js         Bouton du thème (système, clair, sombre) : choix commun aux outils, gardé dans localStorage et suivi en direct
site/assets/js/haut-de-page.js  Bouton « Remonter en haut », visible après 1,2 écran de défilement
site/assets/img/outils/*.svg    Copies exactes des favicons des outils (ne pas les modifier ici)
site/assets/img/outils/*.png    Favicons de Dashboard Formation et du Mini CRM (npm run icones), chargés par leur doGet()
site/assets/fonts/              Georama (woff2), comme dans les autres outils
outils/dev.js                   Serveur local du dossier site/ (port 4180, refuse un port occupé)
outils/icones-png.js            Dérive les PNG du favicon et ceux des deux applis Apps Script
tests/accueil.spec.js           Playwright : ordre des outils, partie équipe, liens, images, thème, typographie, mise en page et axe sur 5 écrans × 2 thèmes × (page, extension)
```

## Commandes

| Commande         | Rôle                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| `npm run dev`    | Serveur local sur http://localhost:4180                                |
| `npm run check`  | Prettier + validation HTML (**avant chaque commit**)                   |
| `npm test`       | Tests Playwright (**avant chaque push**) ; `PORT_E2E` change leur port |
| `npm run icones` | Régénère les PNG après une modification d’un favicon                   |

## Règles

- **En français** : identifiants, commentaires, textes affichés, messages de commit (Conventional Commits : `feat(cartes): …`, `fix: …`).
- **Charte Skazy Formation** (design system Claude Design, copie locale dans `exercices-ia/src/styles/`) : Georama, vert `#50967c` (texte blanc seulement sur `--primaire-fonce`), boutons en pilule, cartes de 16 px à barre de 6 px, badges en majuscules, héros sombre (sur téléphone, ≤ 640 px, il remplit l’écran : en thème clair, il prend les couleurs claires de la page, comme la scène de la Prompthèque et le profil de l’Atelier d’exercices IA), pas d’emoji (icônes Font Awesome Free en sprite SVG dans `index.html`, décoratives).
- **L’arc-en-ciel des outils** : Quiz rouge, Mini-jeux orange, Vigie jaune, Atelier d’exercices IA vert, Comprendre l’IA bleu, Captif indigo, Prompthèque violet. Toujours dans cet ordre. Les dégradés (`--<couleur>-a` → `--<couleur>-b`) sont ceux des favicons ; `--<couleur>-texte` est la teinte de texte au contraste AA (assombrie en clair, éclaircie en sombre). Si un outil change de favicon, recopier le fichier dans `site/assets/img/outils/` et ses deux couleurs dans `charte.css` (et dans `site/favicon.svg`).
- **Les outils de l’équipe** (Dashboard Formation, Mini CRM, Skills IA, Design Skazy) : en vert Skazy (`data-couleur="skazy"`), favicon en aplat `#50967c` avec une icône Lucide blanche (règle de design-skazy). Ils portent la classe `equipe` et ne s’affichent que si la page est ouverte avec `?equipe`, ce que fait l’extension : les stagiaires ne les voient pas. Dashboard Formation et le Mini CRM sont des applis Apps Script réservées au compte de Guillaume ; Apps Script ne sert pas de fichier, leur favicon est le PNG publié ici (`setFaviconUrl` dans leur `doGet()`).
- **Liens vers les outils** : `target="_top"`. Dans l’extension, la page est dans un cadre ; l’outil s’ouvre ainsi dans tout l’onglet, avec son adresse et son favicon (les applis Google refusent d’être affichées dans un cadre).
- **Bandeau commun des outils** (harmonisé le 2026-10-09, le même dans les six outils) : à gauche le bouton « Accueil » de l’outil s’il existe, puis la pastille (le favicon) et le nom, en un lien vers l’accueil de l’outil ; à droite les actions de l’outil, le lien « Les outils » (vers https://gharel.github.io/home/ ; absent ici puisque c’est cette page), un filet et le logo Skazy Formation en dernier, lien vers https://formation.skazy.nc (nouvel onglet). Bouton « Remonter en haut de la page » sur les pages longues (rond, en bas à droite, après 1,2 écran de défilement). Titre d’onglet « Les outils · Skazy Formation ».
- **Thème commun aux outils** (harmonisé le 2026-10-09, le même dans tous les outils) : un seul choix pour tous, puisqu’ils partagent l’origine https://gharel.github.io. Il est gardé dans `localStorage` sous la clé `skazy-outils:theme`, valeur `JSON.stringify('light')` ou `JSON.stringify('dark')` ; pas de clé = thème du système. Le script en ligne du `<head>` pose `data-theme` sur `<html>` avant l’affichage, seulement pour un choix explicite. Le bouton `#bouton-theme` passe de système à clair, puis sombre, puis système ; son icône montre l’état actuel (`circle-half-stroke`, `sun`, `moon`) et son nom (`aria-label` et `title`) est exactement `Thème : celui du système. Changer de thème`, `Thème : clair. Changer de thème` ou `Thème : sombre. Changer de thème` (espace insécable U+00A0 avant les deux-points). Le clair choisi impose `color-scheme: only light` (`charte.css`) et `<meta name="darkreader-lock" />` suit `<meta name="color-scheme" content="light dark" />` : le mode nuit de Brave et Dark Reader ne repeignent pas la page. La page suit un choix fait dans un autre outil : événement `storage` sur la clé (ou clé `null`) et `pageshow` venu du cache (`persisted`, retour en arrière) relisent la clé et réappliquent thème, bouton et `theme-color`. Exception : les Mini-jeux (jeu-formation) n’ont pas de thème sombre.
- **Un nouvel outil** : une entrée dans le lanceur du héros, une carte (même gabarit, badge = un verbe), une ligne dans `OUTILS` (ou `EQUIPE`) de `tests/accueil.spec.js` et dans le tableau du README. Un outil de l’arc-en-ciel ajoute aussi un arc à `site/favicon.svg`, un segment à la barre du héros (`accueil.css`) et ses couleurs dans `charte.css`.
- **Typographie** : espace insécable (`&nbsp;`) avant `? ! ; :` et le point médian `·`, après un nombre suivi de son unité ; un nom composé (Mini-jeux, Nouvelle-Calédonie) va dans `<span class="insecable">`. Le test « typographie » le vérifie.
- **Vérifier** à 1280 × 720, 1920 × 1080, 820 px, 390 px et 360 px, en clair et en sombre : pas de défilement horizontal, aucun texte coupé, axe sans violation (`npm test`).
- `<meta name="robots" content="noindex">` : comme les outils, la page n’apparaît pas dans les moteurs de recherche.
