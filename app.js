/**
 * Streams / local MP3s
 * NOTE: use absolute paths for local media ("/media/...") so they work everywhere.
 */
const STREAMS = [
  {
    id: "live",
    name: "Live Gurdwara",
    url: "/media/hazuri1.mp3",
  },
  {
    id: "asa",
    name: "Asa Ki Vaar",
    url: "/media/Asa_Ki_Vaar_Rajan_Singh.mp3",
  },
  {
    id: "rehraas",
    name: "Rehraas Sahib",
    url: "https://YOUR_STREAM_URL_HERE/rehraas.mp3",
  },
  {
    id: "sohila",
    name: "Sohila / Night Simran",
    url: "https://YOUR_STREAM_URL_HERE/sohila.mp3",
  },
  {
    id: "morning",
    name: "Morning Nitnem",
    // Directory stream: files discovered at runtime by scanning this folder.
    url: "/media/morning_nitnem/",
  },
  {
    id: "tabla",
    name: "Tabla / Harmonium",
    url: "https://YOUR_STREAM_URL_HERE/tabla.mp3",
  },
];

const SCHEDULE = [
  { id: "morning", label: "Amrit Vela → Morning Nitnem", startHour: 4, endHour: 6 },
  { id: "asa", label: "Morning → Asa Ki Vaar", startHour: 6, endHour: 12 },
  { id: "live", label: "Daytime → Live Gurdwara", startHour: 12, endHour: 18 },
  { id: "rehraas", label: "Evening → Rehraas Sahib", startHour: 18, endHour: 21 },
  { id: "sohila", label: "Night → Sohila / Simran", startHour: 21, endHour: 3 },
];

const SUPPORTED_AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".m4a",
  ".aac",
  ".wav",
  ".ogg",
  ".flac",
]);

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const streamName = document.getElementById("streamName");
const chips = document.getElementById("chips");
const vol = document.getElementById("vol");

// OPTIONAL UI button (only if you add it to HTML)
const scheduleToggle = document.getElementById("scheduleToggle");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const hint = document.getElementById("hint");

let current = STREAMS[0];
let userPaused = true;
let autoScheduleEnabled = true;
let scheduleTimer = null;

// Directory playlist state
let currentTrackIndex = 0;
let activeTrackList = [];
let directoryLoadToken = 0;

// Tracking
const playedByStream = new Map();       // streamId -> Set(url)
const directoryTrackCache = new Map();  // directoryPath -> [trackUrls]

function isDirectoryStream(stream) {
  return typeof stream?.url === "string" && stream.url.endsWith("/");
}

function getTrackNameFromUrl(url) {
  const cleanUrl = url.split("?")[0].split("#")[0];
  const parts = cleanUrl.split("/");
  return parts[parts.length - 1] || cleanUrl;
}

function hasSupportedAudioExtension(url) {
  const pathname = new URL(url, window.location.href).pathname.toLowerCase();
  for (const ext of SUPPORTED_AUDIO_EXTENSIONS) {
    if (pathname.endsWith(ext)) return true;
  }
  return false;
}

function getDirectoryUrl(directoryPath) {
  return new URL(directoryPath, window.location.href);
}

function parseDirectoryTracks(html, directoryPath) {
  const directoryUrl = getDirectoryUrl(directoryPath);
  const doc = new DOMParser().parseFromString(html, "text/html");

  const links = [...doc.querySelectorAll("a[href]")]
    .map((link) => link.getAttribute("href"))
    .filter(Boolean)
    .map((href) => new URL(href, directoryUrl).toString())
    .filter((absoluteUrl) => {
      if (!hasSupportedAudioExtension(absoluteUrl)) return false;
      const absolute = new URL(absoluteUrl);
      return absolute.pathname.startsWith(directoryUrl.pathname);
    });

  return [...new Set(links)].sort();
}

async function scanDirectoryTracks(directoryPath) {
  if (directoryTrackCache.has(directoryPath)) {
    return directoryTrackCache.get(directoryPath);
  }

  const response = await fetch(directoryPath, { cache: "no-store" });
  if (!response.ok) throw new Error(`Directory scan failed: ${response.status}`);

  const html = await response.text();
  const tracks = parseDirectoryTracks(html, directoryPath);

  directoryTrackCache.set(directoryPath, tracks);
  return tracks;
}

