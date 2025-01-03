import { Youtube, Facebook, Instagram } from 'lucide-react'

const platforms = [
    {
      name: "YouTube",
      icon: <Youtube className="w-8 h-8 text-red-500" />,
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-8 h-8 text-blue-500" />,
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-8 h-8 text-pink-500" />,
    },
    {
      name: "TikTok",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.321 5.562a5.124 5.124 0 0 1-3.585-1.477A5.124 5.124 0 0 1 14.259.5h-4.18v15.94a2.79 2.79 0 0 1-5.58 0 2.79 2.79 0 0 1 2.79-2.79c.154 0 .31.012.463.037V9.49a7.19 7.19 0 0 0-.463-.015A7.189 7.189 0 0 0 0 16.664a7.189 7.189 0 0 0 7.189 7.189 7.189 7.189 0 0 0 7.189-7.189V8.556a9.239 9.239 0 0 0 4.943 1.438V5.814a5.176 5.176 0 0 1-4.943-.252z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ]

export function Platforms() {
  return (
    <div className="mt-20 text-center">
      <h2 className="text-xl font-semibold mb-2">Supported Platforms</h2>
      <p className="text-slate-400 mb-8">Download from all major social media platforms</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="bg-slate-900 p-6 rounded-lg flex flex-col items-center gap-2"
          >
            {platform.icon}
            <span className="text-sm text-slate-400">{platform.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
