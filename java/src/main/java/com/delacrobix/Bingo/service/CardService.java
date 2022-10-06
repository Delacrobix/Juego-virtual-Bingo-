package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.dao.CardDao;
import com.delacrobix.Bingo.domain.Bingo;
import com.delacrobix.Bingo.domain.Card;
import com.delacrobix.Bingo.domain.ColumnLetter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CardService implements ICardService{

    @Autowired
    private CardDao card_dao;

    @Override
    public List<Card> list(){
        return (List<Card>) card_dao.findAll();
    }

    @Override
    @Transactional
    public Card save(Card card){
        return card_dao.save(card);
    }

    @Override
    @Transactional
    public Card update(Long id, Card card){
        card.setId_card(id);
        return card_dao.save(card);
    }

    @Override
    public Card findByGamerId(Long id){
        return card_dao.findByGamerId(id);
    }

    public Card generateCard(Long[] ids, Long id_game, Long id_gamer){
        Card card = new Card();

        card.setB_id(ids[0]);
        card.setI_id(ids[1]);
        card.setN_id(ids[2]);
        card.setG_id(ids[3]);
        card.setO_id(ids[4]);

        card.setGame_number(id_game);
        card.setId_gamer(id_gamer);

        return card;
    }
}
