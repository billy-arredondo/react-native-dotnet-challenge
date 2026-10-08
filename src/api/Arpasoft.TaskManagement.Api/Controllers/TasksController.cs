namespace Arpasoft.TaskManagement.Api.Controllers;

using Arpasoft.TaskManagement.Application.Tasks;
using Arpasoft.TaskManagement.Application.Tasks.GetTaskById;
using Arpasoft.TaskManagement.Application.Tasks.GetTasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("tasks")]
public sealed class TasksController(ISender sender) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TaskItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResult<TaskItemDto>>> GetTasks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await sender.Send(
                new GetTasksQuery(page, pageSize, SplitValues(status), SplitValues(priority)),
                cancellationToken);

            return Ok(result);
        }
        catch (TaskQueryValidationException exception)
        {
            return BadRequest(new ValidationProblemDetails(
                new Dictionary<string, string[]>(exception.Errors))
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "The task query is invalid."
            });
        }
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskItemDto>> GetTask(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var result = await sender.Send(new GetTaskByIdQuery(id), cancellationToken);
        return result is null
            ? NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Task not found.",
                Detail = $"No task exists with id '{id}'."
            })
            : Ok(result);
    }

    private static IReadOnlyCollection<string>? SplitValues(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }
}
