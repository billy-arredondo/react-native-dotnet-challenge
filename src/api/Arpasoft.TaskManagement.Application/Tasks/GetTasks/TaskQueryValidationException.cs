namespace Arpasoft.TaskManagement.Application.Tasks.GetTasks;

public sealed class TaskQueryValidationException(
    IReadOnlyDictionary<string, string[]> errors) : Exception("The task query is invalid.")
{
    public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}
