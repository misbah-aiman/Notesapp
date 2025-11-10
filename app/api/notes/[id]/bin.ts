import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';
import { Note } from '../../../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection<Note>('notes');

  try {
  const filter: any = { _id: new ObjectId(id as string) };
    const update = {
      $set: {
        in_bin: true,
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
  } catch (error) {
    console.error('Error moving note to bin:', error);
    res.status(500).json({ error: 'Failed to move note to bin' });
  }
}