import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';

export async function PUT(request: Request, context: any) {
  try {
    // ✅ Get the ID first
    const { id } = await context.params;
    
    console.log('🔄 API PUT - Received ID:', id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Note ID is required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid note ID is required' },
        { status: 400 }
      );
    }

    // ✅ SAFE JSON PARSING
    let updateData;
    try {
      const bodyText = await request.text();
      console.log('🔄 API PUT - Raw request body:', bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        return NextResponse.json(
          { success: false, error: 'Request body is empty' },
          { status: 400 }
        );
      }
      
      updateData = JSON.parse(bodyText);
      console.log('🔄 API PUT - Parsed update data:', updateData);
    } catch (jsonError) {
      console.error('❌ JSON Parse Error:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // ✅ VALIDATION
    if (!updateData || (typeof updateData !== 'object')) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const hasTitle = updateData.title && updateData.title.trim().length > 0;
    const hasContent = updateData.content && updateData.content.trim().length > 0;

    if (!hasTitle && !hasContent) {
      return NextResponse.json(
        { success: false, error: 'Title or content is required for update' },
        { status: 400 }
      );
    }

    // ✅ DATABASE OPERATION
    const client = await clientPromise;
    const db = client.db('notesapp');
    const notesCollection = db.collection('notes');

    const filter = { _id: new ObjectId(id) };
    const update = {
      $set: {
        ...(hasTitle && { title: updateData.title.trim() }),
        ...(hasContent && { content: updateData.content.trim() }),
        updatedAt: new Date().toISOString(),
      },
    };

    const result = await notesCollection.findOneAndUpdate(filter, update, {
      returnDocument: 'after'
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    const updatedNote = {
      ...result,
      _id: result._id.toString(),
      id: result._id.toString(),
    };

    console.log('✅ API PUT - Success:', updatedNote);
    return NextResponse.json({ success: true, data: updatedNote });

  } catch (error: any) {
    console.error('❌ API PUT Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
}

// RESTORE - Move note out of bin
export async function POST(request: Request, context: any) {
  try {
    const { id } = await context.params;
    
    console.log('🔄 API RESTORE - ID:', id);
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid note ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('notesapp');
    const notesCollection = db.collection('notes');

    const updateResult = await notesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          in_bin: false,
          updatedAt: new Date().toISOString()
        } 
      },
      { returnDocument: 'after' }
    );

    if (!updateResult) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    const restoredNote = {
      ...updateResult,
      _id: updateResult._id.toString(),
      id: updateResult._id.toString(),
    };

    return NextResponse.json({ 
      success: true, 
      data: restoredNote,
      message: 'Note restored from bin' 
    });
  } catch (error: any) {
    console.error('❌ API RESTORE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    
    console.log('🗑️ API DELETE - Moving to bin ID:', id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Note ID is required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid note ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('notesapp');
    const notesCollection = db.collection('notes');

    // ✅ SOFT DELETE - Mark as in_bin instead of deleting
    const updateResult = await notesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          in_bin: true,
          updatedAt: new Date().toISOString()
        } 
      },
      { returnDocument: 'after' }
    );

    if (!updateResult) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    const updatedNote = {
      ...updateResult,
      _id: updateResult._id.toString(),
      id: updateResult._id.toString(),
    };

    return NextResponse.json({ 
      success: true, 
      data: updatedNote,
      message: 'Note moved to bin' 
    });
  } catch (error: any) {
    console.error('❌ API DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
} 

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = await context.params;
    
    console.log('💀 API PERMANENT DELETE - ID:', id);
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid note ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('notesapp');
    const notesCollection = db.collection('notes');

    const deleteResult = await notesCollection.deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Note permanently deleted' 
    });
  } catch (error: any) {
    console.error('❌ API PERMANENT DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
}