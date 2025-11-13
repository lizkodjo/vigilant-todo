import "@testing-library/jest-dom";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock environment variables
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_API_URL: "http://localhost:8000/api/v1",
  },
});
