import sticker13 from "../../assets/images/sticker13.webp";

type MeowScreenProps = {
  onMeow: () => void;
};

export function MeowScreen({ onMeow }: MeowScreenProps) {
  return (
    <section className="meow-screen" data-component="meow-screen">
      <div className="invitation-card meow-card">
        <img className="meow-sticker" src={sticker13} alt="" aria-hidden="true" />
        <p className="meow-message">
          I&apos;ve been waiting for you since this afternoon… don&apos;t keep meow waiting.
        </p>
        <button className="meow-button" type="button" onClick={onMeow}>
          Meooow 🐾
        </button>
      </div>
    </section>
  );
}
