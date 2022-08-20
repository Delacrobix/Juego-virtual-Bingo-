package com.delacrobix.Bingo.service;

import com.delacrobix.Bingo.domain.Card;

import java.util.List;

public interface ICardService {

    public List<Card> list();

    public Card save(Card card);

    public Card update(Long id, Card card);

    public Card findByGamerId(Long id);

    public Card generateCard(Long[] ids, Long id_game, Long id_gamer);
}
