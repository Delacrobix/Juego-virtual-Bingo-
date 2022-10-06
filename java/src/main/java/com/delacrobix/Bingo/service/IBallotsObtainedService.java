package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.domain.BallotsObtained;

import java.util.List;

public interface IBallotsObtainedService {

    public List<BallotsObtained> list();

    public BallotsObtained save(BallotsObtained ballotsObtained);

    public BallotsObtained update(Long id, BallotsObtained ballotsObtained);

    public void updateBallots(Long game_number, BallotsObtained ballotsObtained);

    public void initRoule(Integer seconds);

    public String buildStringBallots(List<Integer> ballots);

    public BallotsObtained searchByGamerNumber(Long game_number);
}
