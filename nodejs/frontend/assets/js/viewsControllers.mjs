/**
 ** ============================= BINGO ===================================
 */
// Imprime las columnas por letra de la tabla de bingo.
export function printColumns(column_number, column_content) {
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
}

export function isBallot(ballot, ballotsObtained) {
  for (let i = 0; i < ballotsObtained.length; i++) {
    if (ballot == ballotsObtained[i]) {
      return true;
    }
  }

  return false;
}

export function markingBallots(ballotsObtained) {
  let cellNumberElements = document.querySelectorAll('.cell-number');

  cellNumberElements.forEach((e) => {
    ballotsObtained.forEach((ball) => {
      if (e.innerHTML == ball) {
        e.style.backgroundColor = 'rgb(255, 125, 125)';
      }
    });
  });
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
export function createTable(users) {
  const t_body = document.getElementById('t-bodyPlayers');

  deleteChilds(t_body);

  let tr;
  let td;

  for (let i = 0; i < users.length; i++) {
    tr = document.createElement('tr');
    t_body.appendChild(tr);

    td = document.createElement('td');
    td.innerHTML = i + 1;
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = 'player-' + (i + 1);
    td.innerHTML = users[i].userName;
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = 'winner-' + (i + 1);
    tr.appendChild(td);
  }
}

export function writeWinner(id, gamersList) {
  for (let i = 0; i < gamersList.length; i++) {
    if (gamersList[i].mongo_id == id) {
      document.getElementById(`winner-${i + 1}`).innerHTML = '&#128081';
    }
  }
}
