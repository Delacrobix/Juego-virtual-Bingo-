import {
  isWinner,
  getPlayers,
  disqualifyPlayer,
  finishGame,
  getCard,
  getUserName,
  setColumn,
  gameHaveWinner,
  getBallots,
  getBallot,
  sendBallotGamer,
} from './httpRequest.mjs';
import {
  printColumns,
  isBallot,
  markingBallots,
  writeWinner,
  createTable,
} from './viewsControllers.mjs';
const tokens = document.querySelectorAll('.token');
const bingoBtn = document.getElementById('bingo-btn');
const exitBtn = document.getElementById('left-game-btn');
var ballotsObtained = [];
const mongoId = getId();
var gamersList = [];
const socket = io();
var intervalId;

const environment = {
  local: 'https://localhost:7006',
  prod: 'https://Delx.bsite.net',
};
const SERVER = environment.prod;

/**
 * *Evento que captura eventos realizados por el usuario en la tabla de bingo. Solo serán marcados los botones con balotas que ya hayan sido traídas del backend
 */
tokens.forEach((e) =>
  e.addEventListener('click', function () {
    if (isBallot(this.innerHTML, ballotsObtained)) {
      this.style.backgroundColor = 'rgb(255, 125, 125)';

      document.getElementById('div-alert').innerHTML = '¡Bien!';

      sendBallotGamer(mongoId, parseInt(this.innerHTML, 10));
    } else {
      document.getElementById('div-alert').innerHTML =
        'No puede marcar una casilla que no ha sido arrojada';
    }
  })
);

exitBtn.addEventListener('click', async () => {
  await disqualifyPlayer(mongoId);

  location.assign(`/lobby/${mongoId}`);
});

/*
 *Cuando se presiona el botón 'Bingo' Comprueba si el jugador que lo presiono si es el ganador, lo notifica al backend y a los usuarios terminando el juego, en caso contrario, elimina al jugador del juego.
 */
bingoBtn.addEventListener('click', async () => {
  let is_winner = await isWinner(mongoId);

  if (is_winner) {
    notifyWinner();
  } else {
    await disqualifyPlayer(mongoId);

    alert('Usted ha sido descalificado por notificar falsamente una victoria');

    location.assign(`/lobby/${mongoId}`);
  }
});

/*
 * Verifica si aun hay jugadores en el juego, si el numero es menor a 1, termina el juego
 */
async function verifyNumOfPlayers() {
  gamersList = await getPlayers();

  if (gamersList.length < 1) {
    await finishGame();
    alert(
      'Deben participar en el juego almenos un jugador. El juego sera finalizado.'
    );

    location.assign(`/lobby/${mongoId}`);
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
  let card = await getCard(mongoId);
  let userName = await getUserName(mongoId);

  socket.emit('client:user', userName.user);
  await verifyNumOfPlayers();

  // Se verifica que ya no exista un ganador del juego
  await gameHaveWinner(tokens, bingoBtn);
  let is_winner = await isWinner(mongoId);

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

  document.getElementById('3-3').innerHTML = '&#128512';

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${SERVER}/bingo-sockets`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .build();

  await connection.start().catch((err) => {
    console.error(err.message);
  });

  ballotsObtained = await getBallots();

  markingBallots(ballotsObtained);

  await connection.on('sendBallot', (ballot) => {
    ballotsObtained.push(ballot);

    markingBallots(ballotsObtained);
  });

  await getBallot();
};

main();

/*
 * ========================= SOCKETS ==============================
 */
(async () => {
  intervalId = setInterval(async () => {
    socket.on('server:winner', (winner) => {
      /*
       *Se avisa a los jugadores perdedores que hay un ganador y se bloquean los   botones.
       */
      if (winner != '') {
        document.getElementById('div-winner').innerHTML = '¡Ya hay un ganador!';

        writeWinner(winner, gamersList);
        bingoBtn.disable = true;
        tokens.forEach((btn) => (btn.disabled = true));

        clearInterval(intervalId);
      }
    });
  }, 1000);
})();

socket.on('server:users', (users) => {
  createTable(users);
});

/*
 * ===================== CONTROLADORES DE VISTAS =====================
 */

window.addEventListener('beforeunload', async (e) => {
  e.preventDefault();
  e.returnValue = '¿Seguro que quieres salir?';
  await disqualifyPlayer(mongoId);
});

function notifyWinner() {
  document.getElementById('div-winner').innerHTML = '¡Felicidades, GANASTE!';

  writeWinner(mongoId, gamersList);

  socket.emit('client:winner', mongoId);
  clearInterval(intervalId);

  tokens.forEach((btn) => (btn.disabled = true));
  bingoBtn.disable = true;
}
