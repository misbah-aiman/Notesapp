import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';
import { UpdateNoteData } from '../../../../lib/types';

// PUT /api/notes/[id]
export async function PUT(request: Request, context: any) {
  const { id } = await Promise.resolve(context?.params) as { id: string };
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection('notes');

  try {
    const updateData: UpdateNoteData = await request.json();
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
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const idString = updatedNote._id?.toString();
    if (idString) {
      updatedNote._id = idString;
      (updatedNote as any).id = idString;
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}

// DELETE /api/notes/[id]
export async function DELETE(request: Request, context: any) {
  const { id } = await Promise.resolve(context?.params) as { id: string };
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection('notes');

  try {
    const deleteFilter: any = { _id: new ObjectId(id as string) };
    const deleteResult = await notesCollection.deleteOne(deleteFilter);

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted permanently' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}