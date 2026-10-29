import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Les sept outils, dans l'ordre de l'arc-en-ciel Skazy Formation.
const OUTILS = [
  { nom: 'Quiz', couleur: 'rouge', url: 'https://gharel.github.io/quiz/', icone: 'quiz.svg' },
  {
    nom: 'Mini-jeux',
    couleur: 'orange',
    url: 'https://gharel.github.io/jeu-formation/',
    icone: 'mini-jeux.svg',
  },
  { nom: 'Vigie', couleur: 'jaune', url: 'https://gharel.github.io/scraping/', icone: 'vigie.svg' },
  {
    nom: 'Atelier d’exercices IA',
    couleur: 'vert',
    url: 'https://gharel.github.io/exercices-ia/',
    icone: 'atelier-exercices-ia.svg',
  },
  {
    nom: 'Comprendre l’IA',
    couleur: 'bleu',
    url: 'https://gharel.github.io/simulateur-ia/',
    icone: 'comprendre-ia.svg',
  },
  {
    nom: 'Captif',
    couleur: 'indigo',
    url: 'https://gharel.github.io/captif/',
    icone: 'captif.svg',
  },
  {
    nom: 'Prompthèque',
    couleur: 'violet',
    url: 'https://gharel.github.io/prompts/',
    icone: 'promptheque.svg',
  },
];

// Les outils de l'équipe, en vert Skazy : seulement dans l'extension (page ouverte avec ?equipe).
const EQUIPE = [
  {
    nom: 'Dashboard Formation',
    url: 'https://script.google.com/a/macros/skazy.nc/s/AKfycbwgGLgG079USAcbKWSo60KEp9jNR7xS9Oek_Rw4ol8Zz1NIJwzxFntwgks0LzQf_q27rg/exec',
    icone: 'dashboard-formation.svg',
  },
  {
    nom: 'Mini CRM',
    url: 'https://script.google.com/a/macros/skazy.nc/s/AKfycbwREjH5R29EPxQaIabmkPdqyDEFW7JiAaUVD-hmNCU/dev',
    icone: 'mini-crm.svg',
  },
  { nom: 'Skills IA', url: 'https://gharel.github.io/skills/', icone: 'skills-ia.svg' },
  {
    nom: 'Design Skazy',
    url: 'https://github.com/gharel/design-skazy',
    icone: 'design-skazy.svg',
  },
];

const ECRANS = [
  { nom: 'vidéoprojecteur', width: 1280, height: 720 },
  { nom: 'grand écran', width: 1920, height: 1080 },
  { nom: 'tablette', width: 820, height: 1180 },
  { nom: 'téléphone', width: 390, height: 844 },
  { nom: 'petit téléphone', width: 360, height: 740 },
];

// Bouton du thème, le même dans tous les outils : l'icône montre l'état actuel, que le nom
// (aria-label et title) dit aussi, avec une espace insécable avant les deux-points.
const ETATS_THEME = {
  auto: { icone: '#i-circle-half-stroke', nom: 'celui du système' },
  light: { icone: '#i-sun', nom: 'clair' },
  dark: { icone: '#i-moon', nom: 'sombre' },
};

async function verifierBoutonTheme(page, theme) {
  const bouton = page.locator('#bouton-theme');
  const nom = `Thème : ${ETATS_THEME[theme].nom}. Changer de thème`;
  await expect(bouton).toHaveAttribute('aria-label', nom);
  await expect(bouton).toHaveAttribute('title', nom);
  await expect(bouton.locator('use')).toHaveAttribute('href', ETATS_THEME[theme].icone);
}

/**
 * Ouvre l'accueil (`./?equipe` : comme l'extension), polices chargées, et renvoie la liste
 * (vivante) des erreurs de la page.
 */
async function ouvrir(page, adresse = './') {
  const erreurs = [];
  page.on('console', (message) => message.type() === 'error' && erreurs.push(message.text()));
  page.on('pageerror', (erreur) => erreurs.push(erreur.message));
  await page.goto(adresse);
  await page.evaluate(() => document.fonts.ready);
  return erreurs;
}

test('le titre suit la règle commune « Nom · Skazy Formation »', async ({ page }) => {
  await ouvrir(page);
  await expect(page).toHaveTitle('Les outils · Skazy Formation');
  await expect(page.locator('.bandeau__nom')).toHaveText('Les outils');
  await expect(page.locator('.bandeau__pastille')).toHaveAttribute('src', 'favicon.svg');
});

