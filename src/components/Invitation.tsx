type InvitationProps = {
  question: string;
  yesLabel: string;
  noLabel: string;
  onYes: () => void;
  onNoHover: () => void;
};

export function Invitation({
  question,
  yesLabel,
  noLabel,
  onYes,
  onNoHover,
}: InvitationProps) {
  return (
    <section data-component="invitation">
      <p>{question}</p>
      <button type="button" onClick={onYes}>
        {yesLabel}
      </button>
      <button type="button" onMouseEnter={onNoHover}>
        {noLabel}
      </button>
    </section>
  );
}
