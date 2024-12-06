const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008/";

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

let socket;

function createWebsocketConnection(){
  socket = new WebSocket("ws://twserver.alunos.dcc.fc.up.pt:8008/update");
  socket.onopen = function (event) {
    console.log("Connection established");
  };
  socket.onmessage = function (event) {
    console.log(event.data);
  };
  socket.onclose = function (event) {
    console.log("Connection closed");
  };
  socket.onerror = function (event) {
    console.log("Error: " + event.data);
  };
}

const sendMessage = (user,game) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {nick: user, game: game};
      socket.send(message);
      console.log('Message sent:', message);
  }
};

const closeConnection = () => {
  if (socket) {
      socket.close();
      console.log('WebSocket connection closed.');
  }
};

async function status(response) {
  if(response.ok)
      return response;
  else{
      throw new Error(response.status); 
  }     
}

async function register(nick, password) {
  const response = await fetch(BASE_URL + "register", {
    method: "POST",
    body: JSON.stringify({ nick: nick, password: password }),
  });
  return status(response);
}

async function join(group, nick, password, size) {
  const response = await fetch(BASE_URL + "join", {
    method: "POST",
    body: JSON.stringify({
      group: group,
      nick: nick,
      password: password,
      size: size,
    }),
  });
  return status(response);
}


export {
  register,
  join,
  createWebsocketConnection,
  sendMessage,
  closeConnection
};