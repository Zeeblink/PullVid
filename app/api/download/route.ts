import { exec } from 'child_process';
import { spawn } from 'child_process';
import { NextResponse } from 'next/server';
import util from 'util';

const execAsync = util.promisify(exec);

export async function GET(request: Request) {
  try {
    // Get parameters from URL
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const format = searchParams.get('format');
    const quality = searchParams.get('quality');

    if (!url || !format || !quality) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get video info first
    const { stdout: videoInfo } = await execAsync(`yt-dlp -j "${url}"`);
    const info = JSON.parse(videoInfo);
    const videoTitle = info.title.replace(/[^\w\s-]/g, '');

    // Format quality string
    const qualityNumber = parseInt(quality);
    const formatString = `${format}/bestvideo[height<=${qualityNumber}]+bestaudio/best[height<=${qualityNumber}]`;

    // Use spawn to stream the video data directly
    const ytDlp = spawn('yt-dlp', ['-f', formatString, '-o', '-', url]);

    // Create a ReadableStream from the stdout of yt-dlp
    const stream = new ReadableStream({
      start(controller) {
        ytDlp.stdout.on('data', (chunk) => controller.enqueue(chunk));
        ytDlp.stdout.on('end', () => controller.close());
        ytDlp.stderr.on('data', (data) => console.error(`yt-dlp stderr: ${data}`));
        ytDlp.on('error', (err) => controller.error(err));
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': format === 'mp4' ? 'video/mp4' : 'video/webm',
        'Content-Disposition': `attachment; filename="${videoTitle}.${format}"`,
        // Add these headers to prevent buffering
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 });
  }
}
