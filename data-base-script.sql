-- Active: 1658609909514@@127.0.0.1@3306
USE heroku_142cd4cfc7a1937;
SHOW TABLES;

SELECT * FROM Bingo;
SELECT * FROM Card;
SELECT * FROM Ballots_obtained;
SELECT * FROM Countdown;
SELECT * FROM Column_letter;
SELECT * FROM Gamers;

DROP TABLE Bingo;
DROP TABLE Gamers;
DROP TABLE Column_letter;
DROP TABLE Card;
DROP TABLE Ballots_obtained;
DROP TABLE countdown;

CREATE TABLE Bingo(
    id int AUTO_INCREMENT,
    cards_id varchar(255), 
    gamers_id varchar(255), 
    game_state boolean, 
    winner_id varchar(100), 
    PRIMARY KEY (id)
);
CREATE TABLE Gamers(
    id int AUTO_INCREMENT,
    mongo_id varchar(100),
    game_id int,
    gamer_ballots varchar(255),
    PRIMARY KEY (id)
);
CREATE TABLE Column_letter(
    id int AUTO_INCREMENT,
    card_id int,
    letter varchar(1),
    n1 int,
    n2 int,
    n3 int,
    n4 int,
    n5 int,
    PRIMARY KEY (id)
);
CREATE TABLE Card(
    id int AUTO_INCREMENT,
    B_id int,
    I_id int,
    N_id int,
    G_id int,
    O_id int,
    gamer_id int,
    game_id int,
    PRIMARY KEY (id)
);
CREATE TABLE Ballots_obtained(
    id int AUTO_INCREMENT,
    game_id int,
    ballots varchar(255),
    PRIMARY KEY (id)
);