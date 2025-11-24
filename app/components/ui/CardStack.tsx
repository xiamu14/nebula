"use client";
import { Ref, useEffect, useImperativeHandle, useState } from "react";
import { motion } from "motion/react";

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

type Control = {
  next: () => void;
  prev: () => void;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
  control,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  control?: Ref<Control>;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useImperativeHandle(control, () => ({
    next() {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    },
    prev() {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.push(newArray.shift()!); // move the first element to the end
        return newArray;
      });
    },
  }));

  return (
    <div className="relative w-full h-full">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute flex flex-col justify-between bg-white dark:bg-black shadow-black/10 shadow-xl dark:shadow-white/5 p-4 border border-neutral-200 dark:border-white/10 rounded-3xl w-full h-full"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200">
              {card.content}
            </div>
            <div>
              <p className="font-medium text-neutral-500 dark:text-white">
                {card.name}
              </p>
              <p className="font-normal text-neutral-400 dark:text-neutral-200">
                {card.designation}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
