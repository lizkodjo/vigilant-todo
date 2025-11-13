import { fireEvent, render, screen } from "@testing-library/react";
import type { Task } from "../../services/taskService";
import TaskItem from "../../components/TaskItem/TaskItem";

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  completed: false,
  owner_id: 1,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "",
};

describe("TaskItem Component", () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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

    const toggleButton = screen.getByRole("button", {
      name: /toggle completion/i,
    });
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it("calls onDelect when delete button is clicked and confirmed", () => {
    window.confirm = jest.fn().mockReturnValue(true);

    render(
      <TaskItem
        task={mockTask}
        onToggleCompletion={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );
    const deleteButton = screen.getByRole("button", { name: /delete task/i });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this task?"
    );
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it("does not call onDelete when delete is cancelled", () => {
    window.confirm = jest.fn().mockReturnValue(false);

    render(
      <TaskItem
        task={mockTask}
        onToggleCompletion={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete task/i });
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

    const toggleButton = screen.getByRole("button", {
      name: /toggle completion/i,
    });
    expect(toggleButton).toHaveTextContent("✔️");
  });
});
