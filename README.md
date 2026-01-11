# Website Pengaduan Masyarakat

Aplikasi web untuk mengelola pengaduan masyarakat dengan panel admin. Dibangun menggunakan Next.js dan TypeScript.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- **Node.js** (versi 16 atau lebih tinggi)
- **npm** atau **yarn** atau **pnpm**
- **Git**

## Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd website-pengaduan-masyarakat
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

## Menjalankan Secara Lokal

### Development Server

Untuk menjalankan server development dengan hot-reload:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Server akan berjalan di [http://localhost:3000](http://localhost:3000)

Buka browser dan akses:
- **Halaman Publik**: http://localhost:3000
- **Halaman Admin**: http://localhost:3000/admin/login

### Testing

```bash
npm run build
npm run start
```

Perintah di atas akan membuild aplikasi dan menjalankannya dalam mode production lokal.

## Menjalankan di Server (Production)

### 1. Persiapan Server

Pastikan server Anda memiliki:
- Node.js (versi 16 atau lebih tinggi)
- npm/yarn/pnpm
- Akses SSH
- Port 80 (HTTP) dan 443 (HTTPS) terbuka

### 2. Deploy Aplikasi

#### Menggunakan PM2 (Recommended)

```bash
# Login ke server
ssh user@your-server-ip

# Clone repository
git clone <repository-url>
cd website-pengaduan-masyarakat

# Install dependencies
npm install

# Build aplikasi
npm run build

# Install PM2 globally (jika belum)
npm install -g pm2

# Jalankan aplikasi dengan PM2
pm2 start npm --name "pengaduan-app" -- start

# Simpan konfigurasi PM2
pm2 save

# Setup startup script
pm2 startup
```

#### Konfigurasi Reverse Proxy dengan Nginx

1. Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

2. Buat file konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/pengaduan-app
```

3. Tambahkan konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

4. Enable konfigurasi:
```bash
sudo ln -s /etc/nginx/sites-available/pengaduan-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL/HTTPS Setup (Optional dengan Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 4. Update Aplikasi

Untuk update aplikasi di production:

```bash
# SSH ke server
ssh user@your-server-ip
cd website-pengaduan-masyarakat

# Pull latest code
git pull origin main

# Install dependencies (jika ada perubahan)
npm install

# Build aplikasi
npm run build

# Restart aplikasi
pm2 restart pengaduan-app
```

### 5. Monitoring

Untuk melihat status aplikasi:

```bash
# Lihat logs
pm2 logs pengaduan-app

# Lihat status semua aplikasi
pm2 status

# Lihat resource usage
pm2 monit
```

## Struktur Folder

```
src/
├── app/
│   ├── (public)/          # Halaman publik
│   │   ├── lacak/         # Halaman lacak pengaduan
│   │   ├── lapor/         # Halaman buat laporan
│   │   ├── login/         # Halaman login
│   │   ├── register/      # Halaman registrasi
│   │   └── riwayat/       # Halaman riwayat pengaduan
│   └── admin/             # Halaman admin
│       └── (dashboard)/   # Dashboard admin
│           ├── kategori/
│           ├── kelola-admin/
│           ├── kelola-pengguna/
│           ├── laporan/
│           ├── pengumuman/
│           └── statistik/
├── components/            # Komponen reusable
├── context/               # React Context untuk state management
└── ...
```

## Environment Variables

Jika diperlukan, buat file `.env.local` di root project:

```env
# Contoh
NEXT_PUBLIC_API_URL=http://localhost:3000
# Tambahkan variable lain sesuai kebutuhan
```

## Troubleshooting

### Port 3000 sudah digunakan
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Build error
```bash
# Bersihkan cache
rm -rf .next
npm run build
```

### PM2 tidak restart otomatis setelah reboot
```bash
pm2 startup
pm2 save
```

## Lihat Juga

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)

## License

Hak Cipta (c) 2026. Semua hak dilindungi.
