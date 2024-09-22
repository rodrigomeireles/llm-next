'use client'

import React, { createContext, useState, useContext } from 'react'
import { ModelSettings } from './ModelSettings'

const ModelSettingsContext = createContext<{
  settings: ModelSettings
  setSettings: React.Dispatch<React.SetStateAction<ModelSettings>>
} | undefined>(undefined)

export function useModelSettings() {
  const context = useContext(ModelSettingsContext)
  if (context === undefined) {
    throw new Error('useModelSettings must be used within a ModelSettingsProvider')
  }
  return context
}

export function ModelSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ModelSettings>({
    temperature: 0.7,
    topP: 1,
  })

  return (
    <ModelSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </ModelSettingsContext.Provider>
  )
}