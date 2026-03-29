import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
      'audio/webm', 'audio/ogg', 'audio/wav', 'audio/mpeg',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload MP4, WebM, or OGG.' },
        { status: 400 }
      );
    }

    // Max 100MB
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Max 100MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type
    const isAudio = file.type.startsWith('audio/');
    const resourceType = isAudio ? 'video' : 'video'; // Cloudinary uses 'video' for both audio and video

    // Upload to Cloudinary via upload_stream
    const videoUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: 'birthday-wishes',
          format: isAudio ? 'webm' : undefined,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload failed'));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, videoUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
