"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Mic, Play, Pause, RefreshCw } from "lucide-react"

const LipReading = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lip Reading Practice</span>
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
            <Camera className="w-16 h-16 text-gray-600" />
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="icon">
              <Mic className="w-6 h-6" />
            </Button>
            <Button size="icon">
              <Play className="w-6 h-6" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="w-6 h-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LipReading
