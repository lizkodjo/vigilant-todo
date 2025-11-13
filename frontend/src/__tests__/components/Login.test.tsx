import { type ReactNode } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../pages/Login/Login";
import { AuthProvider } from "../../contexts/AuthContext";

const renderWithProviders = (component: ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

// Mock the auth service
const mockLogin = jest.fn();
const mockGetCurrentUser = jest.fn();

jest.mock("../../services/authService", () => ({
  authService: {
    login: mockLogin,
    getCurrentUser: mockGetCurrentUser,
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks
    mockLogin.mockReset();
    mockGetCurrentUser.mockReset();
  });

  it("renders login form correctly", () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("shows validation error when form is submitted empty", async () => {
    renderWithProviders(<Login />);

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    // The form should prevent submission and show validation errors
    expect(screen.getByLabelText(/username/i)).toBeInvalid();
    expect(screen.getByLabelText(/password/i)).toBeInvalid();
  });

  it("submits form with correct data", async () => {
    mockLogin.mockResolvedValue({
      access_token: "test-token",
      token_type: "bearer",
    });
    mockGetCurrentUser.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  it("displays error message on login failure", async () => {
    mockLogin.mockRejectedValue({
      response: {
        data: {
          detail: "Invalid credentials",
        },
      },
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
