# Database

Scripts de SQL Server para la fase backend del reto.

## Orden de ejecución

1. Crear la base de datos `TaskManagement` si no existe.
2. Ejecutar los scripts contra esa base en este orden:
   1. `001_schema.sql`
   2. `002_stored_procedures.sql`
   3. `003_seed.sql`

Ejemplo con `sqlcmd`:

```text
sqlcmd -S localhost -U sa -d TaskManagement -i database/001_schema.sql
sqlcmd -S localhost -U sa -d TaskManagement -i database/002_stored_procedures.sql
sqlcmd -S localhost -U sa -d TaskManagement -i database/003_seed.sql
```

En SSMS o Azure Data Studio basta abrirlos en el orden anterior contra `TaskManagement` y ejecutarlos.

Los scripts están diseñados para ejecutarse repetidamente sin duplicar el esquema, los procedimientos ni los datos de seed.

La aplicación usará únicamente los stored procedures de lectura:

- `dbo.Tasks_List`
- `dbo.Tasks_GetById`

La generación de `uniqueidentifier` para futuros inserts se configura con `NEWSEQUENTIALID()`.

Las pruebas de integración de Infrastructure ejecutarán estos mismos scripts dentro de un container SQL Server administrado por Testcontainers.
