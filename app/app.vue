<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
    <!-- Navbar Header -->
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div class="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <FileText class="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 class="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Generator Sertifikat Massal
              <span class="text-[10px] font-semibold uppercase px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                CSV to PDF
              </span>
            </h1>
            <p class="text-xs text-slate-400">Tempel nama peserta langsung ke template sertifikat</p>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <a
            href="/sample_peserta.csv"
            download="sample_peserta.csv"
            class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-all"
          >
            <FileSpreadsheet class="w-3.5 h-3.5 text-emerald-400" />
            Unduh Contoh CSV
          </a>

          <button
            @click="resetAll"
            class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Reset semua data dan posisi"
          >
            <RotateCcw class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column: Controls (5 cols) -->
      <section class="lg:col-span-5 flex flex-col gap-4">
        
        <!-- Tab Navigation (Data Peserta vs Template vs Atur Posisi Nama) -->
        <div class="bg-slate-900 p-1 rounded-xl border border-slate-800 grid grid-cols-3 gap-1 text-xs font-semibold">
          <button
            @click="activeTab = 'data'"
            :class="[
              'flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all relative',
              activeTab === 'data'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            ]"
          >
            <Users class="w-3.5 h-3.5" />
            Data Peserta
            <span
              v-if="participants.length"
              class="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[9px] font-bold rounded-full"
            >
              {{ participants.length }}
            </span>
          </button>

          <button
            @click="activeTab = 'template'"
            :class="[
              'flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all relative',
              activeTab === 'template'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            ]"
          >
            <Palette class="w-3.5 h-3.5" />
            Template
            <span
              v-if="customTemplateUrl"
              class="w-1.5 h-1.5 rounded-full bg-emerald-400"
            ></span>
          </button>

          <button
            @click="activeTab = 'position'"
            :class="[
              'flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all',
              activeTab === 'position'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            ]"
          >
            <Sliders class="w-3.5 h-3.5" />
            Atur Nama
          </button>
        </div>

        <!-- TAB 1: DATA NAMA PESERTA -->
        <div v-show="activeTab === 'data'" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex-1 flex flex-col">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <Users class="w-4 h-4 text-blue-400" />
                Daftar Nama Peserta
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">Upload CSV (1 kolom nama) atau tempel manual</p>
            </div>
            <span class="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-lg">
              {{ participants.length }} Peserta
            </span>
          </div>

          <!-- Upload Dropzone CSV -->
          <div
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative',
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/50'
            ]"
            @click="triggerFileInput"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept=".csv,text/csv,text/plain"
              class="hidden"
              @change="handleFileUpload"
            />
            <div class="flex flex-col items-center justify-center gap-1.5">
              <div class="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <UploadCloud class="w-5 h-5" />
              </div>
              <div class="text-xs font-semibold text-slate-200">
                Klik atau Seret File CSV ke Sini
              </div>
              <p class="text-[10px] text-slate-400">
                Hanya butuh 1 kolom nama peserta saja
              </p>
            </div>
          </div>

          <!-- Option: Paste Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-300">
              Atau tempel (paste) daftar nama langsung:
            </span>
            <button
              @click="showPasteArea = !showPasteArea"
              class="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
            >
              {{ showPasteArea ? 'Sembunyikan Textarea' : 'Buka Textarea Paste' }}
            </button>
          </div>

          <!-- Paste Area -->
          <div v-if="showPasteArea" class="space-y-2">
            <textarea
              v-model="rawNamesInput"
              rows="4"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
              placeholder="Dr. Adi Nugroho, M.Si.&#10;Siti Rahmawati, S.STP.&#10;Budi Santoso, S.AP., M.A.P."
            ></textarea>
            <button
              @click="applyRawNames"
              class="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition"
            >
              Terapkan Teks ke Daftar Peserta
            </button>
          </div>

          <!-- Participant List Table / List -->
          <div class="flex-1 min-h-[220px] max-h-[320px] overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-2 space-y-1.5 divide-y divide-slate-800/60">
            <div
              v-for="(name, idx) in participants"
              :key="idx"
              :class="[
                'pt-1.5 first:pt-0 flex items-center justify-between px-2 py-1 rounded-lg transition group',
                previewIndex === idx ? 'bg-blue-600/20 border border-blue-500/40 text-white' : 'hover:bg-slate-900 text-slate-300'
              ]"
            >
              <div
                @click="previewIndex = idx"
                class="flex items-center gap-2 flex-1 cursor-pointer truncate"
              >
                <span class="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                  #{{ idx + 1 }}
                </span>
                <span class="text-xs font-medium truncate">{{ name }}</span>
              </div>

              <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <button
                  @click="previewIndex = idx"
                  class="p-1 text-slate-400 hover:text-blue-400 transition"
                  title="Lihat Preview"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>
                <button
                  @click="removeParticipant(idx)"
                  class="p-1 text-slate-400 hover:text-red-400 transition"
                  title="Hapus"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div v-if="!participants.length" class="h-32 flex flex-col items-center justify-center text-slate-500 text-xs">
              <Users class="w-6 h-6 mb-2 text-slate-600" />
              Belum ada nama peserta
            </div>
          </div>

          <!-- Add Single Participant -->
          <div class="flex gap-2 pt-1">
            <input
              v-model="newSingleName"
              @keyup.enter="addSingleParticipant"
              type="text"
              class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="Ketik nama peserta baru..."
            />
            <button
              @click="addSingleParticipant"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition flex items-center gap-1"
            >
              <Plus class="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>

        </div>

        <!-- TAB 2: TEMPLATE BACKGROUND -->
        <div v-show="activeTab === 'template'" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <Palette class="w-4 h-4 text-purple-400" />
                Background Template Sertifikat
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">Upload gambar template sertifikat Anda</p>
            </div>
          </div>

          <!-- Mode Selection -->
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="useDefaultTemplate"
              :class="[
                'p-3 rounded-xl border text-left transition flex flex-col gap-1.5',
                !customTemplateUrl
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white">Template LAN RI</span>
                <CheckCircle2 v-if="!customTemplateUrl" class="w-4 h-4 text-blue-400" />
              </div>
              <p class="text-[10px] text-slate-400">Gambar template resmi bawaan</p>
            </button>

            <button
              @click="triggerTemplateUpload"
              :class="[
                'p-3 rounded-xl border text-left transition flex flex-col gap-1.5',
                customTemplateUrl
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white">Upload Sendiri</span>
                <CheckCircle2 v-if="customTemplateUrl" class="w-4 h-4 text-emerald-400" />
              </div>
              <p class="text-[10px] text-slate-400">Gunakan file gambar JPG/PNG</p>
            </button>
          </div>

          <!-- Upload Dropzone for Image Template -->
          <div
            @click="triggerTemplateUpload"
            class="border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-950/50 rounded-xl p-4 text-center cursor-pointer transition"
          >
            <input
              ref="templateInputRef"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              class="hidden"
              @change="handleTemplateUpload"
            />
            <div class="flex flex-col items-center justify-center gap-1.5">
              <ImageIcon class="w-6 h-6 text-purple-400" />
              <div class="text-xs font-semibold text-slate-200">
                {{ customTemplateUrl ? 'Ganti File Gambar Template' : 'Pilih File Gambar Background' }}
              </div>
              <p class="text-[10px] text-slate-400">
                Format: PNG, JPG (Disarankan resolusi landscape A4)
              </p>
            </div>
          </div>

          <div v-if="customTemplateUrl" class="pt-1">
            <button
              @click="useDefaultTemplate"
              class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-400 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Kembali ke Template Bawaan
            </button>
          </div>
        </div>

        <!-- TAB 3: PENGATURAN FONT & POSISI NAMA -->
        <div v-show="activeTab === 'position'" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <Sliders class="w-4 h-4 text-emerald-400" />
                Format & Penempatan Nama
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">Pas-kan posisi teks nama tepat di atas garis template</p>
            </div>
            <button
              @click="resetNameStyles"
              class="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition"
            >
              Reset Setelan
            </button>
          </div>

          <!-- Posisi Vertikal (Y) & Horizontal (X) -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-3">
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Posisi Penempatan Nama
            </div>

            <!-- Posisi Y -->
            <div>
              <div class="flex justify-between items-center text-xs mb-1.5">
                <span class="text-[11px] text-slate-300 font-semibold">Posisi Vertikal (Atas / Bawah):</span>
                <div class="flex items-center gap-1.5">
                  <input
                    v-model.number="nameStyles.nameY"
                    type="number"
                    min="0"
                    max="1000"
                    class="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-amber-400 font-mono font-bold text-center focus:outline-none focus:border-blue-500"
                  />
                  <span class="text-[10px] text-slate-400">px</span>
                </div>
              </div>
              <input
                v-model.number="nameStyles.nameY"
                type="range"
                min="0"
                max="950"
                step="1"
                class="w-full accent-blue-500 cursor-pointer"
              />
              <div class="flex justify-between items-center mt-1 text-[10px] text-slate-500">
                <span>0 px (Paling Atas)</span>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="nameStyles.nameY = Math.max(0, (nameStyles.nameY || 0) - 5)"
                    class="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                    title="Naik 5px"
                  >
                    ▲ -5
                  </button>
                  <button
                    type="button"
                    @click="nameStyles.nameY = Math.min(950, (nameStyles.nameY || 0) + 5)"
                    class="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
                    title="Turun 5px"
                  >
                    ▼ +5
                  </button>
                </div>
                <span>950 px (Paling Bawah)</span>
              </div>
            </div>

            <!-- Posisi X -->
            <div>
              <div class="flex justify-between items-center text-xs mb-1.5">
                <span class="text-[11px] text-slate-300 font-semibold">Geser Horizontal (Kiri / Kanan):</span>
                <div class="flex items-center gap-1.5">
                  <input
                    v-model.number="nameStyles.nameOffsetX"
                    type="number"
                    min="-400"
                    max="400"
                    class="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-amber-400 font-mono font-bold text-center focus:outline-none focus:border-blue-500"
                  />
                  <span class="text-[10px] text-slate-400">px</span>
                </div>
              </div>
              <input
                v-model.number="nameStyles.nameOffsetX"
                type="range"
                min="-300"
                max="300"
                step="1"
                class="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- Ukuran Font & Tipografi -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-3">
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Tipografi & Ukuran Huruf
            </div>

            <!-- Ukuran Font Slider -->
            <div>
              <div class="flex justify-between items-center text-xs mb-1">
                <span class="text-[11px] text-slate-300">Ukuran Font Nama:</span>
                <span class="font-mono text-amber-400 font-bold">{{ nameStyles.nameFontSize }} px</span>
              </div>
              <input
                v-model.number="nameStyles.nameFontSize"
                type="range"
                min="20"
                max="60"
                step="1"
                class="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <!-- Jenis Font & Ketebalan -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">Jenis Huruf (Font):</label>
                <select
                  v-model="nameStyles.nameFontFamily"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                  <option value="'Montserrat', sans-serif">Montserrat</option>
                  <option value="'Merriweather', Georgia, serif">Merriweather (Serif)</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                </select>
              </div>

              <div>
                <label class="text-[11px] text-slate-400 block mb-1">Ketebalan Huruf:</label>
                <select
                  v-model.number="nameStyles.nameFontWeight"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option :value="400">Normal (400)</option>
                  <option :value="600">Semi Bold (600)</option>
                  <option :value="700">Bold (700)</option>
                  <option :value="800">Extra Bold (800)</option>
                  <option :value="900">Black (900)</option>
                </select>
              </div>
            </div>

            <!-- Warna Teks & Underline Toggle -->
            <div class="flex items-center justify-between pt-1 border-t border-slate-900 text-xs">
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-slate-400">Warna Teks:</span>
                <input
                  v-model="nameStyles.nameColor"
                  type="color"
                  class="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
              </div>

              <label class="flex items-center gap-1.5 cursor-pointer text-slate-300 text-xs">
                <input
                  v-model="nameStyles.showUnderline"
                  type="checkbox"
                  class="w-3.5 h-3.5 accent-blue-500 rounded"
                />
                Garis Bawah (Underline)
              </label>
            </div>
          </div>

        </div>

      </section>

      <!-- Right Column: Live Interactive Preview & Batch Generation (7 cols) -->
      <section class="lg:col-span-7 flex flex-col gap-4">
        
        <!-- Action & Navigation Bar -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          
          <!-- Participant Preview Navigator -->
          <div class="flex items-center gap-2">
            <button
              @click="prevPreview"
              :disabled="previewIndex <= 0"
              class="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition"
              title="Peserta Sebelumnya"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>

            <div class="text-xs text-center px-2">
              <div class="font-bold text-white">
                Peserta {{ participants.length > 0 ? previewIndex + 1 : 0 }} / {{ participants.length }}
              </div>
              <div class="text-[10px] text-slate-400 truncate max-w-[160px]">
                {{ currentParticipantName }}
              </div>
            </div>

            <button
              @click="nextPreview"
              :disabled="previewIndex >= participants.length - 1"
              class="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition"
              title="Peserta Berikutnya"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>

          <!-- Download Buttons -->
          <div class="flex items-center gap-2.5">
            <!-- Download Single Preview PDF -->
            <button
              @click="downloadCurrentPdf"
              :disabled="isGenerating || !participants.length"
              class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition disabled:opacity-40"
            >
              <FileDown class="w-4 h-4 text-blue-400" />
              Unduh PDF Ini
            </button>

            <!-- Download Batch ZIP Button -->
            <button
              @click="generateAllZip"
              :disabled="isGenerating || !participants.length"
              class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Archive class="w-4 h-4" />
              Download Semua (.ZIP)
              <span class="ml-1 px-1.5 py-0.5 bg-slate-950 text-amber-400 text-[10px] font-mono rounded-md">
                {{ participants.length }} File
              </span>
            </button>
          </div>

        </div>

        <!-- Preview Card Container -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          
          <div class="w-full flex items-center justify-between pb-3 text-xs text-slate-400">
            <span class="flex items-center gap-1.5 font-medium">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Certificate Preview (A4 Landscape)
            </span>
            <span class="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {{ customTemplateUrl ? 'Custom Template' : 'Template LAN RI' }}
            </span>
          </div>

          <!-- Scaled Certificate Wrapper for responsive display -->
          <div class="w-full aspect-[1414/1000] relative bg-slate-950/40 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center p-2">
            <div class="w-full h-full transform-gpu origin-top-left flex items-center justify-center">
              
              <!-- The actual certificate node -->
              <CertificatePreview
                id="certificate-preview-element"
                :width="1414"
                :height="1000"
                :custom-template-url="customTemplateUrl"
                :participant-name="currentParticipantName"
                :styles="nameStyles"
                class="shadow-2xl rounded-sm w-full h-full max-w-full max-h-full object-contain"
              />

            </div>
          </div>

          <div class="w-full mt-3 text-center text-[11px] text-slate-500">
            💡 Gunakan tab <b class="text-slate-300">Atur Nama</b> di sebelah kiri untuk menggeser posisi nama naik/turun agar tepat di garis sertifikat.
          </div>

        </div>

      </section>
    </main>

    <!-- Hidden Offscreen Node used for High-DPI PDF Capture during batch generation -->
    <div class="fixed left-[-9999px] top-[-9999px] pointer-events-none">
      <CertificatePreview
        id="certificate-render-worker"
        :width="1414"
        :height="1000"
        :custom-template-url="customTemplateUrl"
        :participant-name="workerState.name"
        :styles="nameStyles"
      />
    </div>

    <!-- Progress Modal during Batch ZIP Generation -->
    <div
      v-if="isGenerating"
      class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl mx-auto flex items-center justify-center animate-bounce">
          <Archive class="w-7 h-7 text-amber-400" />
        </div>

        <div>
          <h3 class="text-base font-bold text-white">Memproses Sertifikat PDF...</h3>
          <p class="text-xs text-slate-400 mt-1">
            Menempelkan nama peserta dan mengompres ke file ZIP
          </p>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-1.5 text-left">
          <div class="flex justify-between text-xs font-semibold">
            <span class="text-slate-300 truncate max-w-[240px]">
              {{ progress.currentName || 'Memproses...' }}
            </span>
            <span class="text-amber-400 font-mono">
              {{ progress.current }} / {{ progress.total }} ({{ progressPercent }}%)
            </span>
          </div>

          <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              class="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-yellow-400 rounded-full transition-all duration-150"
              :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>
        </div>

        <p class="text-[11px] text-slate-500">
          Mohon jangan menutup jendela browser selama proses berlangsung.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import Papa from 'papaparse'
