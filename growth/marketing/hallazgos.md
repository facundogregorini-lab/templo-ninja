# Hallazgos de adquisición y retención

| ID | Fecha | Hallazgo | Estado | Resultado |
| --- | --- | --- | --- | --- |
| MK-001 | 2026-10-05 | La mitad de las sesiones pagas son cargas automáticas de 0 a 2 s; medir con "visitas reales" | **aplicado** 2026-10-05 | Tabla "Visitas reales por anuncio" en el dashboard Growth · Adquisición; el experimento ya cuenta solo personas (UX-001) |
| MK-002 | 2026-10-05 | Retención cero: 0 de 30 practicantes volvieron; falta un recordatorio (email, WhatsApp o pantalla de inicio) | **descartado** 2026-10-05 (decidió Facundo) | — |
| MK-003 | 2026-10-05 | El conjunto optimiza ViewContent (2 resultados); optimizar por la conversión "Practica" (~10 veces más volumen) | **descartado** 2026-10-05 (decidió Facundo) | — |
| MK-004 | 2026-10-07 | `velocidad` trae practicantes baratos (ARS 258) pero solo 7 de 116 ven precios | **confirmado** 2026-11-16 → MK-007 | 87 de 2.073 ven precios (4,2%), 8/10 al 27/10 |
| MK-005 | 2026-10-07 | El conjunto gasta ~52% del presupuesto y no sale del aprendizaje (7 resultados) | **resuelto** 2026-11-16 | Del 8 al 27/10 gastó ~97% del presupuesto, con 62 a 84 ViewContent por semana |
| MK-006 | 2026-10-07 | Campaña Profesional activa sin datos legibles en Meta; `pro-a`/`pro-b` solo con cargas automáticas | **cerrado** 2026-11-16 | Pausada, sin gasto |
| MK-007 | 2026-11-16 | `velocidad`: ARS 108 por practicante pero ~ARS 51.700 por clic en pagar y 0 pagos; ViewContent ya no equivale a "vio precios". Al reactivar, sumar un conjunto que optimice por CompleteRegistration (ARS 3.000 + 3.000 por día, 14 días) | experimentar (pendiente de aprobación de Facundo; sin respuesta al 23/11, sigue en MK-010) | — |
| MK-008 | 2026-11-16 | Vuelven en 7 días 21% de los que tienen cuenta contra 2,4% de los invitados; el 94% nunca crea cuenta | investigar más (medir PR #63) | 23/11: cohorte del 2/11, 6 de 29 con cuenta vuelven contra 3 de 180 sin cuenta; PR #63 sin volumen para medir |
| MK-009 | 2026-11-16 | Google `teclado` convierte a cuenta el 11,9% contra 2,4% de Meta `velocidad`; sin acceso a los costos de Google | **experimentar** 2026-11-23 (anuncio de Meta con la promesa del curso; sigue sin costo de Google) | Semana del 2/11: `teclado` 26 cuentas de 214 (12%); Biblioteca AR "mecanografía": ningún curso competidor |
| MK-010 | 2026-11-23 | Sin adquisición paga (Meta 0 desde el 27/10, Google ~0 desde el 9/11), la app tuvo 6 personas nuevas en la semana del 16/11; reactivar Meta con el conjunto de MK-007: A ARS 6.000 por día o B ARS 3.000 por día, 14 días | aplicar ya (pendiente de aprobación de Facundo) | — |

No vuelvas a proponer un hallazgo descartado salvo que haya evidencia nueva y fuerte; si es así, decilo explícitamente.

Detalle en `informes/2026-10-05.md`, `informes/2026-10-07.md`, `informes/2026-11-16.md` e `informes/2026-11-23.md`.

Nota: MK-007 propone optimizar por cuenta creada, no por "Practica" (MK-003, descartado); la evidencia nueva es la relación entre cuenta y regreso (MK-008).
