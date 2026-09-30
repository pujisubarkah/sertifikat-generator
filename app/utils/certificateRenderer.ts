import type { NameOnlyStyles } from '~/components/CertificatePreview.vue'

// Cache preloaded images to avoid re-fetching
const imageCache = new Map<string, HTMLImageElement>()

export function preloadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    const cached = imageCache.get(url)!
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached)
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageCache.set(url, img)
      resolve(img)
    }
    img.onerror = (err) => {
      // Fallback attempt without crossorigin if CORS error
      const fallbackImg = new Image()
      fallbackImg.onload = () => {
        imageCache.set(url, fallbackImg)
        resolve(fallbackImg)
      }
      fallbackImg.onerror = reject
      fallbackImg.src = url
    }
    img.src = url
  })
}

export function drawCertificate(
  ctx: CanvasRenderingContext2D,
  templateImg: HTMLImageElement,
  participantName: string,
  styles: NameOnlyStyles,
  width: number = 1414,
  height: number = 1000
) {
  // 1. Draw Template Background
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(templateImg, 0, 0, width, height)

  // 2. Configure Typography
  const fontSize = styles.nameFontSize || 32
  const fontFamily = styles.nameFontFamily || "'Plus Jakarta Sans', sans-serif"
  const fontWeight = styles.nameFontWeight || 700
  const color = styles.nameColor || '#000000'
  const letterSpacing = styles.nameLetterSpacing || 0.5
  const posX = width / 2 + (styles.nameOffsetX || 0)
  const posY = styles.nameY ?? 405

  ctx.save()
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if ('letterSpacing' in ctx) {
    // @ts-ignore
    ctx.letterSpacing = `${letterSpacing}px`
  }

  const name = participantName || 'Nama Peserta Lengkap, Gelar'
  ctx.fillText(name, posX, posY)

  // 3. Optional Underline Bar
  if (styles.showUnderline) {
    const textMetrics = ctx.measureText(name)
    const underlineWidth = Math.max(textMetrics.width + 40, 380)
    const thickness = styles.underlineThickness || 2
    const marginTop = styles.underlineMarginTop || 18
    ctx.fillRect(posX - underlineWidth / 2, posY + marginTop, underlineWidth, thickness)
  }

  ctx.restore()
}
