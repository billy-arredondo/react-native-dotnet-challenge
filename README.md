# Task Management Challenge

Repositorio base para un desafío técnico de gestión de tareas.

Este repositorio implementa un desafío técnico de gestión de tareas. La fase actual cubre el backend y la base de datos; el proyecto mobile se implementará después de integrar esta fase en `main`.

## Tecnología

- Expo con React Native y TypeScript
- Expo Router
- TanStack Query
- Zustand, solo si se necesita estado local/global adicional
- `lucide-react-native`
- .NET 10 Web API
- SQL Server
- REST API
- Stored procedures
- Principios de Clean Architecture
- CQRS con MediatR
- Dapper
- Testcontainers para pruebas de integración

## Estructura

```text
src/api/        Microservicio REST .NET (Arpasoft.TaskManagement.slnx)
src/mobile/     Aplicación Expo/React Native
database/       Esquema, seed y stored procedures SQL Server
docs/           Documentación del proyecto
```

Al abrir `challenge.code-workspace` en VS Code, la raíz se muestra como `challenge` y `src/mobile` aparece como carpeta separada (`src` está excluido de la vista principal).

## Alcance

La aplicación permite listar tareas, filtrarlas por estado y prioridad, paginarlas y consultar su detalle. No se contemplan autenticación, multiusuario, CRUD completo, despliegue ni CI/CD.

Endpoints previstos:

```text
GET /tasks?page=1&pageSize=20&status=Todo,InProgress&priority=High,Critical
GET /tasks/{id}
GET /health
```

## Prerrequisitos

- SDK de .NET 10.
- Instancia SQL Server accesible para ejecución local.
- Docker Engine activo solo para las pruebas de integración de Infrastructure.
- Node.js y npm para el proyecto mobile.
- Expo Go para ejecutar la aplicación durante el desarrollo.
- Android Studio y un Android Virtual Device (AVD) son opcionales si se prefiere usar un emulador local en lugar de un dispositivo físico o Expo Go.

Para iOS se requiere macOS con Xcode; el desarrollo y validación local en Windows se realizará sobre Android.

### Configuración opcional de Android

Esta configuración solo es necesaria para ejecutar la aplicación en un emulador Android local. Si se utiliza Expo Go en un dispositivo físico, puede omitirse.

Configurar estas variables de entorno de usuario, adaptando las rutas a la instalación local:

```text
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17...
ANDROID_HOME=C:\Users\<usuario>\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\<usuario>\AppData\Local\Android\Sdk
```

Añadir al `PATH`:

```text
%JAVA_HOME%\bin
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\cmdline-tools\latest\bin
```

Verificar la instalación desde una nueva terminal:

```text
java -version
adb version
emulator -list-avds
```

Para usar un emulador local, `java -version` debe mostrar JDK 17 y `emulator -list-avds` debe mostrar al menos un dispositivo virtual. Si no aparece ninguno, crear un AVD desde **Android Studio > Device Manager**. Si `sdkmanager` no está disponible, instalar **Android SDK Command-line Tools** desde **Android Studio > SDK Manager**.

## Configuración local del backend

1. Crear la base de datos `TaskManagement` en la instancia SQL Server local.
2. Ejecutar los scripts de `database/` en orden contra esa base:
   - `001_schema.sql`
   - `002_stored_procedures.sql`
   - `003_seed.sql`
3. Configurar la cadena de conexión local sin commitear credenciales. El valor de `appsettings.json` es solo un ejemplo. Preferir User Secrets para el proyecto Api:

```text
dotnet user-secrets init --project src/api/Arpasoft.TaskManagement.Api
dotnet user-secrets set "ConnectionStrings:TaskManagement" "Server=localhost;Database=TaskManagement;User Id=sa;Password=<tu-password>;TrustServerCertificate=True;" --project src/api/Arpasoft.TaskManagement.Api
```

También puede usarse la variable de entorno `ConnectionStrings__TaskManagement` con el mismo formato.

4. Restaurar, compilar y ejecutar las pruebas desde la raíz del repositorio:

```text
dotnet restore src/api/Arpasoft.TaskManagement.slnx
dotnet build src/api/Arpasoft.TaskManagement.slnx
dotnet test src/api/Arpasoft.TaskManagement.slnx
```

Las pruebas de Infrastructure crean automáticamente un container SQL Server, ejecutan los scripts de `database/` y lo eliminan al finalizar.

5. Ejecutar la API con el perfil `https` y verificar:

```text
https://localhost:7019/health
https://localhost:7019/tasks?page=1&pageSize=20
https://localhost:7019/openapi/v1.json
```

La raíz `https://localhost:7019/` no tiene endpoint asignado y devuelve 404. El health check no valida SQL Server; los endpoints de tareas requieren base, procedimientos y seed creados.

## Decisiones arquitectónicas

Las decisiones iniciales están documentadas en [`docs/architecture.md`](docs/architecture.md).

La arquitectura mobile utilizará Expo con React Native y TypeScript, Expo Router, TanStack Query y componentes nativos sin UI Kit. Expo se elige como la herramienta recomendada para iniciar aplicaciones React Native; el alcance actual no requiere código nativo personalizado ni `prebuild`. Zustand y Axios no se incorporarán por defecto; se añadirán solo si existe una necesidad concreta.

Aunque el enunciado original menciona React Native CLI, Expo utiliza React Native oficialmente y cubre las necesidades funcionales del reto con menor configuración. Si en el futuro se requiere código nativo personalizado, el proyecto podrá evolucionar hacia un development build o utilizar `prebuild`.

El orden de implementación está documentado en [`docs/implementation-plan.md`](docs/implementation-plan.md).

El enunciado original se conserva en [`docs/technical-challenge.md`](docs/technical-challenge.md).

Este repositorio es un technical challenge y su implementación se realizará de forma incremental.
