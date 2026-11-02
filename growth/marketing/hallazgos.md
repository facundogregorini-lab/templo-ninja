# Hallazgos de adquisición y retención

| ID | Fecha | Hallazgo | Estado | Resultado |
| --- | --- | --- | --- | --- |
| MK-001 | 2026-10-05 | La mitad de las sesiones pagas son cargas automáticas de 0 a 2 s; medir con "visitas reales" | **aplicado** 2026-10-05 | Tabla "Visitas reales por anuncio" en el dashboard Growth · Adquisición; el experimento ya cuenta solo personas (UX-001) |
| MK-002 | 2026-10-05 | Retención cero: 0 de 30 practicantes volvieron; falta un recordatorio (email, WhatsApp o pantalla de inicio) | **descartado** 2026-10-05 (decidió Facundo) | — |
| MK-003 | 2026-10-05 | El conjunto optimiza ViewContent (2 resultados); optimizar por la conversión "Practica" (~10 veces más volumen) | **descartado** 2026-10-05 (decidió Facundo) | — |
| MK-004 | 2026-10-07 | `velocidad` trae practicantes baratos (ARS 258) pero solo 7 de 116 ven precios | reemplazado por MK-007 (BL-002 postergado) | — |
| MK-005 | 2026-10-07 | El conjunto gasta ~52% del presupuesto y no sale del aprendizaje (7 resultados) | **descartado** 2026-10-07 (BL-017; misma causa que MK-003) | — |
| MK-006 | 2026-10-07 | Campaña Profesional activa sin datos legibles en Meta; `pro-a`/`pro-b` solo con cargas automáticas | cerrado de hecho (campaña pausada, gasto 0; BL-006 en pausa) | — |
| MK-007 | 2026-10-12 | `velocidad`: practicantes a ARS 105 y 37 ven precios, pero 0 clics en pagar | investigar más (BL-025) | — |
| MK-008 | 2026-10-12 | Los 6 Reels cuestan ~6,6 veces más por practicante que `velocidad` (ARS 695 vs 105); aún sin volumen | investigar más (revisar el 19/10; sin acción en Meta) | — |
| MK-009 | 2026-10-12 | `iq` mezcla Meta y Google (utm_source) y el gasto por anuncio del acumulado no cierra con la campaña | investigar más (pregunta a Facundo: ¿Google Ads o links con `utm_source=google`?) | — |
| MK-010 (en el informe del 2026-11-02: MK-007) | 2026-11-02 | La rutina no accede al proyecto PostHog 642163 (solo ve 683617, habitaia); sin embudo ni retención | aplicar ya (Facundo) | — |
| MK-011 (en el informe del 2026-11-02: MK-008) | 2026-11-02 | Campaña Templo Ninja pausada desde el 27/10; el gasto va a MARU | investigar más | — |
| MK-012 (en el informe del 2026-11-02: MK-009) | 2026-11-02 | `velocidad` = 77% del gasto (ARS 112.452) con 55 registros en Meta | experimentar | — |

Actualizaciones 2026-10-12: MK-004 se reemplaza por MK-007; MK-005 sin acción (gasto 82% del presupuesto de $6.000); MK-006 cerrado de hecho (campaña Profesional pausada, gasto 0).

Actualización 2026-11-02 (marketing, sin acceso a PostHog 642163): MK-007, MK-008 y MK-009 del informe de hoy figuran aquí como MK-010, MK-011 y MK-012 (colisión de IDs: la rutina partió de un main sin la memoria del 10-12).

No vuelvas a proponer un hallazgo descartado salvo que haya evidencia nueva y fuerte; si es así, decilo explícitamente.

Detalle en `informes/2026-10-05.md`, `informes/2026-10-07.md` y `informes/2026-10-12.md` y `informes/2026-11-02.md`.
