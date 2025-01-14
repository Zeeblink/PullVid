import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import util from 'util';
import fetch from 'node-fetch';

const execAsync = util.promisify(exec);

export async function POST(request: Request) {
  try {
    const { url, format, quality } = await request.json();
    
    // Validate URL
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Get video info first
    const { stdout: videoInfo } = await execAsync(`yt-dlp -j "${url}"`);
    const info = JSON.parse(videoInfo);
    const videoTitle = info.title.replace(/[^\w\s-]/g, ''); // Clean the title

    // Format quality string (e.g., "720p" -> "best[height<=720]")
    const qualityNumber = parseInt(quality);
    const formatString = `${format}/bestvideo[height<=${qualityNumber}]+bestaudio/best[height<=${qualityNumber}]`;

    // Get the direct URL
    const { stdout } = await execAsync(`yt-dlp -f "${formatString}" -g "${url}"`);
    const videoUrl = stdout.trim();

    // Fetch the video content
    const response = await fetch(videoUrl);
    const videoBuffer = await response.arrayBuffer();

    // Return the video as a downloadable file
    return new Response(videoBuffer, {
      headers: {
        'Content-Type': format === 'mp4' ? 'video/mp4' : 'video/webm',
        'Content-Disposition': `attachment; filename="${videoTitle}.${format}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 });
  }
} 