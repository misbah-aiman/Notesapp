import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';
import { Note, UpdateNoteData } from '../../../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection<Note>('notes');

  try {
    switch (req.method) {
      case 'PUT':
        const updateData: UpdateNoteData = req.body;
        // Build filter and update separately to avoid syntax errors
        const filter: any = { _id: new ObjectId(id as string) };
        const update = {
          $set: {
            ...updateData,
            updatedAt: new Date().toISOString(),
          },
        };
        const options = { returnDocument: 'after' as const };

        const result = await notesCollection.findOneAndUpdate(filter, update, options);

        const updatedNote = result && 'value' in result ? result.value : result;

        if (!updatedNote) {
          return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json(updatedNote);
        break;

      case 'DELETE':
        const deleteFilter: any = { _id: new ObjectId(id as string) };
        const deleteResult = await notesCollection.deleteOne(deleteFilter);
        
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted permanently' });
        break;

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Operation failed' });
  }
}