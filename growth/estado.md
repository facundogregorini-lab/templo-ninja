# Estado de Growth — Templo Ninja

Última actualización: 2026-10-12 (coordinador, semana del 2026-10-12).

## Cuello de botella actual
**De ver precios a hacer clic en pagar, y la vuelta al día siguiente.** Últimos 7 días hasta el 12/10 (PostHog, proyecto 642163, usuarios únicos; producto 2026-10-12), contra los 7 anteriores:

| Paso | Esta semana | Semana anterior |
| --- | --- | --- |
| Visitas (`$pageview`; unas 60 son automáticas) | 739 | 118 |
| Empezaron una práctica | 299 | 28 |
| Terminaron una práctica | 204 | 24 |
| Vieron precios (`pricing_viewed`; 47 por límite, 12 por "upgrade") | 56 | 14 |
| Clic en pagar (`checkout_clicked`) | 3 (ninguno desde un anuncio) | 3 |
| Llegaron a Mercado Pago | 3 | 2 |
| Pagaron (`payment_succeeded`) | 1 ($4.900 el 7/10, sin UTM; puede ser una prueba propia) | 0 |

- **Anuncio `velocidad`** (6 al 12/10, marketing): ARS 25.376 (74% del gasto), 462 usuarios, 241 practican (ARS 105 por practicante, antes 258), 37 ven precios, **0 clic en pagar**.
- **Vuelta:** 12 de 522 personas (2%) volvieron otro día (producto); por cohortes de practicantes del 6 al 10/10, 9 de 208 (4,3%) volvieron al día siguiente (marketing). Parte se pierde por medición (el navegador de Instagram no comparte almacenamiento).
- **Gasto en Meta 6 al 12/10:** ARS 34.253. Ingresos: ARS 4.900 (bruto, un pago). Contribución marginal: **−ARS 29.353**.

