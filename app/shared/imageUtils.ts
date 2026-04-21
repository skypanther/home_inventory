import { ImageSource, knownFolders, isIOS } from '@nativescript/core'

function saveNativeImage(nativeImage: any, path: string, quality: number): void {
  if (isIOS) {
    const data = UIImageJPEGRepresentation(nativeImage, quality / 100)
    data.writeToFileAtomically(path, true)
  } else {
    const file = new java.io.File(path)
    const outputStream = new java.io.FileOutputStream(file)
    nativeImage.compress(android.graphics.Bitmap.CompressFormat.JPEG, quality, outputStream)
    outputStream.flush()
    outputStream.close()
  }
}

function resizeNative(source: ImageSource, targetWidth: number, targetHeight: number): any {
  if (isIOS) {
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(targetWidth, targetHeight), false, 1)
    ;(source.ios as UIImage).drawInRect(CGRectMake(0, 0, targetWidth, targetHeight))
    const resized = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    return resized
  } else {
    return android.graphics.Bitmap.createScaledBitmap(source.android, targetWidth, targetHeight, true)
  }
}

export async function savePhotoFiles(asset: any): Promise<{ photoPath: string; thumbnailPath: string }> {
  const source = await ImageSource.fromAsset(asset)
  const timestamp = Date.now()
  const basePath = knownFolders.documents().path

  // Large version: max 2048 DIPs wide, maintain aspect ratio
  const largeWidth = Math.min(2048, source.width)
  const largeHeight = Math.round((source.height / source.width) * largeWidth)
  const photoPath = `${basePath}/photo_${timestamp}_large.jpg`
  if (largeWidth < source.width) {
    const largeNative = resizeNative(source, largeWidth, largeHeight)
    saveNativeImage(largeNative, photoPath, 85)
  } else {
    source.saveToFile(photoPath, 'jpg', 85)
  }

  // Thumbnail: 100x100 DIPs
  const thumbNative = resizeNative(source, 100, 100)
  const thumbnailPath = `${basePath}/photo_${timestamp}_thumb.jpg`
  saveNativeImage(thumbNative, thumbnailPath, 80)

  return { photoPath, thumbnailPath }
}
