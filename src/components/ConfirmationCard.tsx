import { useState } from "react";
import type { InviteSelections } from "../App";

type ConfirmationCardProps = {
  selections: InviteSelections;
  onSubmit: () => Promise<void>;
};

export function ConfirmationCard({ selections, onSubmit }: ConfirmationCardProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formattedDate = selections.date
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date(`${selections.date}T12:00:00`))
    : "Date not selected";

  return (
    <section className="confirmation-choice" data-component="confirmation-card">
      <div className="confirmation-card">
        <p className="confirmation-heading">YAY!! 💕</p>

        <div className="confirmation-details">
          <p>
            <span aria-hidden="true">📅</span>
            {formattedDate}
          </p>
          <p>
            <span aria-hidden="true">⏰</span>
            {selections.time ?? "Time not selected"}
          </p>
          <p>
            <span aria-hidden="true">🍽️</span>
            {selections.food ?? "Food not selected"}
          </p>
        </div>

        <p className="confirmation-message">I can&apos;t wait to see you! 🌷✨</p>
        <p className="confirmation-note">
          The most thoughtful thing I&apos;ve ever seen!!
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
            } catch {
              setStatus("error");
            }
          }}
        >
          {status === "sending"
            ? "SENDING..."
            : status === "sent"
              ? "SENT ♥"
              : "SEND MY PICKS ♥"}
        </button>
        {status === "error" && (
          <p className="submit-error">Could not send. Please try again.</p>
        )}
      </div>
    </section>
  );
}
