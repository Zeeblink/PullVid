"use client"
import { useState } from 'react'
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

  const handleDownload = () => {
    // Here you would implement the actual download logic
    console.log(`Downloading ${videoUrl} in ${format} format at ${quality} quality`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>Download Options</DialogTitle>
        </DialogHeader>
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
          <Button onClick={handleDownload} className="bg-orange-500 hover:bg-orange-600">
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

