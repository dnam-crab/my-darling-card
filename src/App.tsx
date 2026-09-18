import { useState } from "react";
import { Envelope } from "./components/Envelope";
import { Invitation } from "./components/Invitation";
import { InvitationCard } from "./components/InvitationCard";
import { MessageModal } from "./components/MessageModal";
import { invitationConfig } from "./data/invitation";

type Stage = "envelope" | "invitation" | "card";

export default function App() {
  const [stage, setStage] = useState<Stage>("envelope");
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  function handleNoHover() {
    // Placeholder: sau này thêm logic đổi vị trí nút NO bằng state/ref.
  }

  return (
    <main data-stage={stage}>
      {stage === "envelope" && <Envelope onOpen={() => setStage("invitation")} />}

      {stage === "invitation" && (
        <Invitation
          question={invitationConfig.question}
          yesLabel={invitationConfig.yesLabel}
          noLabel={invitationConfig.noLabel}
          onYes={() => setIsMessageOpen(true)}
          onNoHover={handleNoHover}
        />
      )}

      {stage === "card" && (
        <InvitationCard title={invitationConfig.cardTitle} />
      )}

      {isMessageOpen && (
        <MessageModal
          prompt={invitationConfig.messagePrompt}
          successMessage={invitationConfig.successMessage}
          onClose={() => setIsMessageOpen(false)}
          onReceiveCard={() => {
            setIsMessageOpen(false);
            setStage("card");
          }}
        />
      )}
    </main>
  );
}
