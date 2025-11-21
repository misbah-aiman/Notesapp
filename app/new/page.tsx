'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert('Please enter title and content')
      return
    }

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
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save note')
      }

      console.log('Note saved successfully:', result.data)
      router.push('/mynotes')
      router.refresh() 
    } catch (error: any) {
      console.error('Error saving note:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '50px', backgroundColor: 'white', position: 'relative' }}>
      <button
        onClick={() => router.push('/')}
        style={styles.backButton}
      >
        ← Back
      </button>

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
            backgroundColor: 'rgba(0,0,0,0.05)', outline: 'none', opacity: loading ? 0.7 : 1,
            color: 'black'
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
            fontFamily: 'inherit', resize: 'vertical', opacity: loading ? 0.7 : 1,
            color: 'black'
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