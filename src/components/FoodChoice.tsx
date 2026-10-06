import { useEffect, useRef, useState } from "react";
import { smokeDisintegrate } from "../effects/smokeDisintegrate";
import snapVideoUrl from "../../assets/clips/Snap.mp4";

type FoodChoiceProps = {
  onNext: (food: string) => void;
};

const foodOptions = [
  { label: "Cay Một Cách Thanh Lịch", emoji: "🌶️" },
  { label: "Tây Vị Quý Tộc", emoji: "🍝" },
  { label: "Quý Tộc Lõi Hồng", emoji: "🥩" },
  { label: "Gia Phả Xương Xẩu", emoji: "🍖" },
  { label: "Ngưu Ma Vương Nghỉ Phép", emoji: "🐄" },
  { label: "Khói Tận Cam Lai", emoji: "🔥" },
  { label: "Món gìii cũnggg đượccccc", emoji: "🤷", anything: true },
];

export function FoodChoice({ onNext }: FoodChoiceProps) {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [isAnythingVisible, setIsAnythingVisible] = useState(true);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [isClipVisible, setIsClipVisible] = useState(false);
  const [flashPhase, setFlashPhase] = useState<"hidden" | "cover" | "hold" | "reveal">("hidden");
  const anythingButtonRef = useRef<HTMLButtonElement>(null);
  const isAnythingDissolving = useRef(false);
  const flashTimers = useRef<number[]>([]);

  useEffect(() => {
    return () => flashTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const startDisintegration = () => {
    if (!anythingButtonRef.current || isAnythingDissolving.current) return;
    isAnythingDissolving.current = true;
    void smokeDisintegrate(anythingButtonRef.current, {
      duration: 4000,
      frameCount: 32,
      repetitionCount: 2,
      restoreVisibility: false,
      onComplete: () => setIsAnythingVisible(false),
    });
  };

  const handleClipEnded = () => {
    setFlashPhase("cover");

    flashTimers.current.push(window.setTimeout(() => {
      setIsClipVisible(false);
      setFlashPhase("hold");

      flashTimers.current.push(window.setTimeout(() => {
        setFlashPhase("reveal");

        flashTimers.current.push(window.setTimeout(() => {
          setFlashPhase("hidden");
          startDisintegration();
        }, 600));
      }, 500));
    }, 500));
  };

  const confirmAnything = () => {
    if (confirmationStep < 3) {
      setConfirmationStep((step) => step + 1);
      return;
    }

    setConfirmationStep(0);
    setIsClipVisible(true);
  };

  const confirmationCopy = [
    "Are you sure??",
    "Are you really really really sure????!!!?",
    "Final chance: are you absolutely, catastrophically sure?!",
  ];

  return (
    <section className="food-choice" data-component="food-choice">
      <div className="food-layout">
        <div className="food-card">
        <p className="food-question">What are we feeling?</p>
        <p className="food-subtitle">Pick what we&apos;re craving for our date</p>

        <div className="food-options">
          {foodOptions.map((food) => {
            if (food.anything && !isAnythingVisible) return null;

            return (
            <button
              ref={food.anything ? anythingButtonRef : undefined}
              className={`food-option${food.anything ? " food-option--anything" : ""}${
                selectedFood === food.label ? " food-option--selected" : ""
              }`}
              key={food.label}
              type="button"
              onClick={() => {
                if (food.anything) {
                  setConfirmationStep(1);
                } else {
                  setSelectedFood(food.label);
                }
              }}
            >
              <span className="food-emoji" aria-hidden="true">
                {food.emoji}
              </span>
              <span>{food.label}</span>
            </button>
            );
          })}
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

        {isClipVisible && (
          <div className="snap-clip" aria-label="The snap clip">
            <video autoPlay muted playsInline onEnded={handleClipEnded}>
              <source src={snapVideoUrl} type="video/mp4" />
            </video>
          </div>
        )}
      </div>

      {flashPhase !== "hidden" && (
        <div className={`screen-flash screen-flash--${flashPhase}`} aria-hidden="true" />
      )}

      {confirmationStep > 0 && (
        <div className="confirmation-modal-backdrop" role="presentation">
          <div
            className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-modal-title"
          >
            <p className="confirmation-modal-kicker">Wait a second...</p>
            <h2 id="confirmation-modal-title">{confirmationCopy[confirmationStep - 1]}</h2>
            <div className="confirmation-modal-actions">
              <button type="button" className="modal-no-button" onClick={() => setConfirmationStep(0)}>
                No
              </button>
              <button type="button" className="modal-yes-button" onClick={confirmAnything}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
