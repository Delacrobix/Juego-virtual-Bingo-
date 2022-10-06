package com.delacrobix.Bingo.dao;

import com.delacrobix.Bingo.domain.BallotsObtained;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface BallotsObtainedDao extends CrudRepository<BallotsObtained, Long> {

    @Modifying
    @Query("update BallotsObtained ballots set ballots.ballots =:ballots where ballots.game_number =:game_number")
    public void updateBallots(
            @Param(value = "game_number") Long game_number,
            @Param(value = "ballots") String ballots
    );

    @Query("select balls from BallotsObtained balls where balls.game_number = :game_number")
    public BallotsObtained searchByGameNumber(
        @Param(value = "game_number") Long game_number
    );
}
