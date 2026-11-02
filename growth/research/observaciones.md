# Observaciones (registro acumulativo, no se borra)

Formato: fecha · fuente · tipo de evidencia · observación.
Tipos: **directa** (lo vimos), **declarado** (lo dice la empresa), **estimación** (terceros), **inferencia** (nuestra).

## 2026-10-05 (primera ejecución)

### Anuncios en Argentina (Biblioteca de anuncios de Meta, activos)
- Meta Ad Library · directa · "test de IQ" en AR: **75 anuncios activos** (IQ Masters "Tu mente, tu arquetipo", Monica Sage "¿Más listo que 100?", Brainova, Brainpiq "¿Cuál es tu verdadero arquetipo?", IQ Center "Ve tu puntuación al instante"). La mayoría paga en USD o TRY: anunciantes extranjeros.
- Meta Ad Library · directa · "coeficiente intelectual" en AR: 56 activos. "Test de inteligencia" en AR: 206 (con ruido de otros rubros).
- Meta Ad Library · directa · "mecanografía" en AR: **2 activos**, ninguno local. "Test psicotécnico" en AR: 2 (B2B). "Entrevista laboral test": 7.
- Meta Ad Library · inferencia · el gancho "IQ" está muy disputado en AR; el de tipeo, casi vacío. No sabemos cuánto rinden esos anuncios.
- Meta Ad Library · limitación · los snapshots de los anuncios piden login (403). Solo vimos títulos, no textos ni creatividades.

### Tráfico de los líderes (Semrush, agosto de 2026, salvo que se indique)
- monkeytype.com 21,33M/mes (67% directo) · typing.com 15,17M · 10fastfingers 5,6M · typingclub 4,99M · keybr 3,61M · humanbenchmark 2,77M · typeracer 2,16M · nitrotype 2,06M · 123test 1,25M · ratatype 400K · estimación.
- En casi todos los sitios de tipeo, Bangladesh e India son los primeros países · estimación · inferencia: mucho tráfico escolar o de bajo valor. No es nuestra audiencia.
- myiq.com 5,8M visitas en 3 meses, +64% m/m, **Paid Social 40%**, top Italia/Brasil/Canadá/Francia/España · Similarweb · estimación.
- psicoactiva.com 371,7K visitas en 3 meses, Argentina 14,9% · Similarweb · estimación.
- velocidactil.es ~7,5K/mes · Similarweb · estimación (sitio chico, poco confiable).

### Modelos de monetización
- Ratatype · directa (FAQ) · gratis con 10 ejercicios por día; acceso ilimitado pago (sin precio publicado en el FAQ); Plus sin anuncios.
- 123test · directa · IQ gratis de 10 preguntas con resultado al instante y comparación con "cientos de miles"; versión profesional de 44 preguntas a US$12,99; banner "Autumn offer (70% off)".
- Keybr · estimación · pago único de US$14 para sacar anuncios.
- typing.com · estimación · Premium sin anuncios (US$7,99 en promo, US$45/año según otra fuente); certificados gratis.
- TypeQuicker · directa · certificados de tipeo gratis e ilimitados (PDF, link público, imagen) para quienes buscan trabajo.
- practiceaptitudetests.com · directa · gratis 1 test por formato; Pro £39/año o £29/mes; "20m+ tests", "11.869 reseñas".
- JobTestPrep · estimación · packs por empleador; Premium de 1, 3 o 6 meses.
- EF SET · declarado · test de inglés gratis con certificado y URL personalizada para CV/LinkedIn; 30M+ personas desde 2016.
- Lumosity · estimación · "Fit Test" inicial de 10 minutos con comparación por edad → paywall con trial de 14 días.
- IQ Masters · estimación · onboarding con objetivos y demografía → paywall con trial de 3 días; US$400K/mes (screensdesign, sin verificar).
- myiq.com / brainable / check-iq · reseñas (Trustpilot, sikayetvar) · test "gratis", pago de ~US$1 para ver el resultado y después suscripción de ~US$30/mes poco informada. Muchas quejas.
- Monkeytype · estimación · anuncios (Playwire), US$60–130K/mes, más Patreon y merch.

### Mecánicas
- Duolingo · declarado (blog y podcast) · separar meta diaria y racha: +3,3% de retención D14. Ligas: +17% de tiempo de aprendizaje.
- Wordle · declarado/prensa · la grilla de emojis para compartir llevó de 300K a 2M+ jugadores en enero de 2022.
- Human Benchmark · directa · percentil frente a otros usuarios en cada prueba.
- Superwall (caso Speak4Me) · declarado · paywall en dos pasos (primero valor, después oferta): +27% de conversión.
- Techint Jóvenes Profesionales · Glassdoor (candidatos) · 5 tests online antes de la entrevista: inglés, razonamiento lógico, matemática, comprensión (39 preguntas en 18 min) y numérico (15 en 30 min).

