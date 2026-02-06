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
    id: "slow",
    name: "Slow / Naam Simran",
    url: "https://YOUR_STREAM_URL_HERE/slow.mp3",
  },
  {
    id: "tabla",
    name: "Tabla / Harmonium",
    url: "https://YOUR_STREAM_URL_HERE/tabla.mp3",
  },
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const streamName = document.getElementById("streamName");
const chips = document.getElementById("chips");
const vol = document.getElementById("vol");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const hint = document.getElementById("hint");

let current = STREAMS[0];
let userPaused = true;

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
    btn.onclick = () => selectStream(s.id);
    chips.appendChild(btn);
  });
}

function selectStream(streamId) {
  const next = STREAMS.find((s) => s.id === streamId);
  if (!next) return;

  current = next;
  streamName.textContent = current.name;
  audio.src = current.url;

  [...chips.children].forEach((c, i) => {
    c.classList.toggle("active", STREAMS[i].id === current.id);
  });

  if (!userPaused) playStream();
  else {
    setStatus(null, "Paused");
    setIcons(false);
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

audio.volume = Number(vol.value);
streamName.textContent = current.name;
audio.src = current.url;
buildChips();
setStatus(null, "Paused");
setIcons(false);
