# Hallazgos de producto y CRO

| ID | Fecha | Hallazgo | Estado | Resultado |
| --- | --- | --- | --- | --- |
| UX-001 | 2026-10-05 | Cargas automáticas de 0 a 2 s (precarga de Instagram y Facebook, revisión de Meta) inflan las visitas y la exposición del experimento | **resuelto** 2026-10-05: el experimento exige `iq_exp_activated` (primera interacción real) | Exposición limpia desde el inicio del experimento |
| UX-002 | 2026-10-05 | En el celular (76% de las visitas) mucha gente hace lecciones de tipeo con el teclado de la pantalla; Ninja mental funciona mejor ahí | propuesto (backlog, BL-004) | — |
| UX-003 | 2026-10-05 | Al llegar al límite diario, pocos terminan de crear la cuenta gratis (12 → 3 → 2) | propuesto (backlog, BL-003 y BL-015) | — |
| UX-004 | 2026-10-07 | En el celular con `velocidad`, 28 terminan una práctica y solo 9 ven precios | propuesto (BL-002 postergado; investigar con BL-025) | — |
| UX-005 | 2026-10-12 | Casi nadie vuelve otro día: 12 de 522 (2%) en la cohorte de hace 2 a 7 días | propuesto (BL-019 medición ahora; BL-020 experimento después) | — |
| UX-006 | 2026-10-12 | En el celular el teclado pierde el foco en Teclado Ciego (velo "Tocá acá para seguir escribiendo"); 129 de 194 terminan la lección | propuesto (**próximo**, BL-018) | — |
| UX-007 (en el informe del 2026-11-02: UX-005) | 2026-11-02 | 114 terminan una práctica y solo 6 ven precios; el muro de pago aparece al ganar el cinturón amarillo y el límite diario casi no se alcanza | propuesto (experimentar) | — |
| UX-008 (en el informe del 2026-11-02: UX-006) | 2026-11-02 | `iq_exp_activated` y `$feature_flag_called` tienen 0 eventos en 14 días: los experimentos `iq-desafio-directo` y `precio-oferta-24h` no se miden | propuesto (arreglar ya) | — |
| UX-009 (en el informe del 2026-11-02: UX-007) | 2026-11-02 | El hito de medición (`checkpoint_shown`) lo ven 192 personas y solo 24 actúan | propuesto (investigar más) | — |

UX-003 y UX-002 actualizados el 2026-10-07 (19 llegaron al límite, 4 tocaron crear cuenta, 5 se registraron). UX-001 sigue resuelto.

UX-003 y UX-004 actualizados el 2026-10-12 (47 llegaron al límite, 15 tocaron crear cuenta, 17 se registraron; velocidad: 163 terminan, 37 ven precios, 0 clics).

Detalle en `informes/2026-10-05.md` y `informes/2026-10-07.md` y `informes/2026-10-12.md`.

Actualización 2026-11-02 (informe de producto): UX-003 con 0 toques de "crear cuenta" esta semana (3 la previa) y 13 registros; el anuncio `velocidad` dejó de traer visitas el 28/10. Las rutinas de hoy partieron de un main sin la memoria del 10-12 y repitieron IDs: sus hallazgos UX-005, UX-006 y UX-007 figuran aquí como UX-007, UX-008 y UX-009.
