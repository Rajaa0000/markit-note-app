"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Pin, PinOff, Plus, Search, Trash2, X } from "lucide-react";
import {
  createNote,
  deleteNote,
  getNotes,
  searchNotes,
  updateNote,
  type Note,
  type NoteInput,
} from "@/services/workspaceApi";
import { getErrorMessage } from "@/services/authService";

const colors = ["#FFFFFF", "#FFF4DF", "#EAF1FF", "#EAF8EF", "#F6EDFF", "#FFECEF"];

const emptyForm: NoteInput = {
  title: "",
  text: "",
  bg_color: "#FFFFFF",
  is_pinned: false,
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<NoteInput>(emptyForm);
  const [editing, setEditing] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const pinnedNotes = useMemo(() => notes.filter((note) => note.is_pinned), [notes]);
  const regularNotes = useMemo(() => notes.filter((note) => !note.is_pinned), [notes]);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!query.trim()) {
        loadNotes(false);
        return;
      }

      try {
        const data = await searchNotes(query.trim());
        setNotes(data.results ?? []);
      } catch (err) {
        setError(getErrorMessage(err, "Search failed"));
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  async function loadNotes(showLoader = true) {
    if (showLoader) setIsLoading(true);
    setError("");

    try {
      setNotes(await getNotes());
    } catch (err) {
      setError(getErrorMessage(err, "Could not load notes"));
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(note: Note) {
    setEditing(note);
    setForm({
      title: note.title,
      text: note.text,
      bg_color: note.bg_color,
      is_pinned: note.is_pinned,
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      if (editing) await updateNote(editing.id, form);
      else await createNote(form);
      setIsModalOpen(false);
      await loadNotes(false);
    } catch (err) {
      setError(getErrorMessage(err, "Could not save note"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePin(note: Note) {
    await updateNote(note.id, { is_pinned: !note.is_pinned });
    await loadNotes(false);
  }

  async function handleDelete(note: Note) {
    await deleteNote(note.id);
    await loadNotes(false);
  }

  function renderNote(note: Note) {
    return (
      <article
        key={note.id}
        className="group min-h-[168px] rounded-2xl border border-[#dfe5f3] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        style={{ backgroundColor: note.bg_color || "#FFFFFF" }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-[#25306f]">{note.title}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#8b96ad]">
              {new Date(note.updated_at).toLocaleDateString()}
            </p>
          </div>
          <button
            aria-label={note.is_pinned ? "Unpin note" : "Pin note"}
            onClick={() => handlePin(note)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#5c7be8] text-white shadow-sm"
          >
            {note.is_pinned ? <PinOff size={17} /> : <Pin size={17} />}
          </button>
        </div>

        <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-[#526078]">{note.text}</p>

        <div className="mt-5 flex gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
          <button
            onClick={() => openEditModal(note)}
            className="app-button min-h-0 rounded-lg border border-[#dfe5f3] bg-white px-3 py-2 text-xs text-[#25306f]"
          >
            <Edit3 size={15} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(note)}
            className="app-button min-h-0 rounded-lg border border-[#ffd5d5] bg-white px-3 py-2 text-xs text-[#bd3f3f]"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="px-5 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6d7893]">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#141827]">My Notes</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-11 w-full items-center gap-2 rounded-2xl border border-[#dfe5f3] bg-white px-4 shadow-sm sm:w-[360px]">
            <Search size={18} className="text-[#8b96ad]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search notes by title..."
            />
          </label>
          <button onClick={openCreateModal} className="app-button bg-[#5c7be8] text-white shadow-sm">
            <Plus size={18} />
            New note
          </button>
        </div>
      </header>

      {error && <div className="mb-5 rounded-xl border border-[#ffd5d5] bg-[#fff5f5] p-4 text-sm font-semibold text-[#a73838]">{error}</div>}

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm font-bold text-[#687089]">
          <Loader2 size={18} className="animate-spin" />
          Loading notes...
        </div>
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cdd7ef] bg-white p-10 text-center">
          <h2 className="text-xl font-black text-[#25306f]">No notes yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#687089]">
            Create your first note, choose a color, and pin the important bits to the top.
          </p>
          <button onClick={openCreateModal} className="app-button mt-5 bg-[#5c7be8] text-white">
            <Plus size={18} />
            Create note
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {pinnedNotes.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#5c7be8]">
                <Pin size={15} />
                Pinned
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{pinnedNotes.map(renderNote)}</div>
            </section>
          )}

          {regularNotes.length > 0 && (
            <section>
              <div className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#8b96ad]">All notes</div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{regularNotes.map(renderNote)}</div>
            </section>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-[#111827]/35 p-4 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-2xl border border-[#dfe5f3] bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#141827]">{editing ? "Edit note" : "New note"}</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#f4f6fb]"
                aria-label="Close note form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="app-input"
                maxLength={50}
                placeholder="Note title"
                required
              />
              <textarea
                value={form.text}
                onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
                className="app-input min-h-[180px] resize-y"
                maxLength={10000}
                placeholder="Write the details..."
                required
              />
              <div className="flex flex-wrap items-center gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, bg_color: color }))}
                    className={`h-8 w-8 rounded-full border ${
                      form.bg_color === color ? "ring-4 ring-[#dce4ff]" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Use color ${color}`}
                  />
                ))}
                <label className="ml-auto flex items-center gap-2 text-sm font-bold text-[#60708d]">
                  <input
                    type="checkbox"
                    checked={form.is_pinned}
                    onChange={(event) => setForm((current) => ({ ...current, is_pinned: event.target.checked }))}
                  />
                  Pin note
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="app-button border border-[#dfe5f3] bg-white text-[#60708d]">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="app-button bg-[#5c7be8] text-white">
                {isSaving && <Loader2 size={17} className="animate-spin" />}
                Save note
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
