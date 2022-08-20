-- Active: 1658609909514@@127.0.0.1@3306
CREATE DATABASE BingoGame;

USE BingoGame;

-- * Tabla contenedora de los datos principales del juego.
CREATE TABLE Bingo(
    game_number int AUTO_INCREMENT,
    id_cards varchar(100), 
    id_gamers varchar(100), 
    game_state boolean, 
    winner_id varchar(100), 
    PRIMARY KEY (game_number)
);


--* Guarda datos de los jugadores como su id en MongoDB, el numero del juego en el cual
--* estan participando, y las balotas que ha marcado en su tabla.
CREATE TABLE gamers(
    id_gamer int AUTO_INCREMENT,
    id_mongo varchar(50),
    game_number int,
    gamer_ballots varchar(100),
    PRIMARY KEY (id_gamer)
);

-- *Tabla contenedora de los datos de las columnas del bingo, del n1 al n5 representan los 5 
-- *numeros de la columna 'letter' asociada a una tabla mediante 'id_card'.
CREATE TABLE colum_letter(
    id_letter int AUTO_INCREMENT,
    id_card int,
    letter varchar(1),
    n1 int,
    n2 int,
    n3 int,
    n4 int,
    n5 int,
    PRIMARY KEY (id_letter)
);

--* Representa una tabla de bingo la cual esta asociada aun juego en especifico (game_number),
--* a un jugador en especifico y esta asociada a sus columnas correspondientes mediante un 
--* id de la tabla colum_letter.
CREATE TABLE card(
    id_card int AUTO_INCREMENT,
    B_id int,
    I_id int,
    N_id int,
    G_id int,
    O_id int,
    id_gamer int,
    game_number int,
    PRIMARY KEY (id_card)
);

--* Guarda las balotas obtenidas en la ruleta del juego. Estas balotas estan asociadas
--* a un juego en particular.
CREATE TABLE ballots_obtained(
    id_ballots int AUTO_INCREMENT,
    game_number int,
    ballots varchar(255),
    PRIMARY KEY (id_ballots)
);

--* Tabla que maneja el conteo atras del 'Lobby'. Solo se activa estando en el lobby.
--* Una vez termina el conteo se borran los datos. 
CREATE TABLE countdown(
    id int AUTO_INCREMENT,
    minute int,
    seg int,
    PRIMARY KEY (id)
);