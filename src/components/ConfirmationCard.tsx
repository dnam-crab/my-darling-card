import { useState } from "react";
import type { InviteSelections } from "../App";
import sticker00 from "../../assets/images/sticker00.webp";

type ConfirmationCardProps = {
  selections: InviteSelections;
  onBack: () => void;
  onSubmit: () => Promise<void>;
};

export function ConfirmationCard({ selections, onBack, onSubmit }: ConfirmationCardProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showSendReveal, setShowSendReveal] = useState(false);
  const formattedDate = selections.date
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date(`${selections.date}T12:00:00`))
    : "A date still needs choosing";

  return (
    <section className="confirmation-choice" data-component="confirmation-card">
      <div className="confirmation-card">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>
        <p className="confirmation-heading">YAY!! 💕</p>

        <div className="confirmation-details">
          <p>
            <span aria-hidden="true">📅</span>
            {formattedDate}
          </p>
          <p>
            <span aria-hidden="true">⏰</span>
            {selections.time ?? "A time still needs choosing"}
          </p>
          <p>
            <span aria-hidden="true">🍽️</span>
            {selections.food ?? "A feast still needs choosing"}
          </p>
        </div>

        <p className="confirmation-message">I can&apos;t wait to spend this time with you! 🌷✨</p>
        <p className="confirmation-note">
          I&apos;m already looking forward to our little adventure!!
        </p>

        <button
          className="submit-button"
          type="button"
          disabled={status === "sending" || status === "sent"}
          onClick={async () => {
            setStatus("sending");

            try {
              await onSubmit();
              setStatus("sent");
              setShowSendReveal(true);
            } catch {
              setStatus("error");
            }
          }}
        >
          {status === "sending"
            ? "SAVING OUR DATE..."
            : status === "sent"
              ? "SAVED ♥"
              : "SEND OUR DATE PLAN ♥"}
        </button>
        {showSendReveal && (
          <div
            className="send-success-reveal"
            role="status"
            onAnimationEnd={() => setShowSendReveal(false)}
          >
            <img src={sticker00} alt="" aria-hidden="true" />
            <span>Tu tu xình xịch</span>
          </div>
        )}
        {status === "error" && (
          <p className="submit-error">Oops, our date plan got shy. Please try again.</p>
        )}
      </div>
    </section>
  );
}
