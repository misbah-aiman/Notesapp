'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { noteService } from '@/app/services/noteServices'

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
      await noteService.createNote({
        title: title.trim(),
        content: content.trim()
      })
      
      router.push('/mynotes')
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Error saving note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ... keep the rest of your JSX exactly the same ...
  // The form UI doesn't need to change
}