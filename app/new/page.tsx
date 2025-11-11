'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Note {
  title: string
  content: string
}

export default function NewNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    
    setLoading(true)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        } as Note),
      })

      if (!response.ok) {
        throw new Error('Failed to create note')
      }

      const newNote = await response.json()
      console.log('Created Note:', newNote)

      // Redirect to mynotes page after successful save
      router.push('/mynotes')
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Error saving note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '50px', backgroundColor: 'white' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <div style={{
          width: '40px', height: '40px', backgroundColor: '#e8f5e8',
          borderRadius: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: 'black'
        }}>+</div>
        <h1 style={{ margin: 0, color: 'black' }}>New Note</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '600px' }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={loading}
          style={{
            padding: '15px', fontSize: '16px', border: 'none', borderRadius: '8px',
            backgroundColor: 'rgba(0,0,0,0.05)', outline: 'none', opacity: loading ? 0.7 : 1
          }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={6}
          required
          disabled={loading}
          style={{
            padding: '15px', fontSize: '16px', border: 'none', borderRadius: '8px',
            backgroundColor: 'rgba(0,0,0,0.05)', outline: 'none', minHeight: '200px',
            fontFamily: 'inherit', resize: 'vertical', opacity: loading ? 0.7 : 1
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '15px 30px', fontSize: '16px',
            backgroundColor: loading ? '#6c757d' : '#4CAF50',
            color: 'white', border: 'none', borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Saving...' : 'Save Note'}
        </button>
      </form>
    </div>
  )
}
