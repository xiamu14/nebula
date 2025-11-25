"use client";
import { Ref, useEffect, useImperativeHandle, useState } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";

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
    <div className="relative h-full w-full">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute flex h-full w-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-4 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-black dark:shadow-white/5"
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-500 dark:text-white">
                  {card.name}
                </p>
                <p className="font-normal text-neutral-400 dark:text-neutral-200">
                  {card.designation}
                </p>
              </div>
              <div className="cursor-pointer">
                <Icon
                  icon="gravity-ui:pencil-to-line"
                  width={20}
                  color="#999"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
