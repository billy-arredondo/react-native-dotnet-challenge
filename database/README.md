# Database

Scripts de SQL Server para la fase backend del reto.

## Orden de ejecución

Ejecutar los scripts contra la base de datos seleccionada en este orden:

1. `001_schema.sql`
2. `002_stored_procedures.sql`
3. `003_seed.sql`

Los scripts están diseñados para ejecutarse repetidamente sin duplicar el esquema, los procedimientos ni los datos de seed.

La aplicación usará únicamente los stored procedures de lectura. La generación de `uniqueidentifier` para futuros inserts se configura con `NEWSEQUENTIALID()`.

Las pruebas de integración de Infrastructure ejecutarán estos mismos scripts dentro de un container SQL Server administrado por Testcontainers.
