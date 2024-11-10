import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const db = await connectToDatabase();
    const { email, password } = await request.json();
    
    const user = await db.collection('users').findOne({ email, password });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Don't send password back in response
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 