## Experimentos
**Cerrados el 11/10 por Facundo (PR #54), sin veredicto por la regla escrita:**
- `iq-desafio-directo` (BL-001): la regla pedía 60 por grupo o 3 semanas (26/10); se cerró antes. Expuestos: control 6, test 11; clic en pagar 0 y 1 (Fisher exacto p = 1,0). **Sin diferencia medible.** Queda la versión original.
- `precio-oferta-24h`: control 13, test 14, 0 clic en pagar en ambos. **Sin ganador.** Vuelve el precio base.

### `home-nueva` (A/B de la portada `/` contra `/nueva`), desde 2026-10-11 (PR #53)
- **Quién:** todos los visitantes nuevos de `/` (la cookie `tn_home` los reparte 50/50; los robots ven siempre la actual). Cubre **todos los segmentos**, así que mientras corra **no arranca ningún otro experimento**.
- **Cambio:** `nueva` = portada nueva (Mi dojo, desafíos rápidos, batallas, cinturones) en la misma dirección.
- **Avance (PostHog, desde el 11/10 20:00 hasta el 12/10, personas por `home_ab`):** `actual` 40 expuestos, 19 empiezan, 14 terminan, 2 cuentas, 3 ven precios, 0 clic en pagar; `nueva` 61 expuestos, 27 empiezan, 21 terminan, 1 cuenta, 8 ven precios, 0 clic. Sin veredicto (volumen bajo, un día). Producto avisa que `home_ab_exposure` (37 + 60) y las personas por `home_ab` no coinciden del todo.
- **Regla de decisión (propuesta por el coordinador, a aprobar por Facundo; se escribe antes de tener volumen):**
  - **Métrica que decide:** % de expuestos que terminan una práctica (`practice_completed`). La conversión principal del README (`signed_up`) da 1 a 2 cuentas por grupo: no alcanza para decidir.
  - **Control de daños:** cuentas (`signed_up`) más vistas de precios por expuesto no bajan a menos de la mitad que en `actual`.
  - **Muestra y duración:** 200 expuestos reales por grupo o hasta el 2026-10-26, lo que ocurra primero.
  - **Gana `nueva`** si termina práctica al menos 10 puntos porcentuales más que `actual` y el control de daños se cumple. **Pierde** si baja 10 puntos o más, o falla el control de daños. En otro caso, **sin diferencia**: se queda la más simple de mantener (`actual`) y lo decide Facundo.
  - Se informa Fisher exacto y qué tan seguro es. Pasar al 100% (`AB_HOME_FORCE`) es una decisión de Facundo.

## Cambios recientes a vigilar
- **2026-10-05, plan gratis de 3/6 a 5/10 prácticas por día.** Revisar el 19/10: clics en pagar por visitante real y vistas de precios por motivo. Dato hasta hoy: 66 personas llegaron a 5 prácticas en el día, 47 vieron precios por el límite; 3 clics en pagar en la semana (misma cifra que antes del cambio, con 6 veces el tráfico).
- **2026-10-05, versión profesional (BL-010):** `pro_cta_clicked` 9 eventos de 5 personas en 14 días, sin pagos asociados. La campaña "TN | Profesional | AR | Test01" figura **pausada**, gasto 0 (marketing). Revisar el 19/10.
- **2026-10-09, 6 Reels nuevos** (conjunto "Vieron precios - Reels"): ARS 695 por practicante contra 105 de `velocidad` (poco volumen). Revisar el 19/10.
- **Presupuesto de campaña** pasó de $5.000 a $6.000 por día (no consta quién; pregunta a Facundo).

## Próximo
Ver `growth/backlog.md`. Esta semana: **ningún experimento nuevo** (`home-nueva` ocupa todos los segmentos), 3 arreglos y 1 investigación:
- **BL-019** (arreglo 1, medición): medir bien la vuelta (cuenta, `$webview_app`, evento de retorno) en `analytics.js`.
- **BL-018** (arreglo 2): velo del teclado en el celular (evento `typing_veil_shown` y texto), `app.js:787-788` e `index.html:295`.
- **BL-015** (arreglo 3): camino de registro sin medir (17 `signed_up` contra 15 toques) y `feedback_sent` en 0 de 8 aperturas.
- **BL-025** (investigar, producto, sin tocar la app): por qué 0 de las 56 personas que ven precios hacen clic en pagar.
- **BL-002** (`velocidad-directo`): **postergado** hasta cerrar `home-nueva` y tener BL-025 (decisión de Facundo).

## Pedidos del coordinador
Cada rutina responde primero lo que le toca, en una sección "Pedidos del coordinador" de su informe.
- **Producto:** (1) BL-025: de las personas que vieron precios (por límite y por "upgrade") y no hicieron clic en pagar, ¿qué hicieron con el diálogo (cerrar, tiempo abierto, scroll, volver a practicar)? Usar eventos y los resúmenes de sesión, por motivo de apertura. (2) Revisar la asignación de `home-nueva`: ¿por qué `home_ab_exposure` y las personas por `home_ab` no coinciden? (3) Verificar los arreglos de la semana (BL-019, BL-018, BL-015) si ya están aplicados.
- **Marketing:** (1) ARS por vista de precios y por clic en pagar de `velocidad`, separando `iq` por `utm_source` (Meta contra Google, MK-009). (2) Dejar al 19/10 el balance de los Reels (100 clics o 20% de practicantes). (3) Qué anuncio y qué `utm` tiene el pago del 7/10 (el evento llegó sin UTM).
- **Research:** cómo muestran Ratatype, Keybr y TypingClub el momento del bloqueo por límite diario (texto del diálogo, precio, qué ofrecen antes de pedir pago), solo con fuente pública enlazada y fecha. Sirve para BL-025. Las empresas argentinas (BL-006) quedan esperando a que una persona abra las páginas de Glassdoor.

## Estructura de Growth
| Rutina | Cuándo (hora de Argentina) | Entrega | Instrucciones |
| --- | --- | --- | --- |
| Status diario | todos los días, 8:47 | email | `growth/status/PROMPT.md` |
| Coordinador | lunes 9:13, después de las tres semanales | un PR con todo + email | `growth/coordinador/PROMPT.md` |
| Producto y CRO | lunes 7:21 | PR + email a las 9:00 | `growth/producto/PROMPT.md` |
| Adquisición y retención | lunes 7:34 | PR + email a las 9:00 | `growth/marketing/PROMPT.md` |
| Research de mercado | lunes 7:48 | PR + email a las 9:00 | `growth/research/PROMPT.md` |

Dashboards de PostHog: "Growth · Producto y CRO", "Growth · Adquisición", "Growth · Retención" y
"Templo Ninja · Embudo de conversión".
