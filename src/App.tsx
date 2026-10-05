import { useState } from "react";
import { Invitation } from "./components/Invitation";
import { invitationConfig } from "./data/invitation";

type Stage = "invitation";

export default function App() {
  const [stage] = useState<Stage>("invitation");

  return (
    <main data-stage={stage}>
      {stage === "invitation" && (
        <Invitation
          question={invitationConfig.question}
          yesLabel={invitationConfig.yesLabel}
          noLabel={invitationConfig.noLabel}
          onYes={() => undefined}
        />
      )}
    </main>
  );
}
