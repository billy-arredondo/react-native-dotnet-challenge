import { describe, expect, it } from 'vitest';
import { pagedTasksSchema } from './task.schemas';

const validPage = {
  items: [{
    id: 'task-1',
    title: 'Review API contract',
    description: 'Check the mobile contract against the backend.',
    priority: 'High',
    status: 'InProgress',
    createdAt: '2026-10-09T10:00:00Z',
  }],
  page: 1,
  pageSize: 8,
  totalItems: 1,
  totalPages: 1,
};

describe('pagedTasksSchema', () => {
  it('accepts the API task contract', () => {
    expect(pagedTasksSchema.parse(validPage)).toEqual(validPage);
  });

  it('rejects unknown status values', () => {
    expect(() => pagedTasksSchema.parse({
      ...validPage,
      items: [{ ...validPage.items[0], status: 'Blocked' }],
    })).toThrow();
  });
});
