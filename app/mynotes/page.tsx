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
      // Remove from local state immediately
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
}