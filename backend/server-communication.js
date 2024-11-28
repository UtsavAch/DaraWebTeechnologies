const registered_games = [];

function makeRequest(command, args) {
  // …
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "http://twserver.alunos.dcc.fc.up.pt:8008/" + command, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      const data = JSON.parse(xhr.responseText);
      if (command === "join") {
        console.log("This is from join");
        registered_games.push(data);
      }
      if (command === "leave") {
        console.log("This is from leave");
      }
      console.log(xhr.responseText);
    }
  };
  xhr.send(JSON.stringify(args));
}

function register() {
  makeRequest("register", { nick: "kdsbcfkj", password: "kdvbskj" });
}

function join() {
  makeRequest("join", {
    group: 99,
    nick: "kdsbcfkj",
    password: "kdvbskj",
    size: 4,
  });
}

function leave(game) {
  makeRequest("leave", {
    nick: "kdsbcfkj",
    password: "kdvbskj",
    size: 4,
    game: game,
  });
}

function notify(game){
  makeRequest("notify",{
    nick: "kdsbcfkj",
    password: "kdvbskj",
    game: game,
    cell: {square: 0, position: 0}
  })
}

// leave(registered_games[0].game)
