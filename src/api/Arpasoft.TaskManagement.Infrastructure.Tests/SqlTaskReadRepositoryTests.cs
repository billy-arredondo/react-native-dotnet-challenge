namespace Arpasoft.TaskManagement.Infrastructure.Tests;

using Arpasoft.TaskManagement.Application.Common.Pagination;
using Arpasoft.TaskManagement.Application.Tasks;
using Arpasoft.TaskManagement.Domain.Tasks;
using Arpasoft.TaskManagement.Infrastructure;
using Arpasoft.TaskManagement.Infrastructure.Tasks;

[Collection(SqlServerCollection.Name)]
public sealed class SqlTaskReadRepositoryTests(SqlServerFixture fixture)
{
    [Fact]
    public async Task GetPagedAsync_returns_seeded_tasks_in_expected_order()
    {
        var repository = CreateRepository();

        var result = await repository.GetPagedAsync(
            new TaskQueryFilter([], [], 1, 20),
            CancellationToken.None);

        Assert.Equal(6, result.TotalItems);
        Assert.Equal(6, result.Items.Count);
        Assert.Equal(TaskPriority.Critical, result.Items.First().Priority);
        Assert.Equal(TaskPriority.Low, result.Items.Last().Priority);
    }

    [Fact]
    public async Task GetPagedAsync_applies_multiple_filters_and_pagination()
    {
        var repository = CreateRepository();

        var result = await repository.GetPagedAsync(
            new TaskQueryFilter(
                [TaskItemStatus.Todo],
                [TaskPriority.High, TaskPriority.Critical],
                1,
                1),
            CancellationToken.None);

        Assert.Equal(2, result.TotalItems);
        Assert.Single(result.Items);
        Assert.Equal(TaskItemStatus.Todo, result.Items.Single().Status);
        Assert.Equal(TaskPriority.Critical, result.Items.Single().Priority);
    }

    [Fact]
    public async Task GetByIdAsync_returns_null_for_unknown_task()
    {
        var repository = CreateRepository();

        var result = await repository.GetByIdAsync(Guid.NewGuid(), CancellationToken.None);

        Assert.Null(result);
    }

    private SqlTaskReadRepository CreateRepository()
    {
        return new SqlTaskReadRepository(new SqlConnectionFactory(fixture.ConnectionString));
    }
}
