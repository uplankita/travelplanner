// Popular landmarks and their high-quality images from Pexels
export const landmarkImages: Record<string, string> = {
  // Paris
  'Eiffel Tower': 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
  'Louvre Museum': 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg',
  'Notre-Dame': 'https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg',
  'Arc de Triomphe': 'https://images.pexels.com/photos/2344/cars-france-landmark-lights.jpg',
  'Palace of Versailles': 'https://images.pexels.com/photos/248224/pexels-photo-248224.jpeg',
  
  // London
  'Big Ben': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
  'Tower Bridge': 'https://images.pexels.com/photos/427679/pexels-photo-427679.jpeg',
  'London Eye': 'https://images.pexels.com/photos/94420/pexels-photo-94420.jpeg',
  'Westminster Abbey': 'https://images.pexels.com/photos/1427578/pexels-photo-1427578.jpeg',
  'Buckingham Palace': 'https://images.pexels.com/photos/372225/pexels-photo-372225.jpeg',

  // New York
  'Statue of Liberty': 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
  'Empire State Building': 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
  'Times Square': 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg',
  'Central Park': 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg',
  'Brooklyn Bridge': 'https://images.pexels.com/photos/45170/kite-brooklyn-bridge-new-york-manhattan-45170.jpeg',

  // Rome
  'Colosseum': 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg',
  'Vatican Museums': 'https://images.pexels.com/photos/3722870/pexels-photo-3722870.jpeg',
  'Trevi Fountain': 'https://images.pexels.com/photos/2928058/pexels-photo-2928058.jpeg',
  'Pantheon': 'https://images.pexels.com/photos/2676642/pexels-photo-2676642.jpeg',
  'Spanish Steps': 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg',

  // Default images for different types of locations
  'default_museum': 'https://images.pexels.com/photos/69903/pexels-photo-69903.jpeg',
  'default_park': 'https://images.pexels.com/photos/1174687/pexels-photo-1174687.jpeg',
  'default_restaurant': 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg',
  'default_shopping': 'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg',
  'default_beach': 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
  'default_mountain': 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
  'default_temple': 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg',
  'default_castle': 'https://images.pexels.com/photos/2832034/pexels-photo-2832034.jpeg',
}

// Helper function to get the most appropriate image for a location
export function getLocationImage(locationName: string): string {
  // First, try exact match
  if (landmarkImages[locationName]) {
    return landmarkImages[locationName]
  }

  // Try to match with known landmarks using substring
  const lowercaseName = locationName.toLowerCase()
  
  // Check for common location types
  if (lowercaseName.includes('museum')) return landmarkImages.default_museum
  if (lowercaseName.includes('park')) return landmarkImages.default_park
  if (lowercaseName.includes('restaurant')) return landmarkImages.default_restaurant
  if (lowercaseName.includes('shop') || lowercaseName.includes('market')) return landmarkImages.default_shopping
  if (lowercaseName.includes('beach')) return landmarkImages.default_beach
  if (lowercaseName.includes('mountain')) return landmarkImages.default_mountain
  if (lowercaseName.includes('temple') || lowercaseName.includes('shrine')) return landmarkImages.default_temple
  if (lowercaseName.includes('castle') || lowercaseName.includes('palace')) return landmarkImages.default_castle

  // Default image for unknown locations
  return 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg'
} 