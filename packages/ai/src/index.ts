import { Anthropic } from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { Itinerary } from '@ai-travel/shared'
import fetch from 'node-fetch'

let openai: OpenAI | undefined
let anthropic: Anthropic | undefined

// Hugging Face API for development
async function generateWithHuggingFace(prompt: string): Promise<string> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: `[INST] You are a travel planning assistant. Generate a travel itinerary in JSON format.

For this itinerary: ${prompt}

Rules:
1. Response must be ONLY valid JSON, no additional text
2. Use single quotes for text to avoid escaping issues
3. Keep descriptions simple without special characters
4. Include exactly 3 activities
5. Use realistic costs and coordinates

Format:
{
  'activities': [
    {
      'name': 'Example Activity',
      'description': 'Simple description without special characters',
      'cost': 50,
      'duration': 120,
      'location': {
        'name': 'Location Name',
        'latitude': 48.8584,
        'longitude': 2.2945
      }
    }
  ]
}
[/INST]`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false,
          do_sample: true
        }
      }),
    }
  )

  if (!response.ok) {
    console.error('Hugging Face API error:', await response.text())
    throw new Error(`Hugging Face API error: ${response.statusText}`)
  }

  const result = await response.json()
  if (!Array.isArray(result) || !result[0]?.generated_text) {
    console.error('Unexpected response format:', result)
    throw new Error('Unexpected response format from Hugging Face API')
  }

  // Clean up the response to extract just the JSON part
  const text = result[0].generated_text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.error('No JSON found in response:', text)
    throw new Error('No JSON found in the response')
  }

  // Clean the JSON string
  let cleanJson = jsonMatch[0]
    .replace(/\s+/g, ' ')
    .replace(/'/g, '"')
    .replace(/\\"/g, "'")  // Replace escaped quotes with single quotes
    .replace(/[\u2018\u2019]/g, "'")  // Replace smart quotes
    .replace(/[\u201C\u201D]/g, '"')  // Replace smart double quotes
    .trim()

  try {
    // Try to parse the cleaned JSON
    const parsed = JSON.parse(cleanJson)
    if (!parsed.activities || !Array.isArray(parsed.activities)) {
      throw new Error('Invalid JSON structure')
    }
    
    // Additional validation
    for (const activity of parsed.activities) {
      if (!activity.name || !activity.description || !activity.cost || !activity.duration || !activity.location) {
        throw new Error('Missing required fields in activity')
      }
      if (!activity.location.name || !activity.location.latitude || !activity.location.longitude) {
        throw new Error('Missing required fields in location')
      }
    }
    
    return cleanJson
  } catch (error) {
    console.error('Failed to parse JSON:', cleanJson)
    throw error
  }
}

// Mock data as fallback
function getMockItinerary(destination: string, days: number, budget: number): Itinerary {
  return {
    destination,
    days,
    budget,
    activities: [
      {
        name: "Visit the Eiffel Tower",
        description: "Explore the iconic Eiffel Tower and enjoy panoramic views of Paris",
        cost: 25,
        duration: 180,
        location: {
          name: "Eiffel Tower",
          coordinates: {
            lat: 48.8584,
            lng: 2.2945
          }
        }
      },
      {
        name: "Louvre Museum Tour",
        description: "Discover world-famous artworks including the Mona Lisa",
        cost: 20,
        duration: 240,
        location: {
          name: "Louvre Museum",
          coordinates: {
            lat: 48.8606,
            lng: 2.3376
          }
        }
      },
      {
        name: "Seine River Cruise",
        description: "Enjoy a scenic boat tour along the Seine River",
        cost: 15,
        duration: 60,
        location: {
          name: "Seine River",
          coordinates: {
            lat: 48.8566,
            lng: 2.3522
          }
        }
      }
    ]
  }
}

export async function generateItinerary(
  destination: string,
  days: number,
  budget: number
): Promise<Itinerary> {
  try {
    // Use Hugging Face in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using Hugging Face API for development')
      
      const prompt = `${days}-day travel itinerary for ${destination} with a budget of $${budget}`

      try {
        const response = await generateWithHuggingFace(prompt)
        const result = JSON.parse(response)
        return {
          destination,
          days,
          budget,
          activities: result.activities.map((activity: any) => ({
            name: activity.name,
            description: activity.description,
            cost: activity.cost,
            duration: activity.duration,
            location: {
              name: activity.location.name,
              coordinates: {
                lat: activity.location.latitude,
                lng: activity.location.longitude
              }
            }
          }))
        }
      } catch (error) {
        console.warn('Failed to generate with Hugging Face, falling back to mock data:', error)
        return getMockItinerary(destination, days, budget)
      }
    }

    // Production code using Anthropic
    if (!anthropic) throw new Error('Anthropic client not initialized')

    const prompt = `Create a ${days}-day travel itinerary for ${destination} with a budget of $${budget}.
    Include daily activities, estimated costs, and locations. Format as JSON.
    Each activity should have: name, description, cost (in USD), duration (in minutes), and location details.
    The response should be a valid JSON object with an 'activities' array.`

    // Add retry logic with exponential backoff
    let retries = 3
    let delay = 1000 // Start with 1 second delay

    while (retries > 0) {
      try {
        const response = await anthropic.messages.create({
          model: "claude-3-sonnet-20240229",
          max_tokens: 2000,
          temperature: 0.7,
          system: "You are a travel planning assistant. Provide detailed itineraries in JSON format.",
          messages: [{
            role: "user",
            content: prompt
          }]
        })

        const result = JSON.parse(response.content[0].text)
        return {
          destination,
          days,
          budget,
          activities: result.activities.map((activity: any) => ({
            name: activity.name,
            description: activity.description,
            cost: activity.cost,
            duration: activity.duration,
            location: {
              name: activity.location.name,
              coordinates: {
                lat: activity.location.latitude,
                lng: activity.location.longitude
              }
            }
          }))
        }
      } catch (error: any) {
        if (error?.status === 429) { // Rate limit error
          retries--
          if (retries > 0) {
            console.log(`Rate limited. Retrying in ${delay/1000} seconds...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            delay *= 2 // Exponential backoff
            continue
          }
        }
        throw error
      }
    }
    throw new Error('Failed after multiple retries')
  } catch (error) {
    console.error('Error generating itinerary:', error)
    throw error
  }
}

export { openai, anthropic } 