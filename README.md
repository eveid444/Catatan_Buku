# Catatan Buku API

Latihan REST API PKL Backend PT. LSKK: CRUD catatan buku dengan autentikasi JWT dan data terpisah per user.

## Tech Stack
TypeScript, NestJS, PostgreSQL + TypeORM, JWT + Passport, class-validator, Swagger (non-production), Throttler, Cache Manager.

## Setup
1. `npm install`
2. `cp .env.example .env`, lalu isi nilainya
3. `npm run start:dev`
4. Swagger: `http://localhost:3000/api-docs` (hanya saat `NODE_ENV` bukan `production`)

## Endpoint
| Method | Path | Auth | Keterangan |
|---|---|---|---|
| POST | /auth/register | - | Registrasi (maks 5 req/menit) |
| POST | /auth/login | - | Login, mengembalikan token (maks 5 req/menit) |
| POST | /books | Bearer | Tambah buku |
| GET | /books | Bearer | Daftar buku milik user |
| GET | /books/:id | Bearer | Detail buku (cache per user, 60 detik) |
| PATCH | /books/:id | Bearer | Ubah buku |
| DELETE | /books/:id | Bearer | Hapus buku |
