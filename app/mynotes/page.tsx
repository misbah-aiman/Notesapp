'use client'
import { useEffect, useState } from 'react'
import { Note } from '@/lib/types'
import { getNotes, saveNotes, moveToBin, updateNote } from '@/lib/supabase'

export default function MyNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching notes from Supabase...')
        const notesData = await getNotes()
        console.log('Received notes:', notesData)
        setNotes(notesData)
        
        if (notesData.length === 0) {
          console.log('No notes found - database might be empty')
        }
      } catch (error) {
        console.error('Error fetching notes:', error)
        setError('Failed to load notes. Check console for details.')
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await moveToBin(id)
      
      const newNotes = notes.filter(n => n.id !== id)
      setNotes(newNotes)
    } catch (error) {
      console.error('Error deleting note:', error)
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
      const updatedNote: Note = {
        ...editingNote,
        title: editTitle,
        content: editContent
      }
      
      await updateNote(updatedNote)
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id ? updatedNote : note
      )
      
      setNotes(updatedNotes)
      setEditingNote(null)
      setEditTitle('')
      setEditContent('')
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setEditTitle('')
    setEditContent('')
  }

  if (loading) {
    return (
      <div style={{ 
        padding: 20, 
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black'
      }}>
        <p>Loading notes...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: 20, 
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        padding: '10px 20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '12px'
      }}>
        <h1 style={{ margin: 0, color: '#2d5016' }}>My Notes</h1>
      </div>

      {notes.length === 0 ? (
        <p style={{
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          textAlign: 'center',
          color: 'black'
        }}>No notes yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {notes.map(note => (
            <div key={note.id} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: 20,
              borderRadius: 12,
              width: 280,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {editingNote?.id === note.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    style={{
                      padding: '10px',
                      fontSize: '16px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      outline: 'none',
                      color: 'black' // ADDED
                    }}
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={4}
                    style={{
                      padding: '10px',
                      fontSize: '14px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      color: 'black' // ADDED
                    }}
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{note.title}</h3>
                    <p style={{ 
                      margin: '0 0 15px 0', 
                      color: '#666',
                      lineHeight: '1.4'
                    }}>{note.content}</p>
                  </div>
                  
                  <div>
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: '#e8f5e8',
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}>
                      <small style={{ color: '#2d5016', fontSize: '12px' }}>
                        {new Date(note.createdAt).toLocaleString()}
                      </small>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button 
                        onClick={() => handleEdit(note)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(note.id)}
                        style={{
                          padding: '8px 16px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}