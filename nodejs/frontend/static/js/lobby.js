//const JAVA_APP = 'https://bingo-module.rj.r.appspot.com';
//const LOCAL = 'https://bingo-module.rj.r.appspot.com';
const LOCAL = "http://localhost:8080";
const socket = io();
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
  let user = {
    id_mongo: gamer_id,
  };

  await fetch(`${LOCAL}/gamers`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json",
    },
  }).then((res) => res.json());
}

async function startGame() {
  let game;

  await fetch(`${LOCAL}/startGame`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      game = {
        game_number: json.game_number,
      };
    });

  return game;
}

async function getBingo() {
  let bingo;

  await fetch(`${LOCAL}/getActuallyGame`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      bingo = data;
    });

  return bingo.game_state;
}

async function countdown() {
  /**
   * *Si ya hay un juego iniciado, no permitirá ingresar a un nuevo jugador.
   */
  // if (await getBingo()) {
  //   alert(
  //     'Ya hay un juego iniciado, por favor, regrese en 5 min o cuando termine el juego'
  //   );
  //   window.location.href = '/login';
  // }

  //await delay(Math.floor(Math.random() * (2500 - 0) + 0));
  /**
   * *Crea el juego nuevo.
   */
  await startGame();

  /**
   * *Envía los ids de los jugadores al backend en spring boot.
   */
  await gamers(getId());
}

socket.on("server:count", (data) => {
  document.getElementById("countdown-min").innerHTML = data.min + " : ";
  document.getElementById("countdown-sec").innerHTML = data.seg;

  //window.location.href = '/bingo/' + getId();
});

socket.on("server:users", (users) => {
  createTable(users);
});

countdown();
