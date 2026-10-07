# Reto Técnico - React Native + .NET

## Mini App de Gestión de Tareas

Construir una aplicación móvil en **React Native (CLI)** conectada a un backend en **.NET 6+** mediante un microservicio REST y una base de datos relacional.

| Aspecto     | Requisito                                                            |
| ----------- | -------------------------------------------------------------------- |
| **Alcance** | Listado, filtrado y detalle de tareas                                |
| **Stack**   | React Native (CLI) + .NET 6+ (Microservicio) + SQL Server/PostgreSQL |
| **DB**      | Relacional con datos por defecto + procedimientos almacenados        |
| **UI**      | Limpia y usable (sin UI Kit)                                         |

---

## 1. Objetivo

El usuario debe poder:

- Listar tareas personales.
- Filtrar tareas por estado y prioridad.
- Ver detalle de una tarea.

### Modelo de tarea

- Título
- Descripción
- Prioridad
- Estado

---

## 2. Requisitos técnicos

### 2.1 Backend - Web API (.NET 6+)

- Crear un microservicio RESTful con .NET que permita listar y filtrar tareas.
- Conectar a una base de datos (**SQL Server o PostgreSQL**) con información por defecto.
- Usar procedimientos almacenados.
- Plantear la arquitectura como si fuera un proyecto grande (capas, Clean Architecture, Hexagonal, etc.).
- Seguir buenas prácticas de código y arquitectura.
- Mantener el código en un repositorio Git con buenas prácticas (**Conventional Commits o similares**).

### 2.2 Frontend - React Native

- Construir una app móvil en **React Native**.
- Pantallas mínimas:
  - Lista de tareas.
  - Filtrado de tareas.
  - Detalle de tarea.
- Estilo limpio y usable.
- Plantear la arquitectura como si fuera un proyecto grande.
- No usar librerías de UI Kit.

---

## 3. Entregables

1. Repositorio Git con backend y frontend.
2. README con instrucciones de setup y ejecución.
3. Documentación técnica:
   - Diagrama de arquitectura del backend.
   - Diagrama de comunicación (`App ↔ API ↔ DB`).
   - Justificación de decisiones técnicas clave.
4. Script SQL con esquema y datos de prueba.

---

## 4. Criterios de evaluación

- Arquitectura propuesta y justificación de decisiones.
- Limpieza y calidad de código.
- Aplicación de buenas prácticas y patrones.
- Claridad de diagramas y documentación.
- Funcionalidad correcta de la solución.

> **Nota:** Nos importa el "por qué" de las cosas más que el "qué".

---

## 5. Bonus

- Pruebas unitarias (backend y/o frontend).
- Consideraciones de escalabilidad y seguridad.
- Manejo de casos edge.

---

## 6. Lo que no se requiere

- Sistema de autenticación/login.
- CRUD completo (crear, editar, eliminar).
- Despliegue en producción o CI/CD.
- Manejo de múltiples usuarios.

---

## 7. Consejos

- Simplicidad sobre complejidad.
- Documenta tus decisiones arquitectónicas.
- Escribe código production-ready.
- Puedes consultar documentación oficial y recursos públicos.
- No copies soluciones completas de otros retos.
