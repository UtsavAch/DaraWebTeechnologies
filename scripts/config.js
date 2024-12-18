import {
  register,
  join,
  leave,
  createSSEConnection,
} from "/backend/server-communication-fetch.js";

export let gameInfo = {
  gameId: -1,
  username: "",
  password: "",
  boardSize: 0,
};

document.addEventListener("DOMContentLoaded", (event) => {
  const singlePlayerButton = document.getElementById("singleplayer-btn");
  const multiPlayerButton = document.getElementById("multiplayer-btn");
  const singlePlayerView = document.getElementById("singleplayer-view");
  const loginView = document.getElementById("login-view");
  const registerButton = document.getElementById("register-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginSubmit = document.getElementById("login-submit");
  const registerQuestion = document.getElementById("register-question");
  const registerSubmit = document.getElementById("register-submit");
  const loginLink = document.getElementById("login-link");
  const waitingView = document.getElementById("waiting-view");
  const leaveWaitingButton = document.getElementById("cancel-waiting-btn");

  singlePlayerButton.addEventListener("click", () => {
    singlePlayerView.style.display = "block";
    //multiPlayerView.style.display = "none";
    multiPlayerButton.classList.add("passive-mode");
    singlePlayerButton.classList.remove("passive-mode");

    loginView.style.display = "none";
    registerForm.style.display = "none";
  });

  multiPlayerButton.addEventListener("click", () => {
    singlePlayerView.style.display = "none";
    waitingView.style.display = "none";
    //multiPlayerView.style.display = "none";
    multiPlayerButton.classList.remove("passive-mode");
    singlePlayerButton.classList.add("passive-mode");
    loginView.style.display = "block";
    loginForm.style.display = "block";
    registerQuestion.style.display = "block";
  });

  /*  loginButton.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });*/

  registerButton.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerQuestion.style.display = "none";
    registerForm.style.display = "block";
  });

  loginSubmit.addEventListener("click", () => {
    gameInfo.username = document.getElementById("l-username").value;
    gameInfo.password = document.getElementById("l-password").value;
    gameInfo.boardSize = document.getElementById("multiplayer-size").value;
    const group = 16;
    join(group, gameInfo.username, gameInfo.password, gameInfo.boardSize)
      .then((response) => {
        response.json().then((data) => {
          gameInfo.gameId = data.game;
          createSSEConnection(gameInfo.username, gameInfo.gameId);
        });
        setNotificationMessage("Login successful");
      })
      .catch((error) => {
        if (error.message === "401") {
          setNotificationMessage("Invalid username or password");
        }
        if (error.message === "400") {
          setNotificationMessage("Invalid data");
        }
      });

    loginForm.style.display = "none";
    registerQuestion.style.display = "none";
    waitingView.style.display = "block";
  });

  registerSubmit.addEventListener("click", () => {
    let username = document.getElementById("r-username").value;
    let password = document.getElementById("r-password").value;

    register(username, password)
      .then((_response) => {
        setNotificationMessage("Registration successful");
      })
      .catch((_error) => {
        setNotificationMessage("Regstration failed");
      });

    registerForm.style.display = "none";
    loginForm.style.display = "block";
    registerQuestion.style.display = "block";
  });

  loginLink.addEventListener("click", () => {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    registerQuestion.style.display = "block";
  });

  //leave the game when in waiting mode
  leaveWaitingButton.addEventListener("click", () => {
    leave(gameInfo.username, gameInfo.password, gameInfo.gameId)
      .then((_response) => {
        setNotificationMessage("You left the game");
        waitingView.style.display = "none";
        loginForm.style.display = "block";
      })
      .catch((_error) => {
        setNotificationMessage("Failed to leave the game");
      });
  });
});

export function setNotificationMessage(message) {
  const notificationElement = document.getElementById("notification-message");
  notificationElement.textContent = message;
}
