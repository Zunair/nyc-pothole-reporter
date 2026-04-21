export class Location {
  public readonly latitude: number
  public readonly longitude: number
  public displayAddress: string

  constructor(latitude: number, longitude: number, displayAddress: string) {
    this.latitude = latitude
    this.longitude = longitude
    this.displayAddress = displayAddress
  }
}
