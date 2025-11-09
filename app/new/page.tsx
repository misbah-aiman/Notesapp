'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Note } from '@/lib/types'
import { saveNotes } from '@/lib/supabase'

export default function NewNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
        in_bin: false
      }
      
      await saveNotes([newNote])
      router.push('/mynotes')
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Error saving note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '50px',
      backgroundColor: 'white'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#e8f5e8',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#2d5016'
        }}>
          +
        </div>
        <h1 style={{ margin: 0 }}>New Note</h1>
      </div>
      
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '30px',
        maxWidth: '600px'
      }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={loading}
          style={{
            padding: '15px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'black',
            outline: 'none',
            transition: 'background-color 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
          onFocus={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.08)'
            }
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
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
            padding: '15px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'black',
            outline: 'none',
            resize: 'vertical',
            minHeight: '200px',
            fontFamily: 'inherit',
            transition: 'background-color 0.2s ease, min-height 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
          onFocus={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.08)'
              e.target.style.minHeight = '250px'
            }
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
            e.target.style.minHeight = '200px'
          }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: loading ? '#6c757d' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-start',
            transition: 'background-color 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#45a049'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#4CAF50'
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Note'}
        </button>
      </form>
    </div>
  )
}