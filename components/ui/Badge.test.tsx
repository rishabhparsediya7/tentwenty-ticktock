import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its text by default", () => {
    render(<Badge text="INCOMPLETE" theme="yellow" />);
    expect(screen.getByText("INCOMPLETE")).toBeInTheDocument();
  });

  it("hides the text when showText is false", () => {
    render(<Badge text="INCOMPLETE" showText={false} />);
    expect(screen.queryByText("INCOMPLETE")).not.toBeInTheDocument();
  });

  it("shows a close button only when enabled and calls onClose", async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Badge text="Tag" />);
    expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();

    rerender(<Badge text="Tag" showCloseIcon onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