import confetti from 'canvas-confetti'
import {
  FileText,
  FileSpreadsheet,
  RotateCcw,
  Users,
  Palette,
  Sliders,
  UploadCloud,
  Eye,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Archive,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-vue-next'
import { generateSingleCertificatePdf, generateBatchCertificatesZip } from '~/utils/pdfGenerator'
import type { NameOnlyStyles } from '~/components/CertificatePreview.vue'

// Active tab on left column
const activeTab = ref<'data' | 'template' | 'position'>('data')

// Custom template state
const customTemplateUrl = ref<string>('')
const templateInputRef = ref<HTMLInputElement | null>(null)

// Name Styling state
const defaultNameStyles: NameOnlyStyles = {
  nameY: 415,
  nameOffsetX: 0,
  nameFontSize: 34,
  nameFontFamily: "'Plus Jakarta Sans', sans-serif",
  nameFontWeight: 800,
  nameColor: '#000000',
  nameLetterSpacing: 0.5,
  showUnderline: false,
  underlineThickness: 2,
  underlineMarginTop: 6
}

const nameStyles = reactive<NameOnlyStyles>({ ...defaultNameStyles })

function resetNameStyles() {
  Object.assign(nameStyles, defaultNameStyles)
}

// Drag & drop CSV state
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const showPasteArea = ref(false)
const rawNamesInput = ref('')
const newSingleName = ref('')

// Participants state
const participants = ref<string[]>([
  'Dr. Adi Nugroho, M.Si.',
  'Siti Rahmawati, S.STP.',
  'Budi Santoso, S.AP., M.A.P.',
  'Dewi Anggraini, S.Kom.',
  'Rian Pratama, S.IP.',
  'Nurfadilah, M.Pd.',
  'Hendro Prasetyo, S.Sos.',
  'Maya Indah Sari, S.E.'
])

const previewIndex = ref(0)

// Worker state for offscreen batch generation
const workerState = reactive({
  name: '',
  index: 0
})

// Progress state
const isGenerating = ref(false)
const progress = reactive({
  current: 0,
  total: 0,
  currentName: ''
})

const progressPercent = computed(() => {
  if (!progress.total) return 0
  return Math.round((progress.current / progress.total) * 100)
})

const currentParticipantName = computed(() => {
  if (!participants.value.length) return 'Nama Peserta Lengkap, Gelar'
  return participants.value[previewIndex.value] || participants.value[0]
})

function prevPreview() {
  if (previewIndex.value > 0) {
    previewIndex.value--
  }
}

function nextPreview() {
  if (previewIndex.value < participants.value.length - 1) {
    previewIndex.value++
  }
}

function resetAll() {
  if (confirm('Kembalikan semua pengaturan dan data ke default?')) {
    customTemplateUrl.value = ''
    resetNameStyles()
    previewIndex.value = 0
  }
}

// Custom Template handlers
function triggerTemplateUpload() {
  templateInputRef.value?.click()
}

function handleTemplateUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      customTemplateUrl.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function useDefaultTemplate() {
  customTemplateUrl.value = ''
  if (templateInputRef.value) {
    templateInputRef.value.value = ''
  }
}

function removeParticipant(index: number) {
  participants.value.splice(index, 1)
  if (previewIndex.value >= participants.value.length) {
    previewIndex.value = Math.max(0, participants.value.length - 1)
  }
}

function addSingleParticipant() {
  const trimmed = newSingleName.value.trim()
  if (trimmed) {
    participants.value.push(trimmed)
    newSingleName.value = ''
    previewIndex.value = participants.value.length - 1
  }
}

function applyRawNames() {
  const lines = rawNamesInput.value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length) {
    participants.value = lines
    previewIndex.value = 0
    showPasteArea.value = false
    rawNamesInput.value = ''
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    parseCsvFile(target.files[0])
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer && e.dataTransfer.files[0]) {
    parseCsvFile(e.dataTransfer.files[0])
  }
}

