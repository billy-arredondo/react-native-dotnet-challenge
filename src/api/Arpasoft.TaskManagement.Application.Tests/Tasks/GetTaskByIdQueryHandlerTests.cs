namespace Arpasoft.TaskManagement.Application.Tests.Tasks;

using Arpasoft.TaskManagement.Application.Tasks;
using Arpasoft.TaskManagement.Application.Tasks.GetTaskById;
using Arpasoft.TaskManagement.Domain.Tasks;

public sealed class GetTaskByIdQueryHandlerTests
{
    [Fact]
    public async Task Handle_returns_null_when_task_does_not_exist()
    {
        var handler = new GetTaskByIdQueryHandler(new StubTaskReadRepository());

        var result = await handler.Handle(new GetTaskByIdQuery(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_rejects_empty_id()
    {
        var handler = new GetTaskByIdQueryHandler(new StubTaskReadRepository());

        await Assert.ThrowsAsync<ArgumentException>(() =>
            handler.Handle(new GetTaskByIdQuery(Guid.Empty), CancellationToken.None));
    }

    private sealed class StubTaskReadRepository : ITaskReadRepository
    {
        public Task<PagedResult<TaskItem>> GetPagedAsync(
            TaskQueryFilter filter,
            CancellationToken cancellationToken)
        {
            return Task.FromResult(new PagedResult<TaskItem>([], filter.Page, filter.PageSize, 0));
        }

        public Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return Task.FromResult<TaskItem?>(null);
        }
    }
}
