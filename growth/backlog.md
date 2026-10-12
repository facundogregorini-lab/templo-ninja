# Backlog de Growth

Único backlog priorizado. Lo mantiene el coordinador (`growth/coordinador/PROMPT.md`). Puntaje = Impacto ×
Confianza × Facilidad (cada uno de 1 a 10). Nunca se borran filas.

Segmentos de tráfico: `iq` (anuncio iq), `velocidad` (anuncio velocidad), `resto` (orgánico, directo,
referidos y otros anuncios). Un experimento por segmento a la vez. Desde el 2026-10-11 `home-nueva` (portada `/`
contra `/nueva`) cubre todos los segmentos: mientras corra no arranca otro experimento.

## Abiertas

Actualizado el 2026-10-12.

| BL | Origen | Idea | Paso del embudo | Segmento | I | C | F | Puntaje | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BL-019 | UX-005 (paso 1) | **Arreglo (medición):** medir bien la vuelta: propiedad de persona con cuenta y `$webview_app`, evento de retorno explícito en `analytics.js`. Hoy 12 de 522 (2%) vuelven y parte se pierde por el navegador de Instagram | vuelta | todos | 7 | 6 | 7 | 294 | **próximo** (arreglo 1) |
| BL-025 | MK-007, UX-004, producto 2026-10-12 | **Investigar:** por qué 0 de 56 personas que ven precios hacen clic en pagar (37 de `velocidad`, 0 clics; 47 vieron precios por el límite, 12 por "upgrade"). Sin cambiar nada | ver precios → clic en pagar | todos | 8 | 4 | 8 | 256 | **próximo** (investigar: producto, con eventos y resúmenes de sesión; research: cómo lo muestran Ratatype, Keybr y TypingClub) |
| BL-002 | OP-001 (variante), UX-004, MK-004, MK-007 | El anuncio `velocidad` lleva directo a la medición de 1 minuto que promete, con la oferta junto al resultado | visita → práctica → ver precios | velocidad | 7 | 5 | 7 | 245 | backlog (**postergado**): choca con `home-nueva` (misma portada en todos los segmentos) y su métrica (ver precios) ya no es el cuello: 37 ven precios y ninguno paga. Confianza baja de 7 a 5, facilidad de 8 a 7 (hay que hacerlo en `/` y en `/nueva`). Retomar con BL-025 |
| BL-018 | UX-006 | **Arreglo:** en el celular el teclado pierde el foco en Teclado Ciego y aparece el velo "Tocá acá para seguir escribiendo": evento `typing_veil_shown` (con `device_type`), texto que diga por qué ("el teclado se cerró") y, si la medición lo justifica, reabrir el teclado al tocar el escenario | práctica | todos (celular) | 6 | 5 | 7 | 210 | **próximo** (arreglo 2: `app.js:787-788`, `index.html:295`; hasta 65 personas por semana; 3 de 10 sesiones leídas, es pista y no patrón) |
| BL-011 | BL-010 | Razonamiento verbal en español (analogías, sinónimos, comprensión con verdadero, falso o no se puede saber); después, juicio situacional | práctica | todos | 7 | 6 | 4 | 168 | backlog (**pospuesto**: toca la práctica de todos los segmentos y contaminaría `home-nueva`; retomar al cerrarlo, a más tardar el 2026-10-26) |
| BL-020 | UX-005 (paso 2) | Pedir "guardar progreso" (cuenta gratis) al terminar la primera práctica y no solo en el límite, para dar un motivo de volver | práctica → cuenta → vuelta | todos | 8 | 4 | 5 | 160 | backlog (después de BL-019 y del cierre de `home-nueva`; riesgo: tapa la práctica) |
| BL-003 | UX-003 | Entender por qué casi nadie termina la cuenta al llegar al límite | límite → cuenta | todos | 4 | 4 | 9 | 144 | backlog (respuesta parcial el 2026-10-12: 47 → 15 tocan → 17 registros, la tasa mejora de 5 de 19 a 17 de 47; en 2 sesiones leídas cerraron el diálogo sin tocar; sigue siendo anécdota. Se cierra con BL-015 y BL-025) |
| BL-004 | UX-002 | En el celular, mostrar primero Ninja mental (el teclado de la pantalla arruina la lección de tipeo) | práctica | resto (y `velocidad` después de BL-002) | 5 | 4 | 7 | 140 | backlog (el celular es la gran mayoría del tráfico pagado: 466 de 466 + 75 en `velocidad` e `iq`; toca la portada, esperar `home-nueva`) |
| BL-014 | producto (arreglo rápido) | **Arreglo:** LCP en celular (p75 2,49 s con 418 mediciones el 2026-10-12, antes 2,9 s; computadora 1,24 s) | visita | todos | 3 | 7 | 6 | 126 | backlog (ya dentro del umbral de 2,5 s, pero al límite; baja de próximo) |
| BL-015 | producto 2026-10-07 y 2026-10-12 | **Arreglo (medición):** hay más registros (`signed_up` 17) que toques en "crear cuenta" (`signup_prompt_clicked` 15): buscar el otro camino o el evento perdido. Sumar: 8 personas abrieron `feedback_opened` y ninguna envió `feedback_sent`, verificar que el envío funcione | límite → cuenta | todos | 3 | 6 | 7 | 126 | **próximo** (arreglo 3) |
| BL-005 | OP-002 | Certificado como prueba de demanda: botón "Obtener mi certificado" después de la medición | resultado → clic en pagar | velocidad | 6 | 3 | 7 | 126 | backlog (esperar BL-002 y `home-nueva`: toca la misma pantalla) |
| BL-016 | OP-004 | Mensaje "pago único, sin suscripción" junto a la oferta y al botón de pagar | ver precios → clic en pagar | todos | 4 | 3 | 8 | 96 | backlog (research lo pasó a "experimentar" el 2026-10-12 porque OP-001 cerró; pero hoy corre `home-nueva` y no hay evidencia propia de que sea el motivo: mirar antes BL-025) |
| BL-012 | relevamiento | Pista de atención y concentración (estilo Toulouse) | práctica | todos | 4 | 4 | 6 | 96 | backlog (los referentes no la priorizan) |
| BL-023 | OP-006 | Título y descripción en español para "test de velocidad de escritura" y medir en 4 semanas las visitas orgánicas desde buscadores | visita (orgánico) | resto | 5 | 2 | 8 | 80 | backlog (exploratoria; hoy 0 anuncios de tipeo en AR y no hay datos de volumen de búsqueda) |
| BL-006 | OP-003 | Simulacros del test de una empresa argentina | nuevo segmento | nuevo anuncio | 7 | 2 | 5 | 70 | **en pausa**: el simulacro estilo Mercado Libre salió con BL-010; la campaña Profesional figura pausada con gasto 0 (MK-006) y research no pudo confirmar fuente 2026 para ninguna empresa. Mantener `/profesional` con redacción genérica; sacar o aclarar Despegar sigue pendiente |
| BL-022 | OP-005 | Anuncio "test de inglés de 2 minutos" hacia la pista de inglés, con resultado de nivel | nuevo segmento | nuevo anuncio | 5 | 2 | 5 | 50 | backlog (exploratoria: 141 anuncios de test de inglés en AR; solo 13 personas en la pista de inglés en 14 días; no hay test de nivel armado) |

