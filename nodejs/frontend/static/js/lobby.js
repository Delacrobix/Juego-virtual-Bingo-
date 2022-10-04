/**
 * *Obtiene el id del jugador que esta en la url.
 */
function getId(){
    let pathname = window.location.pathname;
    pathname = pathname.slice(1)

    return pathname;
}

async function getTime(){
    let time;

    await fetch('http://localhost:8080/getCount', {})
        .then(res => {
            return res.json();
        }).then(data => {
            time = data;
        });

    return time;
}

async function setTime(minutes, seg){
    let time = {
        minute: minutes,
        seg: seg
    };

    await fetch('http://localhost:8080/setCountdown', {
        method: 'POST',
        body: JSON.stringify(time),
        headers: {
            'Content-type': 'application/json',
        }
    }).then(res => res.json())
      .then(data => {
        console.log(data);
      });

    return time;
}

async function gamers(gamer_id){
    let user = {
        id_mongo: gamer_id
    }

    await fetch('http://localhost:8080/gamers', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json',
        }
    }).then(res => res.json())
      .then(data => console.log(data));
}

async function startGame(){
    let game;
    await fetch('http://localhost:8080/startGame', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        }
    })  
        .then(res => res.json())
        .then(json =>{
            game = {
                game_number: json.game_number
            }
        });

    return game;
}

async function getBingo(){
    let bingo;

    await fetch('http://localhost:8080/getActuallyGame', {})  
        .then(res => {
            return res.json();
        }).then(data => {
			bingo = data;
		});

    return bingo.game_state;
}

async function countdown(){
    const delay = ms => new Promise(res => setTimeout(res, ms));

    /**
     * *Si ya hay un juego iniciado, no permitirá ingresar a un nuevo jugador.
     */
    if(await getBingo()){
        alert('Ya hay un juego iniciado, por favor, regrese en 5 min o cuando termine el juego');
        window.location.href = '/login';
    }
    
    /**
     * * Método que configura el tiempo de espera en el lobby
     * * con los parámetros (minutos, segundos).
     */
    setTime(0, 15);
    await delay(500);

    let time;

    do{
        try{
            time = await getTime();
        } catch {
            break;
        }
        
        document.getElementById('countdown-min').innerHTML = time.minute + ' : ';
        document.getElementById('countdown-sec').innerHTML = time.seg;

        await delay(250);
    }while((time.minute >= -1) && (time.seg >= 0));

    await delay(Math.floor(Math.random() * (2500 - 0) + 0));
    /**
     * *Crea el juego nuevo.
     */
    await startGame();

    /**
     * *Envía los ids de los jugadores al backend en spring boot.
     */
    await gamers(getId());

    window.location.href = '/bingo/' + getId();
}

countdown();
