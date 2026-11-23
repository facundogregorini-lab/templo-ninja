# Hallazgos de adquisición y retención

| ID | Fecha | Hallazgo | Estado | Resultado |
| --- | --- | --- | --- | --- |
| MK-001 | 2026-10-05 | La mitad de las sesiones pagas son cargas automáticas de 0 a 2 s; medir con "visitas reales" | **aplicado** 2026-10-05 | Tabla "Visitas reales por anuncio" en el dashboard Growth · Adquisición; el experimento ya cuenta solo personas (UX-001) |
| MK-002 | 2026-10-05 | Retención cero: 0 de 30 practicantes volvieron; falta un recordatorio (email, WhatsApp o pantalla de inicio) | **descartado** 2026-10-05 (decidió Facundo) | — |
| MK-003 | 2026-10-05 | El conjunto optimiza ViewContent (2 resultados); optimizar por la conversión "Practica" (~10 veces más volumen) | **descartado** 2026-10-05 (decidió Facundo) | — |
| MK-004 | 2026-10-07 | `velocidad` trae practicantes baratos (ARS 258) pero solo 7 de 116 ven precios | **confirmado** 2026-11-16 → MK-007 | 87 de 2.073 ven precios (4,2%), 8/10 al 27/10 |
| MK-005 | 2026-10-07 | El conjunto gasta ~52% del presupuesto y no sale del aprendizaje (7 resultados) | **resuelto** 2026-11-16 | Del 8 al 27/10 gastó ~97% del presupuesto, con 62 a 84 ViewContent por semana |
| MK-006 | 2026-10-07 | Campaña Profesional activa sin datos legibles en Meta; `pro-a`/`pro-b` solo con cargas automáticas | **cerrado** 2026-11-16 | Pausada, sin gasto |
| MK-007 | 2026-11-16 | `velocidad`: ARS 108 por practicante pero ~ARS 51.700 por clic en pagar y 0 pagos; ViewContent ya no equivale a "vio precios". Al reactivar, sumar un conjunto que optimice por CompleteRegistration (ARS 3.000 + 3.000 por día, 14 días) | **próximo** (BL-039, decisión de Facundo; coordinador 2026-11-23) | — |
| MK-008 | 2026-11-16 | Vuelven en 7 días 21% de los que tienen cuenta contra 2,4% de los invitados; el 94% nunca crea cuenta | investigar más (BL-020; coordinador 2026-11-23) | 23/11: cohorte del 2/11, 6 de 29 con cuenta vuelven contra 3 de 180 sin cuenta; PR #63 sin volumen para medir |
| MK-009 | 2026-11-16 | Google `teclado` convierte a cuenta el 11,9% contra 2,4% de Meta `velocidad`; sin acceso a los costos de Google | backlog (BL-040, falta creativo y BL-039; coordinador 2026-11-23) | Semana del 2/11: `teclado` 26 cuentas de 214 (12%); Biblioteca AR "mecanografía": ningún curso competidor |
| MK-010 | 2026-11-23 | Sin adquisición paga (Meta 0 desde el 27/10, Google ~0 desde el 9/11), la app tuvo 6 personas nuevas en la semana del 16/11; reactivar Meta con el conjunto de MK-007: A ARS 6.000 por día o B ARS 3.000 por día, 14 días | **próximo** (BL-039: el coordinador recomienda la opción B; decide Facundo) | — |

No vuelvas a proponer un hallazgo descartado salvo que haya evidencia nueva y fuerte; si es así, decilo explícitamente.

Detalle en `informes/2026-10-05.md`, `informes/2026-10-07.md`, `informes/2026-11-16.md` e `informes/2026-11-23.md`.

Nota: MK-007 propone optimizar por cuenta creada, no por "Practica" (MK-003, descartado); la evidencia nueva es la relación entre cuenta y regreso (MK-008).

## Hallazgos anteriores renumerados (coordinador, 2026-11-23)
Los informes del 12/10, 2/11 y 9/11 usaron MK-007 a MK-012 para hallazgos distintos de los de esta tabla. Quedan así:

| ID | Fecha | Hallazgo | Estado | Resultado |
| --- | --- | --- | --- | --- |
| MK-013 (12/10: MK-007) | 2026-10-12 | `velocidad`: practicantes a ARS 105 y 37 ven precios, pero 0 clics en pagar | backlog (BL-025) | — |
| MK-014 (12/10: MK-008) | 2026-10-12 | Los 6 Reels cuestan ~6,6 veces más por practicante que `velocidad` | cerrado (Reels pausados; marketing 2026-11-23 propone dejarlos así) | — |
| MK-015 (12/10: MK-009) | 2026-10-12 | `iq` mezcla Meta y Google (`utm_source`) | backlog (BL-032) | — |
| MK-016 (2/11: MK-007, archivo: MK-010) | 2026-11-02 | La rutina no accedía al proyecto PostHog 642163 | **resuelto** | — |
| MK-017 (2/11: MK-008, archivo: MK-011) | 2026-11-02 | Campaña Templo Ninja pausada desde el 27/10 | decisión de Facundo (BL-039) | — |
| MK-018 (2/11: MK-009, archivo: MK-012) | 2026-11-02 | `velocidad` = 77% del gasto con 55 registros en Meta | backlog (BL-002) | — |
| MK-019 (9/11: MK-007) | 2026-11-09 | Meta apagada desde el 27/10; ARS ~128.000 y 1 clic en pagar | igual que MK-010 (BL-039) | — |
| MK-020 (9/11: MK-008) | 2026-11-09 | Google es la fuente principal con UTM y no vemos su gasto | backlog (BL-032) | — |
| MK-021 (9/11: MK-009) | 2026-11-09 | Practicantes baratos pero ~8% ve precios y 1 clic en pagar de 1.394 | backlog (BL-025, BL-034) | — |

