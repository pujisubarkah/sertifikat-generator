<template>
  <div
    :id="elementId || 'certificate-node'"
    class="certificate-root relative bg-white overflow-hidden select-none text-slate-900"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      aspectRatio: '1414 / 1000'
    }"
  >
    <!-- Custom Uploaded Template Background Image -->
    <img
      v-if="customTemplateUrl"
      :src="customTemplateUrl"
      class="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      alt="Certificate Template"
    />

    <!-- Default Background Decor (SVG Exact Vector) -->
    <svg
      v-else-if="!hideDefaultDecor"
      class="absolute inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1414 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Top Right Decorative Elements -->
      <path
        d="M 950 0 L 1414 0 L 1414 180 L 1120 0 Z"
        fill="#0D2E5C"
      />
      <polygon
        points="1020,120 1414,218 1414,140 1060,50"
        fill="#F5A623"
      />
      <polygon
        points="1080,95 1250,137 1250,130 1080,88"
        fill="#0D2E5C"
      />
      <line x1="880" y1="0" x2="1414" y2="135" stroke="#1E5AA8" stroke-width="3" />

      <!-- Left Side Geometric Lines -->
      <polyline
        points="0,130 120,200 0,380 90,520 0,650"
        stroke="#1E5AA8"
        stroke-width="2.5"
        fill="none"
      />
      <line x1="0" y1="200" x2="120" y2="200" stroke="#1E5AA8" stroke-width="1.5" stroke-dasharray="4 4" />

      <!-- Right Side Geometric Lines -->
      <polyline
        points="1414,470 1310,570 1414,750 1320,890 1414,990"
        stroke="#1E5AA8"
        stroke-width="2.5"
        fill="none"
      />

      <!-- Bottom Left Decorative Elements -->
      <polygon
        points="0,850 0,1000 380,1000 0,850"
        fill="#0D2E5C"
      />
      <polygon
        points="0,680 370,830 350,875 0,735"
        fill="#F5A623"
      />
      <polygon
        points="40,730 220,805 220,812 40,737"
        fill="#0D2E5C"
      />
      <polygon
        points="0,795 440,970 410,1000 0,835"
        fill="#3B82F6"
        fill-opacity="0.85"
      />
      <line x1="0" y1="765" x2="490" y2="960" stroke="#1E5AA8" stroke-width="2.5" />
    </svg>

    <!-- Certificate Inner Content Container -->
    <div
      class="relative z-10 w-full h-full flex flex-col justify-between px-20 pb-8 text-center"
      :style="{ paddingTop: `${topOffset || 285}px` }"
    >
      
      <!-- Main Dynamic Body Section -->
      <div class="flex flex-col items-center w-full max-w-4xl mx-auto my-auto">
        
        <!-- 1. Nomor Sertifikat -->
        <div
          class="font-bold text-slate-900 tracking-wide transition-all"
          :style="{
            transform: `translateY(${styles.nomorOffsetY || 0}px)`,
            fontSize: `${styles.nomorFontSize || 17.5}px`,
            marginBottom: `${styles.nomorMarginBottom || 8}px`
          }"
        >
          {{ formattedNomor }}
        </div>

        <!-- 2. Nama Penerima -->
        <div
          class="w-full max-w-3xl my-1 transition-all"
          :style="{
            transform: `translateY(${styles.nameOffsetY || 0}px)`
          }"
        >
          <div
            class="font-extrabold text-slate-950 px-6 py-0.5 tracking-wide font-heading truncate"
            :style="{
              fontSize: `${styles.nameFontSize || 30}px`,
              lineHeight: 1.2
            }"
          >
            {{ participantName || 'Nama Peserta Lengkap, Gelar' }}
          </div>
          <!-- Underline Bar -->
          <div
            v-if="styles.showUnderline !== false"
            class="w-full bg-slate-950 mx-auto transition-all"
            :style="{
              height: `${styles.underlineThickness || 1.8}px`,
              marginTop: `${styles.underlineMarginTop || 4}px`
            }"
          ></div>
        </div>

        <!-- 4. Sebagai [Peran] Dalam -->
        <div
          class="text-slate-800 transition-all"
          :style="{
            transform: `translateY(${styles.roleOffsetY || 0}px)`,
            fontSize: `${styles.roleFontSize || 16}px`,
            marginTop: `${styles.roleMarginTop || 8}px`,
            marginBottom: `${styles.roleMarginBottom || 8}px`
          }"
        >
          sebagai <span class="font-bold text-slate-950">{{ role || 'Peserta' }}</span> dalam
        </div>

        <!-- 5. Judul Webinar / Kegiatan -->
        <div
          class="w-full px-4 space-y-1.5 transition-all mx-auto"
          :style="{
            transform: `translateY(${styles.titleOffsetY || 0}px)`,
            maxWidth: `${styles.titleMaxWidth || 800}px`,
            textAlign: styles.titleAlign || 'center'
          }"
        >
          <div
            v-if="eventSubtitle"
            class="font-bold text-slate-950"
            :style="{
              fontSize: `${(styles.titleFontSize || 17) + 1}px`,
              lineHeight: styles.titleLineHeight || 1.3
            }"
          >
            {{ eventSubtitle }}
          </div>
          <div
            class="font-bold text-slate-950"
            :style="{
              fontSize: `${styles.titleFontSize || 17}px`,
              lineHeight: styles.titleLineHeight || 1.3
            }"
          >
            {{ eventTitle || 'Judul Acara / Webinar / Kegiatan' }}
          </div>
        </div>

        <!-- 6. Keterangan Penyelenggaraan -->
        <div
          class="text-slate-800 max-w-3xl leading-relaxed transition-all"
          :style="{
            transform: `translateY(${styles.descOffsetY || 0}px)`,
            fontSize: `${styles.descFontSize || 14}px`,
            marginTop: `${styles.descMarginTop || 12}px`
          }"
        >
          {{ eventDescription || 'yang diselenggarakan oleh Lembaga Administrasi Negara...' }}
        </div>

        <!-- 7. Tempat & Tanggal Terbit -->
        <div
          class="w-full max-w-3xl flex justify-end pr-12 transition-all"
          :style="{
            transform: `translate(${styles.dateOffsetX || 0}px, ${styles.dateOffsetY || 0}px)`,
            marginTop: `${styles.dateMarginTop || 16}px`
          }"
        >
          <div
            class="font-medium text-slate-900"
            :style="{ fontSize: `${styles.dateFontSize || 15}px` }"
          >
            {{ dateLocation || 'Jakarta, 29 September 2026' }}
          </div>
        </div>
      </div>

      <!-- Footer Section: BSrE note -->
      <div class="w-full max-w-4xl mx-auto pt-2">
        <p class="text-[10px] text-slate-800 leading-tight font-medium opacity-90">
          {{ footerText || 'Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Balai Besar Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara (BSSN).' }}
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface PositionStyles {
  nomorOffsetY?: number
  nomorFontSize?: number
  nomorMarginBottom?: number
  diberikanOffsetY?: number
  diberikanFontSize?: number
  diberikanMarginBottom?: number
  nameOffsetY?: number
  nameFontSize?: number
  showUnderline?: boolean
  underlineThickness?: number
  underlineMarginTop?: number
  roleOffsetY?: number
  roleFontSize?: number
  roleMarginTop?: number
  roleMarginBottom?: number
  titleOffsetY?: number
  titleFontSize?: number
  titleLineHeight?: number
  titleMaxWidth?: number
  titleAlign?: 'center' | 'left' | 'right' | 'justify'
  descOffsetY?: number
  descFontSize?: number
  descMarginTop?: number
  dateOffsetX?: number
  dateOffsetY?: number
  dateMarginTop?: number
  dateFontSize?: number
}

