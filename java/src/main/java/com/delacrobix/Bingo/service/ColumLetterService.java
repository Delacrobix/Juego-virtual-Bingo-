package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.dao.ColumnLetterDao;
import com.delacrobix.Bingo.domain.ColumnLetter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ColumLetterService implements IColumLetterService{

    @Autowired
    private ColumnLetterDao columnLetter_dao;

    @Override
    @Transactional(readOnly = true)
    public List<ColumnLetter> list() {
        return (List<ColumnLetter>)columnLetter_dao.findAll();
    }

    @Override
    public Optional<ColumnLetter> findById(Long id){
        return columnLetter_dao.findById(id);
    }

    @Override
    @Transactional
    public ColumnLetter save(ColumnLetter columnLetter){
        return  columnLetter_dao.save(columnLetter);
    }

    public ColumnLetter generateColumn(int[] column, char letter, Long id_card){
        ColumnLetter columnLetter = new ColumnLetter();

        if(letter == 'N'){
            columnLetter.setLetter(letter);
            columnLetter.setN1(column[0]);
            columnLetter.setN2(column[1]);
            columnLetter.setN3(0);
            columnLetter.setN4(column[2]);
            columnLetter.setN5(column[3]);
        }else{
            columnLetter.setLetter(letter);
            columnLetter.setN1(column[0]);
            columnLetter.setN2(column[1]);
            columnLetter.setN3(column[2]);
            columnLetter.setN4(column[3]);
            columnLetter.setN5(column[4]);
        }

        columnLetter.setId_card(id_card);

        return columnLetter;
    }

    @Override
    public List<Integer[]> buildNumberArray(List<ColumnLetter> list, Long id){
        List<Integer[]> column_list = new ArrayList<>();

        for (ColumnLetter columnLetter : list) {
            if (Objects.equals(columnLetter.getId_card(), id)) {
                Integer[] numbers = {columnLetter.getN1(), columnLetter.getN2(), columnLetter.getN3(),
                                     columnLetter.getN4(), columnLetter.getN5()};

                column_list.add(numbers);
            }
        }

        return column_list;
    }
}
