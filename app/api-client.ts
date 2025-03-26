const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export async function getVideoInfo(url: string) {
  const response = await fetch(`${API_BASE_URL}/video-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return response.json();
}

export async function downloadVideo(url: string, format: string, quality: string) {
  return `${API_BASE_URL}/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`;
} 