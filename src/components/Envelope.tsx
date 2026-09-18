type EnvelopeProps = { onOpen: () => void };

export function Envelope({ onOpen }: EnvelopeProps) {
  return (
    <section data-component="envelope">
      <button type="button" onClick={onOpen}>
        Mở lời mời
      </button>
    </section>
  );
}
