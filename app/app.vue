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
              Generator Sertifikat LAN RI
              <span class="text-[10px] font-semibold uppercase px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                Nuxt 3 & PDF Engine
              </span>
            </h1>
            <p class="text-xs text-slate-400">Otomasi cetak sertifikat massal dari data CSV / Input Form</p>
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
            @click="resetToDefault"
            class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Reset ke format default"
          >
            <RotateCcw class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column: Settings Form & Participant Data (5 cols) -->
      <section class="lg:col-span-5 flex flex-col gap-4">
        
        <!-- Tab Buttons (Acara vs Peserta vs Template vs Atur Posisi) -->
        <div class="bg-slate-900 p-1 rounded-xl border border-slate-800 grid grid-cols-4 gap-1 text-[11px] font-semibold">
          <button
            @click="activeTab = 'form'"
            :class="[
              'flex items-center justify-center gap-1 py-2 rounded-lg transition-all',
              activeTab === 'form'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            ]"
          >
            <Settings2 class="w-3.5 h-3.5" />
            Acara
          </button>

          <button
            @click="activeTab = 'data'"
            :class="[
              'flex items-center justify-center gap-1 py-2 rounded-lg transition-all relative',
              activeTab === 'data'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            ]"
          >
            <Users class="w-3.5 h-3.5" />
            Peserta
            <span
              v-if="participants.length"
              class="ml-0.5 px-1 py-0.1 bg-amber-500 text-slate-950 text-[9px] font-bold rounded-full"
            >
              {{ participants.length }}
            </span>
          </button>

          <button
            @click="activeTab = 'template'"
            :class="[
              'flex items-center justify-center gap-1 py-2 rounded-lg transition-all relative',
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
              'flex items-center justify-center gap-1 py-2 rounded-lg transition-all relative',
              activeTab === 'position'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            ]"
          >
            <Sliders class="w-3.5 h-3.5" />
            Posisi
          </button>
        </div>

        <!-- TAB 1: FORM ACARA -->
        <div v-show="activeTab === 'form'" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-amber-400" />
              Detail Sertifikat & Acara
            </h2>
            <span class="text-xs text-slate-400">Edit teks dinamis</span>
          </div>

          <!-- Format Nomor & Nomor Awal -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-300 mb-1">
                Pola Nomor Sertifikat
              </label>
              <input
                v-model="form.nomorTemplate"
                type="text"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="NOMOR: {no}/D.2/PDP.07.3"
              />
              <p class="text-[10px] text-slate-500 mt-1">Gunakan <code class="text-amber-400">{no}</code> untuk nomor urut otomatis</p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">
                No. Awal
              </label>
              <input
                v-model.number="form.nomorStart"
                type="number"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="190"
              />
            </div>
          </div>

          <!-- Peran -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Peran / Predikat Penerima
            </label>
            <input
              v-model="form.role"
              type="text"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Peserta"
            />
          </div>

          <!-- Sub Judul -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Sub-Judul / Label Sesi
            </label>
            <input
              v-model="form.eventSubtitle"
              type="text"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Virtual Insight Sharing Session:"
            />
          </div>

          <!-- Judul Utama Webinar -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Judul Acara / Tema Webinar
            </label>
            <textarea
              v-model="form.eventTitle"
              rows="3"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none leading-relaxed"
              placeholder="Narkotika Terus Berevolusi, ASN Harus Beraksi: Peran Aktif Aparatur Sipil Negara dalam Gerakan Anti Narkotika"
            ></textarea>
          </div>

          <!-- Keterangan Penyelenggara & Tanggal Acara -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Keterangan Penyelenggaraan, Tanggal & JP
            </label>
            <textarea
              v-model="form.eventDescription"
              rows="2"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none leading-relaxed"
              placeholder="yang diselenggarakan oleh Lembaga Administrasi Negara pada tanggal 29 September 2026 secara Daring selama 3 (Tiga) Jam Pelajaran."
            ></textarea>
          </div>

          <!-- Tanggal & Lokasi Tanda Tangan -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Tempat & Tanggal Penerbitan
            </label>
            <input
              v-model="form.dateLocation"
              type="text"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Jakarta, 29 September 2026"
            />
          </div>
        </div>

        <!-- TAB 2: DATA NAMA PESERTA -->
        <div v-show="activeTab === 'data'" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex-1 flex flex-col">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <Users class="w-4 h-4 text-blue-400" />
                Daftar Nama Peserta
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">Upload CSV (hanya kolom nama) atau ketik manual</p>
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
                Format file: 1 kolom nama peserta
              </p>
            </div>
          </div>

          <!-- Option: Paste / Quick Edit Toggle -->
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
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="Dr. Adi Nugroho, M.Si.&#10;Siti Rahmawati, S.STP.&#10;Budi Santoso, S.AP."
            ></textarea>
            <button
              @click="applyRawNames"
              class="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition"
            >
              Terapkan Teks ke Daftar Peserta
            </button>
          </div>

          <!-- Participant List Table / List -->
          <div class="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-2 space-y-1.5 divide-y divide-slate-800/60">
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
                  #{{ (form.nomorStart || 190) + idx }}
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
              placeholder="Tambah nama peserta baru..."
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

        <!-- TAB 3: TEMPLATE BACKGROUND -->
        <div v-show="activeTab === 'template'" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <Palette class="w-4 h-4 text-purple-400" />
                Template & Desain Background
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">Pilih template bawaan atau upload background sertifikat Anda</p>
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
              <p class="text-[10px] text-slate-400">Desain vektor geometris A4</p>
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
                <span class="text-xs font-bold text-white">Upload Gambar Sendiri</span>
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
                Format: PNG, JPG (Gambar sertifikat yang sudah ada logo & judul SERTIFIKAT)
              </p>
            </div>
          </div>

          <!-- Options when custom template is active -->
          <div v-if="customTemplateUrl" class="pt-1">
            <button
              @click="useDefaultTemplate"
              class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-400 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Hapus Gambar Kustom & Kembali ke Template Bawaan
            </button>
          </div>

        </div>

        <!-- TAB 4: ATUR POSISI & UKURAN TEKS MANUAL -->
        <div v-show="activeTab === 'position'" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl max-h-[580px] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <Sliders class="w-4 h-4 text-emerald-400" />
                Penyelarasan Posisi & Font Manual
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">Pas-kan posisi teks tepat pada template</p>
            </div>
            <button
              @click="resetPositions"
              class="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition"
            >
              Reset Posisi
            </button>
          </div>

          <!-- 1. Posisi Keseluruhan (Top Margin) -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-white">Posisi Awal Semua Teks (Top Margin)</span>
              <span class="font-mono text-amber-400 font-bold">{{ topOffset }} px</span>
            </div>
            <input
              v-model.number="topOffset"
              type="range"
              min="150"
              max="450"
              step="2"
              class="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <!-- 2. Pengaturan Posisi & Ukuran Nomor Sertifikat -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Nomor Sertifikat
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Geser Y: <span class="text-amber-400 font-mono">{{ posStyles.nomorOffsetY || 0 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.nomorOffsetY"
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Ukuran Font: <span class="text-amber-400 font-mono">{{ posStyles.nomorFontSize || 17.5 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.nomorFontSize"
                  type="range"
                  min="12"
                  max="28"
                  step="0.5"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- 3. Pengaturan Posisi & Ukuran Nama Peserta -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
            <div class="text-xs font-bold text-white flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Nama Peserta
              </div>
              <label class="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                <input
                  v-model="posStyles.showUnderline"
                  type="checkbox"
                  class="w-3.5 h-3.5 accent-blue-500 rounded"
                />
                Garis Bawah
              </label>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Geser Y: <span class="text-amber-400 font-mono">{{ posStyles.nameOffsetY || 0 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.nameOffsetY"
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Ukuran Font: <span class="text-amber-400 font-mono">{{ posStyles.nameFontSize || 30 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.nameFontSize"
                  type="range"
                  min="18"
                  max="44"
                  step="1"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- 4. Pengaturan Posisi & Ukuran Peran (sebagai Peserta dalam) -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Peran (sebagai Peserta dalam)
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Geser Y: <span class="text-amber-400 font-mono">{{ posStyles.roleOffsetY || 0 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.roleOffsetY"
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Ukuran Font: <span class="text-amber-400 font-mono">{{ posStyles.roleFontSize || 16 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.roleFontSize"
                  type="range"
                  min="12"
                  max="26"
                  step="0.5"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- 5. Pengaturan Posisi, Ukuran & Spasi Baris Judul Acara -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
            <div class="text-xs font-bold text-white flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Judul Webinar / Tema Acara (Rata Tengah)
              </div>
              <!-- Spasi Preset Quick Buttons -->
              <div class="flex items-center gap-1">
                <span class="text-[10px] text-slate-400 mr-1">Spasi:</span>
                <div class="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[10px] font-semibold">
                  <button
                    type="button"
                    @click="posStyles.titleLineHeight = 1.0"
                    :class="['px-1.5 py-0.5 rounded transition', posStyles.titleLineHeight === 1.0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white']"
                    title="Spasi 1.0 (Single)"
                  >
                    1.0
                  </button>
                  <button
                    type="button"
                    @click="posStyles.titleLineHeight = 1.15"
                    :class="['px-1.5 py-0.5 rounded transition', posStyles.titleLineHeight === 1.15 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white']"
                    title="Spasi 1.15 (Standar)"
                  >
                    1.15
                  </button>
                  <button
                    type="button"
                    @click="posStyles.titleLineHeight = 1.5"
                    :class="['px-1.5 py-0.5 rounded transition', posStyles.titleLineHeight === 1.5 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white']"
                    title="Spasi 1.5"
                  >
                    1.5
                  </button>
                  <button
                    type="button"
                    @click="posStyles.titleLineHeight = 2.0"
                    :class="['px-1.5 py-0.5 rounded transition', posStyles.titleLineHeight === 2.0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white']"
                    title="Spasi 2.0 (Double)"
                  >
                    2.0
                  </button>
                </div>
              </div>
            </div>

            <!-- Row 1: Geser Y & Font Size -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Geser Y: <span class="text-amber-400 font-mono">{{ posStyles.titleOffsetY || 0 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.titleOffsetY"
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Ukuran Font: <span class="text-amber-400 font-mono">{{ posStyles.titleFontSize || 17 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.titleFontSize"
                  type="range"
                  min="12"
                  max="26"
                  step="0.5"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <!-- Row 2: Line Spacing Slider & Max Width (Paragraph width) -->
            <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-900">
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Jarak Spasi Baris: <span class="text-amber-400 font-mono">{{ posStyles.titleLineHeight || 1.3 }}x</span>
                </label>
                <input
                  v-model.number="posStyles.titleLineHeight"
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Lebar Baris Judul: <span class="text-amber-400 font-mono">{{ posStyles.titleMaxWidth || 800 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.titleMaxWidth"
                  type="range"
                  min="500"
                  max="1200"
                  step="10"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- 6. Pengaturan Posisi & Ukuran Keterangan Penyelenggaraan, Tanggal & JP -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              Keterangan Penyelenggaraan, Tanggal & JP
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Geser Y: <span class="text-amber-400 font-mono">{{ posStyles.descOffsetY || 0 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.descOffsetY"
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label class="text-[11px] text-slate-400 block mb-1">
                  Ukuran Font: <span class="text-amber-400 font-mono">{{ posStyles.descFontSize || 14 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.descFontSize"
                  type="range"
                  min="10"
                  max="24"
                  step="0.5"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- 7. Pengaturan Posisi Tanggal & Tempat Terbit -->
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Tempat & Tanggal Terbit
            </div>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label class="text-[10px] text-slate-400 block mb-1">
                  Geser X (Kiri/Kanan): <span class="text-amber-400 font-mono">{{ posStyles.dateOffsetX || 0 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.dateOffsetX"
                  type="range"
                  min="-120"
                  max="120"
                  step="2"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 block mb-1">
                  Geser Y (Atas/Bawah): <span class="text-amber-400 font-mono">{{ posStyles.dateOffsetY || 0 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.dateOffsetY"
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 block mb-1">
                  Ukuran Font: <span class="text-amber-400 font-mono">{{ posStyles.dateFontSize || 15 }}px</span>
                </label>
                <input
                  v-model.number="posStyles.dateFontSize"
                  type="range"
                  min="11"
                  max="22"
                  step="0.5"
                  class="w-full accent-blue-500 cursor-pointer"
                />
              </div>
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
              <div class="text-[10px] text-slate-400 font-mono">
                No: {{ currentPreviewNomor }}
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
              Live Certificate Canvas (Ukuran Cetak A4 Landscape)
            </span>
            <span class="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {{ customTemplateUrl ? 'Custom Image Template' : 'Template Vektor' }}
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
                :top-offset="topOffset"
                :styles="posStyles"
                :nomor-template="form.nomorTemplate"
                :nomor-start="form.nomorStart"
                :participant-index="previewIndex"
                :participant-name="currentParticipantName"
                :role="form.role"
                :event-subtitle="form.eventSubtitle"
                :event-title="form.eventTitle"
                :event-description="form.eventDescription"
                :date-location="form.dateLocation"
                :footer-text="form.footerText"
                class="shadow-2xl rounded-sm w-full h-full max-w-full max-h-full object-contain"
              />

            </div>
          </div>

          <div class="w-full mt-3 text-center text-[11px] text-slate-500">
            💡 Gunakan tab <b class="text-slate-300">Posisi</b> di sebelah kiri untuk menggeser Nomor, Nama, dan Judul agar pas di template gambar Anda.
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
        :top-offset="topOffset"
        :styles="posStyles"
        :nomor-template="form.nomorTemplate"
        :nomor-start="form.nomorStart"
        :participant-index="workerState.index"
        :participant-name="workerState.name"
        :role="form.role"
        :event-subtitle="form.eventSubtitle"
        :event-title="form.eventTitle"
        :event-description="form.eventDescription"
        :date-location="form.dateLocation"
        :footer-text="form.footerText"
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
            Meng-generate dan mengompres ke format ZIP
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
  Settings2,
  Users,
  Palette,
  Sliders,
  Sparkles,
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
import type { PositionStyles } from '~/components/CertificatePreview.vue'

// Active tab on left column
const activeTab = ref<'form' | 'data' | 'template' | 'position'>('form')

// Custom template state
const customTemplateUrl = ref<string>('')
const topOffset = ref<number>(285)
const templateInputRef = ref<HTMLInputElement | null>(null)

// Position & Typography styles
const defaultPosStyles: PositionStyles = {
  nomorOffsetY: 0,
  nomorFontSize: 17.5,
  diberikanOffsetY: 0,
  diberikanFontSize: 15.5,
  nameOffsetY: 0,
  nameFontSize: 30,
  showUnderline: true,
  roleOffsetY: 0,
  roleFontSize: 16,
  titleOffsetY: 0,
  titleFontSize: 17,
  titleLineHeight: 1.3,
  titleMaxWidth: 800,
  titleAlign: 'center',
  descOffsetY: 0,
  descFontSize: 14,
  dateOffsetX: 0,
  dateOffsetY: 0,
  dateFontSize: 15
}

const posStyles = reactive<PositionStyles>({ ...defaultPosStyles })

function resetPositions() {
  Object.assign(posStyles, defaultPosStyles)
  topOffset.value = 285
}

// Drag & drop CSV state
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const showPasteArea = ref(false)
const rawNamesInput = ref('')
const newSingleName = ref('')

// Form state
const defaultForm = {
  nomorTemplate: 'NOMOR: {no}/D.2/PDP.07.3',
  nomorStart: 190,
  role: 'Peserta',
  eventSubtitle: 'Virtual Insight Sharing Session:',
  eventTitle: 'Narkotika Terus Berevolusi, ASN Harus Beraksi: Peran Aktif Aparatur Sipil Negara dalam Gerakan Anti Narkotika',
  eventDescription: 'yang diselenggarakan oleh Lembaga Administrasi Negara pada tanggal 29 September 2026 secara Daring selama 3 (Tiga) Jam Pelajaran.',
  dateLocation: 'Jakarta, 29 September 2026',
  footerText: 'Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Balai Besar Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara (BSSN).'
}

const form = reactive({ ...defaultForm })

// Participants state
const participants = ref<string[]>([
  'Dr. Adi Nugroho, M.Si.',
  'Siti Rahmawati, S.STP.',
  'Budi Santoso, S.AP., M.A.P.',
  'Dewi Anggraini, S.Kom.',
  'Rian Pratama, S.IP.'
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

const currentPreviewNomor = computed(() => {
  const currentNum = (form.nomorStart || 190) + previewIndex.value
  if (form.nomorTemplate.includes('{no}')) {
    return form.nomorTemplate.replace('{no}', String(currentNum))
  }
  return form.nomorTemplate
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

function resetToDefault() {
  if (confirm('Kembalikan semua form ke format default?')) {
    Object.assign(form, defaultForm)
    customTemplateUrl.value = ''
    resetPositions()
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
        activeTab.value = 'data'
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
      form,
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
    link.download = `Kumpulan_Sertifikat_LAN_RI_${Date.now()}.zip`
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
