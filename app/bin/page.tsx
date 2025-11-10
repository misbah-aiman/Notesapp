'use client'
import { useEffect, useState } from 'react'
import { Note } from '@/lib/types'
import { noteService } from '@/app/services/noteServices'

export default function BinPage() {
  const [bin, setBin] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBinNotes()
  }, [])

  const fetchBinNotes = async () => {
    try {
      setLoading(true)
      const binData = await noteService.getBinNotes()
      setBin(binData)
    } catch (error) {
      console.error('Error fetching bin notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await noteService.restoreFromBin(id)
      setBin(prev => prev.filter(note => note._id !== id))
    } catch (error) {
      console.error('Error restoring note:', error)
      alert('Failed to restore note. Please try again.')
    }
  }

  const handleDeletePermanently = async (id: string) => {
    try {
      await noteService.deleteNote(id)
      setBin(prev => prev.filter(note => note._id !== id))
    } catch (error) {
      console.error('Error deleting note permanently:', error)
      alert('Failed to delete note permanently. Please try again.')
    }
  }
}