'use client'

import { useModelSettings } from './components-model-settings-provider'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface ModelSettings {
  modelName: string
  temperature: number
  topP: number
}

interface ModelSettingsProps {
  settings: ModelSettings
  onSettingsChange: (settings: ModelSettings) => void
}

export function ModelSettings({ settings, onSettingsChange }: ModelSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ModelSettings>(settings)
  const { availableModels, isLoading } = useModelSettings()

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSettingChange = (setting: keyof ModelSettings, value: number | string) => {
    const newSettings = { ...localSettings, [setting]: value }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Model Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select
            disabled={isLoading}
            value={localSettings.modelName}
            onValueChange={(value) => handleSettingChange('modelName', value)}
          >
            <SelectTrigger id="model" className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              <div className="overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {isLoading ? (
                  <SelectItem value="loading">Loading models...</SelectItem>
                ) : (
                  availableModels.map((model) => (
                    <SelectItem key={model} value={model} className="cursor-pointer py-2 px-4 hover:bg-gray-100">
                      {model}
                    </SelectItem>
                  ))
                )}
              </div>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="temperature">
            Temperature: {localSettings.temperature.toFixed(2)}
          </Label>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.01}
            value={[localSettings.temperature]}
            onValueChange={([value]) => handleSettingChange('temperature', value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topP">
            Top P: {localSettings.topP.toFixed(2)}
          </Label>
          <Slider
            id="topP"
            min={0}
            max={1}
            step={0.01}
            value={[localSettings.topP]}
            onValueChange={([value]) => handleSettingChange('topP', value)}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}