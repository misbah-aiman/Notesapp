import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('notesapp');
    const notesCollection = db.collection('notes');

    const url = new URL(request.url);
    const bin = url.searchParams.get('bin');
    const filter = bin === 'true' ? { in_bin: true } : { in_bin: { $ne: true } };

    const notes = await notesCollection
      .find(filter)
      .sort({ updatedAt: -1 })
      .toArray();

    const notesWithStringId = notes.map((note: any) => ({
      ...note,
      _id: note._id.toString(),
      id: note._id.toString(),
    }));

    return NextResponse.json({ success: true, data: notesWithStringId });
  } catch (error: any) {
    console.error('GET Notes Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('notesapp');
    const notesCollection = db.collection('notes');

    const body = await request.json();
    const { title, content } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newNote = {
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      in_bin: false,
      favorite: false,
    };

    const result = await notesCollection.insertOne(newNote);
    
    const createdNote = {
      ...newNote,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString(),
    };

    return NextResponse.json(
      { success: true, data: createdNote },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST Note Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}