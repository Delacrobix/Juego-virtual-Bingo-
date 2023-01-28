var ballots_obtained = [];
var bingo;
var gamers_list;
var isWin = false;
const mongo_id = getId();
const tokens = document.querySelectorAll(".token");
const bingo_btn = document.getElementById("bingo-btn");

const JAVA_APP = "https://bingo-module.rj.r.appspot.com";
const LOCAL = "https://localhost:7006";
//const LOCAL = 'https://bingo-module.rj.r.appspot.com';

/**
 * *Evento que identifica si el usuario presiona un botón en la tabla de bingo.
 * *Solo serán marcados los botones con balotas que ya hayan sido arrojadas
 * *por la ruleta.
 */
tokens.forEach((e) =>
  e.addEventListener("click", function () {
    if (isBallot(this.innerHTML)) {
      this.style.backgroundColor = "red";

      document.getElementById("div-alert").innerHTML = "¡Bien!";

      sendBallotGamer(mongo_id, parseInt(this.innerHTML, 10));
    } else {
      document.getElementById("div-alert").innerHTML =
        "No puede marcar una casilla que no ha sido arrojada";
    }
  })
);

/**
 * *Cuando se presiona el botón 'Bingo' Comprueba si el jugador que lo presiono
 * *es realmente el ganador del juego, en casi afirmativo lo notifica al backend
 * *y a los usuarios terminando el juego, en caso contrario, elimina al jugador
 * *del juego.
 */
bingo_btn.addEventListener("click", async () => {
  let is_winner = await isWinner();

  if (is_winner) {
    document.getElementById("div-winner").innerHTML = "¡Felicidades, GANASTE!";

    writeWinner(mongo_id);
    isWin = true;

    tokens.forEach((btn) => (btn.disabled = true));
    bingo_btn.disable = true;
  } else {
    disqualifyPlayer();
    printPlayers();
    alert("Usted ha sido descalificado por notificar falsamente una victoria");
    window.location.href = "/login";
  }
});

/*
 * Verifica si aun hay jugadores en el juego, si el numero es menor a 2, termina el juego
 * en caso contrario, imprime la lista de jugadores.
 */
async function printPlayers() {
  gamers_list = await getPlayers();

  if (gamers_list.length < 1) {
    await finishGame();
    alert(
      "Deben participar en el juego almenos dos jugadores. El juego sera finalizado"
    );

    window.location.href = "/login";
  } else {
    let users = [];

    for (let i = 0; i < gamers_list.length; i++) {
      users[i] = await getPlayerName(gamers_list[i].id_mongo);
    }

    createTable(users);
  }
}

async function getPlayerName(id) {
  let user;

  await fetch(`/getUser/${id}`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      user = data;
    });

  return user;
}

function writeWinner(id) {
  for (let i = 0; i < gamers_list.length; i++) {
    if (gamers_list[i].id_mongo == id) {
      document.getElementById(`winner-${i + 1}`).innerHTML = "&#128081";
    }
  }
}

async function getWinnerId() {
  let winnerId;

  await fetch(`${LOCAL}/api/bingo/get-current-winner`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      winnerId = data;
    });

  return winnerId;
}

/**
 * *Imprime los usuarios que están en el juego en una tabla.
 */
function createTable(users) {
  let t_body = document.getElementById("t-bodyPlayers");
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
    td.innerHTML = users[i].user;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = "winner-" + (i + 1);
    tr.appendChild(td);
  }
}

async function finishGame() {
  await fetch(`${LOCAL}/api/finish-current`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("Juego terminado", data);
    });
}

async function disqualifyPlayer() {
  let list_players;

  await fetch(`${LOCAL}/api/bingo/disqualify`, {
    method: "PUT",
    body: JSON.stringify(mongo_id),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      list_players = data;
      console.log(data);
    });

  return list_players;
}

async function getPlayers() {
  let players;

  await fetch(`${LOCAL}/api/send-all-players`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      players = data;
    });

  return players;
}

async function isWinner() {
  let is_winner;

  await fetch(`${LOCAL}/api/bingo/is-winner`, {
    method: "POST",
    body: JSON.stringify(mongo_id),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      is_winner = data;
    });

  return is_winner;
}

