const STORAGE_KEYS = {
  playlist: "kirtan_playlist_v1",
  recent: "kirtan_recent_v1",
  auth: "kirtan_auth_v1",
};

const TRACKS = [
  {
    id: "live-harmandir",
    title: "Sri Harmandir Sahib Live",
    category: "Live Streams",
    artist: "SGPC",
    type: "live",
    url: "media/hazuri1.mp3",
    translation: "Live Gurbani broadcast from Sri Harmandir Sahib.",
    description: "Sacred live stream; availability may vary with seva schedule.",
    tags: ["live", "harmandir", "amritsar"],
    duration: "Live",
    language: "Punjabi",
    paathName: "Live Kirtan",
  },
  {
    id: "nitnem-japji",
    title: "Japji Sahib",
    category: "Nitnem",
    artist: "Traditional Recitation",
    type: "track",
    url: "media/morning_nitnem/Japji_Sahib.mp3",
    translation: "Contemplation on truth, discipline, and divine hukam.",
    description: "Foundational morning paath revealed by Guru Nanak Dev Ji.",
    tags: ["nitnem", "morning", "paath"],
    duration: "18:00",
    language: "Gurmukhi/Punjabi",
    paathName: "Japji Sahib",
  },
  {
    id: "nitnem-jaap",
    title: "Jaap Sahib",
    category: "Nitnem",
    artist: "Traditional Recitation",
    type: "track",
    url: "media/morning_nitnem/Jaap_Sahib.mp3",
    translation: "Praise of the timeless, formless, fearless Creator.",
    description: "Composed by Guru Gobind Singh Ji in Dasam Bani.",
    tags: ["nitnem", "paath"],
    duration: "20:00",
    language: "Braj/Punjabi",
    paathName: "Jaap Sahib",
  },
  {
    id: "nitnem-tavprasad",
    title: "Tav Prasad Savaiye",
    category: "Nitnem",
    artist: "Traditional Recitation",
    type: "track",
    url: "media/morning_nitnem/Tav-Prasad_Savaiye.mp3",
    translation: "Remembrance of the Divine beyond ritualistic identity.",
    description: "Part of daily Nitnem emphasizing sincere devotion.",
    tags: ["nitnem", "paath"],
    duration: "7:00",
    language: "Braj/Punjabi",
    paathName: "Tav Prasad Savaiye",
  },
  {
    id: "nitnem-chaupai",
    title: "Chaupai Sahib",
    category: "Nitnem",
    artist: "Traditional Recitation",
    type: "track",
    url: "media/morning_nitnem/Chaupai_Sahib.mp3",
    translation: "Prayer of protection, grace, and spiritual courage.",
    description: "Read daily for strength and divine shelter.",
    tags: ["nitnem", "paath"],
    duration: "10:00",
    language: "Braj/Punjabi",
    paathName: "Chaupai Sahib",
  },
  {
    id: "nitnem-anand",
    title: "Anand Sahib",
    category: "Nitnem",
    artist: "Traditional Recitation",
    type: "track",
    url: "media/morning_nitnem/Anand_Sahib.mp3",
    translation: "Song of bliss through living in Divine awareness.",
    description: "Celebration of inner joy through Guru’s wisdom.",
    tags: ["nitnem", "bliss"],
    duration: "15:00",
    language: "Punjabi",
    paathName: "Anand Sahib",
  },
  {
    id: "rehraas-rajansingh",
    title: "Rehraas Sahib (Evening Recitation)",
    category: "Rehraas Sahib",
    artist: "Bhai Rajan Singh",
    type: "track",
    url: "media/Asa_Ki_Vaar_Rajan_Singh.mp3",
    translation: "Evening prayer of gratitude and resilience.",
    description: "Traditional evening Nitnem bani.",
    tags: ["rehraas", "evening", "nitnem"],
    duration: "22:00",
    language: "Punjabi",
    paathName: "Rehraas Sahib",
  },
  {
    id: "sohila-night",
    title: "Kirtan Sohila",
    category: "Nitnem",
    artist: "Traditional Recitation",
    type: "track",
    url: "https://YOUR_STREAM_URL_HERE/sohila.mp3",
    translation: "Night prayer surrendering the day to Waheguru.",
    description: "Bedtime bani for peace and remembrance.",
    tags: ["night", "nitnem"],
    duration: "8:00",
    language: "Punjabi",
    paathName: "Kirtan Sohila",
  },
  {
    id: "tabla-flow",
    title: "Tabla Harmonium Simran Flow",
    category: "Tabla/Harmonium",
    artist: "Sevadar Ensemble",
    type: "track",
    url: "https://YOUR_STREAM_URL_HERE/tabla.mp3",
    translation: "Instrumental support for focused simran and contemplation.",
    description: "Soft tabla-harmonium loop.",
    tags: ["instrumental", "tabla", "harmonium"],
    duration: "31:00",
    language: "Instrumental",
    paathName: "Instrumental",
  },
  {
    id: "tanti-saaj-raagi",
    title: "Tanti Saaj Reflection",
    category: "Tanti Saaj",
    artist: "Raagi Jatha",
    type: "track",
    url: "https://YOUR_STREAM_URL_HERE/tanti.mp3",
    translation: "String-based kirtan atmosphere for deep listening.",
    description: "Traditional string ensemble flavor.",
    tags: ["instrumental", "tanti", "raag"],
    duration: "26:00",
    language: "Instrumental",
    paathName: "Instrumental",
  },
  {
    id: "akj-raag",
    title: "AKJ Style Asa Simran",
    category: "AKJ Style Kirtan",
    artist: "AKJ Jatha",
    type: "track",
    url: "https://YOUR_STREAM_URL_HERE/akj.mp3",
    translation: "Energetic sangat-centered kirtan style with deep simran focus.",
    description: "AKJ-inspired live-style recording.",
    tags: ["akj", "kirtan", "simran"],
    duration: "34:00",
    language: "Punjabi",
    paathName: "Kirtan",
  },
  {
    id: "playlist-featured",
    title: "Morning Playlist Starter",
    category: "Playlists",
    artist: "Curated",
    type: "track",
    url: "media/morning_nitnem/Japji_Sahib.mp3",
    translation: "Starter selection for calm early listening.",
    description: "Curated track placeholder for playlists category.",
    tags: ["playlist", "morning"],
    duration: "18:00",
    language: "Punjabi",
    paathName: "Playlist Track",
  },
];

