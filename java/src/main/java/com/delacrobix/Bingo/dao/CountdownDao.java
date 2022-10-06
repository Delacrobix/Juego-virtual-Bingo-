package com.delacrobix.Bingo.dao;

import com.delacrobix.Bingo.domain.Countdown;
import org.springframework.data.repository.CrudRepository;

public interface CountdownDao extends CrudRepository<Countdown, Long> {
}
