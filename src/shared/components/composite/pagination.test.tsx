import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("renders nothing when there's only one page", () => {
    const { container } = render(
      <Pagination page={0} totalPages={1} onPageChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("disables Previous on the first page and Next on the last page", () => {
    render(<Pagination page={0} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  it("marks the current page with aria-current", () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText("Page 3")).toHaveAttribute("aria-current", "page");
  });

  it("calls onPageChange with the zero-indexed target page when a number is clicked", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={0} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText("Page 3"));
    expect(onPageChange).toHaveBeenCalledWith(2); // zero-indexed
  });

  it("calls onPageChange with page - 1 / page + 1 for Previous/Next", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    await user.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });

  it("always shows the last page number with an ellipsis when far from the window", () => {
    render(<Pagination page={0} totalPages={20} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText("Page 20")).toBeInTheDocument();
    expect(screen.getByText("…")).toBeInTheDocument();
  });
});