async function getCard() {
  let card;
  let gamer = {
    Mongo_id : mongo_id
  };
  await fetch(`${LOCAL}/api/Bingo/send-card`, {
    method: "POST",
    body: JSON.stringify(gamer),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      card = {
        id_card: data.id_card,
        B_id: json.b_id,
        I_id: data.i_id,
        N_id: data.n_id,
        G_id: data.g_id,
        O_id: data.o_id,
        id_gamer: data.id_gamer,
        game_number: data.game_number,
      };
    });

  return card;
}

async function setColumn(column_id) {
  let column;

  await fetch(`${LOCAL}/send-column/${column_id}`, {})
    .then((res) => res.json())
    .then((json) => {
      column = {
        id_letter: json.id,
        letter: json.letter,
        n1: json.n1,
        n2: json.n2,
        n3: json.n3,
        n4: json.n4,
        n5: json.n5
      };
    });

  return column;
}

async function sendBallotGamer(id, ballot) {
  await fetch(`${LOCAL}/api/bingo/ballot-marked/${id}`, {
    method: "PUT",
    body: JSON.stringify(ballot),
    headers: {
      "Content-type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });
}

async function initRoulette(seconds) {
  await fetch(`${LOCAL}/trigger`, {
    method: "POST",
    body: JSON.stringify(seconds),
    headers: {
      "Content-type": "application/json",
    },
  });
}

async function getBallots() {
  let ballots;

  await fetch(`${LOCAL}/BallotsObtained/send-game-ballots`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      ballots = data;
    });

  return ballots;
}

async function getGameState(id) {
  let state;

  await fetch(`${LOCAL}/api/bingo/current-game-state`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      state = data;
    });

  return state;
}

function isBallot(ballot) {
  for (let i = 0; i < ballots_obtained.length; i++) {
    if (ballot == ballots_obtained[i]) {
      return true;
    }
  }

  return false;
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

/**
 * *Imprime las balotas salidas de la ruleta en pantalla.
 */
function printBallots(ballots, ballots_string) {
  for (let i = 0; i < ballots.length; i++) {
    if (ballots[i] < 16) {
      ballots_string += "B" + ballots[i] + " | ";
    } else if (ballots[i] < 31 && ballots[i] > 15) {
      ballots_string += "I" + ballots[i] + " | ";
    } else if (ballots[i] < 46 && ballots[i] > 30) {
      ballots_string += "N" + ballots[i] + " | ";
    } else if (ballots[i] < 61 && ballots[i] > 45) {
      ballots_string += "G" + ballots[i] + " | ";
    } else {
      ballots_string += "O" + ballots[i] + " | ";
    }
  }
  document.getElementById("ballots-list").innerHTML = ballots_string;

  return ballots_string;
}

/**
 * *Método donde se ejecutan la mayoría de funcionalidades del programa.
 */
const main = async () => {
  let card = await getCard();

  await printPlayers();

  for (let i = 0; i < 5; i++) {
    let column;

    if (i == 0) {
      column = await setColumn(card.B_id);
    } else if (i == 1) {
      column = await setColumn(card.I_id);
    } else if (i == 2) {
      column = await setColumn(card.N_id);
    } else if (i == 3) {
      column = await setColumn(card.G_id);
    } else if (i == 4) {
      column = await setColumn(card.O_id);
    }

    printColumns(i + 1, column);
  }

  /**
   * * Se envía como parámetro el tiempo que tardaran en salir las balotas en segundos.
   */
  initRoulette(5);

  let currentGameState = await getGameState();
  let ballots_string = "";

  /**
   * *Se verifica constantemente si hay balotas nuevas. En caso de que haya un ganador,
   * *o que todos los jugadores queden descalificados, se termina el ciclo.
   */
  do {

    ballots_obtained = await getBallots();
    printBallots(ballots_obtained, ballots_string);

  } while (currentGameState);

  let winner;
  /**
   * *Se avisa a los jugadores perdedores que hay un ganador y se bloquean los botones.
   */
  if (!isWin) {
    document.getElementById("div-winner").innerHTML = "¡Ya hay un ganador!";

    winner = await getWinnerId();
    writeWinner(winner);

    bingo_btn.disable = true;
    tokens.forEach((btn) => (btn.disabled = true));
  }
};

main();