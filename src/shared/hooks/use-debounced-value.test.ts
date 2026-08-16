import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "./use-debounced-value";

describe("useDebouncedValue", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("first", 300));
    expect(result.current).toBe("first");
  });

  it("only updates after the delay elapses, and resets on rapid changes", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      {
        initialProps: { value: "a" },
      },
    );

    rerender({ value: "ab" });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("a"); // not yet — still within the delay

    rerender({ value: "abc" }); // typing again resets the timer
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("a"); // still hasn't reached 300ms since the reset

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("abc"); // settled on the latest value

    vi.useRealTimers();
  });
});
