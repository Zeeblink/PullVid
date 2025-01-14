"use client"
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
}

export function DownloadModal({ isOpen, onClose, videoUrl }: DownloadModalProps) {
  const [format, setFormat] = useState('mp4')
  const [quality, setQuality] = useState('720p')
  const [isLoading, setIsLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState<{ title: string, thumbnail: string } | null>(null)

  // Fetch video info when modal opens
  useEffect(() => {
    if (isOpen && videoUrl) {
      fetch('/api/video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl }),
      })
        .then(res => res.json())
        .then(data => setVideoInfo(data))
        .catch(console.error);
    }
  }, [isOpen, videoUrl]);

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoUrl,
          format,
          quality: quality.replace('p', ''),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Download failed');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor to trigger the download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${videoInfo?.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error('Download failed:', error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>Download Options</DialogTitle>
        </DialogHeader>
        
        {videoInfo && (
          <div className="flex flex-col items-center gap-4">
            <img 
              src={videoInfo.thumbnail} 
              alt={videoInfo.title}
              className="w-full rounded-lg object-cover"
            />
            <h3 className="text-sm font-medium text-center">{videoInfo.title}</h3>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="format">Format</Label>
            <RadioGroup id="format" value={format} onValueChange={setFormat} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mp4" id="mp4" />
                <Label htmlFor="mp4">MP4</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="webm" id="webm" />
                <Label htmlFor="webm">WebM</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quality">Quality</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger className="w-full bg-slate-800">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800">
                <SelectItem value="360p">360p</SelectItem>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDownload} className="bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
            {isLoading ? 'Downloading...' : 'Download'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