const CATEGORIES = [
  "All",
  "Live Streams",
  "Nitnem",
  "Rehraas Sahib",
  "Instrumentals",
  "AKJ Style Kirtan",
  "Tanti Saaj",
  "Tabla/Harmonium",
  "Playlists",
];

const SCHEDULE = [
  { label: "Amrit Vela", start: 3, end: 6, category: "Nitnem" },
  { label: "Morning", start: 6, end: 12, category: "Live Streams" },
  { label: "Evening", start: 18, end: 21, category: "Rehraas Sahib" },
  { label: "Night", start: 21, end: 3, category: "Nitnem" },
];

const state = {
  currentTrackId: TRACKS[0].id,
  search: "",
  category: "All",
  playlist: loadJson(STORAGE_KEYS.playlist, []),
  recent: loadJson(STORAGE_KEYS.recent, []),
  auth: loadJson(STORAGE_KEYS.auth, null),
  authMode: "login",
};

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const statusPill = document.getElementById("statusPill");
const sourceLabel = document.getElementById("sourceLabel");
const nowTitle = document.getElementById("nowTitle");
const nowMeta = document.getElementById("nowMeta");
const volume = document.getElementById("volume");
const quickCategory = document.getElementById("quickCategory");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const categoryChips = document.getElementById("categoryChips");
const catalogList = document.getElementById("catalogList");
const nitnemList = document.getElementById("nitnemList");
const translationTitle = document.getElementById("translationTitle");
const translationMeta = document.getElementById("translationMeta");
const translationText = document.getElementById("translationText");
const playlistList = document.getElementById("playlistList");
const playlistName = document.getElementById("playlistName");
const savePlaylistBtn = document.getElementById("savePlaylistBtn");
const recentList = document.getElementById("recentList");
const scheduleText = document.getElementById("scheduleText");
const playRecommendationBtn = document.getElementById("playRecommendationBtn");
const authBtn = document.getElementById("authBtn");
const authDialog = document.getElementById("authDialog");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const toggleAuthModeBtn = document.getElementById("toggleAuthModeBtn");
const donateTopBtn = document.getElementById("donateTopBtn");

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTrackById(id) {
  return TRACKS.find((track) => track.id === id) || TRACKS[0];
}

