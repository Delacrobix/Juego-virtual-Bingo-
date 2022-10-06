package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.domain.Gamer;

import java.util.List;

public interface IGamerService {

    public List<Gamer> list();

    public Gamer save(Gamer gamer);

    public Gamer update(Long id, Gamer gamer);

    public Gamer findGamer(Gamer gamer);

    public List<Gamer> findAllGamersInGame(Gamer gamer);

    public Gamer findByMongoId(Gamer gamer);
}
