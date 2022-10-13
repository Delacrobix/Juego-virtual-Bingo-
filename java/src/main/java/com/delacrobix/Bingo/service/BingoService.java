package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.dao.BingoDao;
import com.delacrobix.Bingo.domain.Bingo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BingoService implements IBingoService{
    @Autowired //Para inyectar un ContactoDao
    private BingoDao bingo_dao;

    @Override
    @Transactional
    public List<Bingo> list() {
        return (List<Bingo>)bingo_dao.findAll();
    }

    @Override
    @Transactional
    public Bingo save(Bingo bingo) {
        return bingo_dao.save(bingo);
    }

    @Override
    public Bingo update(Long game_number, Bingo bingo) {
        bingo.setGame_number(game_number);
        return bingo_dao.save(bingo);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        bingo_dao.deleteById(id);
    }

    @Override
    public Optional<Bingo> findById(Long id) {
        return bingo_dao.findById(id);
    }

    /**
     * ! No implementado
     * @param id
     * @param bingo
     */
    @Override
    public void updateIdGamer(Long id, Bingo bingo) {

    }

    @Override
    public ArrayList<int[]> createCardNumbers(){
        ArrayList<int[]> columns = new ArrayList<>();

        columns.add(createColumn(5, 1, 15));
        columns.add(createColumn(5, 16, 30));
        columns.add(createColumn(4, 31, 45));
        columns.add(createColumn(5, 46, 60));
        columns.add(createColumn(5, 61, 75));

        return columns;
    }

    @Override
    public int[] createColumn(int cells, int min, int max){
        int[] column = new int[cells];
        int i = 0;

        while(i < cells){
            boolean flag = true;
            int n = (int)(Math.random() * (max - min + 1)) + min;

            for (int k : column) {
                if (k == n) {
                    flag = false;
                    break;
                }
            }

            if(flag) {
                column[i] = n;
                i++;
            }
        }

        return column;
    }

    @Override
    public int generateBallot(String ballots_string){
        List<Integer> ballots = new ArrayList<>();

        ballots = disassembleString(ballots_string);

        while(true){
            int random = (int)(Math.random() * (75 - 1 + 1)) + 1;
            boolean condition = true;

            for(Integer ball : ballots){
                if (random == ball) {
                    condition = false;
                    break;
                }
            }

            if(condition){
                return random;
            }
        }
    }

    @Override
    public List<Integer> disassembleString(String ballots){
        if(ballots == null){
            ballots = "";
        }

        List<Integer> ballots_numbers = new ArrayList<Integer>();
        Matcher searcher = Pattern.compile("\\d+").matcher(ballots);

        while (searcher.find()) {
            ballots_numbers.add(Integer.parseInt(searcher.group()));
        }

        return ballots_numbers;
    }

    @Override
    public String buildStringBallots(List<Integer> ballots) {
        StringBuilder ballots_string = new StringBuilder();

        for(int i : ballots){
            ballots_string.append(i).append(",");
        }

        return ballots_string.toString();
    }

    @Override
    public boolean isWinner(List<Integer> ballots, List<Integer[]> columns){
        if(fourCornersWin(ballots, columns)){
            return true;
        } else if (principalDiagonalWin(ballots, columns)) {
            return true;
        }else if(horizontalWin(ballots, columns)){
            return true;
        } else if (verticalWin(ballots, columns)) {
            return true;
        }else if (secondaryDiagonalWin(ballots, columns)) {
            return true;
        } else{
            return false;
        }
    }

    @Override
    public boolean fourCornersWin(List<Integer> ballots, List<Integer[]> columns){
        int[] corners = {0, 0, 0, 0};

        for (Integer ball :  ballots){
            if (Objects.equals(ball, columns.get(0)[0])){
                corners[0] = 1;
            } else if (Objects.equals(ball, columns.get(0)[4])) {
                corners[1] = 1;
            } else if (Objects.equals(ball, columns.get(4)[0])) {
                corners[2] = 1;
            } else if (Objects.equals(ball, columns.get(4)[4])) {
                corners[3] = 1;
            }
        }

        return isCorrect(corners);
    }

    @Override
    public boolean principalDiagonalWin(List<Integer> ballots, List<Integer[]> columns){
        int[] diagonal = {0, 0, 0, 0};

        for (Integer ball :  ballots){
            if (Objects.equals(ball, columns.get(0)[0])){
                diagonal[0] = 1;
            } else if (Objects.equals(ball, columns.get(1)[1])) {
                diagonal[1] = 1;
            } else if (Objects.equals(ball, columns.get(3)[3])) {
                diagonal[2] = 1;
            } else if (Objects.equals(ball, columns.get(4)[4])) {
                diagonal[3] = 1;
            }
        }

        return isCorrect(diagonal);
    }

    @Override
    public boolean secondaryDiagonalWin(List<Integer> ballots, List<Integer[]> columns){
        int[] diagonal = {0, 0, 0, 0};

        for (Integer ball :  ballots){
            if (Objects.equals(ball, columns.get(4)[0])){
                diagonal[0] = 1;
            } else if (Objects.equals(ball, columns.get(3)[1])) {
                diagonal[1] = 1;
            } else if (Objects.equals(ball, columns.get(1)[3])) {
                diagonal[2] = 1;
            } else if (Objects.equals(ball, columns.get(0)[4])) {
                diagonal[3] = 1;
            }
        }

        return isCorrect(diagonal);
    }

    @Override
    public boolean horizontalWin(List<Integer> ballots, List<Integer[]> columns){
        int[] horizontal = new int[5];
        Integer[] horizontal_numbers = new Integer[5];

        for (int j = 0; j < 5; j++) {
            Arrays.fill(horizontal, 0);

            for (int i = 0; i < 5; i++) {
                horizontal_numbers[i] = columns.get(i)[j];
            }

            for (Integer ball :  ballots){
                if (Objects.equals(ball, horizontal_numbers[0])){
                    horizontal[0] = 1;
                } else if (Objects.equals(ball, horizontal_numbers[1])) {
                    horizontal[1] = 1;
                } else if (Objects.equals(ball, horizontal_numbers[3])) {
                    horizontal[3] = 1;
                } else if (Objects.equals(ball, horizontal_numbers[4])) {
                    horizontal[4] = 1;
                } else if ((Objects.equals(ball, horizontal_numbers[2])) || (Objects.equals(0, horizontal_numbers[2]))) {
                    horizontal[2] = 1;
                }
            }

            if(isCorrect(horizontal)){
                return true;
            }
        }

        return false;
    }

    @Override
    public boolean verticalWin(List<Integer> ballots, List<Integer[]> columns){
        int[] vertical = new int[5];

        for (int j = 0; j < 5; j++) {
            Arrays.fill(vertical, 0);

            for (Integer ball :  ballots){
                if (Objects.equals(ball, columns.get(j)[0])){
                    vertical[0] = 1;
                } else if (Objects.equals(ball, columns.get(j)[1])) {
                    vertical[1] = 1;
                } else if (Objects.equals(ball, columns.get(j)[3])) {
                    vertical[3] = 1;
                } else if (Objects.equals(ball, columns.get(j)[4])) {
                    vertical[4] = 1;
                } else if ((Objects.equals(ball, columns.get(j)[2])) || (Objects.equals(0, columns.get(j)[2]))) {
                    vertical[2] = 1;
                }
            }

            if(isCorrect(vertical)){
                return true;
            }
        }

        return false;
    }

    @Override
    public boolean isCorrect(int[] marks){
        for (int i : marks){
            if (i == 0) {
                return false;
            }
        }

        return true;
    }
}
