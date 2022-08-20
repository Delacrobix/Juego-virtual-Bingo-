package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.domain.Bingo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface IBingoService {

    public List<Bingo> list();

    public Bingo save(Bingo bingo);

    public Bingo update(Long id, Bingo bingo);

    public void delete(Long id);

    public Optional<Bingo> findById(Long id);

    public void updateIdGamer(Long id, Bingo bingo);

    public ArrayList<int[]> createCardNumbers();

    public int generateBallot(String ballots_string);

    public int[] createColumn(int cells, int min, int max);

    public List<Integer> disassembleString(String ballots);

    public String buildStringBallots(List<Integer> ballots);

    public boolean isWinner(List<Integer> ballots, List<Integer[]> columns);

    public boolean fourCornersWin(List<Integer> ballots, List<Integer[]> columns);

    public boolean principalDiagonalWin(List<Integer> ballots, List<Integer[]> columns);

    public boolean secondaryDiagonalWin(List<Integer> ballots, List<Integer[]> columns);

    public boolean horizontalWin(List<Integer> ballot, List<Integer[]> columns);

    public boolean verticalWin(List<Integer> ballots, List<Integer[]> columns);

    public boolean isCorrect(int[] marks);
}
