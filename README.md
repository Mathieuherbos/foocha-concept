# Foocha — concept de redesign

Prototype statique (HTML/CSS/JS, aucune dépendance) inspiré du style de
[bigtroubleinchinatown.com](https://bigtroubleinchinatown.com/) appliqué au
contenu réel de [foocha.be](https://www.foocha.be/).

Ce n'est **pas** le site live de Foocha (qui tourne sur Odoo). C'est une
maquette pour visualiser une direction graphique avant tout vrai chantier.

## Ce qui a été repris de la référence (BTC)

- Fond crème/ivoire + section sombre pour la narration de marque
- Titres en display serif très lourd (ici "Fraunces") + sans-serif propre
  pour le corps ("Outfit"), accent script pour une touche signée ("Caveat")
- Structure : hero logo → histoire des fondateurs → menu en mosaïque d'images
  → horaires/réservation → upsell (gift cards chez BTC, apparel chez Foocha)
  → FAQ au titre clin d'œil → footer
- Ton décontracté mais avec du vrai contenu, pas de blabla IA

## Ce qui vient réellement de Foocha

- Toutes les photos de plats (poulet frit coréen, gyoza, wontons, yuzu
  lemonade) et le logo viennent de foocha.be
- Horaires, téléphone, email, réseaux sociaux : copiés tels quels
- Liens Menu / Bookings / Apparel pointent vers les vraies pages foocha.be
  (ce prototype ne refait pas la réservation ni la boutique)

## Lancer en local

Aucun build. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```
python3 -m http.server 8000
```

puis aller sur `http://localhost:8000`.

## Fichiers

```
index.html
css/styles.css
js/main.js
assets/logo.png
assets/dishes/*.jpg   (photos originales de foocha.be)
```
