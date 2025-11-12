import api from "./api";

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const taskService = {
  async getTask(): Promise<Task[]> {
    const response = await api.get("/tasks/");
    return response.data;
  },

  async getTaskById(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData: CreateTaskData): Promise<Task> {
    const response = await api.post("/tasks/", taskData);
    return response.data;
  },
  async updateTask(id: number, taskData: UpdateTaskData): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
  async toggleTaskCompletion(id: number): Promise<Task> {
    const task = await this.getTaskById(id);
    return this.updateTask(id, { completed: !task.completed });
  },
};
