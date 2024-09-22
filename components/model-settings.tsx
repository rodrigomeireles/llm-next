'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export interface ModelSettings {
  temperature: number
  topP: number
}

interface ModelSettingsProps {
  settings: ModelSettings
  onSettingsChange: (settings: ModelSettings) => void
}

export function ModelSettings({ settings, onSettingsChange }: ModelSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ModelSettings>(settings)

  const handleSettingChange = (setting: keyof ModelSettings, value: number) => {
    const newSettings = { ...localSettings, [setting]: value }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Model Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature: {localSettings.temperature.toFixed(2)}</Label>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.01}
            value={[localSettings.temperature]}
            onValueChange={([value]) => handleSettingChange('temperature', value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topP">Top P: {localSettings.topP.toFixed(2)}</Label>
          <Slider
            id="topP"
            min={0}
            max={1}
            step={0.01}
            value={[localSettings.topP]}
            onValueChange={([value]) => handleSettingChange('topP', value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}