function parseCsvFile(file: File) {
  Papa.parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: (results) => {
      const rows = results.data as string[][]
      if (!rows || !rows.length) return

      const names: string[] = []
      rows.forEach((row, idx) => {
        const val = row[0] ? String(row[0]).trim() : ''
        if (idx === 0 && (val.toLowerCase() === 'nama' || val.toLowerCase() === 'name' || val.toLowerCase() === 'nama peserta')) {
          return
        }
        if (val) names.push(val)
      })

      if (names.length) {
        participants.value = names
        previewIndex.value = 0
      }
    }
  })
}

// Download single preview PDF
async function downloadCurrentPdf() {
  const el = document.getElementById('certificate-preview-element')
  if (!el) return

  const name = currentParticipantName.value
  const blob = await generateSingleCertificatePdf(el, `Sertifikat - ${name}.pdf`)
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `Sertifikat - ${name}.pdf`
  link.click()
  URL.revokeObjectURL(link.href)
}

// Generate Batch ZIP
async function generateAllZip() {
  if (!participants.value.length) return
  isGenerating.value = true
  progress.current = 0
  progress.total = participants.value.length

  try {
    const zipBlob = await generateBatchCertificatesZip(
      participants.value,
      async (name, index) => {
        workerState.name = name
        workerState.index = index
        await nextTick()
        return document.getElementById('certificate-render-worker') as HTMLElement
      },
      (current, total, currentName) => {
        progress.current = current
        progress.total = total
        progress.currentName = currentName
      }
    )

    // Trigger download of ZIP
    const link = document.createElement('a')
    link.href = URL.createObjectURL(zipBlob)
    link.download = `Kumpulan_Sertifikat_${Date.now()}.zip`
    link.click()
    URL.revokeObjectURL(link.href)

    // Trigger Confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (_) {}

  } catch (err) {
    console.error('Batch generation error:', err)
    alert('Terjadi kesalahan saat membuat sertifikat PDF: ' + err)
  } finally {
    isGenerating.value = false
  }
}
</script>
