# Hallazgos de adquisición y retención

| ID | Fecha | Hallazgo | Estado | Resultado |
| --- | --- | --- | --- | --- |
| MK-001 | 2026-10-05 | La mitad de las sesiones pagas son cargas automáticas de 0 a 2 s; medir con "visitas reales" | **aplicado** 2026-10-05 | Tabla "Visitas reales por anuncio" en el dashboard Growth · Adquisición; el experimento ya cuenta solo personas (UX-001) |
| MK-002 | 2026-10-05 | Retención cero: 0 de 30 practicantes volvieron; falta un recordatorio (email, WhatsApp o pantalla de inicio) | **descartado** 2026-10-05 (decidió Facundo) | — |
| MK-003 | 2026-10-05 | El conjunto optimiza ViewContent (2 resultados); optimizar por la conversión "Practica" (~10 veces más volumen) | **descartado** 2026-10-05 (decidió Facundo) | — |
| MK-004 | 2026-10-07 | `velocidad` trae practicantes baratos (ARS 258) pero solo 7 de 116 ven precios | investigar más | — |
| MK-005 | 2026-10-07 | El conjunto gasta ~52% del presupuesto y no sale del aprendizaje (7 resultados) | investigar más | — |
| MK-006 | 2026-10-07 | Campaña Profesional activa sin datos legibles en Meta; `pro-a`/`pro-b` solo con cargas automáticas | investigar más | — |
| MK-007 | 2026-11-02 | La rutina no accede al proyecto PostHog 642163 (solo ve 683617, habitaia); sin embudo ni retención | aplicar ya (Facundo) | — |
| MK-008 | 2026-11-02 | Campaña Templo Ninja pausada desde el 27/10; el gasto va a MARU | investigar más | — |
| MK-009 | 2026-11-02 | `velocidad` = 77% del gasto (ARS 112.452) con 55 registros en Meta | experimentar | — |

No vuelvas a proponer un hallazgo descartado salvo que haya evidencia nueva y fuerte; si es así, decilo explícitamente.

Detalle en `informes/2026-10-05.md`, `2026-10-07.md` y `2026-11-02.md`.
