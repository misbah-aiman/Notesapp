'use client'
import { useEffect, useState } from 'react'

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt?: string
  in_bin?: boolean
}

export default function MyNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notes/route')
      if (!res.ok) throw new Error('Failed to fetch notes')
      const data = await res.json()
      setNotes(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}/bin`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed to move note to bin')
      setNotes(prev => prev.filter(note => note._id !== id))
    } catch (error) {
      console.error(error)
      alert('Failed to delete note')
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleSaveEdit = async () => {
    if (!editingNote) return
    try {
      const res = await fetch(`/api/notes/${editingNote._id}/route`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      })
      if (!res.ok) throw new Error('Failed to update note')
      fetchNotes()
      setEditingNote(null)
      setEditTitle('')
      setEditContent('')
    } catch (error) {
      console.error(error)
      alert('Failed to update note')
    }
  }

  if (loading) return <p>Loading notes...</p>

  return (
    <div>
      {notes.map(note => (
        <div key={note._id}>
          {editingNote?._id === note._id ? (
            <>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} />
              <button onClick={handleSaveEdit}>Save</button>
            </>
          ) : (
            <>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button onClick={() => handleDelete(note._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
