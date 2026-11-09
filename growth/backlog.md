# Backlog de Growth

Único backlog priorizado. Lo mantiene el coordinador (`growth/coordinador/PROMPT.md`). Puntaje = Impacto ×
Confianza × Facilidad (cada uno de 1 a 10). Nunca se borran filas.

Segmentos de tráfico: `iq` (anuncio iq), `velocidad` (anuncio velocidad), `resto` (orgánico, directo,
referidos y otros anuncios). Un experimento por segmento a la vez.

## Abiertas

| BL | Origen | Idea | Paso del embudo | Segmento | I | C | F | Puntaje | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BL-001 | OP-001 | El anuncio `iq` lleva directo al desafío de 5 min y la oferta aparece junto al IQ | ver precios → clic en pagar | iq | 7 | 5 | 8 | 280 | **cerrada** 2026-10-11 (sin ganador; ver Cerradas) |
| BL-002 | OP-001 (variante) | El anuncio `velocidad` lleva directo a la medición de 1 minuto que promete, con la oferta junto al resultado | visita → práctica → ver precios | velocidad | 7 | 6 | 8 | 336 | backlog (pausado: el anuncio `velocidad` y Meta están apagados; sin evidencia de que se corriera) |
| BL-003 | UX-003 | Entender por qué casi nadie termina la cuenta al llegar al límite (12 → 2): grabaciones antes de cambiar nada; rehacer con los muros por cinturón | límite → cuenta | todos | 5 | 4 | 9 | 180 | **próximo** (investigar: producto) |
| BL-004 | UX-002 | En el celular, mostrar primero Ninja mental (el teclado de la pantalla arruina la lección de tipeo) | práctica | resto | 4 | 5 | 7 | 140 | **aplicado** en `/nueva` (puente del celular, README); efecto sin medir |
| BL-005 | OP-002 | Certificado verificable incluido en el aporte, empezando por un botón para medir la demanda | resultado → clic en pagar | iq o velocidad | 6 | 4 | 7 | 168 | backlog (después de BL-001 y BL-002: toca las mismas pantallas) |
| BL-006 | OP-003 | Simulacros del test de una empresa argentina | nuevo segmento | nuevo anuncio | 7 | 2 | 5 | 70 | **en curso**: el primero (estilo Mercado Libre) salió con BL-010; falta validar demanda con un anuncio hacia `/profesional` (a aprobar) |
| BL-013 | OP-005 | Oferta suave (no bloqueante) al terminar la práctica | práctica → ver precios | todos | 7 | 4 | 7 | 196 | backlog (después del A/B de la portada) |
| BL-014 | MK-008 | Entender el canal Google (`utm_source=google`): gasto y costo por practicante | adquisición | todos | 6 | 5 | 9 | 270 | **próximo** (pregunta a Facundo) |
| BL-015 | OP-005 / research | `payment_succeeded`, `checkout_clicked` y `pricing_viewed` con `utm_source`/`utm_content` | medición | todos | 5 | 8 | 9 | 360 | **próximo** (arreglo) |
| BL-016 | MK-009 | Reconciliar compras de Meta (3) con PostHog (2) y revisar el píxel | medición | todos | 4 | 7 | 8 | 224 | **próximo** (arreglo) |
| BL-017 | producto | Conectar el proyecto 642163 a la rutina de Producto | proceso | — | 5 | 9 | 9 | 405 | **próximo** (arreglo, Facundo) |
| BL-011 | BL-010 | Razonamiento verbal en español (analogías, sinónimos, comprensión con verdadero, falso o no se puede saber); después, juicio situacional | práctica | todos | 7 | 6 | 4 | 168 | **próximo**: es parte de todo psicotécnico en español y es el hueco que marca `/profesional` (relevamiento del 2026-10-05) |
| BL-012 | relevamiento | Pista de atención y concentración (estilo Toulouse) | práctica | todos | 4 | 4 | 6 | 96 | backlog (los referentes no la priorizan) |

## Cerradas

| BL | Origen | Idea | Estado | Resultado |
| --- | --- | --- | --- | --- |
| BL-007 | UX-001 / MK-001 | Contar solo personas reales: activación del experimento y visitas reales por anuncio | **aplicado** 2026-10-05 | Evento `iq_exp_activated` y tabla "Visitas reales por anuncio" en PostHog |
| BL-008 | MK-002 | Recordatorio por email para volver a practicar | **descartado** 2026-10-05 (decidió Facundo) | — |
| BL-009 | MK-003 | Optimizar el conjunto de Meta por la conversión "Practica" | **descartado** 2026-10-05 (decidió Facundo) | — |
| BL-010 | Facundo | Versión profesional: `/profesional` al estilo de practiceaptitudetests.com, en español y con empresas argentinas; pista 🧩 Lógica y series; simulacro estilo Mercado Libre (40 preguntas, 30 min) | **aplicado** 2026-10-05 (decidió Facundo) | Medir: `pro_cta_clicked` por `cta`, prácticas con `track=log` y `company=meli`, y si quienes usan la pista de lógica ven precios y hacen clic en pagar más que el resto |
| BL-001 | OP-001 | El anuncio `iq` va directo al desafío de 5 min | **cerrada** 2026-10-11 | Quedó la versión original; sin ganador documentado |
