<template>
  <div
    :id="elementId || 'certificate-node'"
    class="certificate-root relative w-full h-full flex items-center justify-center select-none"
  >
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      class="w-full h-full object-contain rounded shadow-2xl transition-all cursor-move"
      @mousedown="handleMouseDown"
      @touchstart.passive="handleTouchStart"
      title="Klik dan seret untuk menggeser posisi nama langsung di sertifikat"
    ></canvas>

    <!-- Subtle Drag Overlay Indicator when dragging -->
    <div
      v-if="isDraggingText"
      class="absolute top-3 left-3 bg-slate-900/90 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold shadow-lg pointer-events-none"
    >
      Y: {{ Math.round(styles?.nameY ?? 405) }}px | X: {{ Math.round(styles?.nameOffsetX ?? 0) }}px
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { preloadImage, drawCertificate } from '~/utils/certificateRenderer'

export interface NameOnlyStyles {
  nameY?: number
  nameOffsetX?: number
  nameFontSize?: number
  nameFontFamily?: string
  nameFontWeight?: number
  nameColor?: string
  nameLetterSpacing?: number
  showUnderline?: boolean
  underlineThickness?: number
  underlineMarginTop?: number
}

const props = withDefaults(
  defineProps<{
    width?: number
    height?: number
    elementId?: string
    customTemplateUrl?: string
    defaultTemplateUrl?: string
    participantName?: string
    styles?: NameOnlyStyles
    allowDrag?: boolean
  }>(),
  {
    width: 1414,
    height: 1000,
    elementId: 'certificate-preview-node',
    customTemplateUrl: '',
    defaultTemplateUrl: '/template_original.jpg',
    participantName: 'Budi Santoso, S.AP., M.A.P.',
    styles: () => ({
      nameY: 405,
      nameOffsetX: 0,
      nameFontSize: 32,
      nameFontFamily: "'Plus Jakarta Sans', sans-serif",
      nameFontWeight: 700,
      nameColor: '#000000',
      nameLetterSpacing: 0.5,
      showUnderline: false,
      underlineThickness: 2,
      underlineMarginTop: 18
    }),
    allowDrag: true
  }
)

const emit = defineEmits<{
  (e: 'update:styles', styles: NameOnlyStyles): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let loadedImage: HTMLImageElement | null = null
const isDraggingText = ref(false)

let startMouseY = 0
let startMouseX = 0
let startNameY = 0
let startNameOffsetX = 0

async function render() {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  const targetUrl = props.customTemplateUrl || props.defaultTemplateUrl

  try {
    if (!loadedImage || loadedImage.src !== targetUrl) {
      loadedImage = await preloadImage(targetUrl)
    }

    // Ensure document fonts are loaded before drawing text
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      await document.fonts.ready
    }

    drawCertificate(
      ctx,
      loadedImage,
      props.participantName,
      props.styles,
      props.width,
      props.height
    )
  } catch (err) {
    console.error('Error drawing certificate canvas:', err)
  }
}

// Watch all props for immediate redraw
watch(
  () => [
    props.customTemplateUrl,
    props.defaultTemplateUrl,
    props.participantName,
    props.width,
    props.height,
    props.styles.nameY,
    props.styles.nameOffsetX,
    props.styles.nameFontSize,
    props.styles.nameFontFamily,
    props.styles.nameFontWeight,
    props.styles.nameColor,
    props.styles.nameLetterSpacing,
    props.styles.showUnderline,
    props.styles.underlineThickness,
    props.styles.underlineMarginTop
  ],
  () => {
    render()
  },
  { deep: true }
)

// Interactive Drag & Drop implementation
function handleMouseDown(e: MouseEvent) {
  if (!props.allowDrag || !canvasRef.value) return
  isDraggingText.value = true
  startMouseX = e.clientX
  startMouseY = e.clientY
  startNameY = props.styles.nameY ?? 405
  startNameOffsetX = props.styles.nameOffsetX ?? 0

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  if (!isDraggingText.value || !canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const scale = props.height / rect.height

  const deltaY = (e.clientY - startMouseY) * scale
  const deltaX = (e.clientX - startMouseX) * scale

  const newY = Math.round(Math.max(50, Math.min(props.height - 50, startNameY + deltaY)))
  const newX = Math.round(Math.max(-500, Math.min(500, startNameOffsetX + deltaX)))

  // Directly update reactive styles object
  props.styles.nameY = newY
  props.styles.nameOffsetX = newX

  emit('update:styles', {
    ...props.styles,
    nameY: newY,
    nameOffsetX: newX
  })
}

function handleMouseUp() {
  isDraggingText.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

function handleTouchStart(e: TouchEvent) {
  if (!props.allowDrag || !canvasRef.value || !e.touches[0]) return
  isDraggingText.value = true
  startMouseX = e.touches[0].clientX
  startMouseY = e.touches[0].clientY
  startNameY = props.styles.nameY ?? 405
  startNameOffsetX = props.styles.nameOffsetX ?? 0

  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', handleTouchEnd)
}

function handleTouchMove(e: TouchEvent) {
  if (!isDraggingText.value || !canvasRef.value || !e.touches[0]) return
  e.preventDefault()

  const rect = canvasRef.value.getBoundingClientRect()
  const scale = props.height / rect.height

  const deltaY = (e.touches[0].clientY - startMouseY) * scale
  const deltaX = (e.touches[0].clientX - startMouseX) * scale

  const newY = Math.round(Math.max(50, Math.min(props.height - 50, startNameY + deltaY)))
  const newX = Math.round(Math.max(-500, Math.min(500, startNameOffsetX + deltaX)))

  props.styles.nameY = newY
  props.styles.nameOffsetX = newX

  emit('update:styles', {
    ...props.styles,
    nameY: newY,
    nameOffsetX: newX
  })
}

function handleTouchEnd() {
  isDraggingText.value = false
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
}

onMounted(() => {
  render()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})

function getCanvas(): HTMLCanvasElement | null {
  return canvasRef.value
}

defineExpose({
  getCanvas,
  redraw: render
})
</script>

<style scoped>
.certificate-root {
  box-sizing: border-box;
}
</style>
