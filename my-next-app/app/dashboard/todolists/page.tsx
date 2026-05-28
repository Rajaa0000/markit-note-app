"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  createTask,
  createTodoList,
  deleteTask,
  deleteTodoList,
  getTodoLists,
  updateTask,
  updateTodoList,
  type TodoList,
} from "@/services/workspaceApi";
import { getErrorMessage } from "@/services/authService";

function formatListDate(day: string | null) {
  if (!day) return "No date";
  const date = new Date(`${day}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TodoListsPage() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [editingTitle, setEditingTitle] = useState<Record<number, string>>({});
  const [newTasks, setNewTasks] = useState<Record<number, string>>({});
  const [openLists, setOpenLists] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredLists = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return lists;

    return lists.filter((list) => {
      const listMatch = list.title.toLowerCase().includes(term);
      const taskMatch = list.task_set.some((task) => task.statement.toLowerCase().includes(term));
      return listMatch || taskMatch;
    });
  }, [lists, query]);

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getTodoLists();
      setLists(data.results ?? []);
      setOpenLists(Object.fromEntries((data.results ?? []).map((list) => [list.id, true])));
      setEditingTitle(Object.fromEntries((data.results ?? []).map((list) => [list.id, list.title])));
    } catch (err) {
      setError(getErrorMessage(err, "Could not load lists"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const safeTitle = title.trim() || "Untitled list";
    setIsSaving(true);
    setError("");

    try {
      const createdList = await createTodoList(safeTitle, day || null);
      setLists((current) => [createdList, ...current]);
      setOpenLists((current) => ({ ...current, [createdList.id]: true }));
      setEditingTitle((current) => ({ ...current, [createdList.id]: createdList.title }));
      setTitle("");
      setDay("");
    } catch (err) {
      setError(getErrorMessage(err, "Could not create list"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRenameList(list: TodoList) {
    const nextTitle = editingTitle[list.id]?.trim() || "Untitled list";
    if (nextTitle === list.title) return;

    try {
      const updatedList = await updateTodoList(list.id, { title: nextTitle, day: list.day });
      setLists((current) =>
        current.map((item) =>
          item.id === list.id ? { ...item, ...updatedList, task_set: item.task_set } : item,
        ),
      );
      setEditingTitle((current) => ({ ...current, [list.id]: updatedList.title }));
    } catch (err) {
      setError(getErrorMessage(err, "Could not rename list"));
      setEditingTitle((current) => ({ ...current, [list.id]: list.title }));
    }
  }

  async function handleChangeListDate(list: TodoList, nextDay: string) {
    try {
      const updatedList = await updateTodoList(list.id, { title: list.title, day: nextDay || null });
      setLists((current) =>
        current.map((item) =>
          item.id === list.id ? { ...item, ...updatedList, task_set: item.task_set } : item,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not update list date"));
    }
  }

  async function handleAddTask(list: TodoList) {
    const statement = newTasks[list.id]?.trim();
    if (!statement) return;
    const nextPriority = Math.max(0, ...list.task_set.map((task) => task.priority)) + 1;

    try {
      const createdTask = await createTask(list.id, statement, nextPriority);
      setNewTasks((current) => ({ ...current, [list.id]: "" }));
      setLists((current) =>
        current.map((item) =>
          item.id === list.id ? { ...item, task_set: [...item.task_set, createdTask] } : item,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not add task"));
    }
  }

  async function handleToggleTask(taskId: number, checked: boolean) {
    try {
      const updatedTask = await updateTask(taskId, { checked });
      setLists((current) =>
        current.map((list) => ({
          ...list,
          task_set: list.task_set.map((task) => (task.id === taskId ? updatedTask : task)),
        })),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not update task"));
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await deleteTask(taskId);
      setLists((current) =>
        current.map((list) => ({
          ...list,
          task_set: list.task_set.filter((task) => task.id !== taskId),
        })),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete task"));
    }
  }

  async function handleDeleteList(listId: number) {
    try {
      await deleteTodoList(listId);
      setLists((current) => current.filter((list) => list.id !== listId));
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete list"));
    }
  }

  return (
    <div className="px-5 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6d7893]">
            {lists.length} {lists.length === 1 ? "list" : "lists"}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#141827]">My Tasks</h1>
        </div>

        <label className="flex min-h-11 w-full items-center gap-2 rounded-2xl border border-[#dfe5f3] bg-white px-4 shadow-sm xl:w-[420px]">
          <Search size={18} className="text-[#8b96ad]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search lists and tasks..."
          />
        </label>
      </header>

      <form onSubmit={handleCreateList} className="mb-6 grid gap-3 rounded-2xl border border-[#dfe5f3] bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="app-input"
          maxLength={50}
          placeholder="New list title (optional)"
        />
        <label className="flex items-center gap-2 rounded-xl border border-[#dfe5f3] bg-white px-3">
          <Calendar size={18} className="text-[#8b96ad]" />
          <input
            type="date"
            value={day}
            onChange={(event) => setDay(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </label>
        <button disabled={isSaving} className="app-button bg-[#5c7be8] text-white">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          New list
        </button>
      </form>

      {error && <div className="mb-5 rounded-xl border border-[#ffd5d5] bg-[#fff5f5] p-4 text-sm font-semibold text-[#a73838]">{error}</div>}

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm font-bold text-[#687089]">
          <Loader2 size={18} className="animate-spin" />
          Loading task lists...
        </div>
      ) : filteredLists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cdd7ef] bg-white p-10 text-center">
          <CheckCircle2 className="mx-auto text-[#5c7be8]" size={34} />
          <h2 className="mt-3 text-xl font-black text-[#25306f]">No task lists yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#687089]">
            Add a list for a project, class, or daily plan, then break it into small tasks.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl space-y-4">
          {filteredLists.map((list) => {
            const completed = list.task_set.filter((task) => task.checked).length;
            const isOpen = openLists[list.id] ?? true;

            return (
              <article key={list.id} className="overflow-hidden rounded-2xl border border-[#dfe5f3] bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-[#dfe5f3] bg-[#fbfcff] p-4 sm:flex-row sm:items-center">
                  <button
                    onClick={() => setOpenLists((current) => ({ ...current, [list.id]: !isOpen }))}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#eef2ff]"
                    aria-label={isOpen ? "Collapse list" : "Expand list"}
                  >
                    <ChevronDown size={18} className={isOpen ? "" : "-rotate-90"} />
                  </button>
                  <input
                    value={editingTitle[list.id] ?? list.title}
                    onChange={(event) =>
                      setEditingTitle((current) => ({ ...current, [list.id]: event.target.value }))
                    }
                    onBlur={() => handleRenameList(list)}
                    className="min-w-0 flex-1 bg-transparent text-lg font-black text-[#141827] outline-none"
                  />
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-bold text-[#687089] ring-1 ring-[#dfe5f3]">
                    <Calendar size={15} className="text-[#5c7be8]" />
                    {formatListDate(list.day)}
                  </span>
                  <input
                    type="date"
                    value={list.day ?? ""}
                    onChange={(event) => handleChangeListDate(list, event.target.value)}
                    className="rounded-full border border-[#dfe5f3] bg-white px-3 py-1 text-sm font-bold text-[#687089] outline-none"
                    aria-label="Update list date"
                  />
                  <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-sm font-bold text-[#5369c9]">
                    {completed}/{list.task_set.length}
                  </span>
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="grid h-9 w-9 place-items-center rounded-full text-[#bd3f3f] hover:bg-[#fff2f2]"
                    aria-label="Delete list"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {isOpen && (
                  <div className="divide-y divide-[#edf1f8]">
                    {list.task_set
                      .slice()
                      .sort((a, b) => a.priority - b.priority)
                      .map((task) => (
                        <div key={task.id} className="flex items-center gap-3 px-5 py-4">
                          <button
                            onClick={() => handleToggleTask(task.id, !task.checked)}
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                              task.checked
                                ? "border-[#5c7be8] bg-[#5c7be8] text-white"
                                : "border-[#cdd7ef] text-transparent"
                            }`}
                            aria-label={task.checked ? "Mark task incomplete" : "Mark task complete"}
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <span className={`flex-1 text-sm ${task.checked ? "text-[#98a2b8] line-through" : "text-[#253047]"}`}>
                            {task.statement}
                          </span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="grid h-8 w-8 place-items-center rounded-full text-[#bd3f3f] hover:bg-[#fff2f2]"
                            aria-label="Delete task"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}

                    <div className="flex items-center gap-3 px-5 py-4">
                      <Plus size={17} className="text-[#8b96ad]" />
                      <input
                        value={newTasks[list.id] ?? ""}
                        onChange={(event) => setNewTasks((current) => ({ ...current, [list.id]: event.target.value }))}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleAddTask(list);
                          }
                        }}
                        className="flex-1 bg-transparent text-sm outline-none"
                        placeholder="Add task"
                      />
                      <button onClick={() => handleAddTask(list)} className="text-sm font-bold text-[#5c7be8]">
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
