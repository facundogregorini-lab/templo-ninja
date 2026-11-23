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
| MK-010 (en el informe del 2026-11-02: MK-007) | 2026-11-02 | La rutina no accede al proyecto PostHog 642163 (solo ve 683617, habitaia); sin embudo ni retención | **resuelto del lado de la rutina** 2026-11-02 (coordinador: la conexión empieza en otro proyecto; llamar `switch-project 642163` antes de consultar, como hicieron producto y research) | — |
| MK-011 (en el informe del 2026-11-02: MK-008) | 2026-11-02 | Campaña Templo Ninja pausada desde el 27/10; el gasto va a MARU | decisión de Facundo (la pausa se mantiene; ver informe del coordinador 2026-11-02) | — |
| MK-012 (en el informe del 2026-11-02: MK-009) | 2026-11-02 | `velocidad` = 77% del gasto (ARS 112.452) con 55 registros en Meta | investigar más (BL-002 sigue postergado; sin tráfico de `velocidad` desde el 28/10) | — |

Actualizaciones 2026-10-12: MK-004 se reemplaza por MK-007; MK-005 sin acción (gasto 82% del presupuesto de $6.000); MK-006 cerrado de hecho (campaña Profesional pausada, gasto 0).

Actualización 2026-11-02 (marketing, sin acceso a PostHog 642163): MK-007, MK-008 y MK-009 del informe de hoy figuran aquí como MK-010, MK-011 y MK-012 (colisión de IDs: la rutina partió de un main sin la memoria del 10-12).

No vuelvas a proponer un hallazgo descartado salvo que haya evidencia nueva y fuerte; si es así, decilo explícitamente.

Detalle en `informes/2026-10-05.md`, `informes/2026-10-07.md` y `informes/2026-10-12.md` y `informes/2026-11-02.md`.
| MK-004 | 2026-10-07 | `velocidad` trae practicantes baratos (ARS 258) pero solo 7 de 116 ven precios | investigar más | — |
| MK-005 | 2026-10-07 | El conjunto gasta ~52% del presupuesto y no sale del aprendizaje (7 resultados) | investigar más | — |
| MK-006 | 2026-10-07 | Campaña Profesional activa sin datos legibles en Meta; `pro-a`/`pro-b` solo con cargas automáticas | investigar más | — |
| MK-007 | 2026-11-09 | Meta de Templo Ninja apagada desde el 27/10; ARS ~128.000 y 1 clic en pagar; la plata de Meta va a MARU/amoblaIA | investigar más | — |
| MK-008 | 2026-11-09 | Google (`utm_source=google`, `teclado`/`iq`) es hoy la fuente principal con UTM y no vemos su gasto | investigar más | — |
| MK-009 | 2026-11-09 | Practicantes baratos (ARS 59 a 138) pero ~8% ve precios y 1 clic en pagar de 1.394 | investigar más | — |

No vuelvas a proponer un hallazgo descartado salvo que haya evidencia nueva y fuerte; si es así, decilo explícitamente.

Detalle en `informes/2026-10-05.md`, `informes/2026-10-07.md` e `informes/2026-11-09.md`.
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
