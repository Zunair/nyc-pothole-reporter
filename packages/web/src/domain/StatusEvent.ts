import type { ComplaintStatus } from './types'

export class StatusEvent {
  public readonly status: ComplaintStatus
  public readonly createdAt: string
  public readonly note?: string

  constructor(
    status: ComplaintStatus,
    createdAt: string = new Date().toISOString(),
    note?: string,
  ) {
    this.status = status
    this.createdAt = createdAt
    this.note = note
  }
}
