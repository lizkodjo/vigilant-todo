import { useState, useEffect, type FC } from "react";
import { useTasks } from "../../contexts/TaskContext";
import TaskList from "../../components/TaskList/TaskList";
import CreateTaskModal from "../../components/CreateTaskModal/CreateTaskModal";

const Tasks: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (title: string, description: string) => {
    await createTask({ title, description });
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
  };

  const handleToggleCompletion = async (id: number) => {
    await toggleTaskCompletion(id);
  };

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
            <p className="text-gray-600 mt-1">
              {pendingTasks.length} pending, {completedTasks.length} completed
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            + New Task
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading tasks...</p>
          </div>
        ) : (
          <>
            {pendingTasks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Pending Tasks
                </h2>
                <TaskList
                  tasks={pendingTasks}
                  onToggleCompletion={handleToggleCompletion}
                  onDelete={handleDeleteTask}
                />
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Completed Tasks
                </h2>
                <TaskList
                  tasks={completedTasks}
                  onToggleCompletion={handleToggleCompletion}
                  onDelete={handleDeleteTask}
                />
              </div>
            )}

            {tasks.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No tasks yet.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Create Your First Task
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
};

export default Tasks;
