package com.delacrobix.Bingo.domain;

import lombok.Data;

import javax.persistence.*;

/**
 * Clase que representa las balotas obtenidas de "girar" la ruleta.
 */
@Data
@Entity
@Table(name = "ballots_obtained")
public class BallotsObtained{

    private static final long serialVersionUID = 1L;
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ballots")
    private Long id_ballots;

    /**
     * Representa el numero de juego que se esta jugando
     */
    @Column(name = "game_number")
    private Long game_number;

    /**
     * Representa las balotas. Serán guardadas en un String
     * separadas por "comas".
     */
    @Column(name = "ballots")
    private String ballots;
}
