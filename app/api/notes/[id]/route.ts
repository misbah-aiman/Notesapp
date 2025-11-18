import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '../../../../lib/mongodb'

// CORS headers to allow requests from the miniapp host or any origin when
// NEXT_PUBLIC_URL is not set. Preflight (OPTIONS) is handled below.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL ?? '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  // Respond to preflight requests
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
export async function GET(request: Request, context: any) {
  const { id } = await Promise.resolve(context?.params) as { id: string }

  try {
    const client = await clientPromise
    const db = client.db('notesapp')
    const note = await db.collection('notes').findOne({ _id: new ObjectId(id) })

  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404, headers: CORS_HEADERS })

    const normalized = {
      ...note,
      _id: note._id.toString(),
      id: note._id.toString(),
      createdAt: note.createdAt ? new Date(note.createdAt).toISOString() : undefined,
      updatedAt: note.updatedAt ? new Date(note.updatedAt).toISOString() : undefined,
    }

  return NextResponse.json(normalized, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const { id } = await Promise.resolve(context?.params) as { id: string }
    const body = await request.json()

    const client = await clientPromise
    const db = client.db('notesapp')

    // ensure id is defined and log for debugging
    if (!id) {
      console.error('PUT missing id in params', { params: context?.params })
      return NextResponse.json({ error: 'Note id is required' }, { status: 400, headers: CORS_HEADERS })
    }

    const result = await db.collection('notes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: body.title,
          content: body.content,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: 'after' }
    )

    // findOneAndUpdate may return an object with `value` or the document directly depending on driver/version.
    const updatedDoc = result && typeof result === 'object' && 'value' in result ? (result as any).value : result

    if (!updatedDoc) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404, headers: CORS_HEADERS })
    }

    return NextResponse.json({
      ...updatedDoc,
      _id: (updatedDoc._id as any).toString(),
      id: (updatedDoc._id as any).toString(),
      createdAt: updatedDoc.createdAt ? new Date(updatedDoc.createdAt).toISOString() : undefined,
      updatedAt: updatedDoc.updatedAt ? new Date(updatedDoc.updatedAt).toISOString() : undefined,
    }, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await Promise.resolve(context?.params) as { id: string }
    // Log the incoming delete request for debugging (id + origin)
    console.log('API DELETE request for id:', id, 'origin:', request.headers.get('origin'))
    
    const client = await clientPromise
    const db = client.db('notesapp')

    const result = await db.collection('notes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { in_bin: true, deletedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    )

    const updatedDoc = result && typeof result === 'object' && 'value' in result ? (result as any).value : result

    if (!updatedDoc) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404, headers: CORS_HEADERS })
    }

    return NextResponse.json({ message: 'Note moved to bin successfully' }, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Error moving note to bin:', error)
    return NextResponse.json({ error: 'Failed to move note to bin' }, { status: 500 })
  }
}


export async function PATCH(request: Request, context: any) {
  const { id } = await Promise.resolve(context?.params) as { id: string }
  const { action } = await request.json()

  try {
    const client = await clientPromise
    const db = client.db('notesapp')

    if (action === 'restore') {
      await db.collection('notes').updateOne(
        { _id: new ObjectId(id) },
        { $set: { in_bin: false }, $unset: { deletedAt: '' } }
      )
      return NextResponse.json({ message: 'Note restored successfully' }, { headers: CORS_HEADERS })
    }

    if (action === 'deletePermanent') {
      await db.collection('notes').deleteOne({ _id: new ObjectId(id) })
      return NextResponse.json({ message: 'Note permanently deleted' }, { headers: CORS_HEADERS })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400, headers: CORS_HEADERS })
  } catch (error) {
    console.error('Error restoring/deleting note:', error)
    return NextResponse.json({ error: 'Failed to restore/delete note' }, { status: 500, headers: CORS_HEADERS })
  }
}
