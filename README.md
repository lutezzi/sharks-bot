# sharks-bot 🦈

Slash komutlarina sahip, genisletilebilir bir Discord moderasyon botu.
[discord.js v14](https://discord.js.org/) ile yazilmistir.

## ✨ Ozellikler

- 👋 Kullanici katilinca **hosgeldin mesaji**
- 👋 Kullanici ayrilinca **ayrilma mesaji**
- 📜 `/kurallar` komutu ile sunucu kurallarini gosterme
- 🎨 `/renk-menusu` — Acilir menuden (dropdown) renk rolu secme (renkler birbirini dislar)
- 🚻 `/cinsiyet-menusu` — Acilir menuden (dropdown) cinsiyet rolu secme (secenekler birbirini dislar)
- 🏷️ `/rol-menusu` — Butona tiklayarak ilgi alani/bildirim rolu secme (birden fazla secilebilir)
- 🔨 Admin komutlari: `/ban`, `/kick`, `/mute`, `/unban`, `/unmute`, `/clear`
- 👤 `/userinfo`, 🏰 `/serverinfo`, 🖼️ `/avatar` ile kullanici/sunucu bilgi komutlari
- 📖 `/yardim` ile tum komutlari kategorize eden bir liste
- 🔊 `/join` / `/leave` ile botu bulundugunuz sesli kanala davet etme/cikartma
- ⚙️ `/ayarla` ile hosgeldin/ayrilma kanallarini kolayca yapilandirma
- 🌐 Tum metinler `src/locales/tr.json` dosyasinda toplanir (kolay duzenleme ve dil ekleme)
- 🎨 Genel komutlarin embed renkleri, sunucunun pastel temasiyla uyumlu **soft** tonlarda
- 💤 Bot durumu "idle" ve `src/config/activities.js` icindeki yazilar 10 saniyede bir sirayla degisir
- 🖥️ Bot her acildiginda terminalde; sunucu sayisi/isimleri ve yuklenen komutlarin ozet bir gorunumu

## 📁 Klasor Yapisi

```
sharks-bot/
├── data/
│   └── settings.json          # Sunucu bazli ayarlar (calisma zamaninda otomatik olusur)
├── src/
│   ├── commands/
│   │   ├── admin/             # Yetki gerektiren moderasyon komutlari
│   │   │   ├── ban.js
│   │   │   ├── clear.js
│   │   │   ├── kick.js
│   │   │   ├── mute.js
│   │   │   ├── unban.js
│   │   │   └── unmute.js
│   │   ├── genel/              # Genel / yapilandirma / bilgi komutlari
│   │   │   ├── avatar.js
│   │   │   ├── ayarla.js
│   │   │   ├── cinsiyetMenusu.js
│   │   │   ├── kurallar.js
│   │   │   ├── renkMenusu.js
│   │   │   ├── rolMenusu.js
│   │   │   ├── serverinfo.js
│   │   │   ├── userinfo.js
│   │   │   └── yardim.js
│   │   └── ses/                # Sesli kanal komutlari
│   │       ├── join.js
│   │       └── leave.js
│   ├── config/
│   │   ├── activities.js       # Botun durum cubugunda donen yazilar (elle duzenlenir)
│   │   ├── colorRoles.js       # Renk menusu (dropdown) icin rol tanimlari
│   │   ├── genderRoles.js      # Cinsiyet menusu (dropdown) icin rol tanimlari
│   │   ├── reactionRoles.js    # Rol menusu (buton) icin rol tanimlari
│   │   └── rules.js            # Sunucu kurallari metni
│   ├── locales/
│   │   └── tr.json             # Botun kullandigi TUM sabit metinler (embed, komut, mesaj)
│   ├── events/
│   │   ├── guildMemberAdd.js   # Hosgeldin mesaji
│   │   ├── guildMemberRemove.js# Ayrilma mesaji
│   │   ├── interactionCreate.js# Slash komut + buton/menu yonlendirici
│   │   └── ready.js            # Baslangic banner'i, durum rotasyonu, senkronizasyon
│   ├── handlers/
│   │   ├── loadCommands.js     # commands/ klasorunu otomatik yukler
│   │   └── loadEvents.js       # events/ klasorunu otomatik yukler
│   ├── utils/
│   │   ├── activityRotator.js  # activities.js'i okuyup durumu 10 sn'de bir degistirir
│   │   ├── startupBanner.js    # Terminaldeki acilis gorunumunu olusturur
│   │   ├── buttonRows.js       # Rol menusu (ilgi alani) butonlarini olusturur
│   │   ├── selectMenus.js      # Renk/cinsiyet dropdown menulerini olusturur
│   │   ├── syncColorRoles.js   # Rol renklerini config'teki hex ile senkronize eder
│   │   ├── duration.js         # "10m", "2h", "1d" gibi sureleri parse eder
│   │   ├── embeds.js           # Tum embed sablonlari (metinler locales/'dan gelir)
│   │   ├── i18n.js             # locales/ dosyalarini okuyan `t()` fonksiyonu
│   │   └── settingsStore.js    # data/settings.json okuma/yazma
│   ├── deploy-commands.js      # Slash komutlarini Discord'a kaydeder
│   └── index.js                # Botun giris noktasi
├── .env.example
├── .gitignore
├── deploy-to-server.ps1        # GitHub'siz, scp ile sunucuyu tek komutla guncelleme script'i
├── ecosystem.config.js         # pm2 process yapilandirmasi (7/24 calistirma)
├── package.json
└── README.md
```

Yeni bir komut eklemek istediginizde sadece `src/commands/admin` veya
`src/commands/genel` (ya da yeni bir kategori klasoru) icine dosya eklemeniz
yeterlidir; `loadCommands.js` otomatik olarak bulup kaydedecektir.

## 🚀 Kurulum

1. **Bagimliliklari kurun**

   ```bash
   npm install
   ```

2. **Discord uygulamasi olusturun**

   [Discord Developer Portal](https://discord.com/developers/applications) uzerinden
   yeni bir uygulama/bot olusturun. Bot sekmesinden **Privileged Gateway Intents**
   altinda **Server Members Intent**'i acin (hosgeldin/ayrilma ve rol islemleri icin gerekli).

3. **.env dosyasini olusturun**

   `.env.example` dosyasini `.env` olarak kopyalayin ve alanlari doldurun:

   ```bash
   cp .env.example .env
   ```

   ```env
   DISCORD_TOKEN=BOT_TOKENINIZ
   CLIENT_ID=UYGULAMA_CLIENT_ID
   GUILD_ID=TEST_SUNUCU_ID
   DEPLOY_MODE=guild
   ```

4. **Rol ID'lerini yapilandirin**

   Renk, cinsiyet ve rol menuleri icin sunucunuzda oncelikle ilgili
   rolleri olusturun, ardindan rol ID'lerini kopyalayip su dosyalara
   yapistirin:

   - `src/config/colorRoles.js`
   - `src/config/genderRoles.js`
   - `src/config/reactionRoles.js`

   Rol ID'si almak icin: Discord Ayarlar > Gelismis > **Gelistirici Modu**'nu
   acin, ardindan role sag tiklayip **ID'yi Kopyala**'yi secin.

   Kurallarinizi de `src/config/rules.js` dosyasindan duzenleyebilirsiniz.

5. **Slash komutlarini Discord'a kaydedin**

   ```bash
   npm run deploy
   ```

6. **Botu baslatin**

   ```bash
   npm start
   ```

## 🕹️ Kullanim

| Komut | Yetki | Aciklama |
|---|---|---|
| `/kurallar` | Herkes | Sunucu kurallarini embed olarak gosterir |
| `/renk-menusu` | Rolleri Yonet | Bulundugu kanala renk secim menusunu (dropdown) gonderir |
| `/cinsiyet-menusu` | Rolleri Yonet | Bulundugu kanala cinsiyet secim menusunu (dropdown) gonderir |
| `/rol-menusu` | Rolleri Yonet | Bulundugu kanala rol secim menusunu (buton) gonderir |
| `/userinfo [kullanici]` | Herkes | Kullanicinin katilma tarihi, hesap yasi ve rollerini gosterir (bos birakilirsa kendinizinkini gosterir) |
| `/serverinfo` | Herkes | Sunucu uye/rol/kanal sayisi, kurulus tarihi ve boost seviyesini gosterir |
| `/avatar [kullanici]` | Herkes | Kullanicinin profil fotografini buyuk boyutta gonderir |
| `/yardim` | Herkes | Tum komutlari kategorilere ayirarak listeleyen bir embed gonderir |
| `/join` | Herkes | Botu, komutu kullanan kisinin bulundugu sesli kanala davet eder |
| `/leave` | Herkes | Botu bulundugu sesli kanaldan cikarir |
| `/ayarla hosgeldin-kanal #kanal` | Sunucuyu Yonet | Hosgeldin mesajlarinin gonderilecegi kanali ayarlar |
| `/ayarla ayrilma-kanal #kanal` | Sunucuyu Yonet | Ayrilma mesajlarinin gonderilecegi kanali ayarlar |
| `/ban kullanici sebep mesaj-sil-gun` | Uyeleri Yasakla | Kullaniciyi sunucudan yasaklar |
| `/unban kullanici-id sebep` | Uyeleri Yasakla | Yasagi kaldirir |
| `/kick kullanici sebep` | Uyeleri At | Kullaniciyi sunucudan atar |
| `/mute kullanici sure sebep` | Uyeleri Yonet | Kullaniciyi belirtilen sure susturur (timeout) — orn. `10m`, `2h`, `1d` |
| `/unmute kullanici sebep` | Uyeleri Yonet | Susturmayi kaldirir |
| `/clear miktar` | Mesajlari Yonet | Bulundugu kanaldaki son X mesaji topluca siler (1-100, 14 gunden eski mesajlar haric) |

> Not: Botun rolu, islem yapmak istedigi uyenin/rolun **ustunde** olmalidir
> (Discord rol hiyerarsisi kurali). Aksi halde `ban`/`kick`/`mute`/rol verme
> islemleri basarisiz olur.

## 🌐 Metinleri Duzenleme / Localization

Botun kullandigi **tum sabit metinler** (embed basliklari/aciklamalari,
komut ve secenek aciklamalari, hata/basari mesajlari, buton-menu
metinleri) kod icinde degil, tek bir dosyada toplanir:

```
src/locales/tr.json
```

Bir metni degistirmek icin kod dosyalarina dokunmaniza gerek yok, sadece
bu JSON dosyasindaki ilgili degeri duzenleyip botu yeniden baslatmaniz
(slash komut aciklamasi degistiyse `npm run deploy` da calistirmaniz)
yeterlidir. Dosya, ozelligine gore boluk boluktur (`embeds`, `commands`,
`selectMenus`, `interactions`), ic ice anahtarlar noktali yol ile
kullanilir (orn. `commands.ban.success`). Bazi metinler `{degisken}`
seklinde yer tutucular icerir (orn. `"{member} sunucumuza katildi!"`) —
bunlari silmeyin, kod calisirken gercek degerle degistirilirler.

**Yeni bir dil eklemek icin:**

1. `src/locales/tr.json` dosyasini kopyalayip `src/locales/en.json` (ya
   da istediginiz dil kodu) olarak kaydedin ve tum degerleri cevirin
   (anahtarlari degistirmeyin, sadece degerleri).
2. `.env` dosyasina `LOCALE=en` satirini ekleyin.
3. Botu yeniden baslatin.

Eger secilen `LOCALE` dosyasi bulunamazsa ya da icinde eksik bir anahtar
varsa, bot otomatik olarak `tr.json`'a (ya da eksik anahtarin kendisine)
geri duser ve konsola bir uyari yazar; bu yuzden yarim birakilmis bir
ceviri botun cokmesine sebep olmaz.

## 🧩 Genisletme Ornekleri (Opsiyonel Komutlar)

Bu bot, kolayca yeni komutlar eklenebilecek sekilde tasarlandi. Yeni bir
slash komutu eklemek icin `src/commands/<kategori>/` altina asagidaki
sablonla bir dosya olusturmaniz yeterli:

```js
// src/commands/genel/ping.js
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun gecikme suresini gosterir."),

  async execute(interaction) {
    await interaction.reply(`🏓 Pong! Gecikme: ${interaction.client.ws.ping}ms`);
  },
};
```

Dosyayi ekledikten sonra `npm run deploy` calistirarak komutu Discord'a
kaydetmeniz yeterlidir. Metinleri dogrudan kod icine yazmak yerine
`src/locales/tr.json` dosyasina ekleyip `const { t } = require("../../utils/i18n")`
ile cagirmaniz, projenin geri kalaniyla tutarli ve kolay cevrilebilir
kalmasini saglar.

Asagida ilerleyen zamanda ekleyebileceginiz bazi komut fikirleri yer alir:

### Moderasyon
- **`/warn ekle|listele|sil`** — Kullanicilara uyari verme ve uyari gecmisi tutma (JSON veya veritabaninda saklanir).
- **`/lock` / `/unlock`** — Kanali kilitleyip acma (`@everyone` icin `SendMessages` iznini kapatip/acar).
- **`/slowmode saniye`** — Kanala yavas mod suresi ayarlama (`channel.setRateLimitPerUser`).
- **`/nickname kullanici yeni-isim`** — Kullanicinin sunucu takma adini degistirme.

### Eglence / Topluluk
- **`/anket soru secenekler`** — Emoji tepkili anket mesaji olusturma.
- **`/cekilis baslat sure odul`** — Zamanlayicili cekilis/giveaway sistemi (buton ile katilim).
- **`/seviye` / `/rank`** — Mesaj aktivitesine dayali seviye/XP sistemi.

### Destek Sistemi
- **`/ticket-kur`** — Buton ile ozel destek kanali (ticket) acan bir sistem; `ChannelType.GuildText` ile
  kullaniciya ozel bir kanal olusturup yetkilileri ekleme mantigiyla genisletilebilir.

Bu komutlarin cogu ayni desende ilerler: yeni bir dosya olusturun, gerekli
`SlashCommandBuilder` secenklerini tanimlayin, `execute` icinde islemi
gerceklestirin ve gerekiyorsa `src/utils/settingsStore.js` benzeri basit bir
JSON deposu (ya da SQLite/MongoDB gibi bir veritabani) ile veriyi kalici
hale getirin.

## 🎨 Renk / Cinsiyet Menuleri Nasil Calisir

`/renk-menusu` ve `/cinsiyet-menusu`, buton yerine **acilir menu**
(dropdown / `StringSelectMenu`) kullanir — tipki bircok sunucuda gordugunuz
"Renk Rolunu Sec" tarzi menuler gibi. Her ikisi de **tek secimlidir**:
kullanici listeden bir secenek sectiginde, o kategorideki onceki secimi
otomatik olarak kaldirilir ve yeni secim eklenir. Listenin sonundaki
**"Kaldir"** secenegiyle de mevcut secimini tamamen kaldirabilir.

Discord'un select-menu bilesenlerinde (dropdown), buton API'sinin aksine
ozel renk stili kavrami yoktur — secenekler duz metin + emoji olarak
gorunur, bu yuzden "buton rengi" sorunu burada zaten gecerli degildir.

Asil onemli olan **rolun gercek rengi**dir (kullanicinin sunucuda ismi
hangi renkte gorunecegi). Bu, `src/config/colorRoles.js` icindeki `hex`
alaniyla tamamen ozgurce belirlenebilir:

```js
{ label: "ʚїɞㆍmatcha", emoji: "🎨", roleId: "...", hex: "#A8C69F" }
```

Bot her acildiginda ve `/renk-menusu` her calistirildiginda, buradaki
`hex` degerini rolun Discord uzerindeki gercek rengiyle **otomatik
senkronize eder** (`src/utils/syncColorRoles.js`). Yani renk kodunu
degistirip botu yeniden baslatmaniz (ya da `/renk-menusu`'nu tekrar
calistirmaniz) yeterlidir; Discord'da role tek tek girip elle renk
secmenize gerek kalmaz. (`genderRoles.js` icin bu senkronizasyon
uygulanmadi, cunku cinsiyet rollerinin genelde ozel bir renge ihtiyaci
olmaz; isterseniz ayni `hex` + senkronizasyon mantigini oraya da
kolayca ekleyebilirsiniz.)

Dropdown'daki gorunumu daha da ozellestirmek isterseniz, her secenek
icin unicode yerine **ozel (custom) bir emoji** kullanabilirsiniz
(`emoji: "<:matcha:123456789012345678>"` formatinda) — bu, secenegin
yaninda gercek renge en yakin gorsel eslesmeyi saglayan yontemdir.

## 🩹 Sorun Giderme

**`DiscordAPIError[50035]: Invalid Form Body` / `COMPONENT_INVALID_EMOJI` hatasi aliyorum**

`colorRoles.js`, `genderRoles.js` veya `reactionRoles.js` icindeki bir
`emoji` degeri Discord'un buton/menu bilesenlerinde geçerli saymadigi,
nadir kullanilan bir Unicode sembol oldugunda bu hata alinir (ornegin
`⚧️` bu sekilde reddedilir). Hata mesajindaki `options[N]` (veya
`components[N]`) index'i, config dizinizdeki hangi elemanin sorunlu
oldugunu gosterir (0'dan baslar). Cozum: o elemanin `emoji` degerini
yaygin kullanilan standart bir emoji ile (orn. `🌈`, `🎨`, `⭐`, `❓`)
degistirmeniz yeterlidir.

**`ConnectTimeoutError` / `UND_ERR_CONNECT_TIMEOUT` hatasi aliyorum**

Bazi internet servis saglayicilarinda (ozellikle Turkiye'de) Node.js'in
discord.com'a kurdugu TLS baglantisi normalden cok daha yavas kuruluyor
(birkac saniye surebiliyor), bu da undici'nin varsayilan 10 saniyelik
baglanti zaman asimini asiyor. Bu depoda `src/utils/network.js` dosyasi bu
zaman asimini 30 saniyeye cikararak sorunu buyuk olcude cozer (`index.js`
ve `deploy-commands.js` en basta bu dosyayi otomatik yukler).

Eger sorun devam ederse:
- Bir VPN ile baglanip tekrar deneyin (en kesin cozum).
- Mumkunse botu yurt disinda bir VPS/sunucuda calistirin.
- `src/utils/network.js` icindeki `timeout` degerlerini daha da
  artirabilirsiniz.

**`DiscordAPIError[10062]: Unknown interaction` hatasi aliyorum**

Discord, bir slash komutuna/butona **3 saniye icinde** yanit verilmesini
bekler. Bazi aglarda discord.com'a kurulan TLS baglantisi ilk seferinde
birkac saniye (bazen 10+ saniye) surebiliyor; baglanti bir kere kurulup
acik kaldiginda ise sonraki istekler ~20-30ms gibi çok hizli tamamlaniyor.

Bunun icin projede su onlemler alindi:

1. `src/utils/network.js` — baglanti zaman asimini uzatir ve kurulan
   baglantiyi (varsayilan 4 saniye yerine) 10 dakika boyunca bosta kalsa
   bile acik tutar, boylece komutlar arasinda uzun bosluklar olsa da
   baglanti sifirdan kurulmak zorunda kalmaz.
2. `src/events/ready.js` — bot hazir olur olmaz bu baglantiyi arka planda
   erkenden kurar (isitir).
3. REST cagrisi yapan tum komutlar ve etkilesimler (`ban`, `kick`,
   `mute`, `unban`, `unmute`, `renk-menusu`, `cinsiyet-menusu`,
   `rol-menusu`, renk/cinsiyet dropdown'lari, rol butonlari) once
   `deferReply()` ile etkilesimi hemen onaylayip asil islemi (uye
   getirme, ban/kick/mute, mesaj gonderme, rol ekleme/kaldirma) daha
   sonra yapacak sekilde yazildi. Boylece etkilesim onayi icin tek ve
   mumkun oldugunca erken bir REST cagrisi yapilir.

Bu onlemler sorunu buyuk olcude azaltir, ancak **agin kendisi genel olarak
çok yavassa** (ilk baglanti kurulumu duzenli olarak 3 saniyeden uzun
suruyorsa) botun ilk aciliminda calistirilan ilk komut ya da uzun bir
aradan sonraki ilk komut yine de basarisiz olabilir — bu durum kod
tarafinda tamamen ortadan kaldirilamaz, cunku Discord'un 3 saniyelik
siniri sunucu tarafinda sabittir. Boyle bir durumla surekli
karsilasiyorsaniz:

- Botu actiktan sonra ilk komutu denemeden once ~10-15 saniye bekleyin.
- Bir VPN ile baglanip tekrar deneyin (genelde sorunu tamamen cozer).
- Botu yurt disinda, Discord'a yakin/temiz bir aga sahip bir VPS'te
  calistirin (7/24 calisan botlar icin zaten onerilen yontemdir).

## ☁️ 7/24 Calistirma (Oracle Cloud Free Tier ile Deployment)

Botu bilgisayarini kapatsan bile surekli acik tutmak icin ucretsiz ve
kalici bir VPS olan **Oracle Cloud "Always Free"** kullanabilirsin.
Avrupa bolgesinde (orn. Almanya/Frankfurt, Hollanda/Amsterdam) bir sunucu
secmen, "Sorun Giderme" bolumundeki ag (ISP throttling) sorununu da
buyuk olcude cozer.

### 1. Oracle Cloud hesabi ve sunucu (instance) olusturma

1. [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) uzerinden
   ucretsiz hesap ac (kredi karti dogrulama icin istenir, ucret kesilmez).
2. Hesap olusurken **Home Region**'i Avrupa'da bir bolge sec (orn.
   `Germany Central (Frankfurt)` veya `Netherlands Northwest`) — bu secim
   sonradan degistirilemez, dikkatli sec.
3. Konsolda **Compute > Instances > Create Instance**'a gir.
4. **Image**: Ubuntu (en son LTS, orn. 22.04 veya 24.04).
5. **Shape**: "Always Free eligible" isaretli bir shape sec — `VM.Standard.A1.Flex`
   (Ampere ARM, 4 OCPU / 24GB RAM'e kadar ucretsiz) en guclu secenektir.
6. SSH anahtari olustur/indir (private key dosyasini `.pem` olarak kaydet,
   bilgisayarindan silme).
7. **Create**'e bas, sunucu ayaga kalkana kadar (~1-2 dk) bekle, **Public IP**
   adresini not al.

### 2. Sunucuya baglanma (Windows'tan)

PowerShell'de (private key dosyanin bulundugu klasorden):

```powershell
ssh -i .\senin-anahtarin.key ubuntu@SUNUCU_IP_ADRESI
```

### 3. Sunucuda gerekli programlari kurma

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g pm2
```

### 4. Bot kodunu sunucuya tasima (GitHub kullanmadan, `scp` ile)

Bu projede GitHub kullanilmadi; kod dogrudan Windows'tan `scp` ile
sunucuya kopyalandi. `node_modules` ve `.git` klasorlerini kopyalamaya
**gerek yok** (hem gereksiz yer kaplar hem de sunucuda zaten
`npm install` calistirilacak) — sadece asagidaki dosya/klasorleri
kopyala. Once sunucuda hedef klasoru olustur:

```powershell
ssh -i .\senin-anahtarin.key ubuntu@SUNUCU_IP_ADRESI "mkdir -p ~/sharks-bot/data"
```

Ardindan (kendi bilgisayarinda, proje klasorunden) gerekli dosyalari
kopyala:

```powershell
scp -i .\senin-anahtarin.key -r .\src ubuntu@SUNUCU_IP_ADRESI:~/sharks-bot/src

scp -i .\senin-anahtarin.key `
  .\package.json `
  .\package-lock.json `
  .\ecosystem.config.js `
  .\.env.example `
  .\.gitignore `
  .\README.md `
  .\.env `
  ubuntu@SUNUCU_IP_ADRESI:~/sharks-bot/
```

> `.env` dosyasi normalde `.gitignore` icinde oldugu icin bir Git deposuna
> gitmez, ama burada GitHub kullanilmadigindan dogrudan `scp` ile
> kopyalanabilir — SSH baglantisi zaten sifrelidir.

### 5. `.env` dosyasini kontrol etme

Yukaridaki `scp` komutuyla `.env` dosyasi zaten kopyalandiysa bu adimi
atlayabilirsin, sadece dogru geldigini kontrol et:

```bash
ssh -i .\senin-anahtarin.key ubuntu@SUNUCU_IP_ADRESI "cat ~/sharks-bot/.env"
```

Eger `.env`'i kopyalamadan atladiysan, sunucuda elle olusturabilirsin:

```bash
cd ~/sharks-bot
nano .env
```

Kendi `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, `DEPLOY_MODE`, `LOCALE`
degerlerini yapistir (bilgisayarindaki `.env` dosyanla ayni icerik),
kaydet (`Ctrl+O`, `Enter`, `Ctrl+X`).

### 6. Slash komutlarini kaydetme ve botu pm2 ile baslatma

```bash
npm run deploy
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

`pm2 startup` komutunun ciktisinda sana verecegi `sudo ...` ile baslayan
satiri kopyalayip calistirmayi unutma — bu, sunucu yeniden baslasa
(elektrik kesintisi, Oracle bakimi vb.) bile pm2'nin ve botunun otomatik
ayaga kalkmasini saglar.

### 7. Kontrol ve loglar

```bash
pm2 status          # Bot calisiyor mu?
pm2 logs sharks-bot  # Canli loglari izle (npm run pm2:logs ile de calisir)
pm2 restart sharks-bot
```

### 8. Ileride kod guncelledigin zaman (GitHub'siz, otomatik script ile)

GitHub kullanilmadigi icin guncelleme, degisen dosyalari tekrar `scp`
ile gondermek ve botu `pm2` ile yeniden baslatmaktan olusuyor. Bunu her
seferinde elle yazmak yerine, projede bulunan `deploy-to-server.ps1`
script'i bu adimlarin tumunu otomatik yapar.

**Kullanimi** (kendi bilgisayarinda, proje klasorunde PowerShell'de):

```powershell
.\deploy-to-server.ps1
```

Bu script sirasiyla:
1. `src/`, `package.json`, `package-lock.json`, `ecosystem.config.js`
   dosyalarini sunucuya kopyalar,
2. sunucuda `npm install` calistirir (yeni bagimlilik eklendiyse),
3. `npm run deploy` ile slash komutlarini yeniden kaydeder (komut
   tanimlarinda degisiklik olduysa),
4. `pm2 restart sharks-bot` ile botu yeniden baslatir,
5. son loglari ekrana yazdirir.

Sadece kod degisti, bagimlilik veya slash komut tanimi degismediyse
(daha hizli calisir):

```powershell
.\deploy-to-server.ps1 -SkipInstall -SkipCommandDeploy
```

> Script'in basindaki `$ServerIp`, `$ServerUser`, `$KeyPath`
> degiskenlerini kendi bilgilerinle (sunucu IP'si degisirse, key dosyasi
> tasinirsa vb.) guncel tutman gerekir.

**Elle yapmak istersen** ayni islemler asagidaki gibidir:

```powershell
scp -i .\senin-anahtarin.key -r .\src ubuntu@SUNUCU_IP_ADRESI:~/sharks-bot/src
scp -i .\senin-anahtarin.key .\package.json .\package-lock.json .\ecosystem.config.js ubuntu@SUNUCU_IP_ADRESI:~/sharks-bot/
ssh -i .\senin-anahtarin.key ubuntu@SUNUCU_IP_ADRESI "cd ~/sharks-bot && npm install && npm run deploy && pm2 restart sharks-bot"
```

## 💤 Bot Durumu ve Baslangic Gorunumu

**Durum cubugu (activity):** Bot acildiginda durumu otomatik olarak
**"Boşta" (idle)** olarak ayarlanir ve `src/config/activities.js`
dosyasindaki yazilar **10 saniyede bir** sirayla degisir. Bu listeyi
kod bilmeden duzenleyebilirsin — dosyadaki aciklamalarda hangi
`type` degerlerinin ("Playing", "Watching", "Listening", "Competing",
"Custom") ne gosterdigi ve `{sunucuSayisi}` / `{uyeSayisi}` gibi
otomatik doldurulan yer tutucular anlatilmistir. Degisiklik sonrasi
sadece botu yeniden baslatman (`pm2 restart sharks-bot`) yeterli.

**Terminal acilis gorunumu:** Bot her baslatildiginda (`npm start` ya
da `pm2 restart` sonrasi `pm2 logs sharks-bot`), terminale/loglara
renkli bir ozet basar: bot etiketi, bulundugu sunucu sayisi ve her
sunucunun adi/uye sayisi, ardindan yuklenen tum slash komutlarinin
kategorilere ayrilmis listesi. Bu gorunumun kodu `src/utils/startupBanner.js`
icindedir; ekstra bir paket (chalk vb.) kullanilmadan sade ANSI renk
kodlariyla yazildi.

## 🔊 Sesli Kanal (`/join` / `/leave`) Nasil Calisir

Bot, `@discordjs/voice` paketi ile gercek bir ses baglantisi kurar:

- **`/join`**: komutu kullanan kisinin o an bulundugu sesli kanali
  bulur (bunun icin `index.js`'te `GuildVoiceStates` intent'i acik
  olmali — zaten acik), botun o kanala **Baglan** izni oldugunu
  kontrol eder ve baglanir.
- **`/leave`**: o sunucuda aktif bir ses baglantisi varsa kapatir.

Su an bot sese katildiginda herhangi bir ses **calmiyor** (sessizce
kanalda bekliyor) — bu, asagidaki "Yeni Fikirler" bolumundeki muzik/ses
efekti gibi ozelliklerin temelini olusturur. Ileride muzik calma gibi
bir ozellik eklemek istersen, `ffmpeg` kurulumu ve bir ses kaynagi
(YouTube/Spotify baglantisi coken bir kutuphane) gerekecek.

## 💡 Yeni Fikirler — Botla Neler Yapabilirsin?

Botun zaten dogru sundugu bir alt yapisi var (komut/olay otomatik
yukleme, i18n, ayar deposu, ses baglantisi); bunun uzerine asagidaki
ozellikleri nispeten kolay eklenebilir. Kendi zevkine/sunucuna en
uygun olanlardan baslayabilirsin:

### 🎧 Ses / Muzik (artik `/join`-`/leave` sayesinde temeli hazir)
- **Muzik botu**: YouTube/Spotify linkinden sarki calma, sira (queue)
  sistemi, `/muzik-cal`, `/sira`, `/atla`, `/duraklat` komutlari.
- **Soundboard**: `/ses-cal efekt-adi` ile kisa ses efektleri calma.
- **Karsilama sesi**: birisi sesli kanala girdiginde ozel bir ses
  efekti/mesaji calma.
- **Otomatik ayrilma**: kanalda bottan baska kimse kalmayinca `/leave`
  komutunu otomatik tetikleme (kaynak tasarrufu).

### 🛡️ Moderasyon
- **AutoMod entegrasyonu**: kufur/spam link filtresi icin Discord'un
  kendi AutoMod API'sini kullanma (daha once konustugumuz ✨ rozet
  bonusuyla birlikte).
- **`/warn ekle|listele|sil`**: kullaniciya uyari verme ve gecmis tutma.
- **Moderasyon logu**: mesaj silme/duzenleme, rol degisikligi gibi
  olaylari ozel bir log kanalina otomatik yazma.
- **`/lock` / `/slowmode`**: kanal kilitleme / yavas mod ayarlama.

### 🎉 Eglence / Topluluk
- **Seviye (XP) sistemi**: mesaj/ses aktivitesine gore seviye kazanma,
  `/rank` ile kart gorseli.
- **Ekonomi sistemi**: gunluk odul, sanal para, kucuk bir "market".
- **Anket / cekilis**: `/anket` ve `/cekilis` ile emoji tabanli
  katilim sistemleri.
- **Starboard**: cok begenilen mesajlari ozel bir kanalda sergileme.
- **Dogum gunu / ozel gun kutlamasi**: kayitli tarihe gore otomatik
  kutlama mesaji.

### 🤖 Yapay Zeka / Yardimci
- **`/sor soru`**: bir AI API'siyle (orn. OpenAI) entegre soru-cevap
  komutu.
- **Hatirlatici**: `/hatirlat sure mesaj` ile belirtilen surede DM/kanal
  hatirlatmasi.
- **Ceviri**: bir mesaja tepki verince otomatik ceviri gosterme.

### 🎫 Destek Sistemi
- **Ticket sistemi**: butonla ozel destek kanali acma, yetkilileri
  otomatik ekleme.
- **SSS/otomatik yanit**: belirli anahtar kelimelere otomatik cevap
  verme.

Bunlarin hepsi ayni desende ilerler: `src/commands/<kategori>/` altina
yeni bir dosya, gerekirse `src/config/` altina bir ayar dosyasi,
metinler icin `src/locales/tr.json`'a birkac satir. Hangisiyle
baslamak istedigini soylersen birlikte kodlayabiliriz.

## 🛠️ Kullanilan Teknolojiler

- [discord.js v14](https://discord.js.org/)
- [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice) (`/join`, `/leave` sesli kanal baglantisi)
- [libsodium-wrappers](https://www.npmjs.com/package/libsodium-wrappers) (ses baglantisi sifrelemesi)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [pm2](https://pm2.keymetrics.io/) (production surec yoneticisi)

## 📄 Lisans

MIT
