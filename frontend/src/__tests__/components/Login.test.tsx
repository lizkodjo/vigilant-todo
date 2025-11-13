import { ReactNode } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../pages/Login/Login";
import { AuthProvider } from "../../contexts/AuthContext";

// Create a mock module with jest.fn() directly
jest.mock("../../services/authService", () => ({
  authService: {
    login: jest.fn(),
    getCurrentUser: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

// Import the mocked module to get references to the mock functions
import { authService } from "../../services/authService";

// Type the mocked functions to include Jest mock properties
const mockedAuthService = authService as {
  login: jest.MockedFunction<typeof authService.login>;
  getCurrentUser: jest.MockedFunction<typeof authService.getCurrentUser>;
  register: jest.MockedFunction<typeof authService.register>;
  logout: jest.MockedFunction<typeof authService.logout>;
};

const renderWithProviders = (component: ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    // Use the typed mocked functions
    mockedAuthService.login.mockResolvedValue({
      access_token: "test-token",
      token_type: "bearer",
    });
    mockedAuthService.getCurrentUser.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      full_name: "Test User",
      is_active: true,
      created_at: "",
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
      expect(mockedAuthService.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  it("displays error message on login failure", async () => {
    mockedAuthService.login.mockRejectedValue({
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
