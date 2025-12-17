'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Note {
  _id: string
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  in_bin?: boolean
  favorite?: boolean
}

export default function MyNotesPage() {
  // Use an absolute API base when NEXT_PUBLIC_URL is set so requests work
  // from inside embedded contexts (miniapp iframe) where relative paths
  // would resolve to the host page instead of this app.
  const router = useRouter()
  const API_BASE = (process.env.NEXT_PUBLIC_URL && process.env.NEXT_PUBLIC_URL.length > 0)
    ? `${process.env.NEXT_PUBLIC_URL.replace(/\/$/, '')}/api/notes`
    : '/api/notes'
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
  const res = await fetch(API_BASE)
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch notes')
      }
      
      setNotes(result.data)
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this note?')) return
  
  console.log('🔍 FRONTEND DELETE - Deleting note ID:', id);
  
  try {
    const res = await fetch(`${API_BASE}/${id}`, { 
      method: 'DELETE'
    })
    
    const result = await res.json()
    console.log('DELETE Response:', result)
    
    if (!res.ok) {
      throw new Error(result.error || 'Failed to delete note')
    }
    
    setNotes(prev => prev.filter(note => note._id !== id))
    alert('Note deleted successfully')
  } catch (error: any) {
    console.error('Delete error:', error)
    alert(error.message || 'Failed to delete note')
  }
}

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleSaveEdit = async () => {
  if (!editingNote) return
  
  console.log('🔍 FRONTEND DEBUG ================')
  console.log('Note ID:', editingNote._id)
  
  try {
    const requestBody = {
      title: editTitle.trim(),
      content: editContent.trim()
    }
    
    console.log('Request Body:', requestBody)
    console.log('Stringified Body:', JSON.stringify(requestBody))
    
    const res = await fetch(`${API_BASE}/${editingNote._id}`, {
      method: 'PUT', 
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    
    const result = await res.json()
    console.log('Response Status:', res.status)
    console.log('Response Data:', result)
    
    if (!res.ok) {
      throw new Error(result.error || `HTTP ${res.status}: Failed to update note`)
    }
    
    console.log('✅ Edit successful!')
    fetchNotes()
    setEditingNote(null)
    alert('Note updated successfully')
    
  } catch (error: any) {
    console.error('❌ Edit failed:', error)
    alert(`Error: ${error.message}`)
  }
}

  const cancelEdit = () => {
    setEditingNote(null)
    setEditTitle('')
    setEditContent('')
  }

  if (loading) return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <p>Loading notes...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '50px', backgroundColor: '#faf7f2', position: 'relative', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto' }}>
      <button
        onClick={() => router.push('/')}
        style={styles.backButton}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingLeft: '60px' }}>
        <h1 style={{ color: '#4b3f35', margin: 0, fontSize: '24px' }}>My Notes</h1>
        <span style={{ color: '#8a7f75' }}>{notes.length} notes</span>
      </div>

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px', maxWidth: '900px' }}>
          {notes.map(note => (
            <div 
              key={note._id}
              style={{
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.04)'
              }}
            >
              {editingNote?._id === note._id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input 
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Title"
                    style={{
                      padding: '10px',
                      fontSize: '16px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      color: 'black'
                    }}
                  />
                  <textarea 
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    placeholder="Content"
                    rows={4}
                    style={{
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      color: 'black'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handleSaveEdit}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelEdit}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 style={{ margin: '0 0 10px 0', color: 'black' }}>{note.title}</h3>
                  <p style={{ 
                    margin: '0 0 15px 0', 
                    color: '#333',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5'
                  }}>
                    {note.content}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px',
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '15px'
                  }}>
                    <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleEdit(note)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(note._id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
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

const styles: { [key: string]: React.CSSProperties } = {
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'rgba(150,150,150,0.2)',
    color: '#333',
    border: 'none',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
}