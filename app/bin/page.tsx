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

export default function BinPage() {
  const [bin, setBin] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBinNotes()
  }, [])

  const fetchBinNotes = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notes/route?bin=true')
      if (!res.ok) throw new Error('Failed to fetch bin notes')
      const data = await res.json()
      setBin(data)
    } catch (error) {
      console.error(error)
      alert('Failed to load bin notes')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}/restore`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed to restore note')
      setBin(prev => prev.filter(note => note._id !== id))
    } catch (error) {
      console.error(error)
      alert('Failed to restore note')
    }
  }

  const handleDeletePermanently = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}/route`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete note permanently')
      setBin(prev => prev.filter(note => note._id !== id))
    } catch (error) {
      console.error(error)
      alert('Failed to delete note permanently')
    }
  }

  if (loading) return <p>Loading bin...</p>

  return (
    <div>
      {bin.length === 0 ? (
        <p>Bin is empty.</p>
      ) : (
        bin.map(note => (
          <div key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
            <div>
              <button onClick={() => handleRestore(note._id)}>Restore</button>
              <button onClick={() => handleDeletePermanently(note._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
