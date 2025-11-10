import { Note, CreateNoteData, UpdateNoteData } from '@/lib/types';

const API_BASE = '/api/notes';

export const noteService = {
  async getNotes(): Promise<Note[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  async getBinNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE}?bin=true`);
    if (!response.ok) throw new Error('Failed to fetch bin notes');
    return response.json();
  },

  async createNote(noteData: CreateNoteData): Promise<Note> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error('Failed to create note');
    return response.json();
  },

  async updateNote(id: string, noteData: UpdateNoteData): Promise<Note> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  async moveToBin(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}/bin`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to move note to bin');
  },

  async restoreFromBin(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}/restore`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to restore note');
  },

  async deleteNote(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
  },
};