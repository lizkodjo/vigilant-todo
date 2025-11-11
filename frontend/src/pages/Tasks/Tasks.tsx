import type { FC } from "react";

const Tasks: FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
              + New Task
            </button>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">
              No tasks yet. Create your first task!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
