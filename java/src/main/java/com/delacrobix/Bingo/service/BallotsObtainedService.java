package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.dao.BallotsObtainedDao;
import com.delacrobix.Bingo.domain.BallotsObtained;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class BallotsObtainedService implements IBallotsObtainedService{

    @Autowired
    private BallotsObtainedDao ballotsObtained_dao;

    @Override
    //@Transactional
    public void initRoule(Integer seconds) {
        List<Integer> ballots = new ArrayList<>();

        while(ballots.size() < 75) {
            var ballots_database = list();
            var ballot_db = ballots_database.get(ballots_database.size() - 1);

            int random = (int)(Math.random() * (75 - 1 + 1)) + 1;

            boolean condition = true;

            for(Integer ball : ballots){
                if (random == ball) {
                    condition = false;
                    break;
                }
            }

            if(condition){
                try {
                    for (int i = 0; i < (int)seconds; i++) {
                        Thread.sleep(1000);
                    }
                } catch (Exception e) {
                    System.out.println(e);
                }

                ballots.add(random);
                var string_ballots = buildStringBallots(ballots);
                ballot_db.setBallots(string_ballots);
                update(ballot_db.getId_ballots(), ballot_db);
            }
        }
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
    @Transactional
    public List<BallotsObtained> list() {
        return (List<BallotsObtained>)ballotsObtained_dao.findAll();
    }

    @Override
    @Transactional
    public BallotsObtained save(BallotsObtained ballotsObtained) {
        return ballotsObtained_dao.save(ballotsObtained);
    }

    @Override
    @Transactional
    public BallotsObtained update(Long id, BallotsObtained ballotsObtained) {
        ballotsObtained.setId_ballots(id);
        return ballotsObtained_dao.save(ballotsObtained);
    }

    @Override
    @Transactional
    public void updateBallots(Long game_number, BallotsObtained ballotsObtained){
        ballotsObtained_dao.updateBallots(game_number, ballotsObtained.getBallots());
    }

    @Override
    @Transactional
    public BallotsObtained searchByGamerNumber(Long game_number){
        return ballotsObtained_dao.searchByGameNumber(game_number);
    }
}
