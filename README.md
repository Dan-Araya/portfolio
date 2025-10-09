# Birds Test (Matter.js)

Pequeña demo estilo honda (tipo Angry Birds) usando Matter.js, organizada en módulos.

## Estructura

```
root/
├── config/
├── entities/
├── systems/
├── ui/
├── utils/
├── js/
├── img/
├── css/
├── index.html
├── README.md
└── ARCHITECTURE.md
```

## Cómo ejecutar

Abre `index.html` con un servidor local (recomendado) para evitar restricciones de módulos.

Opciones rápidas en Linux/macOS:

- Python 3:
  - `python3 -m http.server 8080`
  - Visita http://localhost:8080/

- Node.js (http-server):
  - `npx http-server -p 8080`

## Controles

- Arrastra el círculo rojo hacia atrás para tensar la honda.
- Suelta para lanzar. Se resetea al salir de la pantalla.

## Créditos

- [Matter.js](https://brm.io/matter-js/)
