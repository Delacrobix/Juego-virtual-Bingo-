package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.dao.CountdownDao;
import com.delacrobix.Bingo.domain.Countdown;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CountdownService implements ICountDownService{

    @Autowired
    private CountdownDao countDown_dao;

    @Override
    @Transactional
    public Countdown save(Countdown countDown){
        return countDown_dao.save(countDown);
    }

    @Override
    @Transactional
    public List<Countdown> list(){
        return (List<Countdown>)countDown_dao.findAll();
    }

    @Override
    public Countdown update(Long id, Countdown countDown){
        countDown.setId(id);
        return countDown_dao.save(countDown);
    }

    @Override
    @Transactional
    public void delete( Countdown countDown){
        countDown_dao.delete(countDown);
    }

    @Override
    public Countdown startCountdown(Countdown count){
        var minutes = count.getMinute();
        var seconds = count.getSeg();

        do{
            if(seconds == 0) {
                minutes--;
                count.setMinute(minutes);

                if(minutes >= 0) {
                    seconds = 60;
                    count.setSeg(seconds);
                }
            } else {
                seconds--;
                count.setSeg(seconds);
            }

            try {
                Thread.sleep(1000);
            } catch (Exception e) {
                System.out.println(e);
            }

            update(count.getId(), count);
        }while((minutes >= -1) && (seconds >= 0));

        return count;
    }
}
