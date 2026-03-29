import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wish from '@/models/Wish';

export async function GET() {
  try {
    await connectDB();
    const wishes = await Wish.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: wishes });
  } catch (error) {
    console.error('GET /api/wishes error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wishes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, message, type, videoUrl } = body;

    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'Name and message are required' }, { status: 400 });
    }

    const wish = await Wish.create({ name, message, type: type || 'text', videoUrl: videoUrl || '' });
    return NextResponse.json({ success: true, data: wish }, { status: 201 });
  } catch (error) {
    console.error('POST /api/wishes error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save wish' }, { status: 500 });
  }
}
