# Drop your hero photo here

Save your photo as **`hero.png`** in this folder, then run:

```bash
npm run portrait
```

It reads `assets/hero.png` and writes a background-free cutout to
`public/portrait.png`. The pass expects a subject on a flat white studio
background — which is exactly what a studio cutout is — and ramps alpha between
luminance 222 and 248 so hair edges stay soft.

If this file is missing, `npm run portrait` draws a neutral placeholder silhouette
instead, so the site always builds and the layout can always be reviewed. That is
the current state of this archive.

Then regenerate the social card so your face appears in it too:

```bash
npm run build
npm run preview                       # in one shell
npm run og -- http://localhost:4173   # in another
```