function markCurrentTrackPlayed() {
  if (!isDirectoryStream(current) || !activeTrackList.length) return;

  if (!playedByStream.has(current.id)) {
    playedByStream.set(current.id, new Set());
  }
  const currentTrack = activeTrackList[currentTrackIndex];
  playedByStream.get(current.id).add(currentTrack);
}

function updateNowPlayingText() {
  if (!isDirectoryStream(current) || !activeTrackList.length) {
    streamName.textContent = current.name;
    return;
  }
  const trackName = getTrackNameFromUrl(activeTrackList[currentTrackIndex]);
  streamName.textContent = `${current.name} • ${trackName}`;
}

function updateDirectoryTrackingHint() {
  if (!isDirectoryStream(current) || !activeTrackList.length) return;

  const playedCount = playedByStream.get(current.id)?.size || 0;
  hint.textContent = `Track ${currentTrackIndex + 1}/${activeTrackList.length} • Played ${playedCount}/${activeTrackList.length}`;
}

function setStatus(state, text) {
  statusDot.classList.remove("playing", "loading", "error");
  if (state) statusDot.classList.add(state);
  statusText.textContent = text;
}

function setIcons(isPlaying) {
  playIcon.style.display = isPlaying ? "none" : "block";
  pauseIcon.style.display = isPlaying ? "block" : "none";
}

function buildChips() {
  chips.innerHTML = "";
  STREAMS.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (s.id === current.id ? " active" : "");
    btn.textContent = s.name;
    btn.onclick = () => selectStream(s.id, { manual: true });
    chips.appendChild(btn);
  });
}

async function prepareDirectoryStream(stream, { shouldAutoplay = false } = {}) {
  const requestToken = ++directoryLoadToken;

  activeTrackList = [];
  currentTrackIndex = 0;
  audio.src = "";

  setStatus("loading", "Scanning…");
  hint.textContent = "Scanning directory for audio files…";

  try {
    const tracks = await scanDirectoryTracks(stream.url);

    // If user switched streams while we were fetching, ignore the result.
    if (requestToken !== directoryLoadToken || current.id !== stream.id) return;

    activeTrackList = tracks;

    if (!activeTrackList.length) {
      setStatus("error", "No tracks found");
      hint.textContent = "No playable audio files found in this directory.";
      setIcons(false);
      return;
    }

    audio.src = activeTrackList[0];
    updateNowPlayingText();

    if (shouldAutoplay) {
      playStream();
    } else {
      setStatus(null, "Paused");
      setIcons(false);
      updateDirectoryTrackingHint();
    }
  } catch (err) {
    console.error(err);
    if (requestToken !== directoryLoadToken || current.id !== stream.id) return;
    setStatus("error", "Scan failed");
    setIcons(false);
    hint.textContent = "Could not scan directory. Enable nginx autoindex for this folder.";
  }
}

function selectStream(streamId, options = {}) {
  const next = STREAMS.find((s) => s.id === streamId);
  if (!next) return;

  if (options.manual) {
    autoScheduleEnabled = false;
    updateScheduleToggle();
  }

  current = next;

  // chip UI
  [...chips.children].forEach((c, i) => {
    c.classList.toggle("active", STREAMS[i].id === current.id);
  });

  // Directory playlist
  if (isDirectoryStream(current)) {
    prepareDirectoryStream(current, {
      shouldAutoplay: !userPaused && !options.skipAutoplay,
    });
    return;
  }

  // Cancel any directory scan in progress
  directoryLoadToken += 1;
  activeTrackList = [];
  currentTrackIndex = 0;

  audio.src = current.url;
  updateNowPlayingText();

  if (!userPaused && !options.skipAutoplay) playStream();
  else {
    setStatus(null, "Paused");
    setIcons(false);
    if (autoScheduleEnabled) updateScheduleHint(getScheduledStream());
  }
}

