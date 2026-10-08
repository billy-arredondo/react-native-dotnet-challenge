namespace Arpasoft.TaskManagement.Application.Tasks.GetTaskById;

using MediatR;

public sealed record GetTaskByIdQuery(Guid Id) : IRequest<TaskItemDto?>;
