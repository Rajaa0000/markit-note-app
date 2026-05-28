"use client";

import { apiFetch, apiJson, getErrorMessage } from "./authService";

export type Paginated<T> = {
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Note = {
  id: number;
  title: string;
  text: string;
  bg_color: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: number;
  statement: string;
  priority: number;
  checked: boolean;
  todo_list: number;
};

export type TodoList = {
  id: number;
  title: string;
  day: string | null;
  created_at?: string;
  date?: string;
  task_set: Task[];
};

export type NoteInput = Pick<Note, "title" | "text" | "bg_color" | "is_pinned">;

export function normalizeTodoList(list: Omit<TodoList, "task_set"> & { task_set?: Task[] }): TodoList {
  return {
    ...list,
    day: list.day ?? null,
    task_set: list.task_set ?? [],
  };
}

async function getPaginatedOrEmpty<T>(path: string): Promise<Paginated<T>> {
  const response = await apiFetch(path);
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (response.status === 404) {
    return { next: null, previous: null, results: [] };
  }

  if (!response.ok) {
    throw data ?? { error: `Request failed with status ${response.status}` };
  }

  return {
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    results: data?.results ?? [],
  };
}

export async function getNotes() {
  const [pinned, regular] = await Promise.all([
    getPaginatedOrEmpty<Note>("/notes/notes/pinned/"),
    getPaginatedOrEmpty<Note>("/notes/notes/"),
  ]);

  return [...(pinned.results ?? []), ...(regular.results ?? [])];
}

export async function searchNotes(term: string) {
  try {
    return await getPaginatedOrEmpty<Note>(`/notes/notes/search/?term=${encodeURIComponent(term)}`);
  } catch (error) {
    throw { error: getErrorMessage(error, "Search failed") };
  }
}

export function createNote(note: NoteInput) {
  return apiJson<Note>("/notes/notes/", {
    method: "POST",
    body: JSON.stringify(note),
  });
}

export function updateNote(id: number, note: Partial<NoteInput>) {
  return apiJson<Note>(`/notes/notes/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(note),
  });
}

export function deleteNote(id: number) {
  return apiJson<null>(`/notes/notes/${id}/`, { method: "DELETE" });
}

export function getTodoLists() {
  return getPaginatedOrEmpty<TodoList>("/todolists/lists/");
}

export function createTodoList(title: string, day: string | null = null) {
  return apiJson<Omit<TodoList, "task_set"> & { task_set?: Task[] }>("/todolists/lists/", {
    method: "POST",
    body: JSON.stringify({ title, day: day || null }),
  }).then(normalizeTodoList);
}

export function updateTodoList(id: number, payload: { title?: string; day?: string | null }) {
  return apiJson<Omit<TodoList, "task_set"> & { task_set?: Task[] }>(`/todolists/lists/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }).then(normalizeTodoList);
}

export function deleteTodoList(id: number) {
  return apiJson<null>(`/todolists/lists/${id}/`, { method: "DELETE" });
}

export function createTask(todoListId: number, statement: string, priority: number) {
  return apiJson<Task>("/todolists/tasks/", {
    method: "POST",
    body: JSON.stringify({
      todo_list: todoListId,
      statement,
      priority,
      checked: false,
    }),
  });
}

export function updateTask(id: number, payload: Partial<Pick<Task, "statement" | "priority" | "checked">>) {
  return apiJson<Task>(`/todolists/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id: number) {
  return apiJson<null>(`/todolists/tasks/${id}/`, { method: "DELETE" });
}
