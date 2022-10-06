package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.domain.ColumnLetter;

import java.util.List;
import java.util.Optional;

public interface IColumLetterService {

    public List<ColumnLetter> list();

    public ColumnLetter save(ColumnLetter columnLetter);

    public ColumnLetter generateColumn(int[] column, char letter, Long id_card);

    /**
     * Retorna las columnas de una tarjeta en forma de arreglos de enteros ordenados de la siguiente manera:
     * la columba B alojada en el registro 0, la I en el 1, la N en el 2, la G en el 3 y la O en el 4;
     * @param list
     * @param id
     * @return
     */
    public List<Integer[]> buildNumberArray(List<ColumnLetter> list, Long id);

    public Optional<ColumnLetter> findById(Long id);
}
