import { useState } from "react";

type MessageModalProps = {
  prompt: string;
  successMessage: string;
  onClose: () => void;
  onReceiveCard: () => void;
};

export function MessageModal({
  prompt,
  successMessage,
  onClose,
  onReceiveCard,
}: MessageModalProps) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div role="dialog" aria-modal="true" data-component="message-modal">
      {!submitted ? (
        <>
          <p>{prompt}</p>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="button" onClick={() => setSubmitted(true)}>
            Gửi
          </button>
        </>
      ) : (
        <>
          <p>{successMessage}</p>
          <button type="button" onClick={onReceiveCard}>
            Nhận thiệp
          </button>
        </>
      )}
      <button type="button" onClick={onClose}>
        Đóng
      </button>
    </div>
  );
}
