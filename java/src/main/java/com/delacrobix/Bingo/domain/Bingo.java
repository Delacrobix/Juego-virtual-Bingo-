package com.delacrobix.Bingo.domain;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Clase principal de la aplicación. Representa un juego de bingo.
 * Contiene los datos de las tablas usadas en el juego, los jugadores que
 * participaron y terminaron el juego, el estado del juego y su ganador si es que hubo.
 */
@Data
@Entity
@Table(name = "bingo")
public class Bingo implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "game_number")
    private Long game_number;

    /**
     * Representa los ids de las tablas de bingo usadas en el juego.
     * Están contenidas en un String separadas por 'comas'.
     */
    @Column(name = "id_cards")
    private String id_cards;

    /**
     * Representa los ids de los jugadores (ids SQL, osea, números enteros)
     * que participaron y terminaron el juego.
     * Están contenidos en un String separados por 'comas'.
     */
    @Column(name = "id_gamers")
    private String id_gamers;

    /**
     * Define si el juego esta en curso o no.
     * true: en juego, false: terminado.
     */
    @Column(name = "game_state")
    private boolean game_state;

    /**
     * Guarda el id de mongoDB del ganador del juego.
     */
    @Column(name = "winner_id")
    private String winner_id;
}