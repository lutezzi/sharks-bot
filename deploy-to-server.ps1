# sharks-bot'u yerel bilgisayardan Oracle Cloud sunucusuna guncelleyip
# yeniden baslatan yardimci script. GitHub kullanilmadan, dogrudan scp ile
# calisir.
#
# Kullanim (proje klasorunde PowerShell'de):
#   .\deploy-to-server.ps1
#
# Sadece kodu guncellemek yeterliyse (bagimlilik/slash komut degisikligi
# yoksa) daha hizli olmasi icin:
#   .\deploy-to-server.ps1 -SkipInstall -SkipCommandDeploy

param(
  [switch]$SkipInstall,
  [switch]$SkipCommandDeploy
)

$ErrorActionPreference = "Stop"

# --- Sunucu bilgileri: IP veya key degisirse burayi guncelle ---
$ServerIp  = "129.159.220.47"
$ServerUser = "ubuntu"
$KeyPath   = "C:\Users\Yeet\Downloads\ssh-key-2026-07-10.key"
$RemoteDir = "~/sharks-bot"
# -----------------------------------------------------------------

$ProjectRoot = $PSScriptRoot
$Target = "$ServerUser@$ServerIp"
$SshOpts = @("-o", "StrictHostKeyChecking=accept-new", "-i", $KeyPath)

Write-Host "==> Sunucudaki eski src/ klasoru temizleniyor..." -ForegroundColor Cyan
# scp, silinen/yeniden adlandirilan dosyalari asla kaldirmaz (sadece uzerine
# kopyalar) ve var olan bir "src" klasorune tekrar "src" kopyalamak bazi scp
# surumlerinde ic ice (src/src) bir kopya olusturabilir. Bu yuzden her
# guncellemede once uzaktaki src/ tamamen silinip sonra sifirdan kopyalanir
# — bu, yerel projeyle sunucunun her zaman birebir ayni olmasini garantiler.
ssh @SshOpts $Target "rm -rf $RemoteDir/src"

Write-Host "==> src/ klasoru sunucuya kopyalaniyor..." -ForegroundColor Cyan
scp @SshOpts -r "$ProjectRoot\src" "${Target}:${RemoteDir}/"

Write-Host "==> scripts/ klasoru sunucuya kopyalaniyor..." -ForegroundColor Cyan
scp @SshOpts -r "$ProjectRoot\scripts" "${Target}:${RemoteDir}/"

Write-Host "==> package.json, package-lock.json, ecosystem.config.js kopyalaniyor..." -ForegroundColor Cyan
scp @SshOpts `
  "$ProjectRoot\package.json" `
  "$ProjectRoot\package-lock.json" `
  "$ProjectRoot\ecosystem.config.js" `
  "${Target}:${RemoteDir}/"

if (-not $SkipInstall) {
  Write-Host "==> Sunucuda 'npm install' calistiriliyor..." -ForegroundColor Cyan
  ssh @SshOpts $Target "cd $RemoteDir && npm install"
}

if (-not $SkipCommandDeploy) {
  Write-Host "==> Slash komutlari yeniden kaydediliyor (npm run deploy)..." -ForegroundColor Cyan
  ssh @SshOpts $Target "cd $RemoteDir && npm run deploy"
}

Write-Host "==> Bot pm2 ile yeniden baslatiliyor..." -ForegroundColor Cyan
ssh @SshOpts $Target "pm2 restart sharks-bot"

Write-Host "==> Son loglar:" -ForegroundColor Cyan
ssh @SshOpts $Target "cd $RemoteDir && node scripts/pm2-startup-log.js"

Write-Host "`nGuncelleme tamamlandi." -ForegroundColor Green
