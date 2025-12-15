"use client"

import type React from "react"

import { useState } from "react"
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Share2, Copy, Check } from "lucide-react"
import { Input } from "./input"

interface ShareDialogProps {
  url: string
  title: string
  description?: string
  children?: React.ReactNode
}

export function ShareDialog({ url, title, description, children }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const shareText = description ? `${title}\n\n${description}` : title
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(shareText)

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy. Please try again")
    }
  }

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366]",
    },
    {
      name: "X (Twitter)",
      icon: (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: "hover:bg-foreground/10 hover:text-foreground",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
    },
    {
      name: "Reddit",
      icon: (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(title)}`,
      color: "hover:bg-[#FF4500]/10 hover:text-[#FF4500]",
    },
  ]

  return (
    <ResponsiveDialogDrawer
      open={open}
      onOpenChange={setOpen}
      title="Share"
      description={`Share this ${title.toLowerCase()} on your favorite platform`}
      dialogContentClassName="sm:max-w-lg"
      trigger={
        children || (
          <Button variant="outline" size="icon">
            <Share2 className="size-4" />
            <span className="sr-only">Share</span>
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {shareLinks.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              icon={platform.icon}
              iconPosition="center"
              className={`gap-3 transition-colors w-full ${platform.color}`}
              onClick={() => window.open(platform.url, "_blank", "noopener,noreferrer")}
            >
              <span>{platform.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input readOnly value={url} className="w-full rounded-md border bg-muted px-3 py-2 text-sm truncate" />
          <Button size="icon" variant="filled" onClick={handleCopyToClipboard} className="w-10 h-10">
            {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
      </div>
    </ResponsiveDialogDrawer>
  )
}

