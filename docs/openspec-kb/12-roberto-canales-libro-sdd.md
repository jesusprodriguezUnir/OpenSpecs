# 12 · Roberto Canales: «Desarrollo de Software Basado en Especificaciones»

> Proyecto: https://robertocanales.com/proyectos/libro-sdd · Web del autor: https://robertocanales.com
> Documento técnico v0.1 (45 pp., PDF descargable desde la página), edición preliminar de agosto de 2026; estado de herramientas contrastado a 19/08/2026.
> Este fichero es un **resumen propio** para el cuaderno. Para el detalle, añadir el PDF original como fuente en NotebookLM.

## Autor y por qué nos interesa

Roberto Canales Mora: fundador de Autentia y creador de AdictosAlTrabajo.com, ~30 años en el sector, formador de directivos y equipos. Tiene también un libro sobre equipos de alto rendimiento con agilidad e IA (Leanpub).

Su libro sobre SDD es **en español**, analiza **OpenSpec junto a Spec Kit, Kiro y Tessl por mecanismos** (no por popularidad) y propone un modelo de gobierno del cambio muy alineado con lo que queremos montar. Aporta sobre todo **criterio**, no herramientas: es el marco conceptual para justificar el plan ante el equipo y dirección.

## Estructura del documento

| Parte | Tema |
|---|---|
| I | Por qué el *vibe coding* no escala: el problema del *one-shot*, el espectro de autoridad de la spec y la "verja" |
| II | Spec Kit, Kiro, OpenSpec y Tessl comparadas con las mismas seis preguntas |
| III | Núcleo de conocimiento en Markdown + frontmatter + enlaces (Obsidian como vista), un único repositorio |
| IV | Sistema propuesto: lazo de 11 fases, permisos por papel, matriz de cobertura, cierre calculado |
| V | Especificación inicial con requisitos funcionales y no funcionales verificables |

Hilo conductor: un *power-up* de un clon de Arkanoid cuyas reglas, aparentemente triviales, esconden decisiones que la petición original no resuelve (límites, impactos simultáneos, reproducibilidad).

## Ideas clave (resumidas)

1. **La conversación no puede ser el único sitio donde vive la intención.** Lo que deba sobrevivir a una sesión va a ficheros versionados.
2. **"Funciona" no es "es conforme".** Funcionar se comprueba con una demo; ser conforme exige compararlo con un comportamiento acordado de antemano y dejar evidencia reproducible.
3. **Contexto, procedimiento, especificación y evidencia son artefactos distintos.** `CLAUDE.md` (contexto), skills (procedimiento) y hooks (automatismo) mejoran al agente, pero ninguno es una especificación del comportamiento del producto.
4. **Espectro de autoridad de la spec:**
   - *spec-first*: se escribe antes, pero después manda el código y la spec envejece.
   - *spec-anchored*: la spec ratificada sigue siendo normativa; la deriva se controla con revisión y tests.
   - *spec-as-source*: no se edita la salida generada; se cambia la spec y se regenera.
   El autor recomienda empezar en *spec-anchored* y solo mover un módulo a *spec-as-source* cuando haya regeneración repetible, detección de edición manual y CI que lo proteja.
5. **La "verja"** = comprobación ejecutable + política obligatoria + bloqueo efectivo. Un validador instalado no es una verja; un verde local no protege `main`. Junto a ella, el **trinquete**: permitir avanzar sin dejar que la calidad retroceda.
6. **Reparto de papeles:** Claude propone, la persona ratifica, el programa comprueba. Ningún mecanismo debe permitir al modelo ratificar su propio resultado.
7. **El cierre se calcula, no se declara:** un cambio se da por cerrado cuando el sistema lo deduce de artefactos y resultados (filas de cobertura verificadas, CI verde sobre el mismo commit, aprobaciones presentes), no porque el agente diga "he terminado".
8. **Trazabilidad por identificadores:** intención → cambio → requisito → caso de prueba → test → código → ejecución de CI, enlazados por IDs.

