# Canales y anuncios

## Meta Ads — campaña "Templo Ninja | Registro | AR | Test01" (antes "TN | Registro…"; ARS 6.000 por día, presupuesto de campaña; **pausada desde el 27/10**)

| Semana | Anuncio | Gasto (ARS) | Clics | Visitas (Meta) | Practican (PostHog) | Clic en pagar | ARS por practicante |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 al 4/10 | iq | 9.892 | 49 | 31 | 13 | 1 | 761 |
| 1 al 4/10 | velocidad | 6.677 | 49 | 36 | 14 | 1 | 477 |
| 1 al 4/10 | templo | 1.675 | 15 | 8 | 0 | 0 | — |
| 1 al 7/10 (acumulado) | iq | 13.330 | 86 | — | 15 | 2 | 889 |
| 1 al 7/10 (acumulado) | velocidad | 11.093 | 147 | — | 43 | 1 | 258 |
| 1 al 7/10 (acumulado) | templo | 1.683 | 18 | — | 0 | 0 | — |
| 8/10 al 15/11 (corrió hasta el 27/10) | velocidad | 103.362 | 2.551 | 1.846 | 955 | 2 | 108 |
| 8/10 al 15/11 | vel-evolucion (2 conjuntos) | 4.847 | 65 | 53 | 14 | 0 | 346 |
| 8/10 al 15/11 | iq-serie (2 conjuntos) | 3.427 | 47 | 20 | 2 | 0 | 1.713 |
| 8/10 al 15/11 | iq | 1.937 | 20 | 18 | 6 | 0 | 323 |
| 8/10 al 15/11 | iq-desafio, iq-figuras, vel-ppm, vel-trabajo | 2.636 | 16 | 12 | 4 | 0 | — |
| 9 al 15/11 (últimos 7 días) | todos | 0 | — | — | — | — | — |
| 16 al 22/11 | todos | 0 | — | — | 0 | 0 | — |

Por semana (conjunto principal "Vieron precios"): 8–14/10 ARS 40.491, CTR 2,00%, 75 ViewContent · 15–21/10 ARS 40.116, CTR 2,17%, 84 ViewContent · 22–27/10 ARS 28.666, CTR 2,22%, 62 ViewContent. Conjunto "Vieron precios - Reels": ARS 6.937 en total y 6 ViewContent. Costo por cuenta creada (`velocidad`): ARS 2.109 (49 cuentas en PostHog). Pagos de Meta: 0.

| 6 al 12/10 | velocidad | 25.376 | 571 | 393 | 241 | 0 | 105 |
| 6 al 12/10 | iq (Meta) | 3.319 | 38 | 23 | ver MK-009 | — | — |
| 6 al 12/10 | Reels (6 anuncios) | 5.558 | ~56 | — | 8 | 0 | 695 |
### Semanas 5/10 al 8/11 (campaña Templo Ninja; gasto Meta, practicantes PostHog por `$initial_utm_content`)

| Semana | Gasto (ARS) | Clics | Practican | Ven precios | Clic en pagar | ARS por practicante |
| --- | --- | --- | --- | --- | --- | --- |
| 5 al 11/10 | 35.670 | 677 | 258 | 36 | 0 | 138 |
| 12 al 18/10 | 42.744 | 1.109 | 504 | 60 | 0 | 85 |
| 19 al 25/10 | 41.514 | 996 | 496 | 14 | 1 | 84 |
| 26/10 al 1/11 | 8.002 | 167 | 136 | 6 | 0 | 59 |
| 2 al 8/11 | 0 | 0 | — | — | — | — |

### Cambios
- 2026-10-01: lanzamiento con el conjunto "Registro" (optimiza CompleteRegistration).
- 2026-10-04: se pausa "Registro" y se lanza "Vieron precios" (optimiza ViewContent), con 3 anuncios que llevan a temploninja.com.
- 2026-10-05: se pausa el anuncio `templo` (13 visitantes, ninguno practicó). Decidió: Facundo, a propuesta de Growth.
- 2026-10-05: empieza `iq-desafio-directo` para el tráfico del anuncio `iq`. No cambiar su URL ni su texto mientras corre.
- 2026-10-05 a 07: aparece la campaña "TN | Profesional | AR | Test01" (activa, anuncios `pro-a` y `pro-b`); sin datos legibles en Meta. Quién la creó: no consta en esta rutina.
- Últimos 2 días (6 y 7/10): `velocidad` 3.707 ARS, `iq` 1.479 ARS; el conjunto gasta ~52% del presupuesto.
- 2026-10-27: Facundo pausa la campaña "Templo Ninja | Registro" (presupuesto ARS 6.000/día).
- 2026-11-02: acumulado de campaña ARS 146.174 y 3.084 clics; `velocidad` ARS 112.452 (2.760 clics, 55 registros Meta), `iq` ARS 6.789 (69 clics). Sin cruce con PostHog (proyecto 642163 no accesible).

