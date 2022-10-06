package com.delacrobix.Bingo.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Representa los datos que serán guardados en la base de datos
 * relacionados a un jugador.
 */
@Data
@Entity
@Table(name = "Gamers")
public class Gamer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_gamer")
    private Long id_gamer;

    /**
     * Representa el id obtenido de mongoDB
     */
    @Column(name = "id_mongo")
    private String id_mongo;

    /**
     * El juego en el que el jugador participo o esta participando.
     */
    @Column(name = "game_number")
    private Long game_number;

    /**
     * Representa las balotas que el jugador ha ido llenando de su tabla.
     * Este campo solo contendrá las balotas que coincidan con las que 
     * salgan de la ruleta.
     */
    @Column(name = "gamer_ballots")
    private String gamer_ballots;
}
