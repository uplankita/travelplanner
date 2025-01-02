'use client'

import { useState, useEffect } from 'react'
import { Itinerary } from '@ai-travel/shared'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [formState, setFormState] = useState({
    destination: '',
    days: 3,
    budget: 1000
  })

  const generateItinerary = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:4000/api/v1/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      setItineraries([data, ...itineraries])
      
      // Save to localStorage
      const savedItineraries = JSON.parse(localStorage.getItem('itineraries') || '[]')
      localStorage.setItem('itineraries', JSON.stringify([data, ...savedItineraries]))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary')
    } finally {
      setLoading(false)
    }
  }

  // Load saved itineraries on mount
  useEffect(() => {
    const savedItineraries = JSON.parse(localStorage.getItem('itineraries') || '[]')
    setItineraries(savedItineraries)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-96 bg-white shadow-lg p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">AI Travel Planner</h1>
        
        {/* Input Form */}
        <form onSubmit={generateItinerary} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Destination
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={formState.destination}
                onChange={(e) => setFormState(prev => ({ ...prev, destination: e.target.value }))}
                className="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Days
              <input
                type="number"
                value={formState.days}
                onChange={(e) => setFormState(prev => ({ ...prev, days: parseInt(e.target.value) }))}
                className="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="14"
                required
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Budget ($)
              <input
                type="number"
                value={formState.budget}
                onChange={(e) => setFormState(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                className="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="100"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Itinerary'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {itineraries.map((itinerary, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-500 text-white p-4">
                <h2 className="text-xl font-semibold">
                  {itinerary.destination}
                  <span className="text-sm ml-2 opacity-90">
                    {itinerary.days} Days • ${itinerary.budget}
                  </span>
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {itinerary.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>${activity.cost}</div>
                        <div>{activity.duration}m</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      📍 {activity.location.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {itineraries.length === 0 && !loading && (
            <div className="text-center text-gray-500 mt-8">
              No itineraries yet. Generate your first one!
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 