import type { InviteSelections } from "../App";

const responseEndpoint = import.meta.env.VITE_RESPONSE_ENDPOINT as string | undefined;

export async function submitInviteSelections(
  selections: InviteSelections,
): Promise<void> {
  if (!responseEndpoint) {
    throw new Error("VITE_RESPONSE_ENDPOINT is not configured");
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    ...selections,
  };

  await fetch(responseEndpoint, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
}
