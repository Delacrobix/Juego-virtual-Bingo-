package com.delacrobix.Bingo.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Clase que representa las columnas del bingo.
 */
@Data
@Entity
@Table(name = "colum_letter")
public class ColumnLetter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_letter")
    private Long id_letter;

    /**
     * Representa la tabla en la cual estará la columna.
     */
    @Column(name = "id_card")
    private Long id_card;

    /**
     * Letra de la columna, puede ser cualquier letra de la palabra BINGO.
     */
    @Column(name = "letter")
    private char letter;

    /**
     * Números que estarán en cada posición de la columna.
     * El contenido de estos números dependerá de la letra de la columna
     * siguiendo las reglas del bingo convencional en Colombia.
     */
    @Column(name = "n1")
    private int n1;

    @Column(name = "n2")
    private int n2;

    @Column(name = "n3")
    private int n3;

    @Column(name = "n4")
    private int n4;

    @Column(name = "n5")
    private int n5;
}
