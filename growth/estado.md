# Estado de Growth — Templo Ninja

Última actualización: 2026-11-02 (coordinador, semana del 2026-11-02). Esta versión parte de la memoria del 2026-10-12 (PR #59, que seguía sin mergear) y de los informes de las tres rutinas del 2026-11-02.

## Cuello de botella actual
**Que alguien vea la oferta y haga clic en pagar.** Usuarios únicos por semana lunes a domingo (PostHog, proyecto 642163, consultado el 2026-11-02. El lunes 2/11 hasta las 9:30 hubo 16 visitas, 8 terminaron una práctica y ninguna vio precios):

| Paso | 5/10 | 12/10 | 19/10 | 26/10 |
| --- | --- | --- | --- | --- |
| Visitas (`$pageview`) | 676 | 1.080 | 1.134 | 384 |
| Empezaron una práctica | 267 | 528 | 521 | 173 |
| Terminaron una práctica | 179 | 351 | 367 | 124 |
| Vieron precios (`pricing_viewed`) | 46 | 72 | 20 | 7 |
| Clic en pagar (`checkout_clicked`) | 3 | 3 | 2 | 0 |
| Pagos (`payment_succeeded`) | 1 | 1 | 0 | 0 |
| Cuentas (`signed_up`) | 14 | 19 | 35 | 14 |

- **Vistas de precios por persona que termina una práctica:** 26% → 21% → 5% → 6%. **Inferencia:** la caída empieza la semana del 19/10, después de los cambios del 14 y 15/10 en el inicio, las Batallas y el "muro por cinturón" (PR #61 a #63: registro al ganar el blanco, pago al ganar el amarillo). La semana del 12/10, con el plan gratis de 5/10 ya vigente, tuvo el máximo de vistas (72). Por eso el plan de 5/10 por sí solo no explica la caída.
- **Pagos:** 2 en cinco semanas, $4.900 cada uno (7/10 y 13/10), ambos sin UTM (PostHog). No se sabe si fueron reales ni su neto en Mercado Pago.
- **Gasto en la campaña "Templo Ninja | Registro" (Meta, lunes a domingo):** ARS 35.670 (5/10), 42.744 (12/10), 41.513 (19/10) y 8.002 (26/10). Campaña **pausada el 27/10** (marketing, registro de actividad). Contribución marginal bruta de las 4 semanas: ingresos ARS 9.800 menos gasto ARS 127.930 = **−ARS 118.130**.
- **Tráfico:** el anuncio `velocidad` pasó de ~84 a 109 visitantes por día (24 al 26/10) a 0 a 2 desde el 28/10 (PostHog, `utm_content`). Quedan `iq` (12 a 31 por día) y `teclado` (4 a 12 por día): unas 35 visitas por día en total.

## Experimentos
**Cerrados** (11/10, Facundo, PR #54): `iq-desafio-directo` (sin diferencia medible, control 6 y test 11 expuestos, p = 1,0) y `precio-oferta-24h` (sin ganador). El código ya no usa esos flags; por eso hoy no hay `iq_exp_activated` ni `$feature_flag_called` (producto lo marcó como medición rota: **no es un bug**).

### `home-nueva` (`/` contra `/nueva`), desde 2026-10-11 (PR #53): regla aplicada → **sin diferencia, se queda `actual`** (cierre pendiente de Facundo)
- **Regla (propuesta por el coordinador el 12/10 en el PR #59, que no se mergeó: no consta aprobación escrita, pero es la única regla escrita antes de tener volumen; decide el % de expuestos que terminan una práctica, +10 puntos para ganar, control de daños en cuentas más vistas de precios, 200 por grupo o hasta el 26/10):** se aplica tal como está escrita.
- **Datos** (personas con `home_ab_exposure` del 11/10 18:00 al 26/10, y lo que hicieron desde su primera exposición hasta el 2/11): `actual` 1.151 expuestos, 394 terminan (34,2%), 579 empiezan, 29 cuentas, 39 ven precios, 2 clics en pagar, 1 pago; `nueva` 1.199 expuestos, 354 terminan (29,5%), 515 empiezan, 25 cuentas, 48 ven precios, 2 clics, 0 pagos.
- **Lectura:** diferencia −4,7 puntos en terminar práctica (Fisher exacto p = 0,015): `nueva` termina algo menos, pero no llega a los −10 de la regla. Control de daños: cuentas más precios por expuesto 6,1% (`nueva`) contra 5,9% (`actual`): se cumple. **Veredicto por la regla: sin diferencia.** La regla manda quedarse con `actual` (la más simple de mantener) y decide Facundo. Con 1.151 y 1.199 por grupo el volumen alcanza; el problema es que ninguna de las dos portadas mueve precios ni pagos.
- Cortar el test (`AB_HOME_FORCE=actual`) es una decisión de Facundo. Mientras corra, ocupa todos los segmentos y no puede arrancar otro experimento.

## Plan de la semana (todo a aprobar por Facundo; un experimento nuevo y tres arreglos)
- **Experimento `oferta-post-medicion` (BL-026)**, arranca solo cuando se corte `home-nueva`. Ficha completa en el informe del coordinador del 2026-11-02 y regla escrita abajo.
- **Arreglos:** BL-019 (medir la vuelta), BL-018 (velo del teclado en el celular) y BL-015 (registro y feedback). Eran los de la semana del 12/10 y en main no hay rastro de ninguno (sin `typing_veil_shown` ni evento de retorno en el código): pasan otra semana.
- **Investigar, sin tocar la app:** BL-025 (por qué no hacen clic en pagar).

### Regla escrita de `oferta-post-medicion` (BL-026)
- **Quién:** visitantes nuevos de todos los anuncios y orgánico, 50/50 (flag de PostHog `oferta-post-medicion`); solo cuentan las personas que terminan su primera práctica.
- **Cambio (`test`):** al terminar la primera práctica aparece una tarjeta con el resultado y el plan ilimitado ($4.900, pago único) con botón de pagar y "seguir gratis" visible. `control`: como hoy (muro de cinturón y límite diario).
- **Métrica que decide:** % de quienes terminan su primera práctica que ven precios y hacen clic en pagar. Línea de base: 6 de 114 ven precios (5%) y 0 clics en la semana del 26/10; 20 de 367 y 2 clics la del 19/10.
- **Señal temprana (7 días):** % que ve precios, con motivo propio (`post_primera_practica`).
- **Control de daños:** % de los que terminan que empiezan otra práctica ese día (`practice_started`) no baja más de 10 puntos contra `control`.
- **Muestra y duración:** 60 que terminan por grupo o 3 semanas, lo que ocurra primero (hoy terminan ~120 por semana, así que se llega en una o dos semanas).
- **Regla de decisión:** **gana** si en `test` ven precios al menos 15% (3 veces el 5% de línea de base) **y** hay al menos 3 clics en pagar en `test` contra no más de 1 en `control`, con el control de daños cumplido. **Pierde** si el control de daños falla. En otro caso, **sin diferencia** y vuelve la versión original. Se informa Fisher exacto. Pasar al 100% es decisión de Facundo.

## Cambios recientes a vigilar
- **2026-10-05, plan gratis de 3/6 a 5/10 prácticas por día.** La revisión del 19/10 estaba pendiente: los clics en pagar por visitante bajaron (3 de 676, 3 de 1.080, 2 de 1.134, 0 de 384), así que la regla de volver a 3/6 se cumpliría. **Pero** la caída de vistas de precios coincide con los cambios del 14 y 15/10 (inferencia); la recomendación del coordinador es no volver a 3/6 solo y probar BL-026. Decide Facundo.
- **2026-10-14/15, Batallas y muros por cinturón (PR #61 a #63):** el pago aparece al ganar el cinturón amarillo y el registro al ganar el blanco. `belt_gate_shown` 37 personas y `belt_gate_dismissed` 23 en la semana del 26/10 (producto). Mirar qué hacen con el muro (BL-025).
- **2026-10-05, `/profesional` (BL-010):** `pro_cta_clicked` 12 eventos en 5 semanas; campaña Profesional pausada, gasto 0.
- **2026-10-27, campaña "Templo Ninja | Registro" pausada** (Facundo). El presupuesto de la cuenta se va a "MARU | Límite gratuito", otro producto (ARS 71.904 la semana del 26/10; fuera del alcance de este informe).

## Próximo
Ver `growth/backlog.md`. Esta semana: BL-026 (experimento, a aprobar), BL-019, BL-018 y BL-015 (arreglos), BL-025 (investigar).

## Pedidos del coordinador
Cada rutina responde primero lo que le toca, en una sección "Pedidos del coordinador" de su informe. Los de la semana pasada no se respondieron porque las rutinas de hoy partieron de un main sin esta memoria: **se repiten con los nuevos**.
- **Producto:** (1) **BL-025:** de las personas que vieron precios o el muro (por motivo) y no hicieron clic en pagar, ¿qué hicieron con el diálogo (cerrar, tiempo abierto, volver a practicar)? Datos de las 145 vistas de precios de las últimas 4 semanas y de `belt_gate_shown`. (2) ¿Cuándo exactamente cayeron las vistas de precios por día (antes y después del 14 y 15/10) y por motivo? Confirma o descarta la inferencia de arriba. (3) Verificar si BL-019, BL-018 y BL-015 están aplicados. (4) Revisar la asignación de `home-nueva`: `home_ab_exposure` contra personas por `home_ab` (la semana del 12/10 no coincidían).
- **Marketing:** (1) **Antes de consultar PostHog, cambiar al proyecto 642163 con `switch-project`** (resuelve MK-010: la conexión empieza en otro proyecto y producto y research ya lo hicieron así). (2) ARS por práctica, por vista de precios y por clic en pagar por anuncio, con PostHog, para las semanas con gasto (5/10 al 26/10). (3) Cruzar las 2 compras que Meta atribuye a `velocidad` con los 2 pagos de PostHog (7/10 y 13/10, sin UTM). (4) `iq` por `utm_source` (Meta contra Google, MK-012/MK-009).
- **Research:** (1) **BL-025:** cómo muestran Ratatype, Keybr y TypingClub el momento del bloqueo por límite y la primera oferta (texto, precio, qué ofrecen antes de pedir pago); sirve también para BL-026 (¿ofrecen pagar tras el primer resultado?). Solo con fuente pública enlazada y fecha. (2) BL-006 sigue en pausa: sin fuente 2026 no se agregan empresas.

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
