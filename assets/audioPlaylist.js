/* Audio Player Controls */

// Song Location Indicator
var mainOffSet = document.querySelector(".controlBar").offsetLeft;
var progressBar = document.getElementById("progressBar");
var progressRail = document.getElementById("progressRail");
var maxProgress = document.getElementById("progressRail").offsetWidth;

// Volume Indicator
var volumeBar = document.getElementById("volumeBar");
var volumeRail = document.getElementById("volumeRail");
var maxVolume = document.getElementById("volumeRail").offsetWidth;

// Buttons
var playButton = document.getElementById("playButton");
var muteButton = document.getElementById("muteButton")
var forwardButton = document.getElementById("forwardButton")
var backButton = document.getElementById("backButton")

/* Playlist control script */
var player = document.getElementById("audioPlayer");
var playlist = document.getElementById("playlist");

// Misc variables
var mute = false;
var volTotal = "100%";

/* Time Text */
var totalMin;
var totalSec;

var dragProgress = false; // Progress Control
var dragVolume = false; // Volume Control

volumeBar.style.width = "100%";
// -----------------------------------------------------------------------------
// Button toggles
function toggleMute() {
  muteButton.firstElementChild.classList.replace("icon-volume-off", "icon-volume-up");
  mute = false;
}

function muteIt(e) {
  if (mute) {
    toggleMute();
    volumeBar.style.width = volTotal;
    player.volume = parseInt(volumeBar.style.width, 10) / 100;
  } else {
    muteButton.firstElementChild.classList.replace("icon-volume-up", "icon-volume-off");
    mute = true;
    volTotal = volumeBar.style.width;
    volumeBar.style.width = "0%";
    player.volume = 0;
  }
}

function playIt(e) {
  let playing = playButton.firstElementChild.classList.contains("icon-pause");

  if (playing) {
    playButton.firstElementChild.classList.replace("icon-pause", "icon-play");
    player.pause();
  } else {
    playButton.firstElementChild.classList.replace("icon-play", "icon-pause");
    player.play();
  }
}

function progressMove(e) {
  let clientLoc;
  if (e.touches) {
    clientLoc = e.touches[0].clientX;
  } else {
    clientLoc = e.clientX;
  }

  dragProgress = true;

  let loc = clientLoc - mainOffSet - progressRail.offsetLeft;
  progressBar.style.width = loc / maxProgress * 100 + "%";
  player.currentTime = Math.min(player.duration * loc / maxProgress, player.duration - 0.1);
}

function volumeMove(e) {
  let clientLoc;
  if (e.touches) {
    clientLoc = e.touches.item(0).clientX;
  } else {
    clientLoc = e.clientX;
  }

  if (mute) {toggleMute()}

  dragVolume = true;
  let loc = clientLoc - mainOffSet - volumeRail.offsetLeft;

  volumeBar.style.width = loc / maxVolume * 100 + "%";
  player.volume = parseInt(volumeBar.style.width, 10) / 100;
}

function scrubProgress(e) {
  let clientLoc;
  if (e.touches) {
    clientLoc = e.touches[0].clientX;
  } else {
    clientLoc = e.clientX;
  }
  // Progress
  if (dragProgress) {
    let loc = clientLoc - mainOffSet - progressRail.offsetLeft;

    if (loc >= progressRail.offsetWidth) {
      progressBar.style.width = "100%";
      player.currentTime = player.duration - 0.1

    } else {
      progressBar.style.width = loc / maxProgress * 100 + "%";
      player.currentTime = player.duration * loc / maxProgress;
    }
  }
  // Volume
  if (dragVolume) {
    let loc = clientLoc - mainOffSet - volumeRail.offsetLeft;

    if (loc >= volumeRail.offsetWidth) {
      volumeBar.style.width = "100%";
    } else {
      volumeBar.style.width = loc / maxVolume * 100 + "%";
      if (mute) {
        toggleMute();
      }
    }

    if (volumeBar.style.width == "0%") {
      muteButton.firstElementChild.classList.replace("icon-volume-up", "icon-volume-off");
      mute = true;
    }
    player.volume = parseInt(volumeBar.style.width, 10) / 100
  }
}

function getTime() {
  let totalTime = document.querySelector(".totalTime");
  totalMin = Math.floor(player.duration / 60);
  totalSec = Math.floor(player.duration % 60);
  // Fix display of time if seconds is less than 10
  if (totalSec < 10) {
    totalSec = "0" + totalSec;
  }

  totalTime.innerText = "/ " + totalMin + ":" + totalSec;
  document.querySelector(".currentTime").innerText = "0" + ":" + "00";
}

function updateTime() {
  let currentTime = document.querySelector(".currentTime");
  let min = Math.floor(player.currentTime / 60);
  let sec = Math.floor(player.currentTime % 60);

  if (sec < 10) {
    sec = "0" + sec;
  }
  currentTime.innerText = min + ":" + sec;
  progressBar.style.width = player.currentTime / player.duration * 100 + "%";
}

/* Playlist Selection controls */
function playOnClick(e) {
  let anchorElement = document.querySelector(".playlist-item.active")

  anchorElement.classList.remove("active");
  e.target.classList.add("active");
  e.preventDefault();
  player.src = e.target;
  playButton.firstElementChild.classList.add("icon-pause")
  playButton.firstElementChild.classList.remove("icon-play")
  player.play();
}

function playNext(e) {
  let anchorElement = document.querySelector(".playlist-item.active")
  let nextSong = anchorElement.nextElementSibling;

  if (nextSong) {
    player.pause();
    anchorElement.classList.remove("active");
    nextSong.classList.add("active");
    player.src = nextSong;
    player.play();
    playButton.firstElementChild.classList.replace("icon-play", "icon-pause");
  } else {
    playButton.firstElementChild.classList.remove("icon-pause")
    playButton.firstElementChild.classList.add("icon-play")
    player.pause()
  }
}

function playPrevious(e) {
  let anchorElement = document.querySelector(".playlist-item.active")
  let previousSong = anchorElement.previousElementSibling;

  if (previousSong) {
    anchorElement.classList.remove("active");
    previousSong.classList.add("active");
    player.src = previousSong;
    player.play();
    playButton.firstElementChild.classList.replace("icon-play", "icon-pause");
  }
}

function checkDrag() {
  if (dragProgress) {dragProgress = false};
  if (dragVolume) {dragVolume = false};
}
// ----------------------------------------------------------------------------- /
/* Can use evenytype to determine behavior, or e.preventDefault() */
progressRail.addEventListener("mousedown",  progressMove, false)
volumeRail.addEventListener("mousedown",  volumeMove, false)

muteButton.addEventListener("click", muteIt, false) // Mute Button
playButton.addEventListener("click", playIt, false) // Play-Pause Button
forwardButton.addEventListener("click", playNext, false)
backButton.addEventListener("click", playPrevious, false)

/* Document Listeners */
// Progress and volume dragging/scrub
document.addEventListener("mousemove", scrubProgress, false)
document.addEventListener("click", checkDrag, false) // Toggle dragging variables

player.onloadeddata = (event) => { getTime() }
player.addEventListener("timeupdate", updateTime, false)
player.addEventListener("ended", playNext, false)


/* Playlist */
for (child of playlist.children) {
  child.addEventListener("click", playOnClick, false);
}

player.src = playlist.firstElementChild.href

// EoF
