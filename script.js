//* state

const state = { activeTrack: 0, initPlay: false };

//* selectors

const audio = document.getElementById("audio-player");

const ui = {
  // sliders
  seekBar: document.querySelector(".seek-slider input"),
  volumeBar: document.querySelector(".volume-slider input"),

  // buttons
  showPlayListBtn: document.querySelector(".show"),
  hidePlayListBtn: document.querySelector(".hide"),
  prevBtn: document.querySelector(".prev"),
  nextBtn: document.querySelector(".next"),
  playPauseBtn: document.querySelector(".play-pause"),

  // text and image
  playList: document.querySelector(".playlist"),
  playListContent: document.querySelector(".playlist-content"),
  artwork: document.querySelector(".artwork"),
  trackName: document.querySelector(".name"),
  artist: document.querySelector(".artist"),
  currentTime: document.querySelector(".current-time"),
  duration: document.querySelector(".duration"),
};

//* event listeners

const setupEventListeners = () => {
  document.addEventListener("DOMContentLoaded", loadTrack);

  // player events
  ui.playPauseBtn.addEventListener("click", playPauseTrack);
  ui.seekBar.addEventListener("input", updateSeek);
  ui.volumeBar.addEventListener("input", updateVolume);
  ui.nextBtn.addEventListener("click", nextTrack);
  ui.prevBtn.addEventListener("click", prevTrack);
  ui.showPlayListBtn.addEventListener("click", showPlayList);
  ui.hidePlayListBtn.addEventListener("click", hidePlayList);

  // audio events
  audio.addEventListener("ended", nextTrack);
  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("loadedmetadata", updateTrackInfo);
  audio.addEventListener("durationchange", updateDuration);
};

//* event handlers

const updateVolume = () => {
  audio.volume = ui.volumeBar.value / 100;
};

const updateSeek = () => {
  audio.currentTime = (ui.seekBar.value / 100) * audio.duration;
};

const updateTime = () => {
  ui.seekBar.value = (audio.currentTime / audio.duration) * 100;
  ui.currentTime.textContent = formatTime(audio.currentTime);
};

const updateDuration = () => {
  ui.seekBar.value = 0;
  ui.duration.textContent = formatTime(audio.duration);
};

const updateTrackInfo = () => {
  ui.artwork.src = tracks[state.activeTrack].artwork;
  ui.trackName.textContent = tracks[state.activeTrack].name;
  ui.artist.textContent = tracks[state.activeTrack].artist;
};

const playPauseTrack = () => {
  audio.paused ? audio.play() : audio.pause();
  ui.playPauseBtn.classList.toggle("paused", audio.paused);
  if (!state.initPlay) state.initPlay = true;
  renderPlayList();
};

const prevTrack = () => {
  state.activeTrack = (state.activeTrack - 1 + tracks.length) % tracks.length;
  loadTrack();
};

const nextTrack = () => {
  state.activeTrack = (state.activeTrack + 1) % tracks.length;
  loadTrack();
};

const playTrack = (index) => {
  if (index === state.activeTrack) {
    playPauseTrack();
  } else {
    state.activeTrack = index;
    loadTrack();
  }
};

const loadTrack = () => {
  audio.src = tracks[state.activeTrack].path;
  state.initPlay ? playPauseTrack() : renderPlayList();
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const showPlayList = () => {
  ui.playList.classList.add("show");
};

const hidePlayList = () => {
  ui.playList.classList.remove("show");
};

const renderPlayList = () => {
  ui.playListContent.innerHTML = "";

  tracks.forEach((track, index) => {
    const isActive = index === state.activeTrack;
    const icon = audio.paused ? "bi-play-fill" : "bi-pause-fill";

    const item = document.createElement("div");
    item.classList.add("item");
    item.classList.toggle("active", isActive);
    item.addEventListener("click", () => playTrack(index));
    item.innerHTML = `
    <img src="${track.artwork}" alt="${track.name}" />
    <div class="item-detail">
      <h4>${track.name}</h4>
      <p>${track.artist}</p>
    </div>
    ${isActive ? `<button><i class="bi ${icon}"></i></button>` : ""}`;

    ui.playListContent.appendChild(item);
  });
};

renderPlayList();
setupEventListeners();
