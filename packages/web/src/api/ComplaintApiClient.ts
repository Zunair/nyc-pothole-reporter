import { Complaint } from '../domain/Complaint'

export class ComplaintApiClient {
  private readonly apiBaseUrl: string

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl
  }

  async save(complaint: Complaint): Promise<void> {
    await fetch(`${this.apiBaseUrl}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint),
    })
  }
}
