# Deploy Diajar ke VPS Ubuntu

Panduan deploy produksi: **Ubuntu + Node + PM2 + Nginx + Certbot + PostgreSQL/pgvector (via Docker)**.
Target: `https://diajar.web.id` live dengan HTTPS.

Ganti `diajar.web.id` di seluruh dokumen dengan domainmu, dan `IP_VPS` dengan IP publik server.

---

## 0. Prasyarat

- VPS Ubuntu 22.04/24.04, akses SSH sebagai user non-root ber-`sudo` (mis. `deploy`).
- Domain sudah dibeli, bisa atur DNS.
- Key yang perlu disiapkan: `AI_API_KEY` (Sumopod), `EMBEDDING_API_KEY`, `YOUTUBE_API_KEY` (opsional).

### Pointing domain (lakukan lebih dulu — propagasi DNS butuh waktu)

Di panel DNS domain, buat **A record**:

| Type | Name | Value    |
| ---- | ---- | -------- |
| A    | @    | `IP_VPS` |
| A    | www  | `IP_VPS` |

Cek propagasi: `dig +short diajar.web.id` (harus keluar `IP_VPS`).

---

## 1. Setup server dasar

SSH ke VPS, lalu:

```bash
sudo apt update && sudo apt upgrade -y

# Firewall — hanya SSH + HTTP + HTTPS
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Node.js 22 LTS + pnpm + PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm pm2
node --version   # v22.x
```

### Docker (untuk PostgreSQL + pgvector)

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# logout & login lagi supaya grup docker aktif tanpa sudo
```

---

## 2. Ambil kode

```bash
sudo mkdir -p /var/www && sudo chown $USER:$USER /var/www
cd /var/www
git clone https://github.com/one2pret/diajar.git
cd diajar
pnpm install --frozen-lockfile
```

---

## 3. Database (PostgreSQL + pgvector via Docker)

```bash
cd /var/www/diajar

# Password DB yang kuat (simpan — dipakai di DATABASE_URL nanti)
export POSTGRES_PASSWORD='ganti-password-kuat-di-sini'

docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps   # STATUS harus Up (healthy)

# Aktifkan extension pgvector (sekali saja)
docker exec diajar_db psql -U diajar -d diajar_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

> Port DB hanya di-bind ke `127.0.0.1:5432` (lihat `docker-compose.prod.yml`) — tidak terekspos ke internet. App terhubung via `localhost`.

---

## 4. Environment produksi

Buat `.env.local` di server (JANGAN commit — sudah gitignored):

```bash
cd /var/www/diajar
cat > .env.local <<'EOF'
# Database (samakan password dgn POSTGRES_PASSWORD di atas)
DATABASE_URL=postgresql://diajar:ganti-password-kuat-di-sini@localhost:5432/diajar_db

# NextAuth — generate secret: openssl rand -base64 32
AUTH_SECRET=ISI_HASIL_openssl_rand_base64_32
AUTH_URL=https://diajar.web.id
AUTH_TRUST_HOST=true

# Password akun seed — WAJIB diisi, generate baru per environment.
# Contoh generate: openssl rand -base64 18 | tr -d '=+/' | cut -c1-20
SEED_ADMIN_PASSWORD=ISI_PASSWORD_KUAT
SEED_DEMO_PASSWORD=ISI_PASSWORD_KUAT

# AI generation (Sumopod / OpenAI-compatible)
AI_BASE_URL=https://ai.sumopod.com/v1
AI_API_KEY=sk-xxxxx
AI_MODEL=deepseek-v4-flash

# AI embedding (dimensi HARUS cocok schema = 1536)
EMBEDDING_BASE_URL=https://ai.sumopod.com/v1
EMBEDDING_API_KEY=sk-xxxxx
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536

# YouTube Data API (opsional — metadata module)
YOUTUBE_API_KEY=AIza...
EOF
```

`AUTH_URL` + `AUTH_TRUST_HOST=true` wajib benar, kalau tidak login/redirect NextAuth rusak di balik reverse proxy.

---

## 5. Push schema + seed data

```bash
cd /var/www/diajar
pnpm db:push     # buat semua tabel (baca .env.local via drizzle.config.ts)
pnpm db:seed     # admin + user demo + course contoh (password dari SEED_*_PASSWORD di atas)
```

`db:seed` menolak jalan kalau `SEED_ADMIN_PASSWORD`/`SEED_DEMO_PASSWORD` belum diisi — tidak ada
password default yang bisa kepakai tidak sengaja di produksi. Simpan kedua password itu di
password manager setelah seed selesai.

---

## 6. Build + jalankan via PM2

```bash
cd /var/www/diajar
pnpm build

pm2 start ecosystem.config.cjs
pm2 save                        # simpan daftar proses
pm2 startup                     # ikuti perintah yang dicetak (aktifkan auto-start saat reboot)

pm2 status                      # diajar harus "online"
curl -sI http://localhost:3000  # harus 200/307
```

App jalan di `127.0.0.1:3000` (belum publik — Nginx yang mengeksposnya di step 7).

---

## 7. Nginx reverse proxy

```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/diajar >/dev/null <<'EOF'
server {
    listen 80;
    server_name diajar.web.id www.diajar.web.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/diajar /etc/nginx/sites-enabled/diajar
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Uji: `http://diajar.web.id` harus muncul (belum HTTPS).

---

## 8. HTTPS (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d diajar.web.id -d www.diajar.web.id
```

Ikuti prompt (email, setuju TOS, pilih redirect HTTP→HTTPS). Certbot otomatis edit config Nginx + pasang auto-renew.

Uji akhir: buka **https://diajar.web.id** — gembok hijau, login/register jalan, AI Q&A jalan (untuk module yang sudah punya transcript).

---

## 9. Update / redeploy

Tiap ada perubahan kode:

```bash
cd /var/www/diajar
git pull
pnpm install --frozen-lockfile
pnpm build
pnpm db:push          # kalau ada perubahan schema
pm2 reload diajar     # zero-downtime restart
```

---

## Troubleshooting

| Gejala | Cek |
| --- | --- |
| 502 Bad Gateway | `pm2 status` (app online?), `pm2 logs diajar` |
| Login/redirect loop | `AUTH_URL` = https domain? `AUTH_TRUST_HOST=true`? |
| DB connection refused | `docker compose -f docker-compose.prod.yml ps`, extension vector aktif? |
| AI Q&A error 500 | `AI_API_KEY` valid? module punya transcript chunk (embedded)? |
| Build OOM di VPS kecil | tambah swap 2G, atau build lokal lalu rsync `.next` |
| Certbot gagal | DNS sudah propagate? port 80 kebuka (`ufw`)? |

### Log berguna

```bash
pm2 logs diajar --lines 100
docker compose -f docker-compose.prod.yml logs db --tail 100
sudo tail -f /var/log/nginx/error.log
```

---

## Catatan keamanan produksi

- Password akun seed sudah wajib diisi lewat `SEED_ADMIN_PASSWORD`/`SEED_DEMO_PASSWORD` sebelum
  `db:seed` bisa jalan — pastikan isinya unik per environment (jangan reuse dari dev).
- `.env.local` berisi rahasia — jangan pernah commit / bagikan.
- Rate limit AI Q&A saat ini in-memory (reset tiap restart, per-instance). Cukup untuk 1 VPS; kalau scale multi-instance, pindah ke Redis.
- Backup volume DB berkala: `docker exec diajar_db pg_dump -U diajar diajar_db > backup-$(date +%F).sql`.