const props = withDefaults(
  defineProps<{
    width?: number
    height?: number
    elementId?: string
    customTemplateUrl?: string
    hideDefaultDecor?: boolean
    topOffset?: number
    nomorTemplate?: string
    nomorStart?: number
    participantIndex?: number
    participantName?: string
    role?: string
    eventSubtitle?: string
    eventTitle?: string
    eventDescription?: string
    dateLocation?: string
    footerText?: string
    styles?: PositionStyles
  }>(),
  {
    width: 1414,
    height: 1000,
    elementId: 'certificate-preview-node',
    customTemplateUrl: '',
    hideDefaultDecor: false,
    topOffset: 285,
    nomorTemplate: 'NOMOR: {no}/D.2/PDP.07.3',
    nomorStart: 190,
    participantIndex: 0,
    participantName: 'Budi Santoso, S.AP., M.A.P.',
    role: 'Peserta',
    eventSubtitle: 'Virtual Insight Sharing Session:',
    eventTitle: 'Narkotika Terus Berevolusi, ASN Harus Beraksi: Peran Aktif Aparatur Sipil Negara dalam Gerakan Anti Narkotika',
    eventDescription: 'yang diselenggarakan oleh Lembaga Administrasi Negara pada tanggal 29 September 2026 secara Daring selama 3 (Tiga) Jam Pelajaran.',
    dateLocation: 'Jakarta, 29 September 2026',
    footerText: 'Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Balai Besar Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara (BSSN).',
    styles: () => ({})
  }
)

const formattedNomor = computed(() => {
  const currentNum = Number(props.nomorStart || 190) + Number(props.participantIndex || 0)
  if (props.nomorTemplate && props.nomorTemplate.includes('{no}')) {
    return props.nomorTemplate.replace('{no}', String(currentNum))
  }
  return props.nomorTemplate
})
</script>

<style scoped>
.certificate-root {
  box-sizing: border-box;
}
</style>
