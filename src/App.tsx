import { useRef, useState } from "react";
import { DateTimeChoice } from "./components/DateTimeChoice";
import { FoodChoice } from "./components/FoodChoice";
import { ConfirmationCard } from "./components/ConfirmationCard";
import { StickerLayer } from "./components/StickerLayer";
import { submitInviteSelections } from "./services/submitInviteSelections";
import { Invitation } from "./components/Invitation";
import { IntroScreen } from "./components/IntroScreen";
import { QuestionTeaser } from "./components/QuestionTeaser";
import { MeowScreen } from "./components/MeowScreen";
import { invitationConfig } from "./data/invitation";
import backgroundMusicUrl from "../assets/audio/freecompress-background-music.mp3";

type Stage = "meow" | "intro" | "teaser" | "invitation" | "date-time" | "food" | "confirmation";

export type InviteSelections = {
  date: string | null;
  time: string | null;
  food: string | null;
};

const initialSelections: InviteSelections = {
  date: null,
  time: null,
  food: null,
};

export default function App() {
  const [stage, setStage] = useState<Stage>("meow");
  const [selections, setSelections] = useState<InviteSelections>(initialSelections);
  const [hasUsedAnything, setHasUsedAnything] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleMeow = async () => {
    try {
      await audioRef.current?.play();
    } catch {
      // Browsers can still reject playback; the invitation itself remains usable.
    }
    setStage("intro");
  };

  return (
    <>
      <StickerLayer />
      <audio ref={audioRef} className="background-audio" loop preload="none" src={backgroundMusicUrl} />
      <main data-stage={stage}>
      {stage === "meow" && (
        <MeowScreen onMeow={handleMeow} />
      )}

      {stage === "intro" && (
        <IntroScreen onNext={() => setStage("teaser")} />
      )}

      {stage === "teaser" && (
        <QuestionTeaser onNext={() => setStage("invitation")} />
      )}

      {stage === "invitation" && (
        <Invitation
          question={invitationConfig.question}
          yesLabel={invitationConfig.yesLabel}
          noLabel={invitationConfig.noLabel}
          onYes={() => setStage("date-time")}
        />
      )}

      {stage === "date-time" && (
        <DateTimeChoice
          onBack={() => setStage("invitation")}
          onNext={(date, time) => {
            setSelections((current) => ({ ...current, date, time }));
            setStage("food");
          }}
        />
      )}

      {stage === "food" && (
        <FoodChoice
          onBack={() => setStage("date-time")}
          hasUsedAnything={hasUsedAnything}
          onAnythingConsumed={() => setHasUsedAnything(true)}
          onNext={(food) => {
            setSelections((current) => ({ ...current, food }));
            setStage("confirmation");
          }}
        />
      )}

      {stage === "confirmation" && (
        <ConfirmationCard
          selections={selections}
          onBack={() => setStage("food")}
          onSubmit={async () => submitInviteSelections(selections)}
        />
      )}
      </main>
    </>
  );
}
