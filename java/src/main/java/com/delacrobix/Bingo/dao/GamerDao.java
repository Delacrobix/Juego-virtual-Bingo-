package com.delacrobix.Bingo.dao;

import com.delacrobix.Bingo.domain.Gamer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GamerDao extends CrudRepository<Gamer, Long> {

    @Query("select g from Gamer g where g.id_mongo=:id_mongo and g.game_number=:game_number")
    public List<Gamer> findGamer(
            @Param("id_mongo") String id_mongo,
            @Param("game_number") Long game_number
    );

    @Query("select g from Gamer g where g.game_number=:game_number")
    public List<Gamer> findAllGamersInGame(
            @Param("game_number") Long game_number
    );

    @Query("select g from Gamer g where g.id_mongo=:id_mongo")
    public List<Gamer> findByMongoId(
            @Param("id_mongo") String id_mongo
    );
}
