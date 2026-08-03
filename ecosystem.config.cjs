// Konfigurasi PM2 untuk menjalankan Diajar (Next.js) di VPS produksi.
// Jalankan dari root project: `pm2 start ecosystem.config.cjs`
// Env (DATABASE_URL, AUTH_SECRET, AI_*, dst.) dibaca Next dari .env.local di server.
module.exports = {
  apps: [
    {
      name: "diajar",
      cwd: __dirname,
      // Jalankan binary Next langsung (bukan lewat pnpm) supaya sinyal PM2
      // (reload/stop) diteruskan benar ke proses Node.
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
