# Hallazgos de producto y CRO

| ID | Fecha | Hallazgo | Estado | Resultado |
| --- | --- | --- | --- | --- |
| UX-001 | 2026-10-05 | Cargas automáticas de 0 a 2 s (precarga de Instagram y Facebook, revisión de Meta) inflan las visitas y la exposición del experimento | **resuelto** 2026-10-05: el experimento exige `iq_exp_activated` (primera interacción real) | Exposición limpia desde el inicio del experimento |
| UX-002 | 2026-10-05 | En el celular (76% de las visitas) mucha gente hace lecciones de tipeo con el teclado de la pantalla; Ninja mental funciona mejor ahí | propuesto (experimentar) | — |
| UX-003 | 2026-10-05 | Al llegar al límite diario, pocos terminan de crear la cuenta gratis (12 → 3 → 2) | propuesto (investigar más) | — |
| UX-004 | 2026-10-07 | En el celular con `velocidad`, 28 terminan una práctica y solo 9 ven precios | propuesto (experimentar, BL-002) | — |
| UX-005 | 2026-11-02 | 114 terminan una práctica y solo 6 ven precios; el muro de pago aparece al ganar el cinturón amarillo y el límite diario casi no se alcanza | propuesto (experimentar) | — |
| UX-006 | 2026-11-02 | `iq_exp_activated` y `$feature_flag_called` tienen 0 eventos en 14 días: los experimentos `iq-desafio-directo` y `precio-oferta-24h` no se miden | propuesto (arreglar ya) | — |
| UX-007 | 2026-11-02 | El hito de medición (`checkpoint_shown`) lo ven 192 personas y solo 24 actúan | propuesto (investigar más) | — |

UX-003 y UX-002 actualizados el 2026-10-07 (19 llegaron al límite, 4 tocaron crear cuenta, 5 se registraron). UX-001 sigue resuelto.

UX-003 actualizado el 2026-11-02: 0 toques de "crear cuenta" esta semana (3 la previa), 13 registros. Contexto: el anuncio `velocidad` dejó de traer visitas el 28/10.

Detalle en `informes/2026-10-05.md`, `informes/2026-10-07.md` y `informes/2026-11-02.md`.
