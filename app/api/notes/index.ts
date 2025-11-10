import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { Note, CreateNoteData } from '../../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection<Note>('notes');

  switch (req.method) {
    case 'GET':
      try {
        const { bin } = req.query;
        const filter = bin === 'true' ? { in_bin: true } : { in_bin: false };
        
        const notes = await notesCollection
          .find(filter)
          .sort({ updatedAt: -1 })
          .toArray();
        res.status(200).json(notes);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
      }
      break;

    case 'POST':
      try {
        const noteData: CreateNoteData = req.body;
        const newNote: Note = {
          ...noteData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          in_bin: false,
        };
        
        const result = await notesCollection.insertOne(newNote);
        const createdNote = { ...newNote, _id: result.insertedId.toString() };
        
        res.status(201).json(createdNote);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}