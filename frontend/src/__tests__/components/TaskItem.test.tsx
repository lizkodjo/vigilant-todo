import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "../../components/TaskItem/TaskItem";
import { Task } from "../../services/taskService";

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  completed: false,
  owner_id: 1,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

describe("TaskItem Component", () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.confirm
    window.confirm = jest.fn().mockReturnValue(true);
  });

  it("renders task information correctly", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleCompletion={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it("calls onToggle when completion button is clicked", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleCompletion={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Use aria-label to find the toggle button
    const toggleButton = screen.getByLabelText(/mark task as complete/i);
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it("calls onDelete when delete button is clicked and confirmed", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleCompletion={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Use aria-label to find the delete button
    const deleteButton = screen.getByLabelText(/delete task/i);
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this task?"
    );
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it("does not call onDelete when deletion is cancelled", () => {
    window.confirm = jest.fn().mockReturnValue(false);

    render(
      <TaskItem
        task={mockTask}
        onToggleCompletion={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText(/delete task/i);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it("shows completed state correctly", () => {
    const completedTask = { ...mockTask, completed: true };

    render(
      <TaskItem
        task={completedTask}
        onToggleCompletion={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Check for completed state indicators
    const toggleButton = screen.getByLabelText(/mark task as incomplete/i);
    expect(toggleButton).toHaveTextContent("✓");

    // Check for strikethrough text
    const title = screen.getByText("Test Task");
    expect(title).toHaveClass("line-through");
  });

  it("has correct accessibility attributes", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleCompletion={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Check that buttons have proper aria-labels
    expect(screen.getByLabelText(/mark task as complete/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delete task/i)).toBeInTheDocument();
  });
});
