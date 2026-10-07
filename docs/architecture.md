# Architecture

La solución prevista seguirá principios de Clean Architecture, manteniendo separadas las responsabilidades del dominio, la aplicación, la infraestructura y el punto de entrada HTTP.

Flujo esperado:

```text
React Native App
      ↓
.NET REST API
      ↓
Application
      ↓
Infrastructure
      ↓
SQL Server / Stored Procedures
```

La arquitectura detallada se documentará cuando se inicialicen los proyectos.
