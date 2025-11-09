import { Note } from './types'

const NOTES_KEY = 'notes'
const BIN_KEY = 'bin'

export function getNotes(): Note[] {
  if (typeof window === 'undefined') return []
  
  const notes = localStorage.getItem(NOTES_KEY)
  return notes ? JSON.parse(notes) : []
}

export function saveNotes(notes: Note[]) {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

export function getBin(): Note[] {
  if (typeof window === 'undefined') return []
  
  const bin = localStorage.getItem(BIN_KEY)
  return bin ? JSON.parse(bin) : []
}

export function saveBin(bin: Note[]) {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(BIN_KEY, JSON.stringify(bin))
}

export function clearBin() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(BIN_KEY)
}