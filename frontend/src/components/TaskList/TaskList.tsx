import { type FC } from "react";
import { type Task } from "../../services/taskService";
import TaskItem from "../TaskItem/TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskList: FC<TaskListProps> = ({
  tasks,
  onToggleCompletion,
  onDelete,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No tasks yet. Create your first task!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
