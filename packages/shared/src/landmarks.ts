// City images for destination headers
export const cityImages: Record<string, string[]> = {
  'Paris': [
    'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg', // Eiffel Tower
    'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg', // City View
    'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg', // Seine River
    'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg', // Champs Elysees
  ],
  'London': [
    'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', // Big Ben
    'https://images.pexels.com/photos/427679/pexels-photo-427679.jpeg', // Tower Bridge
    'https://images.pexels.com/photos/220887/pexels-photo-220887.jpeg', // City Skyline
    'https://images.pexels.com/photos/1837592/pexels-photo-1837592.jpeg', // Westminster
  ],
  'New York': [
    'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg', // Empire State
    'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg', // Times Square
    'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg', // Central Park
    'https://images.pexels.com/photos/2224424/pexels-photo-2224424.jpeg', // City Skyline
  ],
  'Tokyo': [
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', // Shibuya
    'https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg', // Temple
    'https://images.pexels.com/photos/161251/senso-ji-temple-japan-kyoto-landmark-161251.jpeg', // Sensoji
    'https://images.pexels.com/photos/5169056/pexels-photo-5169056.jpeg', // Street View
  ],
  'Rome': [
    'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg', // Colosseum
    'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg', // Vatican
    'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg', // Trevi Fountain
    'https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg', // Roman Forum
  ],
  'Dubai': [
    'https://images.pexels.com/photos/1743165/pexels-photo-1743165.jpeg', // Burj Khalifa
    'https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg', // Marina
    'https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg', // Desert
    'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg', // Palm
  ],
}

// Activity type images
export const activityImages: Record<string, string[]> = {
  'museum': [
    'https://images.pexels.com/photos/69903/pexels-photo-69903.jpeg',
    'https://images.pexels.com/photos/2372978/pexels-photo-2372978.jpeg',
    'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg',
  ],
  'park': [
    'https://images.pexels.com/photos/1174687/pexels-photo-1174687.jpeg',
    'https://images.pexels.com/photos/1165982/pexels-photo-1165982.jpeg',
    'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg',
  ],
  'restaurant': [
    'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg',
    'https://images.pexels.com/photos/2290070/pexels-photo-2290070.jpeg',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
  ],
  'shopping': [
    'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg',
    'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg',
    'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg',
  ],
  'beach': [
    'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
    'https://images.pexels.com/photos/1139541/pexels-photo-1139541.jpeg',
  ],
  'temple': [
    'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg',
    'https://images.pexels.com/photos/5719444/pexels-photo-5719444.jpeg',
    'https://images.pexels.com/photos/6462662/pexels-photo-6462662.jpeg',
  ],
  'castle': [
    'https://images.pexels.com/photos/2832034/pexels-photo-2832034.jpeg',
    'https://images.pexels.com/photos/2739387/pexels-photo-2739387.jpeg',
    'https://images.pexels.com/photos/2002264/pexels-photo-2002264.jpeg',
  ],
  'market': [
    'https://images.pexels.com/photos/2919588/pexels-photo-2919588.jpeg',
    'https://images.pexels.com/photos/375897/pexels-photo-375897.jpeg',
    'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg',
  ],
  'garden': [
    'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg',
    'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg',
    'https://images.pexels.com/photos/1645832/pexels-photo-1645832.jpeg',
  ],
  'landmark': [
    'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
    'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg',
  ],
}

// Helper function to get a random image from an array
function getRandomImage(images: string[]): string {
  return images[Math.floor(Math.random() * images.length)]
}

// Helper function to get the most appropriate image for a location
export function getLocationImage(locationName: string): string {
  const lowercaseName = locationName.toLowerCase()
  
  // Check if it's a city (for destination headers)
  for (const [city, images] of Object.entries(cityImages)) {
    if (lowercaseName.includes(city.toLowerCase())) {
      return getRandomImage(images)
    }
  }

  // Check for activity types
  if (lowercaseName.includes('museum')) return getRandomImage(activityImages.museum)
  if (lowercaseName.includes('park')) return getRandomImage(activityImages.park)
  if (lowercaseName.includes('restaurant')) return getRandomImage(activityImages.restaurant)
  if (lowercaseName.includes('shop') || lowercaseName.includes('mall')) return getRandomImage(activityImages.shopping)
  if (lowercaseName.includes('beach')) return getRandomImage(activityImages.beach)
  if (lowercaseName.includes('temple') || lowercaseName.includes('shrine')) return getRandomImage(activityImages.temple)
  if (lowercaseName.includes('castle') || lowercaseName.includes('palace')) return getRandomImage(activityImages.castle)
  if (lowercaseName.includes('market') || lowercaseName.includes('bazaar')) return getRandomImage(activityImages.market)
  if (lowercaseName.includes('garden')) return getRandomImage(activityImages.garden)
  
  // For general landmarks or unknown locations
  return getRandomImage(activityImages.landmark)
} 