test('bandeau commun : le nom à gauche, le logo Skazy Formation en dernier à droite', async ({
  page,
}) => {
  await ouvrir(page);
  const nom = page.locator('a.bandeau__nom');
  await expect(nom).toHaveAttribute('href', './');
  await expect(nom).toHaveAttribute('aria-current', 'page');
  const dernier = page.locator('.bandeau__interieur :is(a, button):visible').last();
  await expect(dernier).toHaveClass(/bandeau__logo/);
  await expect(dernier).toHaveAttribute('href', 'https://formation.skazy.nc');
  await expect(dernier).toHaveAttribute('target', '_blank');
  await expect(dernier).toHaveAccessibleName('Site de Skazy Formation (nouvel onglet)');
  const boites = await Promise.all([nom.boundingBox(), dernier.boundingBox()]);
  expect(boites[0].x).toBeLessThan(boites[1].x);
});

test('le bouton « Remonter en haut » apparaît après défilement et ramène en haut', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ouvrir(page);
  const bouton = page.getByRole('button', { name: 'Remonter en haut de la page' });
  await expect(bouton).toBeHidden();
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(bouton).toBeVisible();
  await bouton.click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator('#titre-accueil')).toBeFocused();
  await expect(bouton).toBeHidden();
});

test('les sept outils, dans l’ordre de l’arc-en-ciel, avec leur favicon', async ({ page }) => {
  await ouvrir(page);
  const cartes = page.locator('.carte:visible');
  await expect(cartes).toHaveCount(OUTILS.length);
  const lanceur = page.locator('.lanceur__lien:visible');
  await expect(lanceur).toHaveCount(OUTILS.length);
  for (const [i, outil] of OUTILS.entries()) {
    const carte = cartes.nth(i);
    await expect(carte).toHaveAttribute('data-couleur', outil.couleur);
    await expect(carte.locator('.carte__lien')).toHaveText(outil.nom);
    await expect(carte.locator('.carte__lien')).toHaveAttribute('href', outil.url);
    await expect(carte.locator('.pastille')).toHaveAttribute(
      'src',
      `assets/img/outils/${outil.icone}`,
    );
    await expect(lanceur.nth(i)).toHaveAttribute('href', outil.url);
    await expect(lanceur.nth(i).locator('.pastille')).toHaveAttribute(
      'src',
      `assets/img/outils/${outil.icone}`,
    );
  }
});

test('les outils de l’équipe n’apparaissent que dans l’extension (?equipe)', async ({ page }) => {
  await ouvrir(page);
  await expect(page.locator('.equipe:visible')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Pour l’équipe' })).toHaveCount(0);

  await ouvrir(page, './?equipe');
  const cartes = page.locator('#equipe .carte');
  await expect(cartes).toHaveCount(EQUIPE.length);
  const lanceur = page.locator('.lanceur__liste.equipe .lanceur__lien');
  await expect(lanceur).toHaveCount(EQUIPE.length);
  for (const [i, outil] of EQUIPE.entries()) {
    const carte = cartes.nth(i);
    await expect(carte).toBeVisible();
    await expect(carte).toHaveAttribute('data-couleur', 'skazy');
    await expect(carte.locator('.carte__lien')).toHaveText(outil.nom);
    await expect(carte.locator('.carte__lien')).toHaveAttribute('href', outil.url);
    await expect(carte.locator('.pastille')).toHaveAttribute(
      'src',
      `assets/img/outils/${outil.icone}`,
    );
    await expect(lanceur.nth(i)).toHaveAttribute('href', outil.url);
  }
  // Les outils de l'arc-en-ciel restent à leur place, avant ceux de l'équipe.
  await expect(page.locator('.outils:not(.equipe) .carte')).toHaveCount(OUTILS.length);
});

test('dans l’extension, chaque outil s’ouvre dans tout l’onglet', async ({ page }) => {
  await ouvrir(page, './?equipe');
  // La page est dans un cadre de l'extension : un outil ouvert dans le cadre n'aurait ni son
  // adresse ni son favicon, et les applications Google refusent d'y être affichées.
  for (const lien of await page.locator('.lanceur__lien, .carte__lien').all()) {
    await expect(lien).toHaveAttribute('target', '_top');
  }
});

test('toutes les images se chargent', async ({ page }) => {
  await ouvrir(page, './?equipe');
  await page.waitForLoadState('load');
  const cassees = await page.$$eval('img', (images) =>
    images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
  );
  expect(cassees).toEqual([]);
  for (const chemin of [
    'favicon.svg',
    'favicon-32.png',
    'apple-touch-icon.png',
    // Favicons des applications Apps Script (setFaviconUrl dans leur doGet()).
    'assets/img/outils/dashboard-formation.png',
    'assets/img/outils/mini-crm.png',
  ]) {
    expect((await page.request.get(chemin)).ok(), chemin).toBe(true);
  }
});

test('toute la carte mène à l’outil', async ({ page }) => {
  await ouvrir(page, './?equipe');
  for (const carte of await page.locator('.carte').all()) {
    // elementFromPoint ne voit que l'écran : on amène d'abord la carte en vue.
    await carte.scrollIntoViewIfNeeded();
    const boite = await carte.boundingBox();
    const lien = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href') ?? null,
      { x: boite.x + boite.width / 2, y: boite.y + boite.height - 20 },
    );
    expect(lien).toBe(await carte.locator('.carte__lien').getAttribute('href'));
  }
});

