import { Task } from '../models/Task.js';

// Serviço de Gerenciamento de Tarefas integrado à API SQL.
export class TaskService {
  static async getUserTasks(userId) {
    const response = await fetch('/api/tasks', {
      method: 'GET',
      headers: {
        'Authorization': userId
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao carregar tarefas.');
    }

    return data.map(t => new Task(t));
  }

  static async createTask(userId, title, description, priority, deadline) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    const taskData = {
      id,
      userId,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'PENDENTE',
      deadline,
      createdAt,
      completedAt: null
    };

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userId
      },
      body: JSON.stringify(taskData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar tarefa.');
    }

    return new Task(data);
  }

  static async updateTask(userId, taskId, updates) {
    let completedAt = updates.completedAt;
    if (updates.status !== undefined) {
      if (updates.status === 'CONCLUIDA') {
        completedAt = new Date().toISOString();
      } else {
        completedAt = null;
      }
    }

    const payload = {
      ...updates,
      ...(updates.status !== undefined ? { completedAt } : {})
    };

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userId
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao atualizar tarefa.');
    }

    return new Task(data);
  }

  static async deleteTask(userId, taskId) {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': userId
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao remover tarefa.');
    }
  }

  static queryTasks(tasksList, filters, sortBy = 'DATA_LIMITE', sortOrder = 'ASC') {
    let tasks = [...tasksList];

    // 1. Busca textual
    if (filters.search) {
      const term = filters.search.toLowerCase();
      tasks = tasks.filter(
        t => t.title.toLowerCase().includes(term) || t.description.toLowerCase().includes(term)
      );
    }

    // 2. Filtro de Status
    if (filters.status && filters.status !== 'TODAS') {
      if (filters.status === 'ATRASADA') {
        tasks = tasks.filter(t => t.isOverdue());
      } else {
        tasks = tasks.filter(t => t.status === filters.status);
      }
    }

    // 3. Filtro de Prioridade
    if (filters.priority && filters.priority !== 'TODAS') {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }

    // 4. Ordenação
    const priorityWeight = { ALTA: 3, MEDIA: 2, BAIXA: 1 };

    tasks.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'DATA_LIMITE') {
        comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === 'PRIORIDADE') {
        comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortBy === 'CRIACAO') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === 'ASC' ? comparison : -comparison;
    });

    return tasks;
  }

  static getNearDeadlineTasks(tasksList, hours = 48) {
    return tasksList.filter(t => t.isNearDeadline(hours));
  }
}
