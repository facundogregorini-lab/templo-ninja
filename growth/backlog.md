# Backlog de Growth

Único backlog priorizado. Lo mantiene el coordinador (`growth/coordinador/PROMPT.md`). Puntaje = Impacto ×
Confianza × Facilidad (cada uno de 1 a 10). Nunca se borran filas.

Segmentos de tráfico: `iq` (anuncio iq), `velocidad` (anuncio velocidad), `resto` (orgánico, directo, Google,
referidos y otros anuncios). Un experimento por segmento a la vez. `home-nueva` (portada `/` contra `/nueva`)
cubre todos los segmentos: mientras corra no arranca otro experimento que toque la portada.

**Nota de consolidación (2026-11-23).** Ningún PR de Growth se mergeó desde el 2026-10-12, así que el coordinador
del 2026-11-09 partió de un main viejo y reusó BL-013 a BL-017 para ideas nuevas. Esas cinco filas pasan a
**BL-031 a BL-035** (se indica el número anterior). Las filas que ese día se duplicaron (BL-002 a BL-006, BL-011)
se unificaron en la fila original con la nota de la semana. Los IDs de origen de las rutinas también chocaron:
la tabla de equivalencias está en `growth/coordinador/informes/2026-11-23.md`.

## Abiertas

Actualizado el 2026-11-23 (coordinador). Ordenadas por estado y puntaje. Contexto: **casi sin tráfico** desde el
9/11 (7 visitantes la semana del 16/11, PostHog), así que la facilidad de cualquier experimento baja hasta que
vuelva la adquisición.

