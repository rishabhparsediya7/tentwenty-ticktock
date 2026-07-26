import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

function setup(overrides = {}) {
  const props = {
    page: 1,
    perPage: 5,
    totalItems: 12, // -> 3 pages
    onPageChange: vi.fn(),
    onPerPageChange: vi.fn(),
    ...overrides,
  };
  render(<Pagination {...props} />);
  return props;
}

describe("Pagination", () => {
  it("disables Previous on the first page and advances with Next", async () => {
    const props = setup({ page: 1 });
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(props.onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables Next on the last page", () => {
    setup({ page: 3 });
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("marks the current page with aria-current", () => {
    setup({ page: 2 });
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("emits the new size and resets via onPerPageChange", async () => {
    const props = setup();
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /rows per page/i }),
      "10"
    );
    expect(props.onPerPageChange).toHaveBeenCalledWith(10);
  });
});
