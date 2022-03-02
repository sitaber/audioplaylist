/* Playlist Selection controls */
function playOnClick(e) {
  let anchorElement = document.querySelector(".playlist-item.active")
  anchorElement.classList.remove("active");
  e.target.classList.add("active");
  e.preventDefault();
  player.src = e.target;
  playButton.firstElementChild.classList.add("fa-pause")
  playButton.firstElementChild.classList.remove("fa-play")
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
    playButton.firstElementChild.classList.replace("fa-play", "fa-pause");
  } else {
    playButton.firstElementChild.classList.remove("fa-pause")
    playButton.firstElementChild.classList.add("fa-play")
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
    playButton.firstElementChild.classList.replace("fa-play", "fa-pause");
  }  
}
// Add eventListener to each "album" track in playlists
for (album of albums) {
  for (child of album.children) {
    child.addEventListener("click", playOnClick, false);
  }
}

player.addEventListener("ended", playNext, false)
forwardButton.addEventListener("click", playNext, false)
backButton.addEventListener("click", playPrevious, false)
player.onloadeddata = (event) => { getTime() }

function switchPlayer() {
  if (!basicPlayer) {
    document.getElementsByClassName("controlBar")[0].style.display = "none";
    document.getElementsByClassName("audio")[0].style.display = "inline";
    basicPlayer = true
    switchBtn.style.display = "none";
  } else {
    document.getElementsByClassName("controlBar")[0].style.display = "flex";
    document.getElementsByClassName("audio")[0].style.display = "none";
    basicPlayer = false
    }
}

let switchBtn = document.getElementById("btn");
let basicPlayer = false;
switchBtn.addEventListener("click", switchPlayer, false);