- 2026-10-09: Facundo crea 6 anuncios Reels (`vel-evolucion`, `vel-ppm`, `vel-trabajo`, `iq-desafio`, `iq-serie`, `iq-figuras`) en el conjunto nuevo "Vieron precios - Reels" y pausa sus copias del conjunto principal.
- Presupuesto de campaña de $5.000 a $6.000 por día (fecha y autor sin registro; consultar a Facundo). El gasto pasó de ~52% a ~82% del presupuesto.
- 2026-10-11: se cierran los experimentos de iq y de la oferta de 24 horas y se mergea el A/B de portada `/` contra `/nueva` (PR #53 y #54).
- Campaña "TN | Profesional | AR | Test01": pausada, gasto 0.
- Aparece tráfico con `utm_source=google` (`iq`, `teclado`, `psicotecnicos`): canal sin documentar (MK-009).
- 2026-10-27 17:29: se pausa la campaña "Templo Ninja | Registro" (decidió Facundo, Power Editor). "TN | Profesional" figura pausada y sin gasto.
- 2026-10-22 a 11-04: Facundo activa/pausa en la misma cuenta las campañas MARU (activa) y amoblaIA (pausada el 30/10); no son de Templo Ninja y no se analizan.

## Google (`utm_source=google`)
- Desde el 28/10: `teclado` 252 usuarios y `iq` 212 (referido google.com). Gasto desconocido. Ver MK-008.

## Canales no pagos
- Directo, orgánico y referidos: volumen casi nulo.
- Desafíos entre amigos: 2 aceptados en 30 días (link directo). Batallas 6 al 12/10: 4 creadas, 3 aceptadas (1 persona).
- Google (UTM): `iq` 62 usuarios, `teclado` 12, `psicotecnicos` 11 (1 al 12/10).
- 2026-10-08: se borran los anuncios viejos `iq`, `velocidad` y `templo`; `velocidad | temploninja.com` cambia de creativo; se suman 5 reels (`iq-serie`, `iq-figuras`, `iq-desafio`, `vel-evolucion`, `vel-trabajo`) y `vel-ppm`. Decidió: Facundo.
- 2026-10-09: los reels pasan a un conjunto propio, "Vieron precios - Reels"; en el principal quedan `iq` y `velocidad`. Decidió: Facundo.
- 2026-10-11: cierran `iq-desafio-directo` y `precio-oferta-24h` (README).
- 2026-10-27: Facundo pausa la campaña. Desde entonces, 0 gasto. "TN | Profesional | AR | Test01" también está pausada, sin gasto.
- 2026-11-16: Growth propone reactivar con un conjunto que optimice por CompleteRegistration (MK-007), pendiente de aprobación.
- 2026-11-23: sin cambios en la cuenta desde el 15/11 (registro de actividad vacío); las 5 campañas siguen pausadas. Growth vuelve a proponer reactivar (MK-010): opción A ARS 6.000 por día o B ARS 3.000 por día, 14 días. Pendiente de Facundo.

## Google Ads (cuenta 5235658460; esta rutina no ve costos)
| Período | Anuncio (`utm_content`) | Usuarios | Practican | Ven precios | Cuentas |
| --- | --- | --- | --- | --- | --- |
| 8/10 al 15/11 | iq | 801 | 393 | 12 | 10 |
| 8/10 al 15/11 | teclado | 312 | 202 | 16 | 37 |
| 8/10 al 15/11 | sl_simulacro / psicotecnicos | 35 | 17 | 2 | 0 |
- El tráfico cae a 29 usuarios en la semana del 9/11 (era ~300 por semana).

| Semana (personas nuevas) | Anuncio | Usuarios | Practican | Ven precios | Cuentas |
| --- | --- | --- | --- | --- | --- |
| 2/11 | teclado | 214 | 147 | 10 | 26 |
| 2/11 | iq | 96 | 57 | 0 | 3 |
| 9/11 | todos | 32 | 18 | 1 | 2 |
| 16/11 | todos | 1 | 0 | 0 | 0 |
- Gasto de Google: sin dato (no informado; PostHog sin fuente de Google Ads conectada, 23/11).

## Canales no pagos
- Directo, orgánico y referidos: volumen casi nulo (~5 practicantes por semana sin UTM).
- Instagram `link_in_bio`: 10 usuarios desde el 8/10, con 1 pago.
- Desafíos entre amigos: 2 aceptados en 30 días (link directo, al 7/10). Batallas (desde mediados de octubre): pico de 22 creadas y 15 respondidas la semana del 12/10; 0 a 2 por semana desde el 26/10; 1 creada la semana del 2/11 y 0 en las del 9 y 16/11.
- Total de la app, semana del 16/11: 6 personas nuevas, 8 activas, 3 practican, 0 pagos (PostHog).
