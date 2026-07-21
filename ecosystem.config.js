// pm2 process yoneticisi icin yapilandirma. VPS (orn. Oracle Cloud) uzerinde
// botu arka planda 7/24 calistirmak ve cokme durumunda otomatik yeniden
// baslatmak icin kullanilir.
//
// Kullanim (VPS uzerinde, proje klasorunde):
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup   (sunucu yeniden baslayinca pm2'nin de otomatik baslamasi icin)
module.exports = {
  apps: [
    {
      name: "sharks-bot",
      script: "src/index.js",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      // Cokme sonrasi surekli yeniden baslama dongusune girmemesi icin
      // art arda 10 cokmede pm2 durur.
      max_restarts: 10,
      min_uptime: "30s",
      restart_delay: 5000,
      // Bellek 500MB'i asarsa yeniden baslat (kucuk VPS'lerde guvenlik onlemi).
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      time: true,
    },
  ],
};
