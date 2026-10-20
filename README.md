# AvoPack — avopacking.com

Sitio web de **AvoPack**, empaque de aguacate en Ciudad Guzmán, Jalisco, México.
Página de una sola página (one-page), bilingüe español / inglés, responsiva.

## Estructura

```
index.html      Página principal con todas las secciones
styles.css      Estilos (colores de marca: verde y gris)
main.js         Toggle de idioma ES/EN, menú móvil y traducciones
assets/         Imágenes (logo y fotos) — ver assets/README.md
tienda/         La tienda en línea (avopacking.com/tienda/) — ver abajo
```

## La tienda en línea (`/tienda/`)

Venta directa a casas y negocios de **Ciudad Guzmán y alrededores**: el cliente arma su pedido,
lo manda desde la página y le llega por correo el link de pago de Mercado Pago. Pedidos de lunes
a sábado hasta las 6 pm; entrega a domicilio el martes. Sólo español.

```
tienda/index.html     La página
tienda/tienda.css     Lo que la página agrega a styles.css
tienda/tienda.js      Productos, carrito, área de entrega y envío de formularios
tienda/precios.json   Los precios de la semana
tienda/zonas.json     A dónde entregamos y cuánto cuesta el envío
tienda/gracias.html   Para quien manda un formulario sin JavaScript
```

**Cada semana, los precios** (`tienda/precios.json`): precio por pieza = (plantilla de venta del
calibre + $19) × kilos, redondeado al precio terminado en 9 más cercano (la malla, al peso). La
malla usa el renglón de Tercera. Cambia `vigentes_desde` a la fecha de la plantilla. Lo ya pagado
conserva su precio.

**El área de entrega** (`tienda/zonas.json`): cada zona tiene sus municipios (con km por
carretera desde Ciudad Guzmán), su `envio` y desde cuántos kilos el envío no cuesta
(`envio_gratis_desde_kg`), y el pedido mínimo de un negocio (`minimo_negocio_kg`).
`proximamente` son los municipios a los que todavía no llegamos: ahí la página ofrece
«Avísame».

Cada municipio lleva también sus **códigos postales**: `cp_ciudad` (la ciudad y sus colonias: se
entrega) y `cp_comunidad` (comunidades y ranchos: se le confirma por correo antes de cobrarle).
El cliente puede escribir su código postal arriba de la tienda en lugar de escoger municipio, y
el pedido lo pide y revisa que sea del municipio escogido. Lo último que el cliente revisó se
queda en una franja bajo el encabezado y en su teléfono.

Las listas se armaron el 20-oct-2026 con el catálogo de Correos de México (SEPOMEX): ciudad = un
código con alguna colonia urbana; todo Zapotlán es ciudad; en Gómez Farías, San Sebastián del Sur
(49120) y San Andrés Ixtlán (49130). **El catálogo de Correos es para uso particular y no se puede
redistribuir**, así que aquí sólo va nuestra lista de códigos con entrega, sin nombres de colonias.
Para agregar un municipio, se consultan sus códigos en Correos y se copian los números.

**Lo que llega por correo** (a avopack.empaque@gmail.com, por FormSubmit, igual que el contacto):
los pedidos (con su detalle, envío y total), las altas de negocio y los «Avísame». Ningún
formulario pide teléfono. La lista de precios de negocio no está en la página: se manda por
correo a los negocios dados de alta.

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
