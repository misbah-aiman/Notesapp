import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection('notes');

  try {
    switch (req.method) {
      case 'GET':
        // Get all notes (both regular and bin)
        const { bin } = req.query;
        const filter = bin === 'true' ? { in_bin: true } : { in_bin: false };
        
        const notes = await notesCollection
          .find(filter)
          .sort({ updatedAt: -1 })
          .toArray();
        
        // Convert MongoDB _id to string for the frontend
        const notesWithStringId = notes.map(note => ({
          ...note,
          _id: note._id.toString()
        }));
        
        res.status(200).json(notesWithStringId);
        break;

      case 'POST':
        // Create new note
        const { title, content } = req.body;
        const newNote = {
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          in_bin: false,
        };
        
        const result = await notesCollection.insertOne(newNote);
        const createdNote = {
          ...newNote,
          _id: result.insertedId.toString()
        };
        
        res.status(201).json(createdNote);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}