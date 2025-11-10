import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('notesapp');
    const notesCollection = db.collection('notes');

    const result = await notesCollection.findOneAndUpdate(
      { _id: new ObjectId(id as string) },
      { 
        $set: {
          in_bin: true,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Convert _id to string
    const updatedNote = {
      ...result,
      _id: result._id.toString()
    };

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Move to bin error:', error);
    res.status(500).json({ error: 'Failed to move note to bin' });
  }
}