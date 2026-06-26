# AvoPack — avopacking.com

Sitio web de **AvoPack**, empaque de aguacate en Ciudad Guzmán, Jalisco, México.
Página de una sola página (one-page), bilingüe español / inglés, responsiva.

## Estructura

```
index.html      Página principal con todas las secciones
styles.css      Estilos (colores de marca: verde y gris)
main.js         Toggle de idioma ES/EN, menú móvil y traducciones
assets/         Imágenes (logo y fotos) — ver assets/README.md
```

## Ver el sitio localmente

No necesita instalación ni compilación. Abre `index.html` en el navegador, o
levanta un servidor simple:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Publicar en Vercel

Es un sitio estático, Vercel lo detecta solo:

1. Entra a https://vercel.com e importa este repositorio de GitHub.
2. Framework Preset: **Other** (sin build). Output dir: raíz (`.`).
3. Deploy.
4. En **Settings → Domains**, agrega `avopacking.com` y sigue las
   instrucciones de DNS (apuntar el dominio a Vercel).

## Pendientes de contenido

- [ ] Subir `assets/logo.png` (el logo real).
- [ ] Reemplazar los *placeholders* de fotos por imágenes reales.
- [ ] Revisar textos de las secciones (ES/EN).