| BL | Origen | Idea | Paso del embudo | Segmento | I | C | F | Puntaje | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BL-036 | UX-011, UX-007 (producto 2026-11-16 y 2026-11-23) | **Arreglo:** el botón del cartel de cuenta dice "Seguir practicando" y la gente lo toca con los campos vacíos: cambiar el texto a "Crear mi cuenta gratis y seguir", validar en el navegador (`required`, `minlength`, `pattern`) con las reglas visibles, y mandar `gate_submit_error` con el motivo | cartel → cuenta | todos | 6 | 8 | 9 | 432 | **próximo** (arreglo 1; `app.js:1810-1814`. 56 de 139 que tocaron el botón no crearon cuenta, 38 sin escribir; 16/10–23/11) |
| BL-037 | UX-006 (producto 2026-11-16) | **Arreglo:** la portada `/` actual salta al cargar en el celular (CLS p75 0,93 contra 0,002 en `/nueva`): el panel de preferencias nace cerrado en el HTML | visita → empieza | todos (celular) | 4 | 8 | 10 | 320 | **próximo** (arreglo 2; `index.html:33-36`, `app.js:2004`. Se aplica al cerrar `home-nueva` con `actual`) |
| BL-039 | MK-010, MK-007 (marketing 2026-11-16 y 2026-11-23) | **Decisión de adquisición:** reactivar Meta con un conjunto que optimice por cuenta creada (CompleteRegistration) y `velocidad` | adquisición | velocidad | 8 | 5 | 7 | 280 | **próximo** (a aprobar por Facundo; el coordinador recomienda la opción B, ARS 3.000 por día durante 14 días, después de BL-036 y BL-037) |
| BL-026 | UX-007 del 2026-11-02 (hoy UX-008) | **Experimento `oferta-post-medicion`:** mostrar la oferta ($4.900, pago único) al terminar la primera práctica, con "seguir gratis" visible | terminar práctica → ver precios → clic en pagar | todos | 8 | 4 | 5 | 160 | **próximo** (experimento de la semana; regla escrita el 2026-11-02 en `estado.md`, sin cambios. Arranca solo cuando cierre `home-nueva` y vuelva el tráfico. Facilidad baja de 6 a 5: sin tráfico no llega a 60 por grupo) |
| BL-043 | OP-007 (research 2026-11-23) | Páginas de práctica por empresa (Mercado Libre, Techint, YPF) para buscadores, con `sitemap.xml`, `robots.txt` y alta en Google Search Console | visita (orgánico) | resto (orgánico) | 5 | 3 | 6 | 90 | backlog (exploratoria; el primer paso, sitemap + robots + Search Console, va como **arreglo 3** porque es la única fuente de tráfico sin presupuesto y hoy el repo no tiene ninguno de los dos) |
| BL-019 | UX-005 del 2026-10-12 (hoy UX-012) | **Arreglo (medición):** medir bien la vuelta: propiedad de persona con cuenta y `$webview_app`, evento de retorno explícito en `analytics.js` | vuelta | todos | 6 | 6 | 7 | 252 | backlog (baja de próximo: lleva 6 semanas sin aplicarse y sin tráfico no hay vuelta que medir; marketing ya mide la vuelta con `practice_started` por cohorte) |
| BL-025 | MK-007 del 2026-10-12 (hoy MK-013), UX-004 | **Investigar:** por qué nadie hace clic en pagar después de ver precios | ver precios → clic en pagar | todos | 8 | 5 | 6 | 240 | backlog (respondido en parte el 2026-11-16, UX-005: el muro aparece por sorpresa, a gente con un día de uso y sin salida gratis; 0 de 11 cuentas tocaron pagar. Se sigue con BL-026 y BL-038) |
| BL-038 | UX-005 (producto 2026-11-16) | Candado 🔒 y "acceso ilimitado" en las lecciones pagas desde la lista; en el cartel del amarillo, "Seguir gratis con repasos y mediciones" | ver precios → clic en pagar | todos (cuentas) | 6 | 4 | 6 | 144 | backlog (toca la misma pantalla de pago que BL-026: va después) |
| BL-018 | UX-006 del 2026-10-12 (hoy UX-013) | **Arreglo:** en el celular el teclado pierde el foco en Teclado Ciego (velo "Tocá acá para seguir escribiendo"): evento `typing_veil_shown` y texto que explique | práctica | todos (celular) | 5 | 5 | 7 | 175 | backlog (baja de próximo: 6 semanas sin aplicar y 0 celulares esta semana) |
| BL-040 | MK-009 (marketing 2026-11-16 y 2026-11-23) | Anuncio de Meta con la promesa del curso: "Escribí sin mirar el teclado en 26 lecciones, gratis" (video 9:16), dentro del conjunto de BL-039 | adquisición → cuenta | nuevo anuncio | 6 | 4 | 5 | 120 | backlog (Google `teclado` convirtió a cuenta 12% contra 2,4% de Meta `velocidad`; falta el creativo y que se apruebe BL-039) |
| BL-020 | UX-005 del 2026-10-12, MK-008 (marketing 2026-11-16) | Pedir "guardar progreso" (cuenta gratis) al terminar la primera práctica, para dar un motivo de volver | práctica → cuenta → vuelta | todos | 7 | 4 | 5 | 140 | backlog (MK-008: vuelven en 7 días 21% con cuenta contra 1,7% sin cuenta en la cohorte del 2/11; correlación, no causa. Toca la pantalla de BL-026) |
| BL-011 | BL-010 | Razonamiento verbal en español (analogías, sinónimos, comprensión); después, juicio situacional | práctica | todos | 7 | 5 | 4 | 140 | backlog (sigue pospuesto: toca la práctica de todos los segmentos) |
| BL-002 | OP-001 (variante), UX-004, MK-004 | El anuncio `velocidad` lleva directo a la medición de 1 minuto, con la oferta junto al resultado | visita → práctica → ver precios | velocidad | 7 | 4 | 5 | 140 | backlog (postergado; `velocidad` sin tráfico desde el 28/10. 2026-11-09 también lo dejó en pausa) |
| BL-004 | UX-002 | En el celular, mostrar primero Ninja mental | práctica | resto | 4 | 5 | 7 | 140 | backlog (aplicado solo en `/nueva`, puente del celular; si `home-nueva` cierra con `actual`, queda sin efecto) |
| BL-005 | OP-002 | Certificado como prueba de demanda: botón "Obtener mi certificado" después de la medición | resultado → clic en pagar | velocidad | 6 | 3 | 7 | 126 | backlog (research 2026-11-16: ARTypist y Ratatype lo cobran) |
| BL-014 | producto 2026-10-12 | **Arreglo:** LCP en celular (p75 2,49 s el 2026-10-12) | visita | todos | 3 | 6 | 6 | 108 | backlog (sin mediciones nuevas: 0 celulares esta semana) |
| BL-015 | producto 2026-10-07 y 2026-10-12 | **Arreglo (medición):** más registros que toques en "crear cuenta"; `feedback_sent` no llegaba | límite → cuenta | todos | 3 | 6 | 7 | 126 | backlog (lo absorbe BL-036: el registro hoy es el formulario del cartel; feedback: 2 `feedback_sent` en 30 días, ya llega) |
| BL-042 | OP-006 (research 2026-11-16) | 24 h de acceso completo al crear la cuenta (prueba invertida) | cuenta → clic en pagar | todos | 6 | 2 | 5 | 60 | backlog (exploratoria; no correr junto con BL-041 ni BL-026) |
| BL-041 | OP-005 (research 2026-11-16) | En el celular, que el cartel venda la mente (IQ ninja, simulacros) y no el teclado | ver precios → clic en pagar | todos (celular) | 5 | 3 | 6 | 90 | backlog (0 clics en pagar en 1.813 visitantes de celular, research 2026-11-16; toca el cartel de BL-026) |
| BL-044 | OP-008 (research 2026-11-23) | Descuento que se gana con cinturones (como el "Tag Hunt" de Ratatype) | cuenta → clic en pagar | cuentas | 5 | 2 | 5 | 50 | backlog (investigar: ver el 30/11 si Ratatype lo repite. Antecedente propio en contra: `precio-oferta-24h`, 0 clics) |
| BL-016 | OP-004 | Mensaje "pago único, sin suscripción" junto a la oferta | ver precios → clic en pagar | todos | 4 | 3 | 8 | 96 | backlog (se puede sumar al texto de BL-026 sin contaminar, si Facundo quiere) |
| BL-003 | UX-003 | Entender por qué casi nadie termina la cuenta al llegar al límite | límite → cuenta | todos | — | — | — | — | **aplicado** 2026-11-16 (UX-003 resuelto: formulario dentro del cartel desde el 15/10; el resto del abandono es BL-036) |
| BL-027 | UX-009 del 2026-11-02 (hoy UX-010) | Investigar el hito de medición (`checkpoint_shown`): 192 lo ven y 24 actúan | práctica | todos | 4 | 3 | 7 | 84 | backlog |
| BL-023 | OP-006 del 2026-10-12 (hoy OP-013) | Título y descripción en español para "test de velocidad de escritura" | visita (orgánico) | resto | 4 | 2 | 8 | 64 | backlog (research 2026-11-23: los primeros resultados son sitios de herramientas con mucha autoridad; mejor BL-043) |
| BL-012 | relevamiento | Pista de atención y concentración (estilo Toulouse) | práctica | todos | 4 | 4 | 6 | 96 | backlog |
| BL-006 | OP-003 | Simulacros del test de una empresa argentina | nuevo segmento | nuevo anuncio | 7 | 2 | 5 | 70 | **en pausa** (la parte orgánica sigue en BL-043; research 2026-11-23: sin fuente de prensa 2026 para Mercado Libre, Techint ni Unilever) |
| BL-028 | OP-007 del 2026-11-02 (hoy OP-009) | Percentil real entre jugadores en el resultado de la medición, con botón de desafío | resultado → desafío | velocidad | 5 | 2 | 6 | 60 | backlog |
| BL-022 | OP-005 del 2026-10-12 (hoy OP-012) | Anuncio "test de inglés de 2 minutos" | nuevo segmento | nuevo anuncio | 5 | 2 | 5 | 50 | backlog |
| BL-031 | OP-005 del 2026-11-09 (hoy OP-011); era BL-013 del 2026-11-09 | Oferta suave (no bloqueante) al terminar la práctica | práctica → ver precios | todos | — | — | — | — | **unificada con BL-026** (es la misma idea) |
| BL-032 | MK-008 del 2026-11-09 (hoy MK-020); era BL-014 del 2026-11-09 | Entender el canal Google: gasto y costo por practicante | adquisición | resto | 5 | 5 | 9 | 225 | backlog (pregunta a Facundo, pendiente desde el 12/10; Google trae ~0 desde el 9/11) |
| BL-033 | research 2026-11-09; era BL-015 del 2026-11-09 | `payment_succeeded`, `checkout_clicked` y `pricing_viewed` con `utm_source`/`utm_content` | medición | todos | 5 | 7 | 8 | 280 | backlog (útil antes de reactivar Meta; con 0 pagos no bloquea esta semana. Va junto con BL-039 si se aprueba) |
| BL-034 | MK-009 del 2026-11-09 (hoy MK-021); era BL-016 del 2026-11-09 | Reconciliar compras de Meta con PostHog y revisar el píxel (Probar eventos) | medición | todos | 4 | 6 | 8 | 192 | backlog (marketing 2026-11-23: el píxel cuenta más que PostHog; control en "Probar eventos" antes de reactivar) |

