import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { stdout } = await execAsync(`yt-dlp -j "${url}"`);
    const info = JSON.parse(stdout);

    return NextResponse.json({
      title: info.title,
      thumbnail: info.thumbnail,
    });
  } catch (error) {
    console.error('Video info error:', error);
    return NextResponse.json({ error: 'Failed to fetch video info' }, { status: 500 });
  }
}