import { Location } from '../domain/Location'
import { ReverseGeocoderService } from './ReverseGeocoderService'

const CACHE_PREFIX = 'reverseGeocode:'

export class NominatimReverseGeocoder extends ReverseGeocoderService {
  private lastRequestAt = 0
  private readonly apiBaseUrl: string

  constructor(apiBaseUrl: string) {
    super()
    this.apiBaseUrl = apiBaseUrl
  }

  async reverse(location: Location): Promise<Location> {
    const key = `${CACHE_PREFIX}${location.latitude.toFixed(5)}:${location.longitude.toFixed(5)}`
    const cached = localStorage.getItem(key)
    if (cached) {
      return new Location(location.latitude, location.longitude, cached)
    }

    const now = Date.now()
    const elapsed = now - this.lastRequestAt
    if (elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed))
    }

    const response = await fetch(
      `${this.apiBaseUrl}/geocode/reverse?lat=${location.latitude}&lng=${location.longitude}`,
    )
    if (!response.ok) {
      throw new Error('Reverse geocoding failed')
    }

    const data = (await response.json()) as { address: string }
    this.lastRequestAt = Date.now()
    localStorage.setItem(key, data.address)
    return new Location(location.latitude, location.longitude, data.address)
  }
}