test('typographie : espace insécable avant ? ! ; : et le point médian', async ({ page }) => {
  await ouvrir(page, './?equipe');
  const texte = await page.locator('body').innerText();
  expect(texte).not.toMatch(/ [?!;:·]/);
  const etiquette = await page.locator('#bouton-theme').getAttribute('aria-label');
  expect(etiquette).not.toMatch(/ [?!;:]/);
});

test('le bouton du thème passe de système à clair, puis sombre, et s’en souvient', async ({
  page,
}) => {
  await ouvrir(page);
  const racine = page.locator('html');
  const bouton = page.locator('#bouton-theme');
  const choix = () => page.evaluate(() => localStorage.getItem('skazy-outils:theme'));
  await expect(bouton).toBeVisible();
  await expect(racine).not.toHaveAttribute('data-theme');
  await verifierBoutonTheme(page, 'auto');

  await bouton.click();
  await expect(racine).toHaveAttribute('data-theme', 'light');
  await verifierBoutonTheme(page, 'light');
  expect(await choix()).toBe(JSON.stringify('light'));
  await page.reload();
  await expect(racine).toHaveAttribute('data-theme', 'light');
  await verifierBoutonTheme(page, 'light');

  await bouton.click();
  await expect(racine).toHaveAttribute('data-theme', 'dark');
  await verifierBoutonTheme(page, 'dark');
  expect(await choix()).toBe(JSON.stringify('dark'));
  await expect(page.locator('.logo--sombre')).toBeVisible();
  await expect(page.locator('.logo--clair')).toBeHidden();

  await bouton.click();
  await expect(racine).not.toHaveAttribute('data-theme');
  await verifierBoutonTheme(page, 'auto');
  expect(await choix()).toBeNull();
});

test('le thème clair choisi ne se laisse pas assombrir (mode nuit de Brave, Dark Reader)', async ({
  page,
}) => {
  await ouvrir(page);
  // Le verrou de Dark Reader suit la déclaration des deux thèmes de la page.
  await expect(
    page.locator('meta[name="color-scheme"][content="light dark"] + meta[name="darkreader-lock"]'),
  ).toHaveCount(1);
  const schema = () => page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
  const bouton = page.locator('#bouton-theme');
  expect(await schema()).toBe('light');
  await bouton.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await schema()).toMatch(/^(only light|light only)$/);
  await bouton.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await schema()).toBe('dark');
});

