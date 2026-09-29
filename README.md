# 🎓 Generator Sertifikat Otomatis (Nuxt 3 & PDF Engine)

Aplikasi web modern untuk pembuatan dan pencetakan sertifikat massal otomatis berbasis **Nuxt 3**, **Vue 3**, **Tailwind CSS**, dan **PDF Generator**. 

Didesain untuk memudahkan instansi/panitia webinar dalam menghasilkan ratusan sertifikat PDF peserta hanya dengan mengunggah 1 file CSV berisi daftar nama peserta.

---

## ✨ Fitur Utama

- 🎨 **Dukungan Template**: Template resmi vektor bawaan LAN RI dan fitur upload background sertifikat kustom (.jpg / .png).
- 📋 **Input Dinamis**: Pengaturan Nomor Sertifikat otomatis berurutan (`NOMOR: {no}/...`), Peran, Sub-Judul, Judul Acara, Keterangan Penyelenggara/JP, dan Tempat & Tanggal Penerbitan.
- 👥 **Batch Processing**: Upload file CSV (cukup 1 kolom nama) atau *copy-paste* daftar nama langsung.
- 📐 **Penyelarasan Posisi & Tipografi Manual**:
  - Pengatur *Line Spacing* Judul (Pilihan tombol cepat: **Spasi 1.0**, **1.15**, **1.5**, **2.0**).
  - *Max Width Slider* untuk membatasi pemenggalan baris judul secara rapi.
  - Geser vertikal (Atas/Bawah) & horizontal untuk setiap elemen teks secara mandiri.
- 👁️ **Live Interactive Preview**: Preview real-time instan ukuran standar A4 Landscape.
- ⚡ **Export & Download**:
  - 📄 Unduh PDF satuan untuk peserta yang sedang dipreview.
  - 📦 Unduh Semua PDF sekaligus dalam format arsip **`.ZIP`** dengan indikator *progress bar*.

---

## 🚀 Panduan Menjalankan Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/pujisubarkah/sertifikat-generator.git
   cd sertifikat-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Jalankan server development:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

4. **Build untuk Production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploy ke Vercel

Aplikasi ini 100% kompatibel dengan **Vercel**:
1. Hubungkan repository ini di [Vercel Dashboard](https://vercel.com).
2. Framework preset akan otomatis terdeteksi sebagai **Nuxt.js**.
3. Klik **Deploy** dan aplikasi langsung online!

---

Dibuat dengan ❤️ menggunakan **Nuxt 3** & **Tailwind CSS**.
