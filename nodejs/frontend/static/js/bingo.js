var ballots_obtained = [];
var gamers_list = [];
var bingo;
var isWin = false;
var intervalId;
const mongoId = getId();
const socket = io();
const tokens = document.querySelectorAll(".token");
const bingo_btn = document.getElementById("bingo-btn");
const exitBtn = document.getElementById("left-game-btn");

const environment = {
  local: "https://localhost:7006",
  prod: "https://jeffrm.ga",
};
const SERVER = environment.prod;

/**
 * *Evento que captura eventos realizados por el usuario en la tabla de bingo.
 * *Solo serán marcados los botones con balotas que ya hayan sido traídas del backend
 */
tokens.forEach((e) =>
  e.addEventListener("click", function () {
    if (isBallot(this.innerHTML)) {
      this.style.backgroundColor = "red";

      document.getElementById("div-alert").innerHTML = "¡Bien!";

      sendBallotGamer(mongoId, parseInt(this.innerHTML, 10));
    } else {
      document.getElementById("div-alert").innerHTML =
        "No puede marcar una casilla que no ha sido arrojada";
    }
  })
);

exitBtn.addEventListener("click", async () => {
  await disqualifyPlayer();

  location.assign(`/lobby/${getId()}`);
});

/*
 *Cuando se presiona el botón 'Bingo' Comprueba si el jugador que lo presiono si es el ganador, lo notifica al backend y a los usuarios terminando el juego, en caso contrario, elimina al jugador del juego.
 */
bingo_btn.addEventListener("click", async () => {
  let is_winner = await isWinner();

  if (is_winner) {
    notifyWinner();
  } else {
    await disqualifyPlayer();

    alert("Usted ha sido descalificado por notificar falsamente una victoria");

    location.assign(`/lobby/${getId()}`);
  }
});

/*
 * Verifica si aun hay jugadores en el juego, si el numero es menor a 1, termina el juego
 */
async function verifyNumOfPlayers() {
  gamers_list = await getPlayers();

  if (gamers_list.length < 1) {
    await finishGame();
    alert(
      "Deben participar en el juego almenos un jugador. El juego sera finalizado."
    );

    location.assign(`/lobby/${getId()}`);
  }
}

/**
 * *Obtiene el id del jugador que esta en la url.
 */
function getId() {
  let pathname = window.location.pathname;
  pathname = pathname.slice(7);

  return pathname;
}

/**
 * *Método donde se ejecutan la mayoría de funcionalidades del programa.
 */
