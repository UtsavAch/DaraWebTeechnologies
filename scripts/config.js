document.addEventListener("DOMContentLoaded", (event) => {
  const singlePlayerButton = document.getElementById("singleplayer-btn");
  const multiPlayerButton = document.getElementById("multiplayer-btn");
  const singlePlayerView = document.getElementById("singleplayer-view");
  const multiPlayerView = document.getElementById("multiplayer-view");
  const loginView = document.getElementById("login-view");
  const loginButton = document.getElementById("login-btn");
  const registerButton = document.getElementById("register-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginSubmit = document.getElementById("login-submit");
  const registerSubmit = document.getElementById("register-submit");

  singlePlayerButton.addEventListener("click", () => {
    singlePlayerView.style.display = "block";
    multiPlayerView.style.display = "none";
    multiPlayerButton.classList.add("passive-mode");
    singlePlayerButton.classList.remove("passive-mode");

    loginView.style.display = "none";
  });

  multiPlayerButton.addEventListener("click", () => {
    singlePlayerView.style.display = "none";
    multiPlayerView.style.display = "none";
    multiPlayerButton.classList.remove("passive-mode");
    singlePlayerButton.classList.add("passive-mode");
    loginView.style.display = "block";
  });

  loginButton.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  registerButton.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  loginSubmit.addEventListener("click", () => {
    //no validation for now
    loginForm.style.display = "none";
    loginView.style.display = "none";
    multiPlayerView.style.display = "block";
  });

  registerSubmit.addEventListener("click", () => {
    //no validation for now
    registerForm.style.display = "none";
    loginView.style.display = "none";
    multiPlayerView.style.display = "block";
  });
});
