import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";

// Mock next/cache globally to avoid "static generation store missing" in tests
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

if (typeof window !== "undefined") {
  window.HTMLMediaElement.prototype.load = () => {};
  window.HTMLMediaElement.prototype.play = async () => {};
  window.HTMLMediaElement.prototype.pause = () => {};
  window.scrollTo = () => {};
  window.matchMedia = window.matchMedia || (() => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }));
}

afterEach(() => {
  if (typeof document !== "undefined") {
    document.body.innerHTML = "";
  }
});
