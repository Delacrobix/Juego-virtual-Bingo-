const environment = {
  local: 'https://localhost:7006',
  prod: 'https://bingo-web.somee.com',
};

const SERVER = environment.prod;

export async function getGamerInGame(id) {
  let response;

  await fetch(`${SERVER}/api/bingo/is-in-current-game/${id}`, {})
    .then((res) => res.json())
    .then((data) => (response = data))
    .catch((err) => console.error(err));

  return response;
}

export async function gamers(gamerId) {
  let gamer = {
    Mongo_id: gamerId,
    Gamer_ballots: '',
  };

  await fetch(`${SERVER}/api/gamer/save-gamer-in-game`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gamer),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
    });
}

export async function getUserName(id) {
  let userName;

  await fetch(`/get-userName/${id}`, {})
    .then((res) => res.json())
    .then((data) => {
      userName = data;
    })
    .catch((err) => {
      console.error(err);
    });

  return userName;
}

export async function startGame() {
  await fetch(`${SERVER}/api/Bingo/new-game`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
    });
}

export async function getBingoState() {
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

export async function finishGame() {
  await fetch(`${SERVER}/api/bingo/finish-current`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function disqualifyPlayer(id) {
  let playerList;

  await fetch(`${SERVER}/api/bingo/disqualify`, {
    method: 'PUT',
    body: JSON.stringify(id),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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

export async function getPlayers() {
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

export async function isWinner(id) {
  let is_winner;

  await fetch(`${SERVER}/api/bingo/is-winner`, {
    method: 'PUT',
    body: JSON.stringify(id),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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

export async function getCard(id) {
  let card;
  let gamer = {
    Mongo_id: id,
  };

  await fetch(`${SERVER}/api/Bingo/send-card`, {
    method: 'POST',
    body: JSON.stringify(gamer),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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

export async function gameHaveWinner(tokens, bingoBtn) {
  let haveWinner;

  await fetch(`${SERVER}/api/bingo/game-have-winner`, {})
    .then((res) => res.json())
    .then((data) => (haveWinner = data))
    .catch((err) => console.error(err));

  if (haveWinner) {
    tokens.forEach((btn) => (btn.disabled = true));
    bingoBtn.disable = true;
  }
}

export async function setColumn(column_id) {
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

export async function sendBallotGamer(id, ballot) {
  await fetch(`${SERVER}/api/bingo/ballot-marked/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ballot),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getBallots() {
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

export async function getBallot() {
  let ballot;

  await fetch(`${SERVER}/api/bingo/send-ballot`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
