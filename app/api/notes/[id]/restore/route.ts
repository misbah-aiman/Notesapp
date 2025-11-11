import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../lib/mongodb';

// PUT /api/notes/[id]/restore
export async function PUT(request: Request, context: any) {
  const { id } = await Promise.resolve(context?.params) as { id: string };
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection('notes');

  try {
    const filter: any = { _id: new ObjectId(id as string) };
    const update = {
      $set: {
        in_bin: false,
        updatedAt: new Date().toISOString(),
      },
    };
    const options = { returnDocument: 'after' as const };

    const result = await notesCollection.findOneAndUpdate(filter, update, options);
    const updatedNote = result && 'value' in result ? result.value : result;

    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    if (updatedNote._id) updatedNote._id = updatedNote._id.toString();

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error restoring note:', error);
    return NextResponse.json({ error: 'Failed to restore note' }, { status: 500 });
  }
}
