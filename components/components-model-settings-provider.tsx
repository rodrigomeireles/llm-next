'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { Configuration, OpenAIApi, ResponseTypes } from 'openai-edge'

export interface ModelSettings {
  temperature: number
  topP: number
  modelName: string
}

interface ModelSettingsContextType {
  settings: ModelSettings
  setSettings: React.Dispatch<React.SetStateAction<ModelSettings>>
  availableModels: string[]
  isLoading: boolean
}

const ModelSettingsContext = createContext<ModelSettingsContextType | undefined>(undefined)

export function useModelSettings() {
  const context = useContext(ModelSettingsContext)
  if (context === undefined) {
    throw new Error('useModelSettings must be used within a ModelSettingsProvider')
  }
  return context
}

export function ModelSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ModelSettings>({
    temperature: 1,
    topP: 0.3,
    modelName: '', // Default empty string, will be set after fetching models
  })
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log(process.env.GROQ_API_KEY);
    async function fetchModels() {
      try {
        const getModels = await fetch("/api/models");
        const modelNames = (await getModels.json() as string[]);
        setAvailableModels(modelNames);
        setSettings(prevSettings => ({
          ...prevSettings,
          modelName: modelNames[0] || 'llama-3.2-90b-text-preview' // Set the first model as default
        }));
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModels()
  }, [])

  return (
    <ModelSettingsContext.Provider value={{ settings, setSettings, availableModels, isLoading }}>
      {children}
    </ModelSettingsContext.Provider>
  )
}