function setStatus(kind, text) {
  statusPill.className = `status ${kind}`;
  statusPill.textContent = text;
}

function getFilteredTracks() {
  const q = state.search.trim().toLowerCase();
  return TRACKS.filter((track) => {
    const inCategory = state.category === "All" || track.category === state.category;
    const mappedInstrumentals = state.category === "Instrumentals"
      ? ["Tabla/Harmonium", "Tanti Saaj"].includes(track.category)
      : false;

    const matchesCategory = state.category === "All" || inCategory || mappedInstrumentals;
    if (!matchesCategory) return false;

    if (!q) return true;
    const hay = `${track.title} ${track.artist} ${track.category} ${(track.tags || []).join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}

function renderCategoryControls() {
  quickCategory.innerHTML = "";
  categoryFilter.innerHTML = "";
  categoryChips.innerHTML = "";

  CATEGORIES.forEach((category) => {
    const optA = document.createElement("option");
    optA.value = category;
    optA.textContent = category;
    quickCategory.appendChild(optA);

    const optB = optA.cloneNode(true);
    categoryFilter.appendChild(optB);

    const chip = document.createElement("button");
    chip.className = `chip ${category === state.category ? "active" : ""}`;
    chip.textContent = category;
    chip.onclick = () => {
      state.category = category;
      categoryFilter.value = category;
      quickCategory.value = category;
      renderAll();
    };
    categoryChips.appendChild(chip);
  });

  categoryFilter.value = state.category;
  quickCategory.value = state.category;
}

function selectTrack(trackId, autoplay = false) {
  const track = getTrackById(trackId);
  state.currentTrackId = track.id;
  audio.src = track.url;
  sourceLabel.textContent = `Source: ${track.category} • ${track.artist}`;
  nowTitle.textContent = track.title;
  nowMeta.textContent = `${track.paathName} • ${track.duration} • ${track.language}`;

  translationTitle.textContent = track.title;
  translationMeta.textContent = `${track.paathName} — ${track.description}`;
  translationText.textContent = track.translation;

  addRecent(track.id);
  renderAll();

  if (autoplay) {
    playCurrent();
  }
}

async function playCurrent() {
  try {
    setStatus("loading", "Loading");
    await audio.play();
    setStatus("playing", "Playing");
    playBtn.textContent = "❚❚";
  } catch {
    setStatus("error", "Error");
    playBtn.textContent = "▶";
  }
}

function pauseCurrent() {
  audio.pause();
  setStatus("idle", "Paused");
  playBtn.textContent = "▶";
}

function addRecent(trackId) {
  const next = [trackId, ...state.recent.filter((id) => id !== trackId)].slice(0, 8);
  state.recent = next;
  saveJson(STORAGE_KEYS.recent, next);
}

function addToPlaylist(trackId) {
  if (!state.playlist.includes(trackId)) {
    state.playlist.push(trackId);
    saveJson(STORAGE_KEYS.playlist, state.playlist);
    renderPlaylist();
  }
}

function removeFromPlaylist(trackId) {
  state.playlist = state.playlist.filter((id) => id !== trackId);
  saveJson(STORAGE_KEYS.playlist, state.playlist);
  renderPlaylist();
}

function movePlaylistItem(trackId, direction) {
  const idx = state.playlist.indexOf(trackId);
  if (idx < 0) return;
  const swap = idx + direction;
  if (swap < 0 || swap >= state.playlist.length) return;
  [state.playlist[idx], state.playlist[swap]] = [state.playlist[swap], state.playlist[idx]];
  saveJson(STORAGE_KEYS.playlist, state.playlist);
  renderPlaylist();
}

function renderCatalog() {
  const tracks = getFilteredTracks();
  catalogList.innerHTML = "";

  if (!tracks.length) {
    catalogList.innerHTML = '<div class="rowItem"><strong>No results</strong><span class="rowMeta">Try broader search/filter.</span></div>';
    return;
  }

  tracks.forEach((track) => {
    const row = document.createElement("article");
    row.className = "rowItem";
    row.innerHTML = `
      <strong>${track.title}</strong>
      <div class="rowMeta">${track.category} • ${track.artist} • ${track.duration}</div>
      <div class="rowMeta">${track.tags.join(", ")}</div>
      <div class="rowActions">
        <button class="btn ghost" data-action="play">Play</button>
        <button class="btn" data-action="add">Add to playlist</button>
      </div>
    `;

    row.querySelector('[data-action="play"]').onclick = () => selectTrack(track.id, true);
    row.querySelector('[data-action="add"]').onclick = () => addToPlaylist(track.id);
    catalogList.appendChild(row);
  });
}

function renderNitnem() {
  const nitnemOrder = [
    "Japji Sahib",
    "Jaap Sahib",
    "Tav Prasad Savaiye",
    "Chaupai Sahib",
    "Anand Sahib",
    "Rehraas Sahib",
    "Kirtan Sohila",
  ];

  const nitnemTracks = nitnemOrder
    .map((name) => TRACKS.find((track) => track.paathName === name))
    .filter(Boolean);

  nitnemList.innerHTML = "";
  nitnemTracks.forEach((track) => {
    const row = document.createElement("div");
    row.className = "rowItem";
    row.innerHTML = `<strong>${track.paathName}</strong><span class="rowMeta">${track.artist}</span>`;
    row.onclick = () => selectTrack(track.id, true);
    nitnemList.appendChild(row);
  });
}

function renderPlaylist() {
  playlistList.innerHTML = "";
  if (!state.playlist.length) {
    playlistList.innerHTML = '<div class="rowItem"><span class="rowMeta">No tracks yet. Add from catalog.</span></div>';
    return;
  }

  state.playlist.forEach((id) => {
    const track = getTrackById(id);
    const row = document.createElement("div");
    row.className = "rowItem";
    row.innerHTML = `
      <strong>${track.title}</strong>
      <span class="rowMeta">${track.category} • ${track.artist}</span>
      <div class="rowActions">
        <button class="btn ghost" data-a="up">↑</button>
        <button class="btn ghost" data-a="down">↓</button>
        <button class="btn ghost" data-a="remove">Remove</button>
        <button class="btn" data-a="play">Play</button>
      </div>
    `;
    row.querySelector('[data-a="up"]').onclick = () => movePlaylistItem(id, -1);
    row.querySelector('[data-a="down"]').onclick = () => movePlaylistItem(id, 1);
    row.querySelector('[data-a="remove"]').onclick = () => removeFromPlaylist(id);
    row.querySelector('[data-a="play"]').onclick = () => selectTrack(id, true);
    playlistList.appendChild(row);
  });
}

function renderRecent() {
  recentList.innerHTML = "";
  if (!state.recent.length) {
    recentList.innerHTML = '<div class="rowItem"><span class="rowMeta">Nothing played yet.</span></div>';
    return;
  }

  state.recent.forEach((id) => {
    const track = getTrackById(id);
    const row = document.createElement("div");
    row.className = "rowItem";
    row.innerHTML = `<strong>${track.title}</strong><span class="rowMeta">${track.category}</span>`;
    row.onclick = () => selectTrack(id, true);
    recentList.appendChild(row);
  });
}

function getScheduleRecommendation(date = new Date()) {
  const hour = date.getHours();
  const slot = SCHEDULE.find((entry) => {
    if (entry.start < entry.end) return hour >= entry.start && hour < entry.end;
    return hour >= entry.start || hour < entry.end;
  }) || SCHEDULE[0];

  const recommended = TRACKS.find((track) => track.category === slot.category) || TRACKS[0];
  return { slot, recommended };
}

function renderSchedule() {
  const { slot, recommended } = getScheduleRecommendation();
  scheduleText.textContent = `${slot.label}: ${recommended.title} (${recommended.category})`;
  playRecommendationBtn.onclick = () => selectTrack(recommended.id, true);
}

function renderAuth() {
  if (state.auth) {
    authBtn.textContent = `${state.auth.name} • Log out`;
  } else {
    authBtn.textContent = "Sign in";
  }
}

function renderAll() {
  renderCategoryControls();
  renderCatalog();
  renderNitnem();
  renderPlaylist();
  renderRecent();
  renderSchedule();
  renderAuth();
}

playBtn.onclick = () => {
  if (audio.paused) playCurrent();
  else pauseCurrent();
};

volume.oninput = () => {
  audio.volume = Number(volume.value);
};

quickCategory.onchange = () => {
  state.category = quickCategory.value;
  categoryFilter.value = state.category;
  renderAll();
};

categoryFilter.onchange = () => {
  state.category = categoryFilter.value;
  quickCategory.value = state.category;
  renderAll();
};

searchInput.oninput = () => {
  state.search = searchInput.value;
  renderCatalog();
};

savePlaylistBtn.onclick = () => {
  const name = playlistName.value.trim() || "My Playlist";
  localStorage.setItem(`${STORAGE_KEYS.playlist}_name`, name);
  saveJson(STORAGE_KEYS.playlist, state.playlist);
  savePlaylistBtn.textContent = "Saved";
  setTimeout(() => {
    savePlaylistBtn.textContent = "Save";
  }, 900);
};

audio.addEventListener("waiting", () => setStatus("loading", "Buffering"));
audio.addEventListener("playing", () => {
  setStatus("playing", "Playing");
  playBtn.textContent = "❚❚";
});
audio.addEventListener("pause", () => {
  if (audio.currentTime > 0) {
    setStatus("idle", "Paused");
    playBtn.textContent = "▶";
  }
});
audio.addEventListener("error", () => setStatus("error", "Stream error"));
audio.addEventListener("ended", () => {
  const currentIndex = state.playlist.indexOf(state.currentTrackId);
  if (currentIndex >= 0 && currentIndex < state.playlist.length - 1) {
    selectTrack(state.playlist[currentIndex + 1], true);
  } else {
    pauseCurrent();
  }
});

authBtn.onclick = () => {
  if (state.auth) {
    state.auth = null;
    saveJson(STORAGE_KEYS.auth, null);
    renderAuth();
    return;
  }

  authDialog.showModal();
};

toggleAuthModeBtn.onclick = () => {
  state.authMode = state.authMode === "login" ? "signup" : "login";
  authTitle.textContent = state.authMode === "login" ? "Sign in" : "Create account";
  toggleAuthModeBtn.textContent =
    state.authMode === "login" ? "Need an account?" : "Have an account?";
};

authForm.onsubmit = (event) => {
  event.preventDefault();
  state.auth = {
    mode: state.authMode,
    name: authName.value.trim() || "Listener",
    email: authEmail.value.trim(),
  };
  saveJson(STORAGE_KEYS.auth, state.auth);
  authDialog.close();
  renderAuth();
};

donateTopBtn.onclick = () => {
  document.querySelector(".donationCard").scrollIntoView({ behavior: "smooth", block: "center" });
};

audio.volume = Number(volume.value);
const savedPlaylistName = localStorage.getItem(`${STORAGE_KEYS.playlist}_name`);
if (savedPlaylistName) playlistName.value = savedPlaylistName;
selectTrack(state.currentTrackId, false);
renderAll();
setStatus("idle", "Paused");
