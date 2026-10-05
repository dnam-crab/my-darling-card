import { useState } from "react";
import { DateTimeChoice } from "./components/DateTimeChoice";
import { FoodChoice } from "./components/FoodChoice";
import { Invitation } from "./components/Invitation";
import { invitationConfig } from "./data/invitation";

type Stage = "invitation" | "date-time" | "food";

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
  const [stage, setStage] = useState<Stage>("invitation");
  const [selections, setSelections] = useState<InviteSelections>(initialSelections);

  return (
    <main data-stage={stage}>
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
          onNext={(date, time) => {
            setSelections((current) => ({ ...current, date, time }));
            setStage("food");
          }}
        />
      )}

      {stage === "food" && (
        <FoodChoice
          onNext={(food) =>
            setSelections((current) => ({ ...current, food }))
          }
        />
      )}
    </main>
  );
}
