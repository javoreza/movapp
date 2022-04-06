import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import kidsWords from '../../../data/translations/pro-deti.json';
import { Button } from '../../../components/basecomponents/Button';
import Card from './MemoryGameCard';
import { KidsTranslationsContainer } from '../../../components/basecomponents/KidsTranslationContainer';
import { createReadStream } from 'fs';
export { getStaticProps } from '../../../utils/localization';

export interface CardType {
  image: string;
  id: number;
  flipped: boolean;
}

const MemoryGame = ({ cardsData }: { cardsData: { image: string }[] }) => {
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const { t } = useTranslation();

  const [cards, setCards] = useState<CardType[]>([]);
  const [firstSelectedCard, setFirstSelectedCard] = useState<CardType | null>(null);
  const [secondSelectedCard, setSecondSelectedCard] = useState<CardType | null>(null);

  const newGame = () => {
    console.log('new game');
    // prepare and shuffle cards
    setCards([...cardsData, ...cardsData].sort(() => Math.random() - 0.5).map((card) => ({ ...card, id: Math.random(), flipped: false })));
    setFirstSelectedCard(null);
    setSecondSelectedCard(null);
  };

  const flippCard = (cardToFlip: CardType) =>
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
  // TODO: play flippcard sound...maybe

  const selectCard = (card: CardType) => {
    if (!firstSelectedCard && !card.flipped) {
      setFirstSelectedCard(card);
      flippCard(card);
    } else if (!secondSelectedCard && !card.flipped) {
      setSecondSelectedCard(card);
      flippCard(card);
    }
  };

  // game init
  useEffect(() => {
    newGame();
  }, []);

  // resolve selected cards
  useEffect(() => {
    if (firstSelectedCard && secondSelectedCard) {
      if (firstSelectedCard.image === secondSelectedCard.image) {
        setFirstSelectedCard(null);
        setSecondSelectedCard(null);
        console.log('cards match');
        // TODO: play voice
        if (cards.filter((card) => !card.flipped).length === 0) {
          console.log('victory');
          // TODO: play victory sound
        }
      } else {
        console.log('cards dont match');
        // TODO: play oh..no sound
        setTimeout(() => {
          flippCard(firstSelectedCard);
          flippCard(secondSelectedCard);
          setFirstSelectedCard(null);
          setSecondSelectedCard(null);
        }, 1500);
      }
    }
  }, [secondSelectedCard]);

  return (
    <div className="flex flex-col items-center">
      <div className="py-5">
        <Button text="New game" onClick={newGame} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <Card key={card.id} onClick={selectCard} card={card} />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
