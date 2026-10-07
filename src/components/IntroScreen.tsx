type IntroScreenProps = {
  onNext: () => void;
};

export function IntroScreen({ onNext }: IntroScreenProps) {
  return (
    <section className="intro-screen" data-component="intro-screen">
      <div className="invitation-card intro-card">
        <div className="intro-icon" aria-hidden="true">💌✨</div>
        <p className="intro-question">
          Hey sweetheart, I&apos;ve been planning something special for us ✨
        </p>
        <p className="intro-subtitle">But first, I need to know…</p>
        <button className="next-button intro-next-button" type="button" onClick={onNext}>
          REVEAL THE QUESTION ✨
        </button>
      </div>
    </section>
  );
}
