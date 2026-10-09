import { beforeEach, describe, expect, it } from 'vitest';
import { useTaskFiltersStore } from './task-filters.store';

describe('task filters store', () => {
  beforeEach(() => {
    useTaskFiltersStore.getState().clearFilters();
  });

  it('sets and clears status and priority filters', () => {
    useTaskFiltersStore.getState().setFilters({ status: ['Done'], priority: ['Critical'] });

    expect(useTaskFiltersStore.getState()).toMatchObject({ status: ['Done'], priority: ['Critical'] });

    useTaskFiltersStore.getState().clearFilters();

    expect(useTaskFiltersStore.getState()).toMatchObject({ status: [], priority: [] });
  });
});
