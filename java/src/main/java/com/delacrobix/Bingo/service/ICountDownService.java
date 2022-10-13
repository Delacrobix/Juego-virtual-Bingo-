package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.domain.Countdown;

import java.util.List;

public interface ICountDownService {

    public Countdown save(Countdown countDown);

    public List<Countdown> list();

    public Countdown update(Long id, Countdown countDown);

    public void delete( Countdown countDown);

    public Countdown startCountdown(Countdown count);
}
