import { type FC } from "react";
import { type Task } from "../../services/taskService";

interface TaskItemProps {
  task: Task;
  onToggleCompletion: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onDelete,
}) => {
  const handleToggle = () => {
    onToggleCompletion(task.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${
        task.completed ? "opacity-75 bg-gray-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={handleToggle}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-500"
            }`}
          >
            {task.completed && "✓"}
          </button>

          <div className="flex-1">
            <h3
              className={`font-medium ${
                task.completed ? "text-gray-500 line-through" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              Created: {new Date(task.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 p-2 transition-colors"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
