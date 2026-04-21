export class Photo {
  public readonly id: string
  public readonly dataUrl: string
  public readonly mimeType: string
  public readonly createdAt: string

  constructor(
    id: string,
    dataUrl: string,
    mimeType: string,
    createdAt: string = new Date().toISOString(),
  ) {
    this.id = id
    this.dataUrl = dataUrl
    this.mimeType = mimeType
    this.createdAt = createdAt
  }
}