## Cerradas

| BL | Origen | Idea | Estado | Resultado |
| --- | --- | --- | --- | --- |
| BL-001 | OP-001 | El anuncio `iq` lleva directo al desafío de 5 min y la oferta aparece junto al IQ | **cerrado** 2026-10-11 (decidió Facundo, PR #54) | Sin diferencia medible: control 6 y test 11 expuestos, 0 y 1 clic en pagar (Fisher exacto p = 1,0). Queda la versión original |
| BL-007 | UX-001 / MK-001 | Contar solo personas reales | **aplicado** 2026-10-05 | Evento `iq_exp_activated` y tabla "Visitas reales por anuncio" en PostHog |
| BL-008 | MK-002 | Recordatorio por email para volver a practicar | **descartado** 2026-10-05 (decidió Facundo) | No se repropone |
| BL-009 | MK-003 | Optimizar el conjunto de Meta por la conversión "Practica" | **descartado** 2026-10-05 (decidió Facundo) | — (BL-039 optimiza por cuenta creada, no por "Practica": la evidencia nueva es MK-008) |
| BL-010 | Facundo | Versión profesional: `/profesional`, pista de Lógica y simulacro estilo Mercado Libre | **aplicado** 2026-10-05 (decidió Facundo) | 9 clics de 5 personas en 14 días hasta el 12/10, sin pagos; desde el 1/10, 0 visitas orgánicas por `/profesional` (research 2026-11-23) |
| BL-013 | research, producto y marketing 2026-10-07 | **Arreglo:** la medición de pagos (`payment_succeeded`) | **aplicado** (el evento llegó el 2026-10-07) | 2 pagos de $4.900 (7/10 y 13/10, sin UTM). Falta confirmar si fueron reales |
| BL-017 | MK-005 | Dejar que el conjunto de Meta gaste el presupuesto | **descartado** 2026-10-07 | MK-005 resuelto de hecho (marketing 2026-11-16: gastó ~97%) |
| BL-029 | OP-008 del 2026-11-02 (hoy OP-010) | Gancho local "argentino promedio" en el anuncio `iq` | **descartado** 2026-11-02 | No hay dato real; no ataca el cuello |
| BL-030 | `home-nueva` (PR #53) | A/B de la portada `/` contra `/nueva` | **sin diferencia por la regla** 2026-11-02, ratificado el 2026-11-23 con más datos (cierre pendiente de Facundo: `AB_HOME_FORCE=actual`) | Hasta el 16/11: 1.450 contra 1.504 expuestos; terminan 36,3% contra 32,8% (−3,5 puntos, Fisher p = 0,048; la regla pide 10 puntos). Se queda `actual` |
| BL-035 | producto 2026-11-09; era BL-017 del 2026-11-09 | Conectar el proyecto 642163 a la rutina de Producto | **aplicado** (producto consulta 642163 desde el 2026-11-16) | — |
