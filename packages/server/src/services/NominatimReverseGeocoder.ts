export class NominatimReverseGeocoder {
  constructor(private readonly userAgent: string) {}

  async reverse(lat: number, lng: number): Promise<string> {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lng))

    const response = await fetch(url, {
      headers: {
        'User-Agent': this.userAgent,
      },
    })

    if (!response.ok) {
      throw new Error('Unable to reverse geocode coordinates')
    }

    const payload = (await response.json()) as { display_name?: string }
    return payload.display_name ?? `${lat}, ${lng}`
  }
}