const main = async () => {
  let card = await getCard();
  let userName = await getUserName();

  socket.emit("client:user", userName.user);
  await verifyNumOfPlayers();

  // Se verifica que ya no exista un ganador del juego
  await gameHaveWinner();
  let is_winner = await isWinner();

  if (is_winner) {
    notifyWinner();
  }

  for (let i = 0; i < 5; i++) {
    let column;

    if (i == 0) {
      column = await setColumn(card.b_id);
    } else if (i == 1) {
      column = await setColumn(card.i_id);
    } else if (i == 2) {
      column = await setColumn(card.n_id);
    } else if (i == 3) {
      column = await setColumn(card.g_id);
    } else if (i == 4) {
      column = await setColumn(card.o_id);
    }

    printColumns(i + 1, column);
  }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${SERVER}/bingo-sockets`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .build();

  await connection
    .start()
    .then(() => {
      console.log("Connection with SignalR started");
    })
    .catch((err) => {
      console.error(err.message);
    });

  ballots_obtained = await getBallots();

  markingBallots();

  await connection.on("sendBallot", (ballot) => {
    ballots_obtained.push(ballot);

    markingBallots();
  });

  await getBallot();
};

main();

/*
 * ========================= SOCKETS ==============================
 */
(async () => {
  intervalId = setInterval(async () => {
    socket.on("server:winner", (winner) => {
      /*
       *Se avisa a los jugadores perdedores que hay un ganador y se bloquean los   botones.
       */
      if (winner != "") {
        document.getElementById("div-winner").innerHTML = "¡Ya hay un ganador!";

        writeWinner(winner);
        bingo_btn.disable = true;
        tokens.forEach((btn) => (btn.disabled = true));

        clearInterval(intervalId);
      }
    });
  }, 1000);
})();

socket.on("server:users", (users) => {
  createTable(users);
});

/*
 * ===================== SOLICITUDES API ==========================
 */
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

async function finishGame() {
  await fetch(`${SERVER}/api/bingo/finish-current`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {})
    .catch((err) => {
      console.error(err);
    });
}

async function disqualifyPlayer() {
  let playerList;

  await fetch(`${SERVER}/api/bingo/disqualify`, {
    method: "PUT",
    body: JSON.stringify(mongoId),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      playerList = data;
    })
    .catch((err) => {
      console.error(err);
    });

  return playerList;
}

async function getPlayers() {
  let players;

  await fetch(`${SERVER}/api/gamer/send-all-players`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      players = data;
    })
    .catch((err) => {
      console.error(err);
    });

  return players;
}

async function isWinner() {
  let is_winner;

  await fetch(`${SERVER}/api/bingo/is-winner`, {
    method: "PUT",
    body: JSON.stringify(mongoId),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      is_winner = data;
    })
    .catch((err) => {
      console.error(err);
    });

  return is_winner;
}

async function getCard() {
  let card;
  let gamer = {
    Mongo_id: mongoId,
  };

  await fetch(`${SERVER}/api/Bingo/send-card`, {
    method: "POST",
    body: JSON.stringify(gamer),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      card = {
        id: data.id,
        b_id: data.b_id,
        i_id: data.i_id,
        n_id: data.n_id,
        g_id: data.g_id,
        o_id: data.o_id,
        gamer_id: data.gamer_id,
        game_id: data.game_id,
      };
    })
    .catch((err) => {
      console.error(err);
    });

  return card;
}

async function setColumn(column_id) {
  let column;

  await fetch(`${SERVER}/api/columnLetter/send-column/${column_id}`, {})
    .then((res) => res.json())
    .then((data) => {
      column = {
        id_letter: data.id,
        letter: data.letter,
        n1: data.n1,
        n2: data.n2,
        n3: data.n3,
        n4: data.n4,
        n5: data.n5,
      };
    })
    .catch((err) => {
      console.error(err);
    });

  return column;
}

async function sendBallotGamer(id, ballot) {
  await fetch(`${SERVER}/api/bingo/ballot-marked/${id}`, {
    method: "PUT",
    body: JSON.stringify(ballot),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getBallots() {
  let ballots;

  await fetch(`${SERVER}/api/BallotsObtained/send-game-ballots`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      ballots = data;
    })
    .catch((err) => {
      console.error(err);
    });

  return ballots;
}

async function getBallot() {
  let ballot;

  await fetch(`${SERVER}/api/bingo/send-ballot`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      ballot = data;
    })
    .catch((err) => {
      console.error(err);
    });

  return ballot;
}

/*
 * ===================== CONTROLADORES DE VISTAS =====================
 */

window.addEventListener("beforeunload", async e => {
  e.preventDefault();
  e.returnValue = "¿Seguro que quieres salir?";
  await disqualifyPlayer();
});

async function gameHaveWinner() {
  let haveWinner;

  await fetch(`${SERVER}/api/bingo/game-have-winner`, {})
    .then((res) => res.json())
    .then((data) => (haveWinner = data))
    .catch((err) => console.error(err));

  if(haveWinner){
    tokens.forEach((btn) => (btn.disabled = true));
    bingo_btn.disable = true;
  }
}

function notifyWinner() {
  document.getElementById("div-winner").innerHTML = "¡Felicidades, GANASTE!";

  writeWinner(mongoId);
  isWin = true;

  socket.emit("client:winner", mongoId);
  clearInterval(intervalId);

  tokens.forEach((btn) => (btn.disabled = true));
  bingo_btn.disable = true;
}

function writeWinner(id) {
  for (let i = 0; i < gamers_list.length; i++) {
    if (gamers_list[i].mongo_id == id) {
      document.getElementById(`winner-${i + 1}`).innerHTML = "&#128081";
    }
  }
}

function deleteChilds(element) {
  let childs = element.childNodes;

  for (let i = childs.length - 1; i > -1; i--) {
    childs[i].remove();
  }
}

/**
 * *Imprime los usuarios que están en el juego en una tabla.
 */
function createTable(users) {
  let t_body = document.getElementById("t-bodyPlayers");

  deleteChilds(t_body);

  let tr;
  let td;

  for (let i = 0; i < users.length; i++) {
    tr = document.createElement("tr");
    t_body.appendChild(tr);

    td = document.createElement("td");
    td.innerHTML = i + 1;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = "player-" + (i + 1);
    td.innerHTML = users[i].userName;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = "winner-" + (i + 1);
    tr.appendChild(td);
  }
}

function isBallot(ballot) {
  for (let i = 0; i < ballots_obtained.length; i++) {
    if (ballot == ballots_obtained[i]) {
      return true;
    }
  }

  return false;
}

function markingBallots() {
  let domElements = document.querySelectorAll(".cell-number");

  domElements.forEach((e) => {
    ballots_obtained.forEach((ball) => {
      if (e.innerHTML == ball) {
        e.style.backgroundColor = "red";
      }
    });
  });
}

/**
 * *Imprime las columnas por letra de la tabla de bingo.
 */
function printColumns(column_number, column_content) {
  for (let i = 0; i < 5; i++) {
    if (i == 0) {
      document.getElementById(`1-${column_number}`).innerHTML =
        column_content.n1;
    } else if (i == 1) {
      document.getElementById(`2-${column_number}`).innerHTML =
        column_content.n2;
    } else if (i == 2) {
      document.getElementById(`3-${column_number}`).innerHTML =
        column_content.n3;
    } else if (i == 3) {
      document.getElementById(`4-${column_number}`).innerHTML =
        column_content.n4;
    } else if (i == 4) {
      document.getElementById(`5-${column_number}`).innerHTML =
        column_content.n5;
    }
  }

  document.getElementById("3-3").innerHTML = "&#128512";
}
