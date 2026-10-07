type QuestionTeaserProps = {
  onNext: () => void;
};

export function QuestionTeaser({ onNext }: QuestionTeaserProps) {
  return (
    <section className="question-teaser" data-component="question-teaser">
      <div className="invitation-card teaser-card">
        <div className="intro-icon" aria-hidden="true">🗝️✨</div>
        <p className="teaser-question">
          Don&apos;t worry, there&apos;s no wrong answer… probably.
        </p>
        <button className="next-button" type="button" onClick={onNext}>
          LET ME ASK YOU SOMETHING ✨
        </button>
      </div>
    </section>
  );
}
