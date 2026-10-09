import { useQuery } from '@tanstack/react-query';
import { fetchTask, fetchTasks, type TaskFilters } from './tasks.api';

export const taskQueryKeys = {
  all: ['tasks'] as const,
  list: (page: number, filters: TaskFilters) => [
    ...taskQueryKeys.all,
    'list',
    page,
    filters.status.join(','),
    filters.priority.join(','),
  ] as const,
  detail: (id: string) => [...taskQueryKeys.all, 'detail', id] as const,
};

export function useTasksQuery(page: number, filters: TaskFilters) {
  return useQuery({
    queryKey: taskQueryKeys.list(page, filters),
    queryFn: ({ signal }) => fetchTasks({ page, pageSize: 8, ...filters }, signal),
  });
}

export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: taskQueryKeys.detail(id),
    queryFn: ({ signal }) => fetchTask(id, signal),
    enabled: id.length > 0,
  });
}
