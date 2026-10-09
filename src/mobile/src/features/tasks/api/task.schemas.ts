import { z } from 'zod';

export const taskStatusSchema = z.enum(['Todo', 'InProgress', 'Done']);
export const taskPrioritySchema = z.enum(['Low', 'Medium', 'High', 'Critical']);

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  description: z.string(),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
  createdAt: z.string().min(1),
});

export const pagedTasksSchema = z.object({
  items: z.array(taskSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type PagedTasks = z.infer<typeof pagedTasksSchema>;
