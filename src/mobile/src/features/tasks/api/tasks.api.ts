import { getJson } from '../../../shared/api/http-client';
import { pagedTasksSchema, taskSchema, type PagedTasks, type Task, type TaskPriority, type TaskStatus } from './task.schemas';

export type TaskFilters = {
  status: TaskStatus[];
  priority: TaskPriority[];
};

export type TaskPageParams = TaskFilters & {
  page: number;
  pageSize: number;
};

export function buildTasksPath({ page, pageSize, status, priority }: TaskPageParams): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });

  if (status.length > 0) params.set('status', status.join(','));
  if (priority.length > 0) params.set('priority', priority.join(','));

  return `/tasks?${params.toString()}`;
}

export async function fetchTasks(params: TaskPageParams, signal?: AbortSignal): Promise<PagedTasks> {
  const payload = await getJson<unknown>(buildTasksPath(params), signal);
  return pagedTasksSchema.parse(payload);
}

export async function fetchTask(id: string, signal?: AbortSignal): Promise<Task> {
  const payload = await getJson<unknown>(`/tasks/${encodeURIComponent(id)}`, signal);
  return taskSchema.parse(payload);
}
