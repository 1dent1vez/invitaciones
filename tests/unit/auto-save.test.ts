import { describe, it, expect, vi } from "vitest";

describe("Auto-guardado", () => {
  it("debe disparar guardado tras 30s de inactividad", () => {
    const saveMock = vi.fn();
    
    vi.useFakeTimers();
    
    let isDirty = true;
    let timer: NodeJS.Timeout | null = null;
    
    const triggerChange = () => {
      if (timer) clearTimeout(timer);
      if (isDirty) {
        timer = setTimeout(() => {
          saveMock();
        }, 30000);
      }
    };
    
    triggerChange();
    
    vi.advanceTimersByTime(29000);
    expect(saveMock).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(1000);
    expect(saveMock).toHaveBeenCalled();
    
    vi.useRealTimers();
  });
});
