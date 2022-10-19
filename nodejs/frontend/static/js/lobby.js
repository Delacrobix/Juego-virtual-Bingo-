//const JAVA_APP = 'https://bingo-module.rj.r.appspot.com';
//const LOCAL = 'https://bingo-module.rj.r.appspot.com';
const LOCAL = 'http://localhost:8080';
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

async function getTime() {
  let time;

  await fetch(`${LOCAL}/getCount`, {})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      time = data;
    });

  return time;
}

async function setTime(minutes, seg) {
  let time = {
    minute: minutes,
    seg: seg,
  };

  await fetch(`${LOCAL}/setCountdown`, {
    method: 'POST',
    body: JSON.stringify(time),
    headers: {
      'Content-type': 'application/json',
    },
  }).then((res) => res.json());

  return time;
}

async function gamers(gamer_id) {
  let user = {
    id_mongo: gamer_id,
  };

  await fetch(`${LOCAL}/gamers`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json',
    },
  }).then((res) => res.json());
}

async function startGame() {
  let game;

  await fetch(`${LOCAL}/startGame`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
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

  /**
   * * Método que configura el tiempo de espera en el lobby
   * * con los parámetros (minutos, segundos).
   */
  await setTime(0, 12);
  await delay(500);

  let time;

  //do {
    // try{
    //     time = await getTime();
    // } catch {
    //     break;
    // }

    // document.getElementById('countdown-min').innerHTML = time.minute + ' : ';
    // document.getElementById('countdown-sec').innerHTML = time.seg;

  //   await delay(250);
  // } while (time.minute >= -1 && time.seg >= 0);

  await delay(Math.floor(Math.random() * (2500 - 0) + 0));
  /**
   * *Crea el juego nuevo.
   */
  await startGame();

  /**
   * *Envía los ids de los jugadores al backend en spring boot.
   */
  await gamers(getId());

  await delay(250);

  //window.location.href = '/bingo/' + getId();
}

socket.on('Tiempo', function (data) {

  document.getElementById('countdown-min').innerHTML = data.min + ' : ';
  document.getElementById('countdown-sec').innerHTML = data.seg;
});

countdown();