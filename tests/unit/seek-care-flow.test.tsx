import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SeekCareFlow } from "@/components/seek-care/seek-care-flow";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

describe("Should I seek care? flow", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("asks for a symptom before it will continue", async () => {
    const user = userEvent.setup();
    render(<SeekCareFlow />);

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByText(/choose what you are noticing/i),
    ).toBeInTheDocument();
  });

  it("goes straight to 911 when a red flag is selected", async () => {
    const user = userEvent.setup();
    render(<SeekCareFlow />);

    await user.click(
      screen.getByRole("radio", { name: /bleeding that worries me/i }),
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.click(
      screen.getByRole("checkbox", { name: /chest pain, pressure/i }),
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByRole("heading", { name: /call 911 now/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /call 911 now/i })).toHaveAttribute(
      "href",
      "tel:911",
    );
  });

  it("never tells the user they are fine when no red flag applies", async () => {
    const user = userEvent.setup();
    render(<SeekCareFlow />);

    await user.click(
      screen.getByRole("radio", { name: /bleeding that worries me/i }),
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.click(
      screen.getByRole("checkbox", { name: /none of these are happening/i }),
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Answer each follow-up with its first option until the result appears.
    for (let step = 0; step < 8; step += 1) {
      const options = screen.queryAllByRole("radio");
      const checkboxes = screen.queryAllByRole("checkbox");
      const choice = options[0] ?? checkboxes[0];
      if (!choice) break;
      await user.click(choice);
      await user.click(screen.getByRole("button", { name: /^continue$/i }));
    }

    const alerts = await screen.findAllByRole("alert");
    for (const alert of alerts) {
      expect(alert.textContent?.toLowerCase()).not.toContain("you are fine");
    }
    expect(screen.getByText(/why you are seeing this/i)).toBeInTheDocument();
    expect(screen.getByText(/if anything changes/i)).toBeInTheDocument();
  });
});
