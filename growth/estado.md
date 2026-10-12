# Estado de Growth — Templo Ninja

Última actualización: 2026-10-07 (coordinador, semana del 2026-10-07).

## Cuello de botella actual
**De ver precios a comprar, y no sabemos si se compra:** `payment_succeeded` nunca llegó a PostHog (BL-013). Últimos 7 días hasta el 2026-10-07 (PostHog, proyecto 642163, usuarios únicos; producto 2026-10-07):

| Paso | Usuarios |
| --- | --- |
| Visitas (`$pageview`) | 253 |
| Empezaron una práctica | 62 |
| Terminaron una práctica | 47 |
| Vieron precios (`pricing_viewed`) | 26 (19 por límite sin cuenta, 7 por "upgrade") |
| Clic en pagar (`checkout_clicked`) | 7 (5 desde computadora sin UTM, probables pruebas propias) |
| Llegaron a Mercado Pago (`checkout_started`) | 3 |
| Pagaron (`payment_succeeded`) | 0 (evento sin medición confirmada) |

Gasto en Meta del 1 al 7/10: ARS 26.106 (marketing 2026-10-07); contribución marginal de la semana: ARS -26.106 si los ingresos fueron 0 (a confirmar contra Mercado Pago). Por anuncio (primera visita, 1 al 7/10): `velocidad` 116 usuarios, 43 practican, 7 ven precios, 1 clic en pagar (ARS 258 por practicante); `iq` 69 usuarios, 15 practican, 11 ven precios, 2 clics en pagar (ARS 889 por practicante). Retención: 0 de 41 practicantes con día siguiente medible volvió.

## Experimentos en curso

### `iq-desafio-directo` (OP-001), desde 2026-10-05
- **Quién:** visitantes del anuncio `iq` (`utm_content=iq`), 50/50 con el flag de PostHog. Solo cuentan los que además interactúan de verdad (`iq_exp_activated`): las cargas automáticas de Instagram, Facebook y Meta no entran (UX-001).
- **Cambio (`test`):** el botón principal de Ninja mental lleva al desafío de 5 minutos, y debajo del IQ aparece el plan ilimitado ($4.900, pago único). El IQ sigue siendo gratis.
- **Métrica que decide:** % de visitantes del anuncio que hacen clic en pagar (`checkout_clicked`). Línea de base: 1 de 42.
- **Señal temprana:** % que completa el desafío (`practice_completed` con `kind=desafio-5-min`). Línea de base: 1 de 13 que practican.
- **Métrica final:** compras por visitante (`payment_succeeded`); con este volumen, no concluyente.
- **Control de daños:** % de visitantes que empieza a practicar (`practice_started`).
- **Duración:** hasta 60 visitantes por grupo o 3 semanas (hasta el 2026-10-26), lo que ocurra primero.
- **Avance (2026-10-07):** 14 expuestos (control 6, test 8; `iq_exp_activated` 8 personas); clic en pagar 0 en control y 1 en test (Fisher exacto, p = 1,0). Sin veredicto. Ritmo de ~5 visitas reales por día de `iq`: llegaría a unos 50 por grupo en las 3 semanas, no a 60. Al 26/10 se aplica la regla con lo que haya; si hay menos de 30 por grupo se informa "sin diferencia medible" y se decide el paso siguiente con Facundo.
- **Regla de decisión:** si `test` duplica o más el % de clic en pagar sin bajar el % que practica, pasa al 100% y se aplica lo mismo al anuncio `velocidad` (directo a la medición de 1 minuto). Si no se mueve, se descarta y se revisa el precio.
- **Cambio en Meta (2026-10-05):** se pausó el anuncio `templo` (13 visitantes, ninguno practicó) para concentrar el presupuesto en `iq`.

## Cambios recientes a vigilar
- **2026-10-05, plan gratis de 3/6 a 5/10 prácticas por día.** Revisar el 19/10: clics en pagar por visitante real y vistas de precios por motivo. Si los clics bajan, volver a 3/6.

- **2026-10-05, versión profesional (BL-010):** página `/profesional`, pista 🧩 Lógica y series (también la ven los dos grupos de `iq-desafio-directo`, que arranca el mismo día) y simulacro estilo Mercado Libre. Revisar el 19/10: `pro_cta_clicked`, prácticas de lógica y simulacros por empresa, y si llevan a ver precios y a pagar.

## Propuesto para empezar (esperan a Facundo)

### `velocidad-directo` (BL-002), segmento `velocidad`
- **Hipótesis:** quien llega desde el anuncio `velocidad` hace la medición de 1 minuto que promete y ve la oferta junto al resultado; hoy 7 de 116 ven precios.
- **Variantes (flag 50/50, solo con `utm_content=velocidad` y primera interacción real):** control = el flujo actual; `test` = el anuncio abre directo la medición de 1 minuto y, al terminar, aparece el plan ilimitado ($4.900, pago único) junto al resultado. La medición sigue siendo gratis.
- **Métrica que decide:** % de visitantes reales que ven precios (`pricing_viewed`). Línea de base: 7 de 116 (6%).
- **Señal temprana:** % que termina la medición de 1 minuto. **Control de daños:** % que empieza una práctica (línea de base 43 de 116, 37%).
- **Muestra y duración:** 60 visitantes reales por grupo o 2 semanas (~19 reales por día, ~1 a 2 semanas), lo que ocurra primero.
- **Regla (escrita antes de empezar):** **gana** si `test` duplica o más el % que ve precios y el % que practica no baja más de 10 puntos porcentuales; **pierde** si el % que practica baja más de 10 puntos o el % que ve precios es menor que en control; en cualquier otro caso, **sin diferencia** (se descarta y se revisa la oferta). Con 60 por grupo, pasar de 6% a 12% es una diferencia chica para detectar: se informa Fisher exacto y se dice qué tan seguro es.

## Próximo
Ver `growth/backlog.md`. Esta semana (1 experimento y 3 arreglos):
- **BL-013** (arreglo 1): medición de pagos, `api/_billing.js:80` y el aviso de Mercado Pago. Va primero.
- **BL-002** (experimento nuevo, a aprobar).
- **BL-014** (arreglo 2): LCP del celular en la primera pantalla de `index.html`.
- **BL-015** (arreglo 3): camino de registro que no pasa por "crear cuenta".
- **BL-003**: investigar el abandono al crear la cuenta (producto, sin video).
- **Pospuesto:** BL-011 hasta cerrar `iq-desafio-directo` (~26/10).

## Pedidos del coordinador
Cada rutina responde primero lo que le toca, en una sección "Pedidos del coordinador" de su informe.
- **Producto:** (1) BL-003 sin video: para quienes tocaron "crear cuenta" (`signup_prompt_clicked`), la secuencia de eventos siguiente y cuánto tardan en `signed_up`; (2) BL-015: ¿qué otro camino de registro existe? (3) BL-013: ¿el aviso de Mercado Pago llega a `api/_billing.js` y por qué `payment_succeeded` nunca se dispara?; (4) confirmar que `$exception` se captura.
- **Marketing:** ARS por vista de precios y por clic en pagar de `velocidad` e `iq` por separado, y visitas reales por día de `/profesional` (campaña Profesional, MK-006) cuando Facundo confirme su estado.
- **Research:** una fuente pública de 2026 (página de empleo de la empresa) para Mercado Libre, Techint, BBVA y Accenture; mientras tanto, nada de `/profesional` con empresas sin fuente leída completa.

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
