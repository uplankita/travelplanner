'use client'

import { useState, useEffect } from 'react'
import { Itinerary } from '@ai-travel/shared'
import { getLocationImage } from '@ai-travel/shared'

interface ActivityModalProps {
  activity: any;
  onClose: () => void;
}

const ActivityModal = ({ activity, onClose }: ActivityModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="relative">
        {/* Image */}
        <div className="h-64 bg-gray-200 overflow-hidden">
          <img
            src={getLocationImage(activity.location.name)}
            alt={activity.location.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{activity.name}</h3>
        <p className="text-gray-600 mb-4">{activity.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Cost</div>
            <div className="text-lg font-semibold">${activity.cost}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Duration</div>
            <div className="text-lg font-semibold">{activity.duration} minutes</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Location Details</h4>
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex items-center">
              <span className="text-lg mr-2">📍</span>
              <span className="font-medium">{activity.location.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
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
              <div className="relative h-48">
                <img
                  src={getLocationImage(itinerary.destination)}
                  alt={itinerary.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
                  <div className="absolute bottom-0 p-4 text-white">
                    <h2 className="text-2xl font-semibold">
                      {itinerary.destination}
                      <span className="text-sm ml-2 opacity-90">
                        {itinerary.days} Days • ${itinerary.budget}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {itinerary.activities.map((activity, actIndex) => (
                  <div
                    key={actIndex}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={getLocationImage(activity.location.name)}
                          alt={activity.location.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
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

      {/* Activity Modal */}
      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  )
} 