import type { TaskPriority, TaskStatus } from '../../features/tasks/api/task.schemas';

export type Language = 'en' | 'es';

type TranslationKey =
  | 'appName' | 'total' | 'heading' | 'subheading' | 'currentTasks' | 'filterBy'
  | 'status' | 'priority' | 'clearFilters' | 'previous' | 'next' | 'pageOf'
  | 'nothing' | 'emptyMessage' | 'viewAll' | 'couldNotLoad' | 'tryAgain'
  | 'taskUnavailable' | 'taskNotFound' | 'removedTask' | 'description' | 'created'
  | 'openTask' | 'toDo' | 'inProgress' | 'done' | 'low' | 'medium' | 'high' | 'critical'
  | 'english' | 'spanish';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    appName: 'PERSONAL WORKBOARD', total: 'total', heading: 'Make room for\nwhat matters.',
    subheading: 'A focused view of your work, one task at a time.', currentTasks: 'CURRENT TASKS',
    filterBy: 'FILTER BY', status: 'STATUS', priority: 'PRIORITY', clearFilters: 'Clear filters',
    previous: 'Previous', next: 'Next', pageOf: 'Page {page} of {total}', nothing: 'Nothing on the board',
    emptyMessage: 'Try clearing your filters or check back after adding more tasks.', viewAll: 'View all tasks',
    couldNotLoad: 'Could not load tasks', tryAgain: 'Try again', taskUnavailable: 'Task unavailable',
    taskNotFound: 'Task not found', removedTask: 'This task may have been removed or the link is no longer valid.',
    description: 'DESCRIPTION', created: 'CREATED', openTask: 'Open task', toDo: 'To do',
    inProgress: 'In progress', done: 'Done', low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
    english: 'English', spanish: 'Español',
  },
  es: {
    appName: 'PANEL PERSONAL', total: 'total', heading: 'Haz espacio para\nlo importante.',
    subheading: 'Una vista enfocada de tu trabajo, una tarea a la vez.', currentTasks: 'TAREAS ACTUALES',
    filterBy: 'FILTRAR POR', status: 'ESTADO', priority: 'PRIORIDAD', clearFilters: 'Limpiar filtros',
    previous: 'Anterior', next: 'Siguiente', pageOf: 'Página {page} de {total}', nothing: 'No hay tareas',
    emptyMessage: 'Prueba a limpiar los filtros o vuelve cuando hayas añadido tareas.', viewAll: 'Ver todas',
    couldNotLoad: 'No se pudieron cargar las tareas', tryAgain: 'Reintentar', taskUnavailable: 'Tarea no disponible',
    taskNotFound: 'Tarea no encontrada', removedTask: 'La tarea pudo eliminarse o el enlace ya no es válido.',
    description: 'DESCRIPCIÓN', created: 'CREADA', openTask: 'Abrir tarea', toDo: 'Pendiente',
    inProgress: 'En progreso', done: 'Completada', low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica',
    english: 'English', spanish: 'Español',
  },
};

export function translate(language: Language, key: TranslationKey, values?: Record<string, string | number>) {
  return (values ? Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, String(value)), translations[language][key]) : translations[language][key]);
}

export function taskStatusLabel(language: Language, status: TaskStatus) {
  return translate(language, status === 'Todo' ? 'toDo' : status === 'InProgress' ? 'inProgress' : 'done');
}

export function taskPriorityLabel(language: Language, priority: TaskPriority) {
  return translate(language, priority.toLowerCase() as 'low' | 'medium' | 'high' | 'critical');
}
