const { Agent, setGlobalDispatcher } = require("undici");

/**
 * Bazi ISS'lerde (ozellikle Turkiye'de) Node.js'in TLS baglantilari
 * discord.com'a normalden çok daha yavas kuruluyor (ilk baglantida
 * birkac / on birkac saniye suruyor, sonraki istekler ayni soket acik
 * kaldigi surece çok hizli - yaklasik ~30ms). undici'nin varsayilan
 * 10 saniyelik connect timeout'u ve SADECE 4 saniyelik keep-alive
 * bosta kalma suresi bu kosullarda iki soruna yol aciyor:
 *
 *   1) Ilk baglanti kurulurken ConnectTimeoutError (10sn cok kisa).
 *   2) Iki komut arasinda 4 saniyeden fazla sure gecerse soket
 *      kapaniyor ve bir sonraki komutta baglanti sifirdan (yavas)
 *      kuruluyor; bu da Discord'un 3 saniyelik etkilesim yanit
 *      suresini asip "Unknown interaction" hatasina yol aciyor.
 *
 * Asagidaki ayarlar baglanti zaman asimini uzatir VE kurulan
 * baglantiyi uzun sure (bosta kalsa bile) acik tutarak sonraki
 * komutlarin ayni hizli soketi yeniden kullanmasini saglar.
 *
 * Sorunun kalici/kesin cozumu genelde bir VPN kullanmak ya da botu
 * yurt disi bir sunucuda (VPS) calistirmaktir; bu ayarlar sadece
 * gecici yavasliklara karsi bir dayaniklilik onlemidir.
 */
setGlobalDispatcher(
  new Agent({
    connect: { timeout: 30_000 },
    headersTimeout: 30_000,
    bodyTimeout: 30_000,
    keepAliveTimeout: 10 * 60 * 1000, // 10 dakika bosta kalsa da baglantiyi kapatma
    keepAliveMaxTimeout: 10 * 60 * 1000,
  })
);
