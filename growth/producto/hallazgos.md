# Hallazgos de producto y CRO

| ID | Fecha | Hallazgo | Estado | Resultado |
| --- | --- | --- | --- | --- |
| UX-001 | 2026-10-05 | Cargas automáticas de 0 a 2 s (precarga de Instagram y Facebook, revisión de Meta) inflan las visitas y la exposición del experimento | **resuelto** 2026-10-05: el experimento exige `iq_exp_activated` (primera interacción real) | Exposición limpia desde el inicio del experimento |
| UX-002 | 2026-10-05 | En el celular (76% de las visitas) mucha gente hace lecciones de tipeo con el teclado de la pantalla; Ninja mental funciona mejor ahí | propuesto (experimentar) | — |
| UX-003 | 2026-10-05 | Al llegar al límite diario, pocos terminan de crear la cuenta gratis (12 → 3 → 2) | **resuelto** 2026-11-16 (formulario dentro del cartel, 15/10) | 26 de 71 invitados en el límite crearon la cuenta en 14 días (2/11–16/11) |
| UX-004 | 2026-10-07 | En el celular con `velocidad`, 28 terminan una práctica y solo 9 ven precios | propuesto (experimentar, BL-002) | Sin datos nuevos: `velocidad` trajo 2 personas en 14 días (2026-11-16) |
| UX-005 | 2026-11-16 | Las cuentas gratis ven el precio (cinturón amarillo o límite de 13) y nadie toca pagar: 11 → 0 en 14 días; la lista no avisa qué lecciones son pagas | nuevo (experimentar cuando vuelva el tráfico) | — |
| UX-006 | 2026-11-16 | La portada `/` actual salta al cargar en el celular (CLS p75 0,93 contra 0,002 en `/nueva`): panel de preferencias abierto que se cierra por JS | nuevo (arreglar ya; decide el coordinador por el A/B de portada) | — |
| UX-007 | 2026-11-16 | El formulario de cuenta del cartel no dice las reglas de usuario y contraseña: errores 400 y clics repetidos en "Seguir practicando" | nuevo (arreglo rápido) | — |

UX-003 y UX-002 actualizados el 2026-10-07 (19 llegaron al límite, 4 tocaron crear cuenta, 5 se registraron). UX-001 sigue resuelto.

UX-002 sin datos nuevos el 2026-11-16 (el tráfico de celular cayó con el corte de campañas).

Detalle en `informes/2026-10-05.md`, `informes/2026-10-07.md` e `informes/2026-11-16.md`.
