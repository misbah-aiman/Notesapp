import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(request: Request) {
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection('notes');

  try {
    const url = new URL(request.url);
    const bin = url.searchParams.get('bin');
    const filter = bin === 'true' ? { in_bin: true } : { in_bin: false };

    const notes = await notesCollection
      .find(filter)
      .sort({ updatedAt: -1 })
      .toArray();

    const notesWithStringId = notes.map((note: any) => {
      const idString = note._id?.toString();
      return {
        ...note,
        _id: idString,
        id: idString,
      };
    });

    return NextResponse.json(notesWithStringId);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/notes
export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db('notesapp');
  const notesCollection = db.collection('notes');

  try {
    const body = await request.json();
    const { title, content } = body;
    const newNote = {
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      in_bin: false,
    };

    const result = await notesCollection.insertOne(newNote);
    const idString = result.insertedId.toString();
    const createdNote = {
      ...newNote,
      _id: idString,
      id: idString,
    };

    return NextResponse.json(createdNote, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}