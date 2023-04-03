const socket = io();
const searchGameButton = document.getElementById("searchGame-btn");

const environment = {
  local: "https://localhost:7006",
  prod: "https://bingobackend20230304180241.azurewebsites.net",
};
const SERVER = environment.local;

function getId() {
  let pathname = window.location.pathname;
  pathname = pathname.slice(7);

  return pathname;
}

async function mainProcess() {
  /*
   * Si ya hay un juego iniciado, no permitirá ingresar a un nuevo jugador.
   */
  let isStarted = await getBingoState();
  let isGamerInGame = await getGamerInGame(getId());

  console.log("1: ", isGamerInGame, !isGamerInGame, " ID: ", getId());

  if (isStarted && !isGamerInGame) {
    window.alert("Ya hay un juego iniciado, por favor, regrese mas tarde");

    // location.assign(`/lobby/${getId()}`);
    window.location.href = `/lobby/${getId()}`;
    console.log("2: ", isGamerInGame);
  } else{
    if (!isGamerInGame) {
      await startGame();
      await gamers(getId());
      console.log("3: ", isGamerInGame);
    }

    // location.assign(`/bingo/${getId()}`);
    window.location.href = `/lobby/${getId()}`;
  }
}

/*
* Chicas por favor, lleven las canciones claras, repasenlas hoy y mañana para sacar eso lo antes posible, no tendremos mucho tiempo y tampoco queremos hacer sentir a Santiago que el ensayo no esta rindiendo.
 */

/*
 * ================ CONTROLADORES DE LAS VISTAS ===================
 */
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
    td.innerHTML = users[i].userName;
    tr.style.color = "#FFFFFF";
    tr.appendChild(td);
  }
}

/*
 * ==================== SOCKETS =========================
 */
searchGameButton.addEventListener("click", () => {
  socket.emit("server:lobby-connection");

  searchGameButton.style.display = "none";

  document.getElementById("countdown-min").style.visibility = "visible";
  document.getElementById("countdown-sec").style.visibility = "visible";
  document.getElementById("message").style.visibility = "visible";
  document.getElementById("searchComment").innerHTML =
    "<h3 style='text-align: center;'>Buscando...</h3>" +
    "<br></br>Si no se encuentra jugadores al terminar el conteo, se le asignara una partida en single player.";
});

socket.on("server:users", (users) => {
  createTable(users);
});

(async () => {
  const userName = await getUserName();

  socket.emit("client:user", userName.user);
})();

socket.on("server:time", (data) => {
  if (typeof data === "boolean") {
    mainProcess();
  }

  var seg = Math.trunc(data.sec);
  var min = data.min;

  if (seg <= 9) {
    seg = " 0" + seg;
  }

  if (isNaN(seg)) {
    seg = "00";
    min = "00";
  }

  document.getElementById("countdown-min").innerHTML = min + ":";
  document.getElementById("countdown-sec").innerHTML = seg;
});

/*
 * ==================== SOLICITUDES API =========================
 */

async function getGamerInGame() {
  let response;

  await fetch(`${SERVER}/api/bingo/is-in-current-game/${getId()}`, {})
    .then((res) => res.json())
    .then((data) => (response = data))
    .catch((err) => console.error(err));

  return response;
}

async function gamers(gamerId) {
  let gamer = {
    Mongo_id: gamerId,
    Gamer_ballots: "",
  };

  await fetch(`${SERVER}/api/gamer/save-gamer-in-game`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gamer),
  })
    .then((res) => res.json())
    .then((data) => {})
    .catch((err) => {
      console.error(err);
    });
}

async function getUserName() {
  let userName;

  await fetch(`/get-userName/${getId()}`, {})
    .then((res) => res.json())
    .then((data) => {
      userName = data;
    })
    .catch((err) => {
      console.error(err);
    });

  return userName;
}

async function startGame() {
  await fetch(`${SERVER}/api/Bingo/new-game`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {})
    .catch((err) => {
      console.error(err);
    });
}

async function getBingoState() {
  let currentGameState;

  await fetch(`${SERVER}/api/bingo/current-game-state`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      currentGameState = data;
    })
    .catch((err) => {
      console.log(err);
    });

  return currentGameState;
}
