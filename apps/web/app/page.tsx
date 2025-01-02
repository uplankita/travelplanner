'use client'
import { useState } from 'react'
import { Theme, Button, TextField, Card, Heading, Text, Container } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generateItinerary = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const form = e.target as HTMLFormElement
    const data = {
      destination: form.destination.value,
      days: parseInt(form.days.value),
      budget: parseFloat(form.budget.value)
    }

    try {
      const response = await fetch('http://localhost:4000/api/v1/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setResult(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Theme>
      <Container size="3" className="py-8">
        <Heading size="8" className="mb-8">AI Travel Planner</Heading>
        
        <Card className="mb-8">
          <form onSubmit={generateItinerary} className="space-y-4">
            <div>
              <Text as="label" size="2" weight="bold">Destination</Text>
              <TextField.Root>
                <TextField.Input
                  name="destination"
                  required
                  placeholder="e.g., Paris"
                />
              </TextField.Root>
            </div>
            
            <div>
              <Text as="label" size="2" weight="bold">Number of Days</Text>
              <TextField.Root>
                <TextField.Input
                  type="number"
                  name="days"
                  required
                  min="1"
                />
              </TextField.Root>
            </div>
            
            <div>
              <Text as="label" size="2" weight="bold">Budget (USD)</Text>
              <TextField.Root>
                <TextField.Input
                  type="number"
                  name="budget"
                  required
                  min="100"
                />
              </TextField.Root>
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Itinerary'}
            </Button>
          </form>
        </Card>

        {error && (
          <Card className="mb-4 p-4 bg-red-50 text-red-700">
            {error}
          </Card>
        )}

        {result && (
          <Card>
            <Heading size="6" className="mb-2">
              {result.destination} - {result.days} Days
            </Heading>
            <Text className="mb-4">Budget: ${result.budget}</Text>
            
            <div className="space-y-4">
              {result.activities.map((activity: any, index: number) => (
                <Card key={index} className="p-4">
                  <Heading size="4">{activity.name}</Heading>
                  <Text className="text-gray-600">{activity.description}</Text>
                  <div className="mt-2">
                    <Text size="2" className="mr-4">Cost: ${activity.cost}</Text>
                    <Text size="2">Duration: {activity.duration} minutes</Text>
                  </div>
                  <Text size="2" className="text-gray-500">
                    Location: {activity.location.name}
                  </Text>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </Container>
    </Theme>
  )
} 