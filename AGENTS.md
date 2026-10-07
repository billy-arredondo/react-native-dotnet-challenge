# Instructions for AI Coding Agents

- Prefer simple solutions over unnecessary complexity.
- Follow Clean Architecture boundaries.
- Domain must not depend on Infrastructure or API.
- Application must not depend on Infrastructure.
- Database access must remain isolated in Infrastructure.
- SQL Server stored procedures will be used for persistence.
- Do not introduce Entity Framework unless explicitly requested.
- Do not introduce CQRS/MediatR unless there is a demonstrated need.
- Do not introduce Redux unless application state complexity requires it.
- Do not use React Native UI Kits.
- Keep TypeScript strict.
- Avoid speculative abstractions.
- Add tests for meaningful business logic.
- Follow existing naming and project conventions.
- Do not implement functionality beyond the requested scope.
- Use Conventional Commits when suggesting commit messages.
- Never execute git commits unless explicitly requested.
