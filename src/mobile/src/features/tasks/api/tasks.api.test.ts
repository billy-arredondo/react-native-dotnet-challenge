import { describe, expect, it } from 'vitest';
import { buildTasksPath } from './tasks.api';

describe('buildTasksPath', () => {
  it('serializes pagination and selected filters', () => {
    expect(buildTasksPath({
      page: 2,
      pageSize: 8,
      status: ['Todo', 'InProgress'],
      priority: ['High'],
    })).toBe('/tasks?page=2&pageSize=8&status=Todo%2CInProgress&priority=High');
  });

  it('omits empty filters', () => {
    expect(buildTasksPath({ page: 1, pageSize: 8, status: [], priority: [] })).toBe('/tasks?page=1&pageSize=8');
  });
});
