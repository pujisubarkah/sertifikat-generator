import JSZip from 'jszip'

export interface CertificateConfig {
  nomorTemplate: string
  nomorStart: number
  role: string
  eventSubtitle: string
  eventTitle: string
  eventDescription: string
  dateLocation: string
  footerText: string
}

export async function generateSingleCertificatePdf(
  element: HTMLElement,
  fileName: string = 'Sertifikat.pdf'
): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default
  const { jsPDF } = await import('jspdf')

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  })

  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST')
  return pdf.output('blob')
}

export async function generateBatchCertificatesZip(
  names: string[],
  config: CertificateConfig,
  renderElementFn: (name: string, index: number) => Promise<HTMLElement>,
  onProgress?: (current: number, total: number, currentName: string) => void
): Promise<Blob> {
  const zip = new JSZip()
  const total = names.length

  for (let i = 0; i < total; i++) {
    const name = names[i].trim()
    if (!name) continue

    if (onProgress) {
      onProgress(i + 1, total, name)
    }

    // Give DOM time to update/render
    const el = await renderElementFn(name, i)
    // Small delay to ensure styles/fonts are painted
    await new Promise((resolve) => setTimeout(resolve, 60))

    const pdfBlob = await generateSingleCertificatePdf(el)
    
    // Clean file name
    const sanitizedName = name.replace(/[\\/:*?"<>|]/g, '_')
    const currentNum = Number(config.nomorStart || 190) + i
    const filename = `${String(currentNum).padStart(3, '0')} - Sertifikat - ${sanitizedName}.pdf`
    
    zip.file(filename, pdfBlob)
  }

  return await zip.generateAsync({ type: 'blob' })
}
