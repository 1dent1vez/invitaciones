import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next/cache globally to avoid "static generation store missing" in tests
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));
