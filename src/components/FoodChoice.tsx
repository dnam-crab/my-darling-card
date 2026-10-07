import { useEffect, useRef, useState } from "react";
import { smokeDisintegrate } from "../effects/smokeDisintegrate";
import snapVideoUrl from "../../assets/clips/Snap.mp4";
import sticker14 from "../../assets/images/sticker14.png";
import sticker15 from "../../assets/images/sticker15.png";
import sticker16 from "../../assets/images/sticker16.png";

type FoodChoiceProps = {
  onNext: (food: string) => void;
  onBack: () => void;
  hasUsedAnything: boolean;
  onAnythingConsumed: () => void;
};

const foodOptions = [
  { label: "Cay Một Cách Thanh Lịch", description: "Món Thái", emoji: "🌶️" },
  { label: "Tây Vị Quý Tộc", description: "Món Âu", emoji: "🍝" },
  { label: "Quý Tộc Lõi Hồng", description: "Beefsteak", emoji: "🥩" },
  { label: "Gia Phả Xương Xẩu", description: "Món sườn", emoji: "🍖" },
  { label: "Ngưu Ma Vương Nghỉ Phép", description: "Món bò", emoji: "🐄" },
  { label: "Khói Tận Cam Lai", description: "Món nướng", emoji: "🔥" },
  { label: "Samurai Đói Bụng", description: "Món Nhật", emoji: "🍱", featured: true },
  {
    label: "Món gìii cũnggg đượccccc",
    description: "Món gì cũng được",
    emoji: "🤷",
    anything: true,
  },
];

const confirmationStickers = [sticker16, sticker15, sticker14];

export function FoodChoice({ onNext, onBack, hasUsedAnything, onAnythingConsumed }: FoodChoiceProps) {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [isAnythingMessageVisible, setIsAnythingMessageVisible] = useState(false);
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
      onComplete: () => {
        onAnythingConsumed();
        setIsAnythingMessageVisible(true);
      },
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
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>
        <p className="food-question">What shall we feast on?</p>
        <p className="food-subtitle">Pick the flavour of our date night</p>

        <div className="food-options">
          {foodOptions.map((food) => {
            if (food.anything && hasUsedAnything) return null;

            return (
            <button
              ref={food.anything ? anythingButtonRef : undefined}
              className={`food-option${food.anything ? " food-option--anything" : ""}${food.featured ? ` food-option--featured${hasUsedAnything ? " food-option--featured-centered" : ""}` : ""}${
                selectedFood === food.label ? " food-option--selected" : ""
              }`}
              title={food.description}
              aria-label={`${food.label} — ${food.description}`}
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
          SAVE OUR DATE PLAN ♥
        </button>
        </div>

        {isClipVisible && (
          <div className="snap-clip" aria-label="The snap clip">
            <video
              autoPlay
              muted
              playsInline
              preload="auto"
              src={snapVideoUrl}
              onEnded={handleClipEnded}
            >
              Your browser does not support this video.
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
            <img
              className="confirmation-modal-sticker"
              src={confirmationStickers[confirmationStep - 1]}
              alt=""
              aria-hidden="true"
            />
            <p className="confirmation-modal-kicker">Hold on, sweetheart...</p>
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

      {isAnythingMessageVisible && (
        <p
          className="anything-choice-message"
          role="status"
          onAnimationEnd={() => setIsAnythingMessageVisible(false)}
        >
          Nope, sweetheart — “anything” is not an answer. 💙
        </p>
      )}
    </section>
  );
}
