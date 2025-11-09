import { supabase } from './supabaseClient'
import { Note } from './types'

export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('in_bin', false)
    .order('createdAt', { ascending: false }) 
  
  if (error) {
    console.error('Error fetching notes:', error)
    return []
  }
  
  return data || []
}

export async function getBin(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('in_bin', true)
    .order('createdAt', { ascending: false })
  
  if (error) {
    console.error('Error fetching bin notes:', error)
    return []
  }
  
  return data || []
}

export async function saveNotes(note: Note) {
  console.log('Inserting note:', note)
  const { data, error, status } = await supabase
    .from('notes')
    .insert([
      {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        in_bin: false
      }
    ])
    .select() 

  if (error) {
    console.error('Supabase insert error:', error.message)
    console.error('Full error object:', error)
    console.error('HTTP status:', status)
    throw error
  }

  console.log('Inserted successfully:', data)
  return data
}


export async function saveBin(binNotes: Note[]) {
  for (const note of binNotes) {
    const { error } = await supabase
      .from('notes')
      .update({ in_bin: true })
      .eq('id', note.id)
    
    if (error) {
      console.error('Error moving note to bin:', error)
    }
  }
}

export async function restoreNote(id: string) {
  const { error } = await supabase
    .from('notes')
    .update({ in_bin: false })
    .eq('id', id)
  
  if (error) {
    console.error('Error restoring note:', error)
    throw error
  }
}

export async function deleteNotePermanently(id: string) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting note:', error)
    throw error
  }
}

export async function clearBin() {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('in_bin', true)
  
  if (error) {
    console.error('Error clearing bin:', error)
    throw error
  }
}

export async function moveToBin(id: string) {
  const { error } = await supabase
    .from('notes')
    .update({ in_bin: true })
    .eq('id', id)
  
  if (error) {
    console.error('Error moving note to bin:', error)
    throw error
  }
}

export async function updateNote(note: Note) {
  const { error } = await supabase
    .from('notes')
    .update({
      title: note.title,
      content: note.content
    })
    .eq('id', note.id)
  
  if (error) {
    console.error('Error updating note:', error)
    throw error
  }
}