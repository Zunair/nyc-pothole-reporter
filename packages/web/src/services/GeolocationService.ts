import { Location } from '../domain/Location'

export abstract class GeolocationService {
  abstract getCurrentLocation(): Promise<Location>
}
