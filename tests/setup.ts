import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next/cache globally to avoid "static generation store missing" in tests
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock HTMLMediaElement functions that JSDOM does not implement
if (typeof window !== "undefined") {
  window.HTMLMediaElement.prototype.load = () => {};
  window.HTMLMediaElement.prototype.play = async () => {};
  window.HTMLMediaElement.prototype.pause = () => {};
}
