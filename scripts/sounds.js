const backgroundMusic = document.getElementById("background-music");
const battleMusic = document.getElementById("battle-music");
const buttonClick = document.getElementById("button-click");

const volumeUpButton = document.getElementById("volume-up-btn");
const volumeOffButton = document.getElementById("volume-off-btn");

const startSingleplayerButton = document.getElementById(
  "start-singleplayer-btn"
);
const startMultiplayerButton = document.getElementById("start-multiplayer-btn");
const closeGameButton = document.getElementById("close-game-btn");
const overlayCancelButton = document.getElementById("overlay-cancel-btn");

// Select all elements with the 'btn' class
const buttons = document.querySelectorAll(".btn");

//Adjusting the volumes of the sounds
backgroundMusic.volume = 0.2;
battleMusic.volume = 0.2;
buttonClick.volume = 1.0;

// To track if the volume button is turned on or off
let volume = false;

// To keep track of the current music
let currentMusic = backgroundMusic;

// Function to play background music
function playBackgroundMusic() {
  battleMusic.pause();
  currentMusic = backgroundMusic;
  backgroundMusic.currentTime = 0;
  if (volume) backgroundMusic.play();
}

// Function to play battle music
function playBattleMusic() {
  backgroundMusic.pause();
  currentMusic = battleMusic;
  battleMusic.currentTime = 0;
  if (volume) battleMusic.play();
}

// Volume button toggle functionality
volumeUpButton.addEventListener("click", () => {
  volume = false;
  currentMusic.pause();
  volumeOffButton.style.display = "block";
  volumeUpButton.style.display = "none";
});

volumeOffButton.addEventListener("click", () => {
  volume = true;
  if (volume) currentMusic.play();
  volumeOffButton.style.display = "none";
  volumeUpButton.style.display = "block";
});

startSingleplayerButton.addEventListener("click", () => {
  playBattleMusic();
});

startMultiplayerButton.addEventListener("click", () => {
  playBattleMusic();
});

closeGameButton.addEventListener("click", () => {
  playBackgroundMusic();
});

overlayCancelButton.addEventListener("click", () => {
  playBattleMusic();
});

// Put button-click sound to all buttons
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const audio = document.getElementById("button-click");
    if (volume && audio) {
      audio.play();
    }
  });
});