async function playStream() {
  try {
    // Directory: set current track source before playing
    if (isDirectoryStream(current)) {
      if (!activeTrackList.length) {
        setStatus("error", "No tracks found");
        hint.textContent = "No playable audio files found in this directory.";
        setIcons(false);
        return;
      }
      audio.src = activeTrackList[currentTrackIndex];
      updateNowPlayingText();
    }

    setStatus("loading", "Loading…");
    hint.textContent = "Loading…";
    await audio.play();

    userPaused = false;
    setStatus("playing", "Playing");
    setIcons(true);

    if (isDirectoryStream(current)) {
      markCurrentTrackPlayed();
      updateDirectoryTrackingHint();
    } else {
      hint.textContent = "Listening. Switch filters anytime.";
    }
  } catch (err) {
    console.error(err);
    userPaused = true;
    setStatus("error", "Can’t play");
    setIcons(false);
    hint.textContent = "Playback failed. Check the URL / HTTPS / format.";
  }
}

function pauseStream() {
  audio.pause();
  userPaused = true;
  setStatus(null, "Paused");
  setIcons(false);
  hint.textContent = "Paused.";
}

function getScheduledStream(date = new Date()) {
  const hour = date.getHours();
  const match = SCHEDULE.find((entry) => {
    if (entry.startHour < entry.endHour) {
      return hour >= entry.startHour && hour < entry.endHour;
    }
    return hour >= entry.startHour || hour < entry.endHour;
  });
  return match || SCHEDULE[0];
}

function updateScheduleHint(entry) {
  if (!entry) return;
  hint.textContent = `Schedule: ${entry.label}`;
}

function updateScheduleToggle() {
  if (!scheduleToggle) return; // <-- prevents crash if button doesn't exist
  scheduleToggle.classList.toggle("active", autoScheduleEnabled);
  scheduleToggle.setAttribute("aria-pressed", autoScheduleEnabled ? "true" : "false");
}

function applySchedule({ shouldPlay } = {}) {
  if (!autoScheduleEnabled) return;

  const entry = getScheduledStream();

  if (current.id !== entry.id) {
    selectStream(entry.id, { skipAutoplay: !shouldPlay });
    return;
  }

  if (shouldPlay && !audio.paused) return;

  if (shouldPlay) playStream();
  else updateScheduleHint(entry);
}

function startScheduleTimer() {
  if (scheduleTimer) window.clearInterval(scheduleTimer);
  scheduleTimer = window.setInterval(() => {
    if (!autoScheduleEnabled) return;
    applySchedule({ shouldPlay: !userPaused });
  }, 60 * 1000);
}

/* UI events */
playBtn.onclick = () => {
  if (audio.paused) playStream();
  else pauseStream();
};

vol.oninput = () => {
  audio.volume = Number(vol.value);
};

/* Audio events */
audio.addEventListener("waiting", () => {
  if (!audio.paused) setStatus("loading", "Buffering…");
});

audio.addEventListener("playing", () => {
  if (!audio.paused) {
    setStatus("playing", "Playing");
    if (isDirectoryStream(current)) {
      markCurrentTrackPlayed();
      updateDirectoryTrackingHint();
      updateNowPlayingText();
    }
  }
});

audio.addEventListener("pause", () => {
  if (userPaused) setStatus(null, "Paused");
});

audio.addEventListener("error", () => {
  setStatus("error", "Stream error");
  setIcons(false);
});

audio.addEventListener("ended", () => {
  if (!isDirectoryStream(current) || !activeTrackList.length) return;

  currentTrackIndex = (currentTrackIndex + 1) % activeTrackList.length;
  playStream();
});

/* Schedule toggle (only if exists) */
if (scheduleToggle) {
  scheduleToggle.addEventListener("click", () => {
    autoScheduleEnabled = !autoScheduleEnabled;
    updateScheduleToggle();

    if (autoScheduleEnabled) {
      applySchedule({ shouldPlay: !userPaused });
    } else if (userPaused) {
      hint.textContent = "Paused.";
    }
  });
}

/* Init */
audio.volume = Number(vol.value);
buildChips();
updateScheduleToggle();
setStatus(null, "Paused");
setIcons(false);

// Apply schedule selection immediately on load (without auto-playing)
applySchedule({ shouldPlay: false });

// Load first stream
selectStream(getScheduledStream().id, { skipAutoplay: true });

// Start schedule timer
startScheduleTimer();