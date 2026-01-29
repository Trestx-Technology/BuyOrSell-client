"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ExchangeableAdWrapperProps {
  children?: React.ReactNode
  exchangeAd: {
    image: string
    title: string
    description: string
  }
  className?: string
}

export function ExchangeableAdWrapper({ children, exchangeAd, className }: ExchangeableAdWrapperProps) {
  return (
    <div className={cn("p-2", className)}>
        <Card className="border-2 border-dashed border-primary/30 bg-accent/10 py-4">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
               
                <CardTitle className="text-lg">Available for Exchange</CardTitle>
                <CardDescription>Owner is willing to accept this item in exchange</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exchange Ad Details */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Looking For:</h3>
              <div className="flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={exchangeAd.image || "/placeholder.svg"}
                    alt={exchangeAd.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-base leading-tight">{exchangeAd.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{exchangeAd.description}</p>
                </div>
              </div>
            </div>

            {/* Original Content */}
            {children && <div className="pt-2">{children}</div>}
          </CardContent>
        </Card>
    </div>
  )
}

