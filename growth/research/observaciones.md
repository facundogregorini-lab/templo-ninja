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

## 2026-11-16 · Tercera ejecución
### Interno (PostHog 642163, solo lectura)
- Visitantes por semana: 676 (5-oct), 1.080 (12-oct), 1.134 (19-oct), 384 (26-oct), 335 (2-nov), **48 (9-nov)**. Meta: 797 y 765 personas (12 y 19-oct), 146 (26-oct), 0 desde el 2-nov. Google: todo pago (1.169 personas con `gclid`/`gad_source` desde el 5-oct; orgánico 23), 38 la semana del 9-nov · directa · inferencia: campañas pausadas.
- Muros por cinturón (desde 15-oct): 214 invitados ven el cartel por límite → 71 crean cuenta (33%). 45 ven precio → 3 clics en pagar (7%) → 0 compras · directa.
- Por dispositivo (desde 15-oct): celular 1.813 visitantes / 829 practican / 41 registros / 23 ven precios / **0 clics**; compu 519 / 311 / 50 / 22 / **3 clics** · directa.
- Compras: 2 `payment_succeeded` (7 y 13 de octubre). 12 `checkout_started` desde el 5-oct; los 4 desde el 24-oct sin pago · directa.
- `iq-desafio-directo` y `precio-oferta-24h` cerrados el 2026-10-11 (README): el segundo con 0 clics en pagar en ambas variantes · directa (repo).
- `payment_succeeded` y `pro_cta_clicked` ya existen (corrige la alerta del 2026-10-07) · directa.
### Anuncios (Biblioteca de Meta, AR, activos)
- "test de IQ": 114 (97 el 7-oct). Ganchos: "Responde 30 preguntas y descubre tu resultado" (páginas con nombre de persona, International Brain Test), "¿Estás en el top 2%?" (IQ Masters, pagan en TRY), "¿Cuántos de los 25 resuelves?" (IQTestPath). Todos en USD o TRY · directa (solo títulos).
- "mecanografía" 3 (ninguno competidor), "test psicotécnico" 1 (Alkemy, B2B), "escribir más rápido teclado" 6 (ninguno de tipeo) · directa.
### Precios y oferta
- Ratatype Plus · directa · US$9,99/mes o US$49,99/año; campo de código promocional, "el descuento aplica solo al primer pago".
- 123test · directa · sin cambios; "Autumn offer (70% off)" en el menú.
- practiceaptitudetests · directa · Pro £39/año o £29/mes; sin reembolso una vez empezado el acceso.
- ARTypist · directa · certificado verificable por código solo en el curso Pro (precio no visible, página de precios 404).
- JobTestPrep · directa · tiene sitio en español (España y tests globales), sin Argentina.
- IQ Masters · estimación (screensdesign, apppricinglab) · suscripción semanal con prueba de 3 días; compras integradas de US$7,99 a US$19,99.
- Reverse trial · estimación (blogs de Amplitude, Userpilot, Inflection) · +10% a 40% de conversión frente al freemium atribuido a Elena Verna; sin estudio controlado.
- CyberMonday 2026 fue del 2 al 4-nov; Black Friday 27-nov · prensa.
### Empresas argentinas (BL-006)
- YPF Jóvenes Profesionales · prensa (iProfesional, 22-ene-2026) · "pruebas de inglés y razonamiento", dinámica grupal virtual, assessment. Fuente más nueva que la de `/profesional`.
- Mercado Libre · prensa (Cronista, 7-abr-2021) · "test psicotécnico de 40 preguntas en 20 minutos": contradice los 30 min de la otra fuente de 2021.
- Techint · prensa (iProfesional, 23-sep-2024) · gira con inscripción hasta el 30-nov de 2024; no menciona tests.
- Unilever · sin fuente argentina de 2026 ("Futuros Líderes" no aparece; vigente: pasantía Únicxs).
- PepsiCo Next Gen · prensa (Mercado, 11-sep-2025) · no describe tests. No sirve para `/profesional`.
### Calidad del proceso
- El buscador volvió a poner "26/6/2026" a notas de 2024 (iProfesional): la regla de fechar con la página abierta sigue haciendo falta.
- El conector de PostHog arrancó en otro proyecto de la organización: confirmar siempre `project-get` = 642163 antes de consultar.

## 2026-11-23
### Interno (PostHog 642163, solo lectura)
- Visitantes por semana: 384 (26-oct), 335 (2-nov), 48 (9-nov), 7 (16-nov), 0 (23-nov, hasta 12 UTC) · observación directa (SQL sobre `events`). Pagos: 0 en las cinco.
- Orgánico desde el 1-oct: ~26 personas desde buscadores (google.com 17, app de Google 6, Bing 3); 0 por `/profesional`; directo 256 · observación directa.
- Meta: 5 campañas pausadas, gasto 0, sin actividad desde el 15-nov · dato del PR #76 (Marketing).
### Competidores
- Ratatype · observación directa (ratatype.com, /ratatype-plus/) · Black Friday "Tag Hunt": 12 insignias escondidas → hasta 60% off en el primer pago de Plus; pide registro. Plus sigue en US$9,99/mes o US$49,99/año.
- 123test · observación directa · versión profesional US$12,99; "Autumn offer (70% off)"; sin Black Friday.
### Anuncios (Meta, AR, activos)
- "test de IQ": 95 (114 el 16-nov) · observación directa. Nuevo: Monolotus IQ (≥12 anuncios del 22-nov, "¿Por qué no intentarlo?", USD). Siguen IQ Masters, Benjamin Carter, Olivia Hayes ("¿Estás en el top 2%?", TRY), IQTestPath.
- "mecanografía": 6, todos de "digitación desde casa" · "test psicotécnico": 3 (Alkemy, Beework) · sin competidores.
### Orgánico (buscador de EE. UU., no Google AR)
- "test de velocidad de escritura": sitios genéricos de herramientas (Miniwebtool, CodeItBro, Tidio, Coddy) + Ratatype, 10FastFingers, ARTypist · observación directa.
- "simulacro test Mercado Libre", "practicar test Techint": solo Glassdoor, Scribd, Indeed, easy-quizzz (SHL genérico); ninguna página de práctica específica · observación directa.
- "site:temploninja.com": sin resultados · inferencia débil (no es Google). El repo no tiene `sitemap.xml` ni `robots.txt` · observación directa.
### Empresas argentinas (BL-006)
- Mercado Libre · Glassdoor 2025-2026 (terceros) · "40 preguntas en 20 minutos" para envíos; sin prensa 2026.
- Techint · Forbes (sin fecha) · JP cierra el 30-nov, no menciona tests · El Economista (27-ago-2025) · PEV verano 2026, no menciona tests.
- Unilever · Mercado (11-feb-2026) · Únicxs 2026 cerró el 28-feb; no describe etapas.
