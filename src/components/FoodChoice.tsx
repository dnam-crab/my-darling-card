import { useState } from "react";

type FoodChoiceProps = {
  onNext: (food: string) => void;
};

const foodOptions = [
  { label: "Pizza", emoji: "🍕" },
  { label: "Sushi", emoji: "🍣" },
  { label: "Burgers", emoji: "🍔" },
  { label: "Fries", emoji: "🍟" },
  { label: "Tacos", emoji: "🌮" },
  { label: "Pasta", emoji: "🍝" },
];

export function FoodChoice({ onNext }: FoodChoiceProps) {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);

  return (
    <section className="food-choice" data-component="food-choice">
      <div className="food-card">
        <p className="food-question">What are we feeling?</p>
        <p className="food-subtitle">Pick what we&apos;re craving for our date</p>

        <div className="food-options">
          {foodOptions.map((food) => (
            <button
              className={`food-option${
                selectedFood === food.label ? " food-option--selected" : ""
              }`}
              key={food.label}
              type="button"
              onClick={() => setSelectedFood(food.label)}
            >
              <span className="food-emoji" aria-hidden="true">
                {food.emoji}
              </span>
              <span>{food.label}</span>
            </button>
          ))}
        </div>

        <button
          className="next-button"
          type="button"
          disabled={!selectedFood}
          onClick={() => onNext(selectedFood!)}
        >
          NEXT ♥
        </button>
      </div>
    </section>
  );
}
