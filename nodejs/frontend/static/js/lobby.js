//const JAVA_APP = 'https://bingo-module.rj.r.appspot.com';
//const LOCAL = 'https://bingo-module.rj.r.appspot.com';
const LOCAL = "https://localhost:7006";
const socket = io();

/**
 * *Obtiene el id del jugador que esta en la url.
 */
function getId() {
  let pathname = window.location.pathname;
  pathname = pathname.slice(1);

  return pathname;
}

function deleteChilds(element) {
  let childs = element.childNodes;

  for (let i = childs.length - 1; i > -1; i--) {
    childs[i].remove();
  }
}

function createTable(users) {
  let t_body = document.getElementById("t-bodyPlayers");

  deleteChilds(t_body);

  let tr;
  let td;

  for (let i = 0; i < users.length; i++) {
    tr = document.createElement("tr");
    t_body.appendChild(tr);

    td = document.createElement("td");
    td.id = "t-counter" + (i + 1);
    td.innerHTML = i + 1;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = "player-" + (i + 1);
    td.innerHTML = users[i];
    tr.appendChild(td);
  }
}

async function gamers(gamer_id) {
  let gamer = {
    Mongo_id: gamer_id,
    Gamer_ballots: ""
  };

  await fetch(`${LOCAL}/api/gamer/save-gamer-in-game`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gamer)
  }).then((res) => res.json())
    .then((data) => {
      console.log(data);
  }).catch((err) => {
    console.error(err)
  });
}

async function startGame() {
  await fetch(`${LOCAL}/api/Bingo/new-game`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
    }
  }).then((res) => res.json())
    .then((data) => {
      console.log(data);
  }).catch((err) => {
      console.error(err)
  });
}

async function getBingoState() {
  let currentGameState;

  await fetch(`${LOCAL}/api/bingo/current-game-state`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      currentGameState = data;
    })
    .catch((err) => {
        console.log(err)
    });

  return currentGameState;
}

async function countdown() {
  /**
   * *Si ya hay un juego iniciado, no permitirá ingresar a un nuevo jugador.
   */
  let isStarted = await getBingoState();
  
  if (isStarted) {
    alert(
      "Ya hay un juego iniciado, por favor, regrese en 5 min o cuando termine el juego"
    );

    window.location.href = "/login";
  }

  /**
   * *Crea el juego nuevo.
   */
  await startGame();
  /**
   * *Envía los ids de los jugadores al backend en spring boot.
   */
  await gamers(getId());
  window.location.href = '/bingo/' + getId();
}

socket.on("server:count", (data) => {
  document.getElementById("countdown-min").innerHTML = data.min + " : ";
  document.getElementById("countdown-sec").innerHTML = data.seg;
});

socket.on("server:users", (users) => {
  createTable(users);
});

socket.on('server:start-game', () => {
  countdown();
});

countdown();