## Cerradas

| BL | Origen | Idea | Estado | Resultado |
| --- | --- | --- | --- | --- |
| BL-001 | OP-001 | El anuncio `iq` lleva directo al desafío de 5 min y la oferta aparece junto al IQ | **cerrado** 2026-10-11 (decidió Facundo, PR #54) | Sin diferencia medible: control 6 y test 11 expuestos, 0 y 1 clic en pagar (Fisher exacto p = 1,0). La regla pedía 60 por grupo o 3 semanas y no se llegó. Queda la versión original |
| BL-007 | UX-001 / MK-001 | Contar solo personas reales: activación del experimento y visitas reales por anuncio | **aplicado** 2026-10-05 | Evento `iq_exp_activated` y tabla "Visitas reales por anuncio" en PostHog (el evento ya no se manda desde el cierre de `iq-desafio-directo`) |
| BL-008 | MK-002 | Recordatorio por email para volver a practicar | **descartado** 2026-10-05 (decidió Facundo) | — (9 de 208 volvieron al día siguiente el 6 al 10/10 es evidencia débil; no se repropone) |
| BL-009 | MK-003 | Optimizar el conjunto de Meta por la conversión "Practica" | **descartado** 2026-10-05 (decidió Facundo) | — |
| BL-010 | Facundo | Versión profesional: `/profesional` al estilo de practiceaptitudetests.com, en español y con empresas argentinas; pista 🧩 Lógica y series; simulacro estilo Mercado Libre (40 preguntas, 30 min) | **aplicado** 2026-10-05 (decidió Facundo) | Medir: `pro_cta_clicked` por `cta`, prácticas con `track=log` y `company=meli`, y si quienes usan la pista de lógica ven precios y hacen clic en pagar más que el resto. Hasta el 12/10: 9 clics de 5 personas en 14 días, sin pagos |
| BL-013 | research, producto y marketing 2026-10-07 | **Arreglo:** la medición de pagos (`payment_succeeded` nunca llegaba a PostHog) | **aplicado** (el evento llegó el 2026-10-07) | 1 `payment_succeeded` ($4.900, 7/10, sin UTM) y 1 `payment_failed` el mismo día. Falta saber si fue un pago real y por qué falló el otro (pregunta a Facundo) |
| BL-017 | MK-005 | Dejar que el conjunto de Meta gaste el presupuesto y salga del aprendizaje | **descartado** 2026-10-07 | Misma causa que BL-009 (descartado por Facundo); sin evidencia nueva. El presupuesto subió a $6.000 por día y el conjunto gasta 82% (marketing 2026-10-12): ya ocurrió sin acción nuestra |
