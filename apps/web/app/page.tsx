'use client'

import { useState, useEffect } from 'react'
import { Itinerary } from '@ai-travel/shared'
import { getLocationImage } from '@ai-travel/shared'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
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
      <aside className="w-96 bg-white shadow-lg overflow-y-auto flex flex-col">
        {/* Form Section */}
        <div className="p-6 border-b border-gray-200">
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
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">History</h2>
          <div className="space-y-3">
            {itineraries.map((itinerary, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedItinerary(itinerary)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={getLocationImage(itinerary.destination)}
                      alt={itinerary.destination}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {itinerary.destination}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {itinerary.days} Days • ${itinerary.budget}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {itinerary.activities.length} activities
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {itineraries.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-8">
                No itineraries yet. Generate your first one!
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content - Selected Itinerary View */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedItinerary ? (
          <div className="max-w-3xl mx-auto">
            {/* Itinerary Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-48">
                <img
                  src={getLocationImage(selectedItinerary.destination)}
                  alt={selectedItinerary.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
                  <div className="absolute bottom-0 p-4 text-white">
                    <h2 className="text-2xl font-semibold">
                      {selectedItinerary.destination}
                      <span className="text-sm ml-2 opacity-90">
                        {selectedItinerary.days} Days • ${selectedItinerary.budget}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {selectedItinerary.activities.map((activity, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex">
                    <div className="w-48 bg-gray-200 overflow-hidden">
                      <img
                        src={getLocationImage(activity.location.name)}
                        alt={activity.location.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                          <p className="text-gray-600 mt-1">{activity.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            📍 {activity.location.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">${activity.cost}</div>
                          <div className="text-sm text-gray-500">{activity.duration} minutes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select an itinerary from the history to view details
          </div>
        )}
      </main>
    </div>
  )
} 