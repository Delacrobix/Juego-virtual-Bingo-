var ballots_obtained = [];
var bingo;
var gamers_list;
var isWin = false;
const mongoId = getId();
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

      sendBallotGamer(mongoId, parseInt(this.innerHTML, 10));
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

    writeWinner(mongoId);
    isWin = true;

    tokens.forEach((btn) => (btn.disabled = true));
    bingo_btn.disable = true;
  }else {
    await disqualifyPlayer();
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
      users[i] = await getPlayerName(gamers_list[i].mongo_id);
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
      console.log(user);
    }).catch(err => {
      console.error(err);
    });

  return user;
}

function writeWinner(id) {
  for (let i = 0; i < gamers_list.length; i++) {
    if (gamers_list[i].mongoId == id) {
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
      console.log("Winner: " + winnerId);
    })
    .catch((err) => {
      console.error(err);
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
  await fetch(`${LOCAL}/api/bingo/finish-current`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function disqualifyPlayer() {
  let playerList;

  await fetch(`${LOCAL}/api/bingo/disqualify`, {
    method: "PUT",
    body: JSON.stringify(mongoId),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      playerList = data;
      console.log(playerList);
    })
    .catch((err) => {
      console.log(err)
    });

  return playerList;
}

async function getPlayers() {
  let players;

  await fetch(`${LOCAL}/api/gamer/send-all-players`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      players = data;
      console.log(players);
    })
    .catch((err) => {
      console.error(err);
    });

  return players;
}

async function isWinner() {
  let is_winner;

  await fetch(`${LOCAL}/api/bingo/is-winner`, {
    method: "PUT",
    body: JSON.stringify(mongoId),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
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
    Mongo_id : mongoId
  };
  await fetch(`${LOCAL}/api/Bingo/send-card`, {
    method: "POST",
    body: JSON.stringify(gamer),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Card data: ", data);
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

  await fetch(`${LOCAL}/api/columnLetter/send-column/${column_id}`, {})
    .then((res) => res.json())
    .then((data) => {
      column = {
        id_letter: data.id,
        letter: data.letter,
        n1: data.n1,
        n2: data.n2,
        n3: data.n3,
        n4: data.n4,
        n5: data.n5
      }
    })
    .catch((err) => {
      console.error(err);
    });

  return column;
}

async function sendBallotGamer(id, ballot) {
  console.log("BALLOT: ", ballot)
  await fetch(`${LOCAL}/api/bingo/ballot-marked/${id}`, {
    method: "PUT",
    body: JSON.stringify(ballot),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then((res) => {
    return res.json();
  }).catch((err) =>{
    console.log(err);
  });
}

async function getBallots() {
  let ballots;

  await fetch(`${LOCAL}/api/BallotsObtained/send-game-ballots`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      ballots = data;
    }).catch(err => {
      console.error(err);
    });

  return ballots;
}

async function getGameState() {
  let state;

  await fetch(`${LOCAL}/api/bingo/current-game-state`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      state = data;
    }).catch((err) => {
      console.error(err);
    });

  return state;
}

async function getBallot(){
  let ballot;

  await fetch(`${LOCAL}/api/bingo/send-ballot`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then((res) => { 
      return res.json();
    })
    .then((data) => { 
      ballot = data;
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

    return ballot;
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

  let ballots_string = "";

  /**
   * *Se verifica constantemente si hay balotas nuevas. En caso de que haya un ganador,
   * *o que todos los jugadores queden descalificados, se termina el ciclo.
   */
  const connection = new signalR.HubConnectionBuilder()
              .withUrl(`${LOCAL}/bingo-sockets`, {
                skipNegotiation: true, 
                transport: signalR.HttpTransportType.WebSockets
              }).build();

  await connection.start()
    .then(() => {
      console.log('Connection started');
    })
    .catch(err => console.log(err.message));

  ballots_obtained = await getBallots();
  printBallots(ballots_obtained, ballots_string);
  
  await connection.on('sendBallot', (ballot) => {
    ballots_obtained.push(ballot);
    
    printBallots(ballots_obtained, ballots_string);
  });

  await getBallot();

  //  * *Se avisa a los jugadores perdedores que hay un ganador y se bloquean los botones.
  //  */
  if (isWin) {
    document.getElementById("div-winner").innerHTML = "¡Ya hay un ganador!";

    let winner = await getWinnerId();
    writeWinner(winner);

    bingo_btn.disable = true;
    tokens.forEach((btn) => (btn.disabled = true));
  }
};

main();