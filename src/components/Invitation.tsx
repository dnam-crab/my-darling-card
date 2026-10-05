import { useRef, useState } from "react";
import { createPortal } from "react-dom";

type InvitationProps = {
  question: string;
  yesLabel: string;
  noLabel: string;
  onYes: () => void;
};

export function Invitation({
  question,
  yesLabel,
  noLabel,
  onYes,
}: InvitationProps) {
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [noPosition, setNoPosition] = useState<{ left: number; top: number } | null>(null);

  function moveNoButton() {
    const button = noButtonRef.current;
    if (!button) return;

    const currentRect = button.getBoundingClientRect();
    const buttonWidth = currentRect.width;
    const buttonHeight = currentRect.height;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const currentLeft = currentRect.left;
    const currentTop = currentRect.top;
    const maxLeft = Math.max(0, viewportWidth - buttonWidth);
    const maxTop = Math.max(0, viewportHeight - buttonHeight);

    let nextPosition = {
      left: Math.min(Math.max(0, currentLeft), maxLeft),
      top: Math.min(Math.max(0, currentTop), maxTop),
    };

    for (let attempt = 0; attempt < 30; attempt += 1) {
      const candidate = {
        left: Math.random() * maxLeft,
        top: Math.random() * maxTop,
      };
      const distance = Math.hypot(
        candidate.left - currentLeft,
        candidate.top - currentTop,
      );

      if (distance > 160) {
        nextPosition = {
          left: Math.min(Math.max(0, candidate.left), maxLeft),
          top: Math.min(Math.max(0, candidate.top), maxTop),
        };
        break;
      }
    }

    setNoPosition(nextPosition);
  }

  const noButton = (
    <button
      ref={noButtonRef}
      className={`no-button${noPosition ? " no-button--escaped" : ""}`}
      type="button"
      onMouseEnter={moveNoButton}
      onFocus={moveNoButton}
      style={
        noPosition
          ? { left: noPosition.left, top: noPosition.top }
          : undefined
      }
    >
      {noLabel}
    </button>
  );

  return (
    <section data-component="invitation">
      <div className="invitation-card">
        <p className="invitation-question">{question}</p>
        <div className="invitation-actions">
          <button className="yes-button" type="button" onClick={onYes}>
            {yesLabel}
          </button>
          {!noPosition && noButton}
        </div>
      </div>
      {noPosition && createPortal(noButton, document.body)}
    </section>
  );
}
