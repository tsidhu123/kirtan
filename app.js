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
    url: "media/morning_nitnem",
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
  streamName.textContent = current.name;
  audio.src = current.url;

  [...chips.children].forEach((c, i) => {
    c.classList.toggle("active", STREAMS[i].id === current.id);
  });

  if (!userPaused && !options.skipAutoplay) playStream();
  else {
    setStatus(null, "Paused");
    setIcons(false);
    if (autoScheduleEnabled) updateScheduleHint(getScheduledStream());
  }
}

async function playStream() {
  try {
    setStatus("loading", "Loading…");
    hint.textContent = "Loading stream…";
    await audio.play();
    userPaused = false;
    setStatus("playing", "Playing");
    setIcons(true);
    hint.textContent = "Listening. Switch filters anytime.";
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
  if (!audio.paused) setStatus("playing", "Playing");
});
audio.addEventListener("pause", () => {
  if (userPaused) setStatus(null, "Paused");
});
audio.addEventListener("error", () => {
  setStatus("error", "Stream error");
  setIcons(false);
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
streamName.textContent = current.name;
audio.src = current.url;
buildChips();
if (userPaused) {
  setStatus(null, "Paused");
  setIcons(false);
}
updateScheduleToggle();
startScheduleTimer();
