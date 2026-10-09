import { create } from 'zustand';
import type { TaskPriority, TaskStatus } from '../api/task.schemas';

type TaskFiltersState = {
  status: TaskStatus[];
  priority: TaskPriority[];
  setFilters: (filters: Pick<TaskFiltersState, 'status' | 'priority'>) => void;
  clearFilters: () => void;
};

const emptyFilters: Pick<TaskFiltersState, 'status' | 'priority'> = { status: [], priority: [] };

export const useTaskFiltersStore = create<TaskFiltersState>((set) => ({
  ...emptyFilters,
  setFilters: (filters) => set({ status: filters.status, priority: filters.priority }),
  clearFilters: () => set(emptyFilters),
}));
