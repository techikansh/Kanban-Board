import { connectToDatabase } from '@/lib/mongodb';
import { createUser } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const db = await connectToDatabase();
    const data = await request.json();
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const newUser = createUser(data);
    await db.collection('users').insertOne(newUser);

    // Don't send password back in response
    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 