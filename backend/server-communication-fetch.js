const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008/";

let eventSource;
function createSSEConnection(username, gameId) {
  console.log("Creating SSE connection " + gameId);
  eventSource = new EventSource(
    `${BASE_URL}update?nick=${username}&game=${gameId}`
  );
  eventSource.onmessage = function (event) {
    // Dispatch a custom event with the received data
    const sseEvent = new CustomEvent("playersPaired", { detail: event.data });
    window.dispatchEvent(sseEvent); // Notify globally
  };
  eventSource.onerror = function (event) {
    console.log("An error occurred");
  };
}

function closeSSEConnection() {
  eventSource.close();
}

async function status(response) {
  if (response.ok) return response;
  else {
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

async function leave(nick, password, game) {
  const response = await fetch(BASE_URL + "leave", {
    method: "POST",
    body: JSON.stringify({
      nick: nick,
      password: password,
      game: game,
    }),
  });
  return status(response);
}

async function notify(nick, password, game, square, position) {
  const response = await fetch(BASE_URL + "notify", {
    method: "POST",
    body: JSON.stringify({
      nick: nick,
      password: password,
      game: game,
      cell: {
        square: square,
        position: position,
      },
    }),
  });
  return status(response);
}

async function ranking(group, size) {
  const response = await fetch(BASE_URL + "ranking", {
    method: "POST",
    body: JSON.stringify({
      group: group,
      size: size,
    }),
  });
  return status(response);
}

export {
  register,
  join,
  leave,
  notify,
  ranking,
  createSSEConnection,
  closeSSEConnection,
};
