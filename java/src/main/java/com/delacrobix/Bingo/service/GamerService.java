package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.dao.GamerDao;
import com.delacrobix.Bingo.domain.Gamer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class GamerService implements IGamerService{

    @Autowired
    private GamerDao gamer_dao;

    @Override
    @Transactional
    public Gamer save(Gamer gamer){
        return gamer_dao.save(gamer);
    }

    @Override
    @Transactional
    public List<Gamer> list(){
        return (List<Gamer>)gamer_dao.findAll();
    }

    @Override
    @Transactional
    public Gamer update(Long id, Gamer gamer){
        gamer.setId_gamer(id);
        return gamer_dao.save(gamer);
    }

    @Override
    public Gamer findGamer(Gamer gamer){
        List<Gamer> list = new ArrayList<>();

        list = gamer_dao.findGamer(gamer.getId_mongo(), gamer.getGame_number());

        return list.get(list.size() - 1);
    }

    @Override
    public List<Gamer> findAllGamersInGame(Gamer gamer){
        List<Gamer> list = new ArrayList<>();

        list = gamer_dao.findAllGamersInGame(gamer.getGame_number());

        return list;
    }

    @Override
    public Gamer findByMongoId(Gamer gamer){
        List<Gamer> list = new ArrayList<>();

        list = gamer_dao.findByMongoId(gamer.getId_mongo());

        return list.get(list.size() - 1);
    }
}
