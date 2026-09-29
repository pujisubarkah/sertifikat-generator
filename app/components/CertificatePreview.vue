<template>
  <div
    :id="elementId || 'certificate-node'"
    class="certificate-root relative bg-white overflow-hidden select-none"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      aspectRatio: '1414 / 1000'
    }"
  >
    <!-- Certificate Background Image -->
    <img
      :src="customTemplateUrl || defaultTemplateUrl"
      class="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      alt="Certificate Template"
    />

    <!-- Dynamic Name Overlay Container -->
    <div
      class="absolute left-0 right-0 z-10 flex flex-col items-center justify-center px-16 text-center pointer-events-none"
      :style="{
        top: `${styles.nameY ?? 415}px`,
        transform: `translate(${styles.nameOffsetX || 0}px, 0)`
      }"
    >
      <div class="w-full max-w-4xl mx-auto flex flex-col items-center">
        <!-- Participant Name -->
        <div
          class="tracking-wide px-4 transition-all truncate max-w-full"
          :style="{
            fontSize: `${styles.nameFontSize || 34}px`,
            fontFamily: styles.nameFontFamily || 'Plus Jakarta Sans, sans-serif',
            fontWeight: styles.nameFontWeight || 800,
            color: styles.nameColor || '#000000',
            letterSpacing: `${styles.nameLetterSpacing || 0.5}px`,
            lineHeight: 1.2
          }"
        >
          {{ participantName || 'Nama Peserta Lengkap, Gelar' }}
        </div>

        <!-- Optional Dynamic Underline Bar -->
        <div
          v-if="styles.showUnderline"
          class="w-full max-w-2xl mx-auto transition-all"
          :style="{
            height: `${styles.underlineThickness || 2}px`,
            marginTop: `${styles.underlineMarginTop || 6}px`,
            backgroundColor: styles.nameColor || '#000000'
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  }>(),
  {
    width: 1414,
    height: 1000,
    elementId: 'certificate-preview-node',
    customTemplateUrl: '',
    defaultTemplateUrl: '/template_original.jpg',
    participantName: 'Budi Santoso, S.AP., M.A.P.',
    styles: () => ({
      nameY: 415,
      nameOffsetX: 0,
      nameFontSize: 34,
      nameFontFamily: 'Plus Jakarta Sans, sans-serif',
      nameFontWeight: 800,
      nameColor: '#000000',
      nameLetterSpacing: 0.5,
      showUnderline: false,
      underlineThickness: 2,
      underlineMarginTop: 6
    })
  }
)
</script>

<style scoped>
.certificate-root {
  box-sizing: border-box;
}
</style>
