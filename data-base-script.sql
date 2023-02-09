-- Active: 1658609909514@@127.0.0.1@3306
CREATE DATABASE BingoGame;
USE BingoGame;
USE bkvl7rgdvhkpygbbuzo9;

SHOW TABLES;

SELECT * FROM bingo;
SELECT * FROM card;
SELECT * FROM ballots_obtained;
SELECT * FROM countdown;
SELECT * FROM colum_letter;
SELECT * FROM gamers;

DROP TABLE Bingo;
DROP TABLE Gamers;
DROP TABLE column_letter;
DROP TABLE card;
DROP TABLE Ballots_obtained;

CREATE TABLE bingo(
    id int AUTO_INCREMENT,
    cards_id varchar(255), 
    gamers_id varchar(255), 
    game_state boolean, 
    winner_id varchar(100), 
    PRIMARY KEY (id)
);


CREATE TABLE gamers(
    id int AUTO_INCREMENT,
    mongo_id varchar(100),
    game_id int,
    gamer_ballots varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE column_letter(
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

CREATE TABLE card(
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

CREATE TABLE ballots_obtained(
    id int AUTO_INCREMENT,
    game_id int,
    ballots varchar(255),
    PRIMARY KEY (id)
);