test('le thème suit le choix fait dans un autre outil (autre onglet, retour en arrière)', async ({
  page,
  context,
}) => {
  await ouvrir(page);
  const racine = page.locator('html');
  const barres = page.locator('meta[name="theme-color"]');

  // Un autre onglet de la même origine (un autre outil) change le thème : événement storage.
  const autre = await context.newPage();
  await autre.goto('./');
  await autre.locator('#bouton-theme').click();
  await expect(racine).toHaveAttribute('data-theme', 'light');
  await verifierBoutonTheme(page, 'light');
  await autre.locator('#bouton-theme').click();
  await expect(racine).toHaveAttribute('data-theme', 'dark');
  await verifierBoutonTheme(page, 'dark');
  await expect(barres.first()).toHaveAttribute('content', '#1f1f1f');
  await expect(barres.last()).toHaveAttribute('content', '#1f1f1f');
  // Stockage vidé (clé null) : retour au thème du système.
  await autre.evaluate(() => localStorage.clear());
  await expect(racine).not.toHaveAttribute('data-theme');
  await verifierBoutonTheme(page, 'auto');
  await expect(barres.first()).toHaveAttribute('content', '#ffffff');
  await expect(barres.last()).toHaveAttribute('content', '#1f1f1f');
  await autre.close();

  // Retour depuis le cache du navigateur (bfcache, désactivé par Playwright) : on simule le
  // pageshow « persisted » qui suit un détour par un outil où le thème a changé.
  await page.evaluate(() => {
    localStorage.setItem('skazy-outils:theme', JSON.stringify('dark'));
    dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await expect(racine).toHaveAttribute('data-theme', 'dark');
  await verifierBoutonTheme(page, 'dark');
  // Le bouton repart de l'état relu : sombre, puis celui du système.
  await page.locator('#bouton-theme').click();
  await expect(racine).not.toHaveAttribute('data-theme');
  await verifierBoutonTheme(page, 'auto');
});

test('sur téléphone, le héros est clair en thème clair ; sombre sur ordinateur', async ({
  page,
}) => {
  const fondHeros = () =>
    page.evaluate(() => getComputedStyle(document.querySelector('.heros')).backgroundColor);
  const CLAIR = 'rgb(248, 249, 250)';
  const cas = [
    { largeur: 390, systeme: 'light', choix: null, attendu: CLAIR },
    { largeur: 390, systeme: 'dark', choix: 'light', attendu: CLAIR },
    { largeur: 390, systeme: 'dark', choix: null, attendu: 'rgb(12, 12, 12)' },
    { largeur: 390, systeme: 'light', choix: 'dark', attendu: 'rgb(12, 12, 12)' },
    { largeur: 1280, systeme: 'light', choix: null, attendu: 'rgb(26, 26, 26)' },
  ];
  await ouvrir(page);
  for (const { largeur, systeme, choix, attendu } of cas) {
    await page.setViewportSize({ width: largeur, height: 844 });
    await page.emulateMedia({ colorScheme: systeme });
    await page.evaluate((valeur) => {
      if (valeur) document.documentElement.dataset.theme = valeur;
      else delete document.documentElement.dataset.theme;
    }, choix);
    expect(await fondHeros(), `${largeur} px, système ${systeme}, choix ${choix}`).toBe(attendu);
  }
});

for (const [vue, adresse] of [
  ['page', './'],
  ['extension', './?equipe'],
]) {
  for (const theme of ['light', 'dark']) {
    for (const ecran of ECRANS) {
      test(`mise en page et accessibilité (${vue}) : ${ecran.nom} (${ecran.width} px), thème ${theme}`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme: theme });
        await page.setViewportSize({ width: ecran.width, height: ecran.height });
        const erreurs = await ouvrir(page, adresse);

        // Pas de défilement horizontal, rien qui dépasse de l'écran.
        const largeur = await page.evaluate(() => ({
          page: document.documentElement.scrollWidth,
          ecran: document.documentElement.clientWidth,
        }));
        expect(largeur.page).toBeLessThanOrEqual(largeur.ecran);
        const dehors = await page.evaluate(() =>
          [...document.querySelectorAll('body *')]
            .filter(
              (el) =>
                el.getClientRects().length && !el.closest('svg[aria-hidden="true"][width="0"]'),
            )
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return (
                r.width > 0 && (r.left < -1 || r.right > document.documentElement.clientWidth + 1)
              );
            })
            .map((el) => el.className || el.tagName),
        );
        expect(dehors).toEqual([]);

        // Aucun texte coupé dans son badge, son lien ou sa ligne.
        const coupes = await page.evaluate(() =>
          [
            ...document.querySelectorAll(
              '.badge, .lanceur__lien, .carte__ouvrir, .bandeau__nom, .carte__titre, .carte__infos li, .surtitre, .heros h1',
            ),
          ]
            .filter((el) => el.scrollWidth > el.clientWidth + 1)
            .map((el) => el.textContent.trim()),
        );
        expect(coupes).toEqual([]);

        // Le texte de chaque point reste à droite de sa coche, sur toutes ses lignes.
        const sousLaCoche = await page.evaluate(() =>
          [...document.querySelectorAll('.carte__points li, .carte__infos li')]
            .filter((li) => {
              const icone = li.querySelector('.icone').getBoundingClientRect();
              const texte = document.createRange();
              texte.setStartAfter(li.querySelector('.icone'));
              texte.setEndAfter(li.lastChild);
              return [...texte.getClientRects()].some((r) => r.width > 0 && r.left < icone.right);
            })
            .map((li) => li.textContent.trim()),
        );
        expect(sousLaCoche).toEqual([]);

        // Le bon logo pour le thème.
        await expect(
          page.locator(theme === 'dark' ? '.logo--sombre' : '.logo--clair'),
        ).toBeVisible();

        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        expect(
          axe.violations.map((v) => `${v.id} : ${v.nodes.map((n) => n.target).join(', ')}`),
        ).toEqual([]);

        expect(erreurs).toEqual([]);
      });
    }
  }
}
