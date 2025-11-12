import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  type FC,
} from "react";
import {
  taskService,
  type CreateTaskData,
  type Task,
  type UpdateTaskData,
} from "../services/taskService";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskData) => Promise<void>;
  updateTask: (id: number, taskData: UpdateTaskData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const tasksData = await taskService.getTask();
      setTasks(tasksData);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData): Promise<void> => {
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create task");
      console.error("Error creating task:", err);
      throw err;
    }
  };

  const updateTask = async (
    id: number,
    taskData: UpdateTaskData
  ): Promise<void> => {
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update task");
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete task");
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const toggleTaskCompletion = async (id: number): Promise<void> => {
    setError(null);
    try {
      const updatedTask = await taskService.toggleTaskCompletion(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to toggle task");
      console.error("Error toggling task:", err);
      throw err;
    }
  };

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
