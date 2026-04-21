import { Location } from '../domain/Location'

export abstract class ReverseGeocoderService {
  abstract reverse(location: Location): Promise<Location>
}
