# Estado de Growth — Templo Ninja

Última actualización: 2026-11-23 (coordinador, semana del 2026-11-23). Esta versión junta la memoria de los
coordinadores del 2026-11-02 (PR #67) y del 2026-11-09 (PR #71), que no se mergearon, y los informes de las rutinas
del 2026-11-16 y del 2026-11-23. Informe completo: `growth/coordinador/informes/2026-11-23.md`.

## Cuello de botella actual
**No entra nadie.** Meta está apagada desde el 27/10 y Google trae ~0 desde el 9/11. Personas únicas por semana,
lunes a domingo (PostHog 642163, SQL sobre `events`, consultado el 2026-11-23):

| Paso | 2/11 | 9/11 | 16/11 |
| --- | --- | --- | --- |
| Visitan (`$pageview`) | 335 | 48 | 7 |
| Practican (`practice_started`) | 213 | 23 | 3 |
| Terminan una práctica | 171 | 19 | 3 |
| Crean cuenta (`signed_up`) | 27 | 3 | 1 |
| Ven precios (`pricing_viewed`) | 10 | 3 | 0 |
| Clic en pagar (`checkout_clicked`) | 1 | 0 | 0 |
| Pagos (`payment_succeeded`) | 0 | 0 | 0 |
| Gasto en Meta (ARS) | 0 | 0 | 0 |

- **Contribución marginal:** 0 las últimas cuatro semanas (sin ingresos ni gasto). Acumulado desde el 5/10: ingresos
  ARS 9.800 (2 pagos, sin confirmar que fueron reales) menos gasto en Meta ARS 127.930 = **−ARS 118.130**.
- **Detrás del tráfico, el cuello sigue siendo la oferta:** con tráfico (12/10 a 8/11) pocas personas veían precios y
  casi nadie tocaba pagar (UX-005, UX-008). Y hay un problema nuevo y claro antes de la oferta: el botón del cartel de
  cuenta (UX-011, BL-036).
- El sitio carga (www.temploninja.com respondió 200 el 2026-11-23 desde el entorno del coordinador).

## Experimentos
**Cerrados** (11/10, Facundo, PR #54): `iq-desafio-directo` y `precio-oferta-24h`, sin ganador.

### `home-nueva` (`/` contra `/nueva`, PostHog 478936), desde 2026-10-11: **sin diferencia por la regla → se queda `actual`** (cierre pendiente de Facundo)
- **Regla** (escrita el 12/10 con 1 día de datos, aplicada el 2/11): decide el % de expuestos que terminan una
  práctica (+10 puntos para ganar), control de daños en cuentas más vistas de precios, 200 por grupo o hasta el 26/10.
  La regla alternativa que propuso el coordinador del 9/11 (sin saber que ya se había aplicado esta) **se retira**: se
  escribió después de ver datos.
- **Datos acumulados** (1.ª exposición del 11/10 al 16/11, producto 2026-11-23): `actual` 1.450 expuestos, 526
  terminan (36,3%), 54 cuentas, 51 ven precios, 3 clics, 1 pago; `nueva` 1.504, 493 (32,8%), 44, 54, 2 clics, 0 pagos.
  Diferencia −3,5 puntos (Fisher exacto p = 0,048): `nueva` termina algo menos, lejos de los 10 puntos de la regla.
  Cuentas más precios por expuesto: 7,2% contra 6,5%. **Veredicto: sin diferencia, igual que el 2/11.**
- Desde el 16/11 entraron 3 personas: no tiene sentido seguir esperando. Cortar (`AB_HOME_FORCE=actual`) es decisión
  de Facundo. Al cortar, aplicar BL-037 (el salto de la portada actual en el celular).
- Experimento 479325 ("cupo compartido"): creado y sin lanzar. No se toca.

## Plan de la semana (todo a aprobar por Facundo)
- **Experimento: `oferta-post-medicion` (BL-026)**, con la regla de abajo (escrita el 2/11, sin cambios). Arranca
  cuando se corte `home-nueva` **y** vuelva el tráfico (BL-039). Sin tráfico no se lanza.
- **Arreglos:** BL-036 (botón y validación del cartel de cuenta, `app.js:1810-1814`), BL-037 (panel de preferencias
  cerrado en el HTML, `index.html:33-36`) y BL-043 paso 1 (`sitemap.xml`, `robots.txt` y alta en Search Console).
- **Adquisición (BL-039):** reactivar Meta, opción B de marketing (ARS 3.000 por día, 14 días, ~ARS 42.000, un
  conjunto nuevo por CompleteRegistration con `velocidad`), **después** de BL-036 y BL-037 y del control del píxel en
  "Probar eventos" (BL-034).

### Regla escrita de `oferta-post-medicion` (BL-026)
- **Quién:** visitantes nuevos de todos los anuncios y orgánico, 50/50 (flag de PostHog `oferta-post-medicion`); solo
  cuentan las personas que terminan su primera práctica.
- **Cambio (`test`):** al terminar la primera práctica aparece una tarjeta con el resultado y el plan ilimitado
  ($4.900, pago único) con botón de pagar y "seguir gratis" visible. `control`: como hoy (muro de cinturón y límite).
- **Métrica que decide:** % de quienes terminan su primera práctica que ven precios y hacen clic en pagar. Línea de
  base: 6 de 114 ven precios (5%) y 0 clics en la semana del 26/10.
- **Señal temprana (7 días):** % que ve precios, con motivo propio (`post_primera_practica`).
- **Control de daños:** % de los que terminan que empiezan otra práctica ese día no baja más de 10 puntos.
- **Muestra y duración:** 60 que terminan por grupo o 3 semanas desde que vuelva el tráfico, lo que ocurra primero.
- **Regla de decisión:** **gana** si en `test` ven precios al menos 15% **y** hay al menos 3 clics en pagar en `test`
  contra no más de 1 en `control`, con el control de daños cumplido. **Pierde** si el control de daños falla. En otro
  caso, **sin diferencia** y vuelve la versión original. Se informa Fisher exacto. Pasar al 100% decide Facundo.

## Cambios recientes a vigilar
- **2026-10-27, Meta apagada** (las 5 campañas de la cuenta pausadas, gasto 0, sin cambios en el registro desde el
  15/11; marketing 2026-11-23 y coordinador, Meta últimos 7 días).
- **~2026-11-09, Google ~0** (`utm_source=google`: 312 → 32 → 1 personas nuevas por semana, marketing 2026-11-23).
  No se sabe por qué ni cuánto costaba.
- **2026-10-15, muros por cinturón** (PR #61 a #63). El registro dentro del cartel resolvió UX-003; el pago al
  amarillo no convence (UX-005).
- **Plan gratis:** 6 prácticas por día sin cuenta y 13 con cuenta (producto 2026-11-16).

## Próximo
Ver `growth/backlog.md`. Esta semana: BL-036, BL-037, BL-043 (paso 1) como arreglos; BL-026 como experimento (espera
tráfico); BL-039 como decisión de Facundo.

## Pedidos del coordinador
Cada rutina responde primero lo que le toca, en una sección "Pedidos del coordinador" de su informe.
- **Producto:** (1) Si se aplicó BL-036, `gate_submit_error` por motivo y % de los que tocan el botón y crean cuenta
  (hoy 83 de 139). (2) Si se aplicó BL-037, CLS p75 en el celular en `/` actual. (3) Las 2 grabaciones de Replay
  Vision que quedaron procesando (a y b del informe del 23/11). (4) ¿Por qué no terminaron los 4 pagos iniciados en
  Mercado Pago desde el 24/10? (pedido de research).
- **Marketing:** (1) Si Facundo reactiva Meta: costo por cuenta creada y por practicante por día, y el control del
  píxel en "Probar eventos" (BL-034). (2) Si no: personas nuevas por fuente y si Google volvió. (3) Gasto de Google
  Ads del 8/10 al 9/11 si Facundo lo da (BL-032).
- **Research:** (1) Volumen de búsqueda en Argentina de "test Mercado Libre", "test Techint" y "test YPF" (Keyword
  Planner o Search Console si Facundo da acceso; si no, cualquier fuente pública con fecha). (2) El 30/11: ¿Ratatype
  extiende o repite el descuento por insignias (BL-044)? (3) Sin cambios en BL-006: sin fuente 2026 no se agregan
  empresas a `/profesional`.

## Estructura de Growth
| Rutina | Cuándo (hora de Argentina) | Entrega | Instrucciones |
| --- | --- | --- | --- |
| Status diario | todos los días, 8:47 | email | `growth/status/PROMPT.md` |
| Coordinador | lunes 9:13, después de las tres semanales | un PR con todo + email | `growth/coordinador/PROMPT.md` |
| Producto y CRO | lunes 7:21 | PR + email a las 9:00 | `growth/producto/PROMPT.md` |
| Adquisición y retención | lunes 7:34 | PR + email a las 9:00 | `growth/marketing/PROMPT.md` |
| Research de mercado | lunes 7:48 | PR + email a las 9:00 | `growth/research/PROMPT.md` |

**Importante para las rutinas:** mientras Facundo no mergee los PRs semanales, cada rutina debe partir de la última
rama `growth/semana-AAAA-MM-DD` (hoy `growth/semana-2026-11-23`) y no de main, que quedó en el 2026-10-12.

Dashboards de PostHog: "Growth · Producto y CRO", "Growth · Adquisición", "Growth · Retención" y
"Templo Ninja · Embudo de conversión".