### Contexto Argentina
- Defensa del Consumidor · directa (prensa) · el "botón de baja" es obligatorio en más rubros de suscripción. Nuestro pago único sin débitos no tiene ese riesgo.
- Mercado Pago (blog) · declarado · conversión media de e-commerce entre 1% y 4%.

### Interno (PostHog, 14 días)
- `iq`: 42 usuarios llegan a `/#ninja`. 13 practican. **9 hacen "sesión" guiada y solo 1 hace el desafío de 5 minutos** (el que da el IQ prometido en el anuncio). 10 ven precios (la mayoría por límite) y 1 hace clic en pagar.
- `velocidad`: 41 usuarios llegan a `/` (home). 14 practican: 9 empiezan una lección y solo 4 hacen la medición de 1 minuto que promete el anuncio.
- `templo`: 13 usuarios, ninguno practica.

### Calidad del proceso
- Los resúmenes del buscador inventaron cifras (TypeLab "US$74K MRR"; la fuente dice US$10). **Regla nueva: toda cifra de ingresos o tráfico que se use en una oportunidad se verifica en la fuente.**

## 2026-10-05 · ¿Psicotécnicos o solo cognitivos? (relevamiento pedido por Facundo)
- **Anuncios en Meta (Biblioteca, AR, activos):** 6 anuncios con "psicotécnico", todos de consultoras o servicios para empresas (Alkemy, Psywork, Astro Laboral, ELPRA, CVs Profesionales) y un medio (El Cronista). Ninguno vende preparación a personas. Los que venden tests a personas usan el examen concreto como gancho ("Test de aptitud de la fuerza aérea", "quiz de acceso a enfermería": Daily Brain Spark, SolvedLib) o el IQ ("¿Más listo que 100?", IQ Center). practiceaptitudetests y JobTestPrep no aparecen en Meta con su nombre.
- **Sitios:** practiceaptitudetests suma 10 cuestionarios de personalidad, solo en Pro ("Questionnaires, no right answer"), y juicio situacional; JobTestPrep tiene personalidad como categoría secundaria. Ninguno cubre tests proyectivos ni de atención.
- **En español,** "psicotécnico" es sobre todo numérico + verbal + lógico/abstracto ([redopositor](https://redopositor.com/blog/es-test-psicotecnicos-pdf-soluciones-gratis-2026/), [jobrise](https://jobrise.io/es/blog/tests-psicotecnicos-seleccion-como-superarlos-2026/), que suma personalidad). Atención, solo en exámenes específicos (conductores).
- **Decisión de Facundo:** sección de psicotécnicos en `/profesional` (hecha); no mencionarlos en los anuncios por ahora. Hueco propio: verbal en español (BL-011).
- **Limitación:** la Biblioteca devuelve títulos y anunciantes, no el texto completo del anuncio.

## 2026-10-07 · Segunda ejecución
### Empresas argentinas con tests online (pedido BL-006)
- Mercado Libre · terceros (iProfesional 3-jun-2021, citando Glassdoor) · 40 preguntas de lógica y matemática en 30 min + entrevista grupal por Zoom. Fuente de 5 años. Brasil: "teste cognitivo online" 100% digital (sin fecha verificada).
- Techint · terceros (resumen de Glassdoor AR, página 403) · comprensión (39 preg., 18 min), numérico (15 preg., 30 min) e inglés. La nota de iProfesional que el buscador fechaba en 2026 es de agosto de 2023 y no menciona tests.
- YPF · prensa (EconoJournal, sin fecha; BAE 15-feb-2022) · "exámenes de razonamiento e idioma", dinámicas grupales.
- Despegar · prensa (Economía Sustentable 10-jun-2022; BAE 2023) · prueba básica de programación + examen técnico: no es de aptitud.
- Unilever · guía de JobTestPrep 2026 (global) · evaluación online (lógico, verbal, numérico, juicio situacional) y juegos de HireVue.
- Accenture AR y BBVA AR · resumen de Glassdoor AR (403) · test online de lógica de 1 hora e IQ (eligo) / lógica de figuras. Sin fecha ni verificación.
- Buscador (EE. UU.): para "test de lógica Mercado Libre ejemplos" no aparece ningún sitio dedicado. Sin volúmenes de búsqueda en AR.
### Anuncios y precios
- Biblioteca de Meta AR (activos, 2026-10-07): "test de IQ" 97 (eran 75 el 05-oct; búsquedas no idénticas); "test de velocidad de escritura" 0; "test psicotécnico entrevista de trabajo" 0; "mecanografía" 3 (ninguno competidor directo). Solo títulos, no texto completo.
- Ratatype Plus · directa · US$49,99/año o US$9,99/mes; incluye certificados.
- TypeQuicker y JobCannon · directa · certificado de velocidad gratis con link público.
- 123test · directa · IQ gratis de 10 preguntas, profesional US$12,99 ofrecido después del resultado.
- myiq · terceros (Which?, Trustpilot, Sikayetvar) · £1 por 7 días y £29,99/mes; quejas por cobros no entendidos en 2026.
### Interno (PostHog, 14 días hasta 2026-10-07)
- 249 usuarios con visita; 59 empiezan práctica; 44 la terminan; 20 ven precios; 4 hacen clic en pagar; 3 llegan a Mercado Pago. Vistas de precios por semana: 14 (28-sep) y 6 (5-oct, en curso).
- **Medición:** el evento `payment_succeeded` y `pro_cta_clicked` no existen en el proyecto (taxonomía 2026-10-07). Las compras no se pueden ver en PostHog.
### Calidad del proceso
- El buscador devolvió fechas de 2026 para notas de 2021 y 2023. Regla: fechar siempre con la página abierta.

## 2026-11-02

### Interno (PostHog, proyecto 642163, solo lectura; consultado 2026-11-02)
- PostHog · directa · usuarios únicos por semana (lun-dom): visitas 115 / 676 / 1.080 / 1.134 / 384 (semanas del 28-sep, 5-oct, 12-oct, 19-oct, 26-oct). Terminan práctica: 24 / 179 / 351 / 367 / 124. Ven precios: 14 / 46 / 72 / 20 / 7. Clic en pagar: 3 / 3 / 3 / 2 / 0. `payment_succeeded`: 0 / 1 / 1 / 0 / 0.
- PostHog · directa · vistas de precios por usuario que termina práctica: 58% → 26% → 21% → 5% → 6%. La caída empieza la semana del 19-oct, dos semanas después de subir el plan gratis (5/10 por día).
- PostHog · directa · últimos 14 días por anuncio (`utm_content`): `velocidad` 870 usuarios, 256 terminan práctica, 12 ven precios, 1 clic en pagar; `iq` 466 / 160 / 2 / 0; `teclado` 64 / 32 / 3 / 0; `iq-serie`, `vel-evolucion`, `sl_simulacro`: menos de 30 usuarios cada uno.
- PostHog · directa · motivos de `pricing_viewed` (28 días): `limit` 184 vistas (95 usuarios), `upgrade` 53, `limite_cuenta` 28, `cinturon_amarillo` 28.
- PostHog · directa · desafíos (21 días): `battle_created` 21 usuarios, `battle_shared` 18, `battle_link_opened` 24, `battle_accepted` 22. `pro_cta_clicked`: 12 eventos en 5 semanas (5/3/3/1 usuarios por semana).
- Cierra la alerta de medición del 2026-10-07: `payment_succeeded` y `pro_cta_clicked` ya existen.
- Acceso: la primera consulta cayó en el proyecto 683617 (otro producto); se cambió al 642163 con switch-project. Sin escrituras.

### Anuncios en Argentina (Biblioteca de anuncios de Meta, consultada 2026-11-02)
- Meta Ad Library · directa · "IQ Mental" (página nueva) lanzó el 2026-11-02 (~04:00 UTC) al menos 12 anuncios iguales con el gancho "¿Te creés más inteligente que el argentino promedio?" y bandera de Argentina. Gancho de identidad local.
- Meta Ad Library · directa · "test de psicotécnico" en AR: 5 resultados, ninguno de preparación (Alkymetrics/Alkemy B2B para empresas, un perfil de España, un "Test de CI"). "mecanografía velocidad de escritura": 2 anuncios de un curso de ofimática. "Pruebas de ingreso trabajo test online": 1, irrelevante.
- Meta Ad Library · directa · "test de IQ" en AR devuelve un total estimado de 21.545 y muchos anuncios en alemán o sueco: el filtro de país incluye anunciantes extranjeros. No comparable con los 75/97 anteriores.

### Precios y ofertas de proyectos en seguimiento (observación directa)
- ratatype.com/ratatype-plus · directa · sin cambios: US$49,99/año o US$9,99/mes; ilimitado, sin anuncios, certificados. El descuento aplica solo al primer pago.
- 123test.com/iq-test · directa · IQ clásico gratis de 10 preguntas; versión profesional de 44 preguntas, US$12,99. Menú con "Autumn offer (70% off)". No pude ver cuándo se muestra la oferta.
- practiceaptitudetests.com/pricing · directa · gratis: una prueba de cada formato y seguimiento básico; Pro £39/año o £29/mes, renovación automática, sin reembolso una vez iniciado el acceso.
- monkeytype.com · estimación · no encontré cifras de ingresos de 2026 confiables; las que circulan son de creadores de contenido. Queda "desconocido".
### Calidad del proceso
- typing.com/student/premium dio 404; keybr.com no mostró el plan en la página de inicio. Sin dato nuevo de ambos.
- Mercado Libre y Techint (pedido BL-006): las búsquedas siguen devolviendo la nota de iProfesional de 2021 con fecha de 2026 en el buscador; ninguna fuente nueva sobre el test.
