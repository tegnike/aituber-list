'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Offline</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You appear to be offline. Please check your internet connection and try again.
          </p>
          <p className="text-muted-foreground text-sm">
            Some cached content may still be available.
          </p>
          <Button onClick={handleRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </Button>
          <div className="pt-4">
            <Button variant="outline" asChild>
              <a href="/">Go to Home</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
