import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }

    const db = await connectToDatabase();
    const users = await db.collection('users')
      .find({ 
        $and: [
          { email: { $regex: query, $options: 'i' } },
          { email: { $ne: session.user.email } }
        ]
      })
      .project({ email: 1 })
      .limit(5)
      .toArray();

    return NextResponse.json(users.map(user => user.email));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 