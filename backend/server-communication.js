function makeRequest(command, args) {
  // …
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "http://twserver.alunos.dcc.fc.up.pt:8008/" + command, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      const data = JSON.parse(xhr.responseText);
      console.log(xhr.responseText);
    }
  };
  xhr.send(JSON.stringify(args));
}

function register() {
  makeRequest("register", { nick: "kdsbcfkj", password: "kdvbskj" });
}
