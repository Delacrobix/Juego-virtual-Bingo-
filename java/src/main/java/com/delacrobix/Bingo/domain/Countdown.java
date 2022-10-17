package com.delacrobix.Bingo.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Clase diseñada para tener un control del contador del lobby.
 * El registro en la tabla se actualiza cada segundo. Cuando los campos
 * minute y seg lleguen ambos a 0, se eliminara el registro de la tabla
 * quedando vacía. Para el buen funcionamiento del lobby la tabla countdown
 * debe estar siempre vacía.
 */
@Data
@Entity
@Table(name = "countdown")
public class Countdown implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "minute")
    private int minute;

    @Column(name = "seg")
    private int seg;
}
