export class ReportService {
  static getSummaryMetrics(tasks) {
    const total = tasks.length;
    
    if (total === 0) {
      return { total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0, completionRate: 0 };
    }

    const completed = tasks.filter(t => t.status === 'CONCLUIDA').length;
    const inProgress = tasks.filter(t => t.status === 'EM_ANDAMENTO').length;
    const pending = tasks.filter(t => t.status === 'PENDENTE').length;
    const overdue = tasks.filter(t => t.isOverdue()).length;
    
    const completionRate = Math.round((completed / total) * 100);

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate
    };
  }

  static getCompletedTasksPerDay(tasks) {
    const completedTasks = tasks.filter(t => t.status === 'CONCLUIDA' && t.completedAt);

    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      
      const dateStr = targetDate.toISOString().split('T')[0];
      const dateLabel = targetDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

      result.push({
        dateLabel,
        dateStr,
        count: 0
      });
    }

    completedTasks.forEach(task => {
      if (!task.completedAt) return;
      
      const compDateStr = task.completedAt.split('T')[0];
      const match = result.find(d => d.dateStr === compDateStr);
      
      if (match) {
        match.count += 1;
      }
    });

    return result;
  }

  static getPriorityMetrics(tasks) {
    const priorities = ['BAIXA', 'MEDIA', 'ALTA'];

    return priorities.map(priority => {
      const priorityTasks = tasks.filter(t => t.priority === priority);
      const total = priorityTasks.length;
      const completed = priorityTasks.filter(t => t.status === 'CONCLUIDA').length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        priority,
        total,
        completed,
        percentage
      };
    });
  }
}
