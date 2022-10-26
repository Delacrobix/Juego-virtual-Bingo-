package com.delacrobix.Bingo.controller;

import com.delacrobix.Bingo.domain.*;
import com.delacrobix.Bingo.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
public class BingoController {
    @Autowired
    private BingoService bingo_service;
    @Autowired
    private GamerService gamer_service;

    @Autowired
    private ColumLetterService columnLetter_service;

    @Autowired
    private CardService card_service;

    @Autowired
    private BallotsObtainedService ballotsObtained_service;
    
    /**
     * Recibe un usuario y lo guarda en la base de datos.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @PostMapping(path = "/gamers")
    public ResponseEntity<Gamer> saveGamers(@RequestBody Gamer gamer){
        var game = bingo_service.list().get(bingo_service.list().size() - 1);

        gamer.setGame_number(game.getGame_number());

        gamer_service.save(gamer);
        log.info("Jugador ingresado: {}", gamer);

        return new ResponseEntity<>(gamer, HttpStatus.CREATED);
    }


    /**
     * Inicia el juego asignando una clave principal 'game_number' al juego.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @PostMapping(path = "/startGame")
    public ResponseEntity<Bingo> startGame(){
        var bingo = new Bingo();
        var bingo_list = bingo_service.list();

        try {
            // *Obtiene el ultimo elemento de la lista.
            var game = bingo_list.get(bingo_list.size() - 1);

            // *Si no hay un juego activo crea un juego.
            if(!game.isGame_state()){
                bingo.setGame_state(true);
                bingo_service.save(bingo);
            }

            return new ResponseEntity<>(bingo, HttpStatus.CREATED);
        }catch (Exception e){
            bingo.setGame_state(true);
            bingo_service.save(bingo);

            return new ResponseEntity<>(bingo, HttpStatus.CREATED);
        }
    }

    /**
     * @return retorna los datos del juego que esta actualmente en curso.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @GetMapping(path = "/getActuallyGame")
    public ResponseEntity<Bingo> getActuallyGame() {
        try {
            var game = bingo_service.list().get(bingo_service.list().size() - 1);
            log.info(String.valueOf(bingo_service.list().size()));

            if(game.isGame_state()){
                return new ResponseEntity<>(game, HttpStatus.ACCEPTED);
            } else {
                Bingo bingo = new Bingo();
                bingo.setGame_state(false);
                return new ResponseEntity<>(bingo, HttpStatus.ACCEPTED);
            }
        } catch (Exception e){
            log.info("No hay juegos iniciados");
            Bingo game = new Bingo();
            game.setGame_state(false);

            return new ResponseEntity<>(game, HttpStatus.ACCEPTED);
        }
    }

    /**
     * Este método se encarga de asignar todos los datos necesarios a la tabla
     * de bingo. Columnas, asociación al jugador, asociación al juego y creación de las columnas
     * guardando todo lo anterior en la base de datos.
     * @return Envía una tabla de bingo al usuario.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @PostMapping(path = "/sendCards")
    public ResponseEntity<Card> sendCards(@RequestBody Gamer player){
        var card_numbers = bingo_service.createCardNumbers();
        var card_database = new Card();

        var game_list = bingo_service.list();
        var game = game_list.get(game_list.size() - 1);

        var gamer = gamer_service.findByMongoId(player);

        card_service.save(card_database);
        var cards = (List<Card>) card_service.list();

        card_database = cards.get(cards.size() - 1);

        Long[] id_column = new Long[5];

        var column = columnLetter_service.generateColumn(card_numbers.get(0), 'B', card_database.getId_card());
        columnLetter_service.save(column);

        var column_list = columnLetter_service.list();
        id_column[0] = column_list.get(column_list.size() - 1).getId_letter();

        column = columnLetter_service.generateColumn(card_numbers.get(1), 'I', card_database.getId_card());
        columnLetter_service.save(column);

        column_list = columnLetter_service.list();
        id_column[1] = column_list.get(column_list.size() - 1).getId_letter();

        column = columnLetter_service.generateColumn(card_numbers.get(2), 'N', card_database.getId_card());
        columnLetter_service.save(column);

        column_list = columnLetter_service.list();
        id_column[2] = column_list.get(column_list.size() - 1).getId_letter();

        column = columnLetter_service.generateColumn(card_numbers.get(3), 'G', card_database.getId_card());
        columnLetter_service.save(column);

        column_list = columnLetter_service.list();
        id_column[3] = column_list.get(column_list.size() - 1).getId_letter();

        column = columnLetter_service.generateColumn(card_numbers.get(4), 'O', card_database.getId_card());
        columnLetter_service.save(column);

        column_list = columnLetter_service.list();
        id_column[4] = column_list.get(column_list.size() - 1).getId_letter();

        var card = card_service.generateCard(id_column, game.getGame_number(), gamer.getId_gamer());

        var card_id = bingo_service.disassembleString(game.getId_cards());
        var gamer_id = bingo_service.disassembleString((game.getId_gamers()));

        card_id.add((int)(long)card_database.getId_card());
        gamer_id.add((int)(long)gamer.getId_gamer());

        game.setId_cards(bingo_service.buildStringBallots(card_id));
        game.setId_gamers(bingo_service.buildStringBallots(gamer_id));

        bingo_service.update(game.getGame_number(), game);
        card = card_service.update(card_database.getId_card(), card);

        return new ResponseEntity<>(card, HttpStatus.CREATED);
    }

    /**
     * Envía una columna.
     * @param id de la columna requerida.
     * @return la columna encontrada de la búsqueda por id en la base de datos.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @GetMapping(path = "/sendColumn/{id}")
    public ResponseEntity<Optional<ColumnLetter>> sendColumn(@PathVariable("id") Long id) {
        var column = columnLetter_service.findById(id);

        return new ResponseEntity<>(column, HttpStatus.ACCEPTED);
    }

    /**
     * @return la lista de todos los jugadores participantes del juego en curso.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @GetMapping(path = "/allGamers")
    public ResponseEntity<List<Gamer>> sendPlayers() {
        var game_list = bingo_service.list();
        var gamer = new Gamer();

        gamer.setGame_number(game_list.get(game_list.size() - 1).getGame_number());

        var gamers = gamer_service.findAllGamersInGame(gamer);

        return new ResponseEntity<>(gamers, HttpStatus.ACCEPTED);
    }

    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @GetMapping(path = "/isInGame/{id}")
    public ResponseEntity<Boolean> isInGame(@PathVariable("id") Long id) {
        var game = bingo_service.findById(id);

        return new ResponseEntity<>(game.get().isGame_state(), HttpStatus.ACCEPTED);
    }

    /**
     * Obtiene la balota que un jugador marco para actualizar la lista de balotas marcadas
     * por el jugador en la base de datos.
     * @param ballot ballot marcada por el jugador en el front end.
     * @param mongo_id id del jugador que marco la balota.
     * @return el jugador actualizado.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @PostMapping(path = "/ballotsGamer/{mongo_id}")
    public ResponseEntity<Gamer> ballotsFromGamer(@PathVariable("mongo_id") String mongo_id, @RequestBody Integer ballot){
        var gamer_database = new Gamer();
        var gamer = new Gamer();

        var game_list = bingo_service.list();
        var game = game_list.get(game_list.size() - 1);

        gamer.setId_mongo(mongo_id);

        gamer_database = gamer_service.findByMongoId(gamer);
        gamer_database.setGame_number(game.getGame_number());

        List<Integer> ballots_gamer;

        try{
            // *Se obtienen las balotas sacadas marcadas por el jugador y se depositan en una lista
            ballots_gamer = bingo_service.disassembleString(gamer_database.getGamer_ballots());
        }catch (Exception e){
            ballots_gamer = new ArrayList<Integer>();
        }

        ballots_gamer.add(ballot);
        gamer_database.setGamer_ballots(bingo_service.buildStringBallots(ballots_gamer));
        gamer_service.update(gamer_database.getId_gamer(), gamer_database);

        return new ResponseEntity<>(gamer_database, HttpStatus.CREATED);
    }

    /**
     * Inicia la ruleta de la cual saldrán las 75 balotas del juego.
     * @param seconds segundos que servirán de intervalo entre balota y balota.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @PostMapping(path = "/trigger")
    public ResponseEntity<String> ballotsTrigger(@RequestBody Integer seconds) {
        var game_list = bingo_service.list();
        var game = game_list.get(game_list.size() - 1);

        if (ballotsObtained_service.list().size() == 0) {
            BallotsObtained ballots_obtained = new BallotsObtained();
            ballots_obtained.setGame_number(game.getGame_number());
            ballotsObtained_service.save(ballots_obtained);

            ballotsObtained_service.initRoule(seconds);
        } else {
            var aux = ballotsObtained_service.searchByGamerNumber(game.getGame_number());

            if (aux == null) {

                BallotsObtained ballots_obtained = new BallotsObtained();
                ballots_obtained.setGame_number(game.getGame_number());
                ballotsObtained_service.save(ballots_obtained);

                ballotsObtained_service.initRoule(seconds);

                return new ResponseEntity<>("Todas las balotas han sido sacadas", HttpStatus.ACCEPTED);

            }else if(!Objects.equals(aux.getGame_number(), game.getGame_number())) {
                BallotsObtained ballots_obtained = new BallotsObtained();
                ballots_obtained.setGame_number(game.getGame_number());
                ballotsObtained_service.save(ballots_obtained);

                ballotsObtained_service.initRoule(seconds);

                return new ResponseEntity<>("Todas las balotas han sido sacadas", HttpStatus.ACCEPTED);
            }  else {
                return new ResponseEntity<>("Ya se están sacando balotas", HttpStatus.ACCEPTED);
            }
        }
        return new ResponseEntity<>("Todas las balotas han sido sacadas", HttpStatus.ACCEPTED);
    }

    /**
     * Termina el juego cambiando su estado de true, a false.
     * @return el juego actualizado.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @PostMapping(path = "/endGame")
    public ResponseEntity<Bingo> finishGame() {
        var game_list = bingo_service.list();
        var game = game_list.get(game_list.size() - 1);

        game.setGame_state(false);
        bingo_service.update(game.getGame_number(), game);

        return new ResponseEntity<>(game, HttpStatus.ACCEPTED);
    }

    /**
     * Desasocia un jugador del juego en el cual esta participando.
     * Este método es usado cuando un jugador anuncia su victoria sin realmente 
     * haber ganado.
     * @param gamer jugador a descalificar.
     * @return la lista de jugadores que aun están en el juego.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @PostMapping(path = "/disqualify")
    public ResponseEntity<List<Integer>> disqualifyPlayer(@RequestBody Gamer gamer) {
        var player = gamer_service.findByMongoId(gamer);

        // *Retorna el ultimo elemento de la lista
        var game = bingo_service.list().get(bingo_service.list().size() - 1);
        var players_inGame = bingo_service.disassembleString(game.getId_gamers());

        // *Se excluye el ID del jugador de la lista de IDS del juego
        if(!players_inGame.isEmpty()) {
            for (int i = 0; i < players_inGame.size(); i++) {
                if((int)players_inGame.get(i) ==  (int)(long)player.getId_gamer()){
                    players_inGame.remove(i);
                    break;
                }
            }
        } else {
            return new ResponseEntity<>(players_inGame, HttpStatus.ACCEPTED);
        }

        // *Se desasocia el jugador del juego
        player.setGame_number((Long)(long) 0);
        gamer_service.update(player.getId_gamer(), player);

        // *Guarda el juego con la lista de jugadores actualizada
        game.setId_gamers(bingo_service.buildStringBallots(players_inGame));
        bingo_service.update(game.getGame_number(), game);

        return new ResponseEntity<>(players_inGame, HttpStatus.ACCEPTED);
    }

    /**
     * Obtiene todas las balotas del juego en curso.
     * @return una lista de Integers con cada una de las balotas sacadas en el juego
     * por la ruleta.
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @GetMapping(path = "/allBallots")
    public ResponseEntity<List<Integer>> allBallots() {
        var ballots_list = ballotsObtained_service.list();
        var list = bingo_service.disassembleString(ballots_list.get(ballots_list.size() - 1).getBallots());

        return new ResponseEntity<>(list, HttpStatus.ACCEPTED);
    }

    /**
     * Verifica si el jugador enviado es el ganador. true: es ganador, false: no es ganador.
     * @param gamer
     * @return
     */
    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @PostMapping(path = "/winner")
    public ResponseEntity<Boolean> isWinner(@RequestBody Gamer gamer){

        // *Se obtienen las balotas marcadas por el jugador
        var gamer_database = gamer_service.findByMongoId(gamer);
        List<Integer> ballots_gamer;

        try {
            ballots_gamer = bingo_service.disassembleString(gamer_database.getGamer_ballots());
        } catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.ACCEPTED);
        }

        var card_database = card_service.findByGamerId(gamer_database.getId_gamer());
        var column_list = columnLetter_service.list();

        // *Se obtiene las columnas de la tabla
        var column_numberList = columnLetter_service.buildNumberArray(column_list,
                                                card_database.getId_card());

        // *Verifica si el jugador es ganador
        var is_win = bingo_service.isWinner(ballots_gamer, column_numberList);

        if(is_win){
            var game_list = bingo_service.list();
            var game = game_list.get(game_list.size() - 1);

            game.setGame_state(false);
            game.setWinner_id(gamer.getId_mongo());

            bingo_service.update(game.getGame_number(), game);
        }

        return new ResponseEntity<>(is_win, HttpStatus.ACCEPTED);
    }

    //@CrossOrigin(origins = "https://auth-module.up.railway.app")
    @GetMapping(path = "/getWinner")
    public ResponseEntity<Bingo> getWinner(){
        var game = bingo_service.list().get(bingo_service.list().size() - 1);

        return new ResponseEntity<>(game, HttpStatus.ACCEPTED);
    }
}

/*TODO: Realizar el envio de cartas a un jugador que se haya desconectado, vuelva a ingresar y el juego aun este activo
        Esto debe retornar las tablas del jugador con las fichas marcadas por el. Se debe buscar su ID en el juego, en
        en caso de que haya sido descalificado, no podra volver
 */

/* TODO: controlar que el usuario sea unico a la hora de registrarse */

/* TODO: En caso de que el juego este en curso y un nuevo usuario entre, lanzarle un mensaje que vuelva pronto */

/* TODO: mostrar lista de jugadores en sala de espera*/

/* TODO: Documentacion de como usar el programa con pantallazos, inclusibe la experiencia de ussuario*/

/* TODO: documentar script base de datos */

/*TODO: quices*/

/* TODO: Controlar el caso en que salgan todas las balotas */

/*TODO: eliminar el count_state*/

/*TODO: cuando solo un jugador juega, el juego no se cierra cuando un jugador es descalificado*/

/*TODO: detener el juego una vez haya terminado (backend)*/

/*TODO: mejorar optimizacion a la hora de buscar balotas*/
