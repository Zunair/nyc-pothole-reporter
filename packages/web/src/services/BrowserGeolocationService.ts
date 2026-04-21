import { Location } from '../domain/Location'
import { GeolocationService } from './GeolocationService'

export class BrowserGeolocationService extends GeolocationService {
  async getCurrentLocation(): Promise<Location> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported in this browser')
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      })
    })

    return new Location(
      position.coords.latitude,
      position.coords.longitude,
      '',
    )
  }
}
