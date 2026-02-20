/**
 * Streams / local MP3s
 */
const STREAMS = [
  {
    id: "live",
    name: "Live Gurdwara",
    url: "media/hazuri1.mp3",
  },
  {
    id: "asa",
    name: "Asa Ki Vaar",
    url: "media/Asa_Ki_Vaar_Rajan_Singh.mp3",
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
    url: "media/morning_nitnem/",
    files: [
      "Japji_Sahib.mp3",
      "Jaap_Sahib.mp3",
      "Tav-Prasad_Savaiye.mp3",
      "Chaupai_Sahib.mp3",
      "Anand_Sahib.mp3",
    ],
  },
  {
    id: "tabla",
    name: "Tabla / Harmonium",
    url: "https://YOUR_STREAM_URL_HERE/tabla.mp3",
  },
];

const SCHEDULE = [
  {
    id: "morning",
    label: "Amrit Vela → Morning Nitnem",
    startHour: 4,
    endHour: 6,
  },
  {
    id: "asa",
    label: "Morning → Asa Ki Vaar",
    startHour: 6,
    endHour: 12,
  },
  {
    id: "live",
    label: "Daytime → Live Gurdwara",
    startHour: 12,
    endHour: 18,
  },
  {
    id: "rehraas",
    label: "Evening → Rehraas Sahib",
    startHour: 18,
    endHour: 21,
  },
  {
    id: "sohila",
    label: "Night → Sohila / Simran",
    startHour: 21,
    endHour: 3,
  },
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const streamName = document.getElementById("streamName");
const chips = document.getElementById("chips");
const vol = document.getElementById("vol");
const scheduleToggle = document.getElementById("scheduleToggle");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const hint = document.getElementById("hint");

let current = STREAMS[0];
let userPaused = true;
let autoScheduleEnabled = true;
let scheduleTimer = null;
let currentTrackIndex = 0;
let activeTrackList = [];

const playedByStream = new Map();

function isDirectoryStream(stream) {
  return stream.url.endsWith("/");
}

function getTrackNameFromUrl(url) {
  const cleanUrl = url.split("?")[0].split("#")[0];
  const parts = cleanUrl.split("/");
  return parts[parts.length - 1] || cleanUrl;
}

function getDirectoryTracks(stream) {
  if (!isDirectoryStream(stream)) return [];
  if (!Array.isArray(stream.files)) return [];
  return stream.files.map((file) => `${stream.url}${file}`);
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

function selectStream(streamId, options = {}) {
  const next = STREAMS.find((s) => s.id === streamId);
  if (!next) return;

  if (options.manual) {
    autoScheduleEnabled = false;
    updateScheduleToggle();
  }

  current = next;

  if (isDirectoryStream(current)) {
    activeTrackList = getDirectoryTracks(current);
    currentTrackIndex = 0;
    audio.src = activeTrackList[0] || "";
  } else {
    activeTrackList = [];
    currentTrackIndex = 0;
    audio.src = current.url;
  }

  updateNowPlayingText();

  [...chips.children].forEach((c, i) => {
    c.classList.toggle("active", STREAMS[i].id === current.id);
  });

  if (!userPaused && !options.skipAutoplay) playStream();
  else {
    setStatus(null, "Paused");
    setIcons(false);
    if (isDirectoryStream(current) && activeTrackList.length) {
      updateDirectoryTrackingHint();
    } else if (autoScheduleEnabled) {
      updateScheduleHint(getScheduledStream());
    }
  }
}

async function playStream() {
  try {
    if (isDirectoryStream(current)) {
      if (!activeTrackList.length) {
        setStatus("error", "No tracks found");
        hint.textContent = "No files configured for this directory.";
        return;
      }
      audio.src = activeTrackList[currentTrackIndex];
      updateNowPlayingText();
    }

    setStatus("loading", "Loading…");
    hint.textContent = "Loading stream…";
    await audio.play();
    userPaused = false;
    markCurrentTrackPlayed();
    setStatus("playing", "Playing");
    setIcons(true);

    if (isDirectoryStream(current)) {
      updateDirectoryTrackingHint();
    } else {
      hint.textContent = "Listening. Switch filters anytime.";
    }
  } catch (err) {
    console.error(err);
    userPaused = true;
    setStatus("error", "Can’t play");
    setIcons(false);
    hint.textContent = "Playback failed. Check the stream URL.";
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
  scheduleToggle.classList.toggle("active", autoScheduleEnabled);
  scheduleToggle.setAttribute(
    "aria-pressed",
    autoScheduleEnabled ? "true" : "false",
  );
}

function applySchedule({ shouldPlay } = {}) {
  if (!autoScheduleEnabled) return;
  const entry = getScheduledStream();
  if (current.id !== entry.id) {
    selectStream(entry.id, { skipAutoplay: !shouldPlay });
  }
  if (shouldPlay) {
    playStream();
  } else {
    updateScheduleHint(entry);
  }
}

function startScheduleTimer() {
  if (scheduleTimer) window.clearInterval(scheduleTimer);
  scheduleTimer = window.setInterval(() => {
    if (!autoScheduleEnabled) return;
    applySchedule({ shouldPlay: !userPaused });
  }, 60 * 1000);
}

playBtn.onclick = () => {
  if (audio.paused) playStream();
  else pauseStream();
};

vol.oninput = () => {
  audio.volume = Number(vol.value);
};

audio.addEventListener("waiting", () => {
  if (!audio.paused) setStatus("loading", "Buffering…");
});
audio.addEventListener("playing", () => {
  if (!audio.paused) {
    markCurrentTrackPlayed();
    setStatus("playing", "Playing");
    if (isDirectoryStream(current)) {
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

scheduleToggle.addEventListener("click", () => {
  autoScheduleEnabled = !autoScheduleEnabled;
  updateScheduleToggle();
  if (autoScheduleEnabled) {
    applySchedule({ shouldPlay: !userPaused });
  } else if (userPaused) {
    hint.textContent = "Paused.";
  }
});

audio.volume = Number(vol.value);
applySchedule({ shouldPlay: false });
if (!current) current = STREAMS[0];
if (isDirectoryStream(current)) {
  activeTrackList = getDirectoryTracks(current);
  audio.src = activeTrackList[0] || "";
} else {
  audio.src = current.url;
}
updateNowPlayingText();
buildChips();
if (userPaused) {
  setStatus(null, "Paused");
  setIcons(false);
}
updateScheduleToggle();
startScheduleTimer();