## Lo que dice de OpenSpec (lo más relevante para nosotros)

Lo clasifica como **spec-anchored por cambios**.

**Aporta:** separación entre spec vigente (`specs/`) y propuesta (`changes/`) con deltas por capacidad (incluye RENAMED, además de ADDED/MODIFIED/REMOVED); validador determinista de estructura; histórico navegable.

**Deja fuera (y debemos cubrirlo nosotros):**

| Carencia señalada | Cómo la cubrimos en nuestro plan |
|---|---|
| La sincronización puede adelantar la "verdad vigente" antes del cierre autorizado | No usar `/opsx:sync` para fusionar en `specs/` fuera de la PR; el `archive` solo dentro de la PR (fichero 05) y `specs/` protegido con **CODEOWNERS** + rama protegida |
| `config.yaml` orienta pero no concede permisos ni protege rutas | Permisos reales en `.claude/settings.json` (`deny` de escritura sobre `openspec/specs/**` fuera de archive) y en la branch policy |
| "Válido" no significa "correcto": el validador comprueba forma, no significado | Revisión humana de la delta spec con checklist (fichero 04) + trazabilidad Scenario → test (`spec-verifier`) |

Del resto: Spec Kit aporta una "constitución" pero no separa spec vigente de propuesta; Kiro integra la disciplina en el IDE pero sus puertas son un modo de uso, no una política; Tessl distribuye contexto versionado (*tiles*) pero versionar no equivale a ratificar. Conclusión del autor: no hay ganador universal; depende de dónde deba vivir la autoridad, y ninguna herramienta garantiza comportamiento por sí sola: los tests son del proyecto.

## Implicaciones para nuestro plan

1. **Nuestro hook `Stop` no es una verja**, es detección temprana. La verja real es la pipeline `openspec validate` + build + tests registrada como **Build Validation obligatoria** en `main` (fichero 06). Mantener ambas, pero no confundirlas.
2. **Proteger los tests aprobados.** En su lazo, tras ratificar los casos de prueba, se protegen (hashes) para que el agente no los "ajuste" al implementar. Equivalente práctico para nosotros: escribir primero los tests de los Scenarios (skill `tdd`, fichero 11), revisarlos con la propuesta y vigilar en la PR cualquier modificación posterior de esos tests (CODEOWNERS sobre `tests/` o regla de revisión).
3. **Confirmar el rojo antes de implementar:** ejecutar los tests nuevos y comprobar que fallan antes de `/opsx:apply`. Encaja con `tdd` y con la receta de bugfix.
4. **Matriz de cobertura = salida del `spec-verifier`.** Hacer obligatoria su tabla (Requirement | Scenario | Código | Test | Estado) en la PR; ninguna fila "sin cubrir" en la DoD.
5. **Ratificación explícita:** la aprobación de la propuesta debe quedar ligada a una versión concreta (aprobación de PR de specs o comentario con el commit revisado), no a un "ok" en el chat.
6. **Posición en el espectro:** somos *spec-anchored*. No aspirar a *spec-as-source* en .NET/Angular a corto plazo.
7. **Medir, no optimizar:** su criterio de éxito coincide con nuestras métricas (fichero 09): si sube la trazabilidad pero también los defectos y el tiempo sin reducir riesgos, no hay valor demostrado.

## Otros recursos del autor

- Proyectos con documentación y código (TFM de IA, laboratorios de deep learning, herramientas): https://robertocanales.com/proyectos
- Bitácora: https://robertocanales.com/bitacora (p. ej., organización del conocimiento con Obsidian)
- Libro sobre equipos de alto rendimiento con agilidad e IA: https://leanpub.com/HPTIA

## Prompts útiles para el cuaderno

- "Según Roberto Canales, ¿qué deja fuera OpenSpec y cómo lo cubrimos en nuestro plan?"
- "Explica la diferencia entre spec-first, spec-anchored y spec-as-source con un ejemplo de .NET."
- "¿Es nuestro hook Stop una verja? Justifícalo."
