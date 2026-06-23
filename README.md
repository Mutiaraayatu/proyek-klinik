# Smart Klinik — Sistem Manajemen Klinik

Aplikasi web manajemen klinik sederhana untuk Proyek Akhir Praktikum Pemrograman Web. Aplikasi ini memungkinkan pasien mendaftar konsultasi secara online tanpa login, sementara staf klinik (admin dan dokter) dapat mengelola data melalui sistem yang dilindungi autentikasi.

## Teknologi yang Digunakan

- **Next.js** (App Router, TypeScript) — frontend dan backend
- **PostgreSQL** (Neon) — basis data relasional
- **Prisma** — ORM untuk menghubungkan aplikasi dengan database
- **Tailwind CSS** — styling antarmuka
- **bcryptjs** — pengamanan password
- **Vercel** — deployment

## Fitur Utama

- **Pendaftaran pasien publik** — pasien mendaftar tanpa perlu login
- **CRUD Dokter** — tambah, lihat, ubah, hapus data dokter
- **CRUD Pendaftaran Pasien** — kelola antrian pasien dengan status (Menunggu, Diperiksa, Selesai)
- **Autentikasi** — login dan register untuk staf klinik
- **Hak akses berbasis peran:**
  - **Admin** — akses penuh (kelola semua data)
  - **Dokter** — hanya dapat melihat data (read-only)

## Struktur Data

- **User** — akun staf (admin/dokter) untuk autentikasi
- **Dokter** — data dokter (entitas CRUD)
- **Pendaftaran** — data pendaftaran pasien (entitas CRUD), berelasi dengan Dokter

## Cara Menjalankan (Lokal)

1. Clone repositori ini
2. Jalankan `npm install` untuk memasang dependensi
3. Buat file `.env` dan isi `DATABASE_URL` dengan connection string PostgreSQL
4. Jalankan `npx prisma migrate dev` untuk menyiapkan tabel database
5. Jalankan `npm run dev`, lalu buka `http://localhost:3000`

## Halaman

- `/` — halaman depan
- `/daftar` — pendaftaran pasien (publik)
- `/login` — login staf
- `/register` — pendaftaran akun staf
- `/dokter` — kelola data dokter (perlu login)
- `/pendaftaran` — antrian pasien (perlu login)