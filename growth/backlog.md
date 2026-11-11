# Backlog de Growth

Único backlog priorizado. Lo mantiene el coordinador (`growth/coordinador/PROMPT.md`). Puntaje = Impacto ×
Confianza × Facilidad (cada uno de 1 a 10). Nunca se borran filas.

Segmentos de tráfico: `iq` (anuncio iq), `velocidad` (anuncio velocidad), `resto` (orgánico, directo,
referidos y otros anuncios). Un experimento por segmento a la vez.

## Abiertas

| BL | Origen | Idea | Paso del embudo | Segmento | I | C | F | Puntaje | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BL-013 | research §5, producto §5, marketing §5 | **Arreglo:** la medición de pagos. `payment_succeeded` nunca llegó a PostHog (está en `api/_billing.js:80`); sin él "0 pagos" no se distingue de "no se mide". Confirmar contra Mercado Pago y probar el camino completo | pagar | todos | 9 | 8 | 8 | 576 | **próximo** (arreglo 1, va primero) |
| BL-002 | OP-001 (variante), UX-004, MK-004 | El anuncio `velocidad` lleva directo a la medición de 1 minuto que promete, con la oferta junto al resultado | visita → práctica → ver precios | velocidad | 7 | 7 | 8 | 392 | **próximo** (experimento nuevo; a aprobar por Facundo). Confianza sube de 6 a 7: producto y marketing ven lo mismo con datos propios (7 de 116 ven precios) |
| BL-001 | OP-001 | El anuncio `iq` lleva directo al desafío de 5 min y la oferta aparece junto al IQ | ver precios → clic en pagar | iq | 7 | 5 | 8 | 280 | **experimentando** desde 2026-10-05 (`iq-desafio-directo`, 6 vs 8 expuestos) |
| BL-003 | UX-003 | Entender por qué casi nadie termina la cuenta al llegar al límite (19 → 4 tocan → 5 registros) | límite → cuenta | todos | 5 | 4 | 9 | 180 | **próximo** (investigar: producto, sin video; depende de BL-015) |
| BL-014 | producto 2026-10-07 (arreglo rápido) | **Arreglo:** LCP en celular p75 2,9 s (229 mediciones) contra 0,8 s en computadora; objetivo menos de 2,5 s | visita | todos | 4 | 7 | 6 | 168 | **próximo** (arreglo 2) |
| BL-011 | BL-010 | Razonamiento verbal en español (analogías, sinónimos, comprensión con verdadero, falso o no se puede saber); después, juicio situacional | práctica | todos | 7 | 6 | 4 | 168 | backlog (**pospuesto**: toca la práctica de todos los segmentos y contaminaría `iq-desafio-directo` y BL-002; retomar al cerrar BL-001, ~2026-10-26) |
| BL-005 | OP-002 | Certificado como prueba de demanda: botón "Obtener mi certificado" después de la medición | resultado → clic en pagar | velocidad | 6 | 3 | 7 | 126 | backlog (confianza baja de 4 a 3: otros lo regalan; esperar el resultado de BL-002, toca la misma pantalla) |
| BL-015 | producto 2026-10-07 §5 | **Arreglo:** hay más registros (`signed_up` 5) que personas que tocaron "crear cuenta" (4): buscar el otro camino de registro o el evento perdido | límite → cuenta | todos | 3 | 5 | 7 | 105 | **próximo** (arreglo 3) |
| BL-016 | OP-004 | Mensaje "pago único, sin suscripción" junto a la oferta y en el anuncio `iq` | ver precios → clic en pagar | iq | 4 | 3 | 8 | 96 | backlog (toca el mismo bloque que BL-001; después de su cierre) |
| BL-012 | relevamiento | Pista de atención y concentración (estilo Toulouse) | práctica | todos | 4 | 4 | 6 | 96 | backlog (los referentes no la priorizan) |
| BL-006 | OP-003 | Simulacros del test de una empresa argentina | nuevo segmento | nuevo anuncio | 7 | 2 | 5 | 70 | **en curso**: simulacro estilo Mercado Libre aplicado con BL-010; la campaña Profesional figura activa en Meta pero sin datos legibles (MK-006). Anuncio sin nombrar empresas. Sacar o aclarar Despegar en `/profesional` (su examen es de programación) |
| BL-004 | UX-002 | En el celular, mostrar primero Ninja mental (el teclado de la pantalla arruina la lección de tipeo) | práctica | resto (y `velocidad` después de BL-002) | 4 | 5 | 7 | 140 | backlog (`resto` casi sin volumen; en `velocidad` toca BL-002) |

## Cerradas

| BL | Origen | Idea | Estado | Resultado |
| --- | --- | --- | --- | --- |
| BL-007 | UX-001 / MK-001 | Contar solo personas reales: activación del experimento y visitas reales por anuncio | **aplicado** 2026-10-05 | Evento `iq_exp_activated` y tabla "Visitas reales por anuncio" en PostHog |
| BL-008 | MK-002 | Recordatorio por email para volver a practicar | **descartado** 2026-10-05 (decidió Facundo) | — |
| BL-009 | MK-003 | Optimizar el conjunto de Meta por la conversión "Practica" | **descartado** 2026-10-05 (decidió Facundo) | — |
| BL-010 | Facundo | Versión profesional: `/profesional` al estilo de practiceaptitudetests.com, en español y con empresas argentinas; pista 🧩 Lógica y series; simulacro estilo Mercado Libre (40 preguntas, 30 min) | **aplicado** 2026-10-05 (decidió Facundo) | Medir: `pro_cta_clicked` por `cta`, prácticas con `track=log` y `company=meli`, y si quienes usan la pista de lógica ven precios y hacen clic en pagar más que el resto |
| BL-017 | MK-005 | Dejar que el conjunto de Meta gaste el presupuesto y salga del aprendizaje (gasta ~52% de ARS 5.000 por día; 7 resultados) | **descartado** 2026-10-07 | Es la misma causa que BL-009 (descartado por Facundo); sin evidencia nueva. Solo queda registrado |
