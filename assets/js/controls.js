/* Audio Player Controls */
// Song Location Indicator
var mainOffSet = document.querySelector(".controlBar").offsetLeft;
var progress = document.getElementById("progressBar");
var maxMeter = document.getElementById("progressRail");
var maxProgress = document.getElementById("progressRail").offsetWidth;

// Volume Indicator
var progress2 = document.getElementById("volumeBar");
var maxMeter2 = document.getElementById("volumeRail");
var maxProgress2 = document.getElementById("volumeRail").offsetWidth;

// Buttons
var playButton = document.getElementById("playButton");
var muteButton = document.getElementById("muteButton")
var forwardButton = document.getElementById("forwardButton")
var backButton = document.getElementById("backButton")

// Misc variables
var mute = false;
var volTotal = "100%";
progress2.style.width = "100%";

// Button toggles
function toggleMute() {
  muteButton.firstElementChild.classList.replace("fa-volume-off", "fa-volume-up");
  mute = false;
}

// Mute Button
muteButton.addEventListener("click", muteIt, false)

function muteIt(e) {
  
  if (mute) {
    toggleMute();
    progress2.style.width = volTotal;
    player.volume = parseInt(progress2.style.width, 10) / 100;
  } else {
    muteButton.firstElementChild.classList.replace("fa-volume-up", "fa-volume-off");
    mute = true;
    volTotal = progress2.style.width;
    progress2.style.width = "0%";
    player.volume = 0;
  }
}

// Play-Pause Button
playButton.addEventListener("click", playIt, false)

function playIt(e) {
  let playing = playButton.firstElementChild.classList.contains("fa-pause");
  
  if (playing) {
    playButton.firstElementChild.classList.replace("fa-pause", "fa-play");
    player.pause();
  } else {
    playButton.firstElementChild.classList.replace("fa-play", "fa-pause");
    player.play();
  }
}

// Progress Control 
var drag = false;

maxMeter.addEventListener("mousedown",  progressMove, false)

function progressMove(e) {
  let clientLoc;
  if (e.touches) {
    clientLoc = e.touches[0].clientX;
    //e.preventDefault();
  } else {
    clientLoc = e.clientX;
  }
  
  drag = true;
  let loc = clientLoc - mainOffSet - maxMeter.offsetLeft;
  progress.style.width = loc / maxProgress * 100 + "%";
  player.currentTime = Math.min(player.duration * loc / maxProgress, player.duration - 0.1);
}

// Volume Control
var drag2 = false;
/* Can use evenytype to determine behavior, or e.preventDefault() */
maxMeter2.addEventListener("mousedown",  volumeMove, false)

function volumeMove(e) {
  let clientLoc;
  if (e.touches) {
    clientLoc = e.touches.item(0).clientX;
    //e.preventDefault();
  } else {
    clientLoc = e.clientX;
  }
  
  if (mute) {
    toggleMute();
  }
  
  drag2 = true;
  let loc = clientLoc - mainOffSet - maxMeter2.offsetLeft;
  progress2.style.width = loc / maxProgress2 * 100 + "%";
  player.volume = parseInt(progress2.style.width, 10) / 100;
}

/* Document Listeners */
// Progress and volume dragging/scrub
document.addEventListener("mousemove", scrubProgress, false)

function scrubProgress(e) {
  let clientLoc;
  if (e.touches) {
    clientLoc = e.touches[0].clientX;
  } else {
    clientLoc = e.clientX;
  }
  // Progress
  if (drag) {
    let loc = clientLoc - mainOffSet - maxMeter.offsetLeft;
    if (loc >= maxMeter.offsetWidth) {
      progress.style.width = "100%";
      player.currentTime = player.duration - 0.1
      
    } else {
      progress.style.width = loc / maxProgress * 100 + "%";
      player.currentTime = player.duration * loc / maxProgress;
    }
  }
  // Volume
  if (drag2) {
    let loc = clientLoc - mainOffSet - maxMeter2.offsetLeft;
    if (loc >= maxMeter2.offsetWidth) {
      progress2.style.width = "100%";
    } else {
      progress2.style.width = loc / maxProgress2 * 100 + "%";
      if (mute) {
        toggleMute();
      }
    }
    if (progress2.style.width == "0%") {
      muteButton.firstElementChild.classList.replace("fa-volume-up", "fa-volume-off");
      mute = true;
    }
    player.volume = parseInt(progress2.style.width, 10) / 100
  }
}

// Toggle dragging variables
document.addEventListener("click", e => {
  if (drag) {
    drag = false
  };
  if (drag2) {
    drag2 = false
  };

})

/* Playlist control script */
var player = document.getElementById("audioPlayer");
var albums = document.getElementsByClassName("playlist");
player.src = albums.item(0).firstElementChild

/* Time Text */
var totalMin;
var totalSec;

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

player.addEventListener("timeupdate", function() {
  let currentTime = document.querySelector(".currentTime");
  let min = Math.floor(player.currentTime / 60);
  let sec = Math.floor(player.currentTime % 60);
  if (sec < 10) {
    sec = "0" + sec;
  }
  currentTime.innerText = min + ":" + sec;
  progress.style.width = player.currentTime / player.duration * 100 + "%";
});

