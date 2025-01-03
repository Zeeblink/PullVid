import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST(request: Request) {
  try {
    const { url, format, quality } = await request.json();
    
    // Validate URL
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Format quality string (e.g., "720p" -> "best[height<=720]")
    const qualityNumber = parseInt(quality);
    const formatString = `${format}/bestvideo[height<=${qualityNumber}]+bestaudio/best[height<=${qualityNumber}]`;

    // Execute yt-dlp command
    const { stdout } = await execAsync(`yt-dlp -f "${formatString}" -g "${url}"`);
    const downloadUrl = stdout.trim();

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 });
  }
} 