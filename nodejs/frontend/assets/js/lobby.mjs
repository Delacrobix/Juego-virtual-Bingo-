import {
  getBingoState,
  getGamerInGame,
  startGame,
  gamers,
  getUserName,
} from './httpRequest.mjs';
const socket = io();
const searchGameButton = document.getElementById('searchGame-btn');
const logout = document.getElementById('logout-btn');

logout.addEventListener('click', (e) => {
  e.preventDefault();

  window.location.href = `/logout`;
});

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

  if (!isStarted) {
    await startGame();
  }
  if (!isGamerInGame) {
    await gamers(getId());
  }

  window.location.href = `/bingo/${getId()}`;
}

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
  let t_body = document.getElementById('t-bodyPlayers');

  deleteChilds(t_body);

  let tr;
  let td;

  for (let i = 0; i < users.length; i++) {
    tr = document.createElement('tr');
    t_body.appendChild(tr);

    td = document.createElement('td');
    td.id = 't-counter' + (i + 1);
    td.innerHTML = i + 1;
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = 'player-' + (i + 1);
    td.innerHTML = users[i].userName;
    tr.style.color = '#FFFFFF';
    tr.appendChild(td);
  }
}

/*
 * ==================== SOCKETS =========================
 */
searchGameButton.addEventListener('click', () => {
  socket.emit('server:lobby-connection');

  searchGameButton.style.display = 'none';

  document.getElementById('countdown-min').style.visibility = 'visible';
  document.getElementById('countdown-sec').style.visibility = 'visible';
  document.getElementById('message').style.visibility = 'visible';
  document.getElementById('searchComment').innerHTML =
    "<h3 style='text-align: center;'>Buscando...</h3>" +
    '<br></br>Si no se encuentra jugadores al terminar el conteo, se le asignara una partida en single player.';
});

socket.on('server:users', (users) => {
  createTable(users);
});

(async () => {
  const userName = await getUserName(getId());

  socket.emit('client:user', userName.user);
})();

socket.on('server:time', (data) => {
  if (typeof data === 'boolean') {
    mainProcess();
  }

  var seg = Math.trunc(data.sec);
  var min = data.min;

  if (seg <= 9) {
    seg = ' 0' + seg;
  }

  if (isNaN(seg)) {
    seg = '00';
    min = '00';
  }

  document.getElementById('countdown-min').innerHTML = min + ':';
  document.getElementById('countdown-sec').innerHTML = seg;
});
