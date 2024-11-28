let registered_game = -1;

function makeRequest(command, args) {
  // …
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "http://twserver.alunos.dcc.fc.up.pt:8008/" + command, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      const data = JSON.parse(xhr.responseText);
      if (command === "join") {
        console.log("This is from join");
        registered_game = data.game;
      }
      if (command === "leave") {
        console.log("This is from leave");
      }
      console.log(xhr.responseText);
    }
  };
  xhr.send(JSON.stringify(args));
}

function makePermanentConn(args) {
  var url = "ws://twserver.alunos.dcc.fc.up.pt:8008/update";
  var webSocket = new WebSocket(url);
  webSocket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    console.log(data);
    webSocket.close();
  };
  webSocket.send(JSON.stringify(args));
}

function register(nick, password) {
  makeRequest("register", { nick: nick, password: password });
}

function join(group, nick, password, size) {
  makeRequest("join", {
    group: group,
    nick: nick,
    password: password,
    size: size,
  });
}

function leave(nick, password, size, game) {
  makeRequest("leave", {
    nick: nick,
    password: password,
    size: size,
    game: game,
  });
}

function notify(nick, password, game, cell) {
  makeRequest("notify", {
    nick: nick,
    password: password,
    game: game,
    cell: cell,
  });
}
// cell: { square: 0, position: 0 },

function ranking(group, size) {
  makeRequest("ranking", {
    group: group,
    size: size,
  });
}

function update(nick) {
  makePermanentConn({
    nick: nick,
    game: registered_game, //Its a global variable
  });
}
