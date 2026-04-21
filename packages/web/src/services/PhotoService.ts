import { Photo } from '../domain/Photo'

export class PhotoService {
  async compress(file: File): Promise<Photo> {
    const image = await this.loadImage(file)
    const canvas = document.createElement('canvas')
    const ratio = Math.min(1600 / image.width, 1600 / image.height, 1)
    canvas.width = Math.round(image.width * ratio)
    canvas.height = Math.round(image.height * ratio)

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas 2D context unavailable')
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    return new Photo(crypto.randomUUID(), dataUrl, 'image/jpeg')
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    const objectUrl = URL.createObjectURL(file)
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Unable to load photo'))
        img.src = objectUrl
      })
      return image
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }
}
