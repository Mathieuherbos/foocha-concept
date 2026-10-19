# Foocha — concept de redesign

**En ligne :**
- v2, style BTC : https://mathieuherbos.github.io/foocha-concept/
- hybride (v1 x v2) : https://mathieuherbos.github.io/foocha-concept/hybrid.html

Prototype statique (HTML/CSS/JS, aucune dépendance) qui transpose le système
de design de [bigtroubleinchinatown.com](https://bigtroubleinchinatown.com/)
(tokens, composants, rythme de section, motion) sur le vrai contenu de
[foocha.be](https://www.foocha.be/). Aucun asset de marque de BTC n'est
copié (logo, dragon, pièces, idéogrammes) — seulement les mécanismes.

Ce n'est **pas** le site live de Foocha (qui tourne sur Odoo). C'est une
maquette pour visualiser une direction graphique avant tout vrai chantier.

## Système de design transposé

- **Tokens** (`css/tokens.css`) : palette à fond plein par section (ivoire,
  encre, sang, ciel, néon rouge/vert), échelle fluide en `clamp()`,
  `html{font-size:62.5%}` → 1rem = 10px
- **Polices** : Fraunces (titres + corps, 300→900 — remplace Albertus Nova ;
  Marcellus n'existe qu'en 400 et ne tenait pas la casse majuscule du H2),
  Archivo (boutons/UI, remplace Helvetica Now), Sarina (accent script, rare)
- **Composants** : bouton double-anneau (`.btn`), encadré double filet avec
  titre à cheval sur la ligne (`.frame-double`), accordéon FAQ, off-canvas
  (nav + réservation), lightbox menu, sceaux SVG originaux, emblème footer
- **Motion** : reveal au scroll en fade pur (`data-reveal` + IntersectionObserver,
  une seule fois, cascade de délais par section — voir `js/main.js`), hero
  jour/nuit selon l'heure locale avec variante néon + flicker discret,
  `prefers-reduced-motion` respecté partout

## Mapping section → pattern de référence

| Section | Pattern BTC |
|---|---|
| Hero | Enseigne jour/nuit, logo seul, un CTA (pas de nav classique) |
| Tales from Foocha | Récit sur illustration line-art (SVG original, pas le dragon de BTC), fond encre |
| Our menu | Encadré double filet, titre qui coupe le filet |
| Photo plein écran | Full-bleed + 2 sceaux SVG originaux (pas les pièces dorées de BTC) |
| Tables go fast | CTA réservation, fond sang, horaires intégrés |
| Wear the canteen | CTA néon secondaire, fond encre, visuel en trio de photos qui se chevauchent |
| Fooch, actually | FAQ accordéon, fond ciel |
| Footer | Emblème circulaire (monogramme F néon, pas le logo BTC), barre encre |

Navigation : pas de nav sticky (fidèle à la référence) — un simple burger
crème en haut à droite ouvre un panneau plein écran (choix validé avec
Mathieu plutôt que de supprimer toute navigation).

## Ce qui vient réellement de Foocha

- Toutes les photos de plats et le logo viennent de foocha.be
- Adresse réelle (Rue de Flandre 17, 1000 Bruxelles), horaires, téléphone,
  email, réseaux sociaux : copiés tels quels
- Les 4 pages du menu dans la lightbox sont les vraies images menu de
  foocha.be (plats + prix, drinks, lunch, vocabulaire)
- Le panneau de réservation charge en lazy-load le vrai `foocha.be/bookings`
  dans une iframe (avec repli "appeler" / "ouvrir dans un nouvel onglet" si
  l'iframe ne charge pas)
- Lien Apparel pointe vers la vraie boutique foocha.be (pas refaite ici)

## Lancer en local

Aucun build. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```
python3 -m http.server 8000
```

puis aller sur `http://localhost:8000`.

## Deux versions sur ce repo

- **`index.html`** (v2) : transposition fidèle du système BTC décrit ci-dessus
  — fond plein par section, boutons double-anneau, encadré double filet,
  hero jour/nuit néon, pas de nav classique (burger off-canvas)
- **`hybrid.html`** (v3) : structure plus proche de la v1 (nav visible,
  photos au premier plan), même typographie/composants que la v2, mais
  dans la vraie identité Foocha (menthe `#9cd6c0` + noir, pas le système
  multi-teintes de BTC) et avec 6 vrais plats + vrais prix affichés
  directement sur la page plutôt que renvoyés dans la lightbox

Les deux pages se renvoient l'une à l'autre via le bandeau du haut.

## Fichiers

```
index.html
hybrid.html
css/tokens.css      (partagé)
css/styles.css      (v2)
css/hybrid.css      (v3)
js/main.js           (v2)
js/hybrid.js         (v3)
assets/logo.png
assets/dishes/*.jpg     (photos originales de foocha.be)
assets/menu/*.webp,jpg  (vraies pages du menu foocha.be, pour la lightbox)
```
