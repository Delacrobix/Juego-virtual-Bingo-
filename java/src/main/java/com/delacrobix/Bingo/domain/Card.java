package com.delacrobix.Bingo.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Representa una tabla de bingo la cual estará asociada a sus respectivas columnas
 * y al juego correspondiente.
 */
@Data
@Entity
@Table(name = "card")
public class Card implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_card")
    private Long id_card;

    /**
     * La columna B del juego
     */
    @Column(name = "B_id")
    private Long b_id;

    /**
     * La columna I del juego
     */
    @Column(name = "I_id")
    private Long i_id;

    /**
     * La columna N del juego
     */
    @Column(name = "N_id")
    private Long n_id;

    /**
     * La columna G del juego
     */
    @Column(name = "G_id")
    private Long g_id;

    /**
     * La columna O del juego
     */
    @Column(name = "O_id")
    private Long o_id;

    /**
     * Representa el jugador que usa la tabla
     */
    @Column(name = "id_gamer")
    private Long id_gamer;

    /**
     * Representa el juego al cual pertenece la tabla
     */
    @Column(name = "game_number")
    private Long game_number;
}
