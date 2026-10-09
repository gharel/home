import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Les six outils, dans l'ordre de l'arc-en-ciel Skazy Formation.
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
    nom: 'Prompthèque',
    couleur: 'violet',
    url: 'https://gharel.github.io/prompts/',
    icone: 'promptheque.svg',
  },
];

const ECRANS = [
  { nom: 'vidéoprojecteur', width: 1280, height: 720 },
  { nom: 'grand écran', width: 1920, height: 1080 },
  { nom: 'tablette', width: 820, height: 1180 },
  { nom: 'téléphone', width: 390, height: 844 },
  { nom: 'petit téléphone', width: 360, height: 740 },
];

/** Ouvre l'accueil, polices chargées, et renvoie la liste (vivante) des erreurs de la page. */
async function ouvrir(page) {
  const erreurs = [];
  page.on('console', (message) => message.type() === 'error' && erreurs.push(message.text()));
  page.on('pageerror', (erreur) => erreurs.push(erreur.message));
  await page.goto('./');
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

test('les six outils, dans l’ordre de l’arc-en-ciel, avec leur favicon', async ({ page }) => {
  await ouvrir(page);
  const cartes = page.locator('.carte');
  await expect(cartes).toHaveCount(OUTILS.length);
  const lanceur = page.locator('.lanceur__lien');
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

test('toutes les images se chargent', async ({ page }) => {
  await ouvrir(page);
  await page.waitForLoadState('load');
  const cassees = await page.$$eval('img', (images) =>
    images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
  );
  expect(cassees).toEqual([]);
  for (const chemin of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png']) {
    expect((await page.request.get(chemin)).ok(), chemin).toBe(true);
  }
});

test('toute la carte mène à l’outil', async ({ page }) => {
  await ouvrir(page);
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
  await ouvrir(page);
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
  await expect(bouton).toBeVisible();
  await expect(racine).not.toHaveAttribute('data-theme');
  await expect(bouton).toHaveAttribute('aria-label', /système/);

  await bouton.click();
  await expect(racine).toHaveAttribute('data-theme', 'light');
  await expect(bouton).toHaveAttribute('aria-label', /clair/);
  await page.reload();
  await expect(racine).toHaveAttribute('data-theme', 'light');

  await bouton.click();
  await expect(racine).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.logo--sombre')).toBeVisible();
  await expect(page.locator('.logo--clair')).toBeHidden();

  await bouton.click();
  await expect(racine).not.toHaveAttribute('data-theme');
  expect(await page.evaluate(() => localStorage.getItem('skazy-outils:theme'))).toBeNull();
});

for (const theme of ['light', 'dark']) {
  for (const ecran of ECRANS) {
    test(`mise en page et accessibilité : ${ecran.nom} (${ecran.width} px), thème ${theme}`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.setViewportSize({ width: ecran.width, height: ecran.height });
      const erreurs = await ouvrir(page);

      // Pas de défilement horizontal, rien qui dépasse de l'écran.
      const largeur = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        ecran: document.documentElement.clientWidth,
      }));
      expect(largeur.page).toBeLessThanOrEqual(largeur.ecran);
      const dehors = await page.evaluate(() =>
        [...document.querySelectorAll('body *')]
          .filter(
            (el) => el.getClientRects().length && !el.closest('svg[aria-hidden="true"][width="0"]'),
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
      await expect(page.locator(theme === 'dark' ? '.logo--sombre' : '.logo--clair')).toBeVisible();

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
