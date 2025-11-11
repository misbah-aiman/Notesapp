'use client'
import { useEffect, useState } from 'react'
import { Note } from '@/lib/types'
import { noteService } from '@/app/services/noteServices'

export default function MyNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      setError(null)
      const notesData = await noteService.getNotes()
      setNotes(notesData)
      setFilteredNotes(notesData)
    } catch (error) {
      console.error('Error fetching notes:', error)
      setError('Failed to load notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes)
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredNotes(filtered)
    }
  }, [searchQuery, notes])

  const handleDelete = async (id: string) => {
    try {
      await noteService.moveToBin(id)
      setNotes(prev => prev.filter(note => note._id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleSaveEdit = async () => {
    if (!editingNote || !editingNote._id) return

    try {
      const updatedNote = await noteService.updateNote(editingNote._id, {
        title: editTitle,
        content: editContent
      })
      
      setNotes(prev => prev.map(note => 
        note._id === editingNote._id ? updatedNote : note
      ))
      
      setEditingNote(null)
      setEditTitle('')
      setEditContent('')
    } catch (error) {
      console.error('Error updating note:', error)
      alert('Failed to update note. Please try again.')
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '15px',
          padding: '10px 20px',
          backgroundColor: '#e8f5e8',
          borderRadius: '12px'
        }}>
          <h1 style={{ margin: 0, color: '#2d5016' }}>My Notes</h1>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {showSearch && (
            <input
              type="text"
              placeholder="Search notes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 15px',
                fontSize: '14px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                outline: 'none',
                color: 'black',
                width: '250px'
              }}
            />
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#e8f5e8',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            🔍
          </button>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <p style={{
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          textAlign: 'center',
          color: 'black'
        }}>
          {searchQuery ? 'No notes found matching your search.' : 'No notes yet.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {filteredNotes.map(note => (
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
                      color: 'black'
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
                      color: 'black'
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
                      marginBottom: '8px'
                    }}>
                      <small style={{ color: '#2d5016', fontSize: '12px' }}>
                        Created: {new Date(note.createdAt).toLocaleString()}
                      </small>
                    </div>
                    
                    {note.updatedAt && (
                      <div style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(232, 245, 232, 0.6)',
                        borderRadius: '8px',
                        marginBottom: '10px'
                      }}>
                        <small style={{ color: '#2d5016', fontSize: '12px' }}>
                          Updated: {new Date(note.updatedAt).toLocaleString()}
                        </small>
                      </div>
                    )}
                    
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