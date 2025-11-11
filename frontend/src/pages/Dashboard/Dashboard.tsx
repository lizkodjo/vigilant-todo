import type { FC } from "react";

const Dashboard: FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to your task management dashboard
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800">
                Total Tasks
              </h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800">
                Completed
              </h3>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default Dashboard;
