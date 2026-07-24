const http = require("node:http");
const https = require("node:https");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  getVoiceConnection,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  entersState,
  VoiceConnectionStatus,
  demuxProbe,
} = require("@discordjs/voice");
const lofiStreams = require("../config/lofiStreams");

const REQUEST_HEADERS = {
  "User-Agent": "sharks-bot/1.0 (Discord community bot; lofi radio)",
  Accept: "audio/mpeg,audio/*,*/*",
  "Icy-MetaData": "1",
};

/** @type {Map<string, { player: import("@discordjs/voice").AudioPlayer, streamIndex: number, volume: number, starting: boolean }>} */
const sessions = new Map();

function requestStream(url, redirectLimit = 5) {
  return new Promise((resolve, reject) => {
    if (redirectLimit <= 0) {
      reject(new Error("Too many redirects"));
      return;
    }

    const lib = url.startsWith("https:") ? https : http;

    const req = lib.get(url, { headers: REQUEST_HEADERS }, (res) => {
      const { statusCode, headers } = res;

      if (statusCode && statusCode >= 300 && statusCode < 400 && headers.location) {
        res.resume();
        const nextUrl = new URL(headers.location, url).href;
        requestStream(nextUrl, redirectLimit - 1).then(resolve).catch(reject);
        return;
      }

      if (statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${statusCode} for ${url}`));
        return;
      }

      resolve(res);
    });

    req.setTimeout(30_000, () => {
      req.destroy(new Error(`Connection timed out for ${url}`));
    });
    req.on("error", reject);
  });
}

async function createResourceFromUrl(url) {
  const stream = await requestStream(url);
  const probe = await demuxProbe(stream);
  return createAudioResource(probe.stream, {
    inputType: probe.type,
    inlineVolume: true,
  });
}

function attachPlayerHandlers(guildId, connection, player, streamIndex) {
  player.removeAllListeners();

  player.on(AudioPlayerStatus.Idle, () => {
    const session = sessions.get(guildId);
    if (!session || session.starting) return;

    const nextIndex = session.streamIndex + 1;
    startPlayback(guildId, connection, nextIndex).catch((error) => {
      console.error(`[muzik] ${guildId} sunucusunda yeniden calma basarisiz:`, error.message);
    });
  });

  player.on("error", (error) => {
    console.warn(`[muzik] Oynatici hatasi (${lofiStreams[streamIndex]?.name ?? "?"}):`, error.message);
    const session = sessions.get(guildId);
    if (!session || session.starting) return;

    const nextIndex = session.streamIndex + 1;
    startPlayback(guildId, connection, nextIndex).catch((retryError) => {
      console.error(`[muzik] ${guildId} yedek akisa gecilemedi:`, retryError.message);
    });
  });
}

async function startPlayback(guildId, connection, streamIndex = 0) {
  let session = sessions.get(guildId);
  if (!session) {
    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play },
    });
    session = { player, streamIndex: 0, volume: 1, starting: false };
    sessions.set(guildId, session);
  }

  session.starting = true;
  let lastError;

  for (let attempt = 0; attempt < lofiStreams.length; attempt++) {
    const index = (streamIndex + attempt) % lofiStreams.length;
    const source = lofiStreams[index];

    try {
      const resource = await createResourceFromUrl(source.url);
      resource.volume?.setVolume(session.volume);

      session.streamIndex = index;
      session.starting = false;
      attachPlayerHandlers(guildId, connection, session.player, index);
      session.player.play(resource);
      connection.subscribe(session.player);

      console.log(`[muzik] ${guildId} -> ${source.name}`);
      return session.player;
    } catch (error) {
      lastError = error;
      console.warn(`[muzik] Akis basarisiz (${source.name}):`, error.message);
    }
  }

  session.starting = false;
  throw lastError ?? new Error("Hicbir lofi akisi calinamadi.");
}

async function playLofi(voiceChannel) {
  const guildId = voiceChannel.guild.id;

  let connection = getVoiceConnection(guildId);
  if (!connection) {
    connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
  }

  await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
  await startPlayback(guildId, connection, 0);
  return connection;
}

function stopMusic(guildId) {
  const session = sessions.get(guildId);
  if (session?.player) {
    session.player.stop();
    session.player.removeAllListeners();
  }
  sessions.delete(guildId);

  const connection = getVoiceConnection(guildId);
  if (connection) {
    connection.destroy();
  }
}

function setVolume(guildId, volume) {
  const session = sessions.get(guildId);
  if (!session) return false;
  session.volume = volume;
  const resource = session.player.state.resource;
  resource?.volume?.setVolume(volume);
  return true;
}

function isPlaying(guildId) {
  const session = sessions.get(guildId);
  const status = session?.player?.state?.status;
  return status === AudioPlayerStatus.Playing || status === AudioPlayerStatus.Buffering;
}

module.exports = {
  playLofi,
  stopMusic,
  setVolume,
  isPlaying,
};
