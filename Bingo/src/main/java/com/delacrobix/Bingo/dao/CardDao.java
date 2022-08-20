package com.delacrobix.Bingo.dao;

import com.delacrobix.Bingo.domain.Card;
import com.delacrobix.Bingo.domain.Gamer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface CardDao extends CrudRepository<Card, Long> {
    @Query("select c from Card c where c.id_gamer = :id_gamer")
    public Card findByGamerId(
            @Param(value = "id_gamer") Long id_gamer
    );
}
