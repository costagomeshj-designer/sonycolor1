# COSTAGOMESDJ | SONYCOLOR

Sitio web estático multipágina (HTML5, CSS3 y JavaScript ES6) para un DJ profesional.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio, noticias (AJAX con `fetch`) y música |
| `galeria.html` | Carrusel automático, cuadrícula y lightbox |
| `presupuesto.html` | Cotizador con desglose y descuentos |
| `contacto.html` | Formulario validado con regex y mapa Leaflet con ruta |
| `css/styles.css` | Estilos y diseño responsive |
| `js/*.js`, `js/noticias.json` | Lógica de cada página y datos de noticias |

## Reglas del presupuesto

Tarifa base según evento, +50 €/h desde la 3.ª hora, extras opcionales.
Descuentos: 10 % desde 6 h, 15 % desde 10 h y 5 % extra si se contratan los 3 extras.
Constantes editables al inicio de `js/presupuesto.js`.

## Ejecutar en local

`fetch` no funciona con doble clic (`file://`). Usa un servidor local:

```
python3 -m http.server 8000
```

y abre http://localhost:8000.

## Despliegue en GitHub Pages

1. Sube todo a un repositorio con `index.html` en la raíz.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Publicado en `https://<usuario>.github.io/<repositorio>/`.

Todas las rutas son relativas y en minúsculas, por lo que funcionan en subcarpetas.

## Pendiente de personalizar

- Coordenadas reales del estudio y origen por defecto de la ruta (`js/contacto.js`).
- Enlaces de inserción (embed) reales de Suno en `index.html`.
- Los formularios son de demostración: no envían datos a ningún servidor.
