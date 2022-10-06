package com.delacrobix.Bingo.dao;

import com.delacrobix.Bingo.domain.Bingo;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface BingoDao extends CrudRepository<Bingo, Long> {
    @Modifying
    @Query("update Bingo game set game.id_gamers = :id_gamers where game.game_number = :game_number")
    public void updateGamersId(
            @Param(value = "game_number") Long game_number,
            @Param(value = "id_gamers") Long id_gamers
    );
}
