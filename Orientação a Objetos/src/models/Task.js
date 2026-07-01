export class Task {
  constructor({ id, userId, title, description, priority, status, deadline, createdAt, completedAt }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description || '';
    this.priority = priority;
    this.status = status;
    this.deadline = deadline;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
  }

  isOverdue() {
    if (this.status === 'CONCLUIDA') {
      return false;
    }
    const deadlineDate = new Date(this.deadline);
    const now = new Date();
    return now.getTime() > deadlineDate.getTime();
  }

  isNearDeadline(hours = 24) {
    if (this.status === 'CONCLUIDA' || this.isOverdue()) {
      return false;
    }
    const deadlineDate = new Date(this.deadline);
    const now = new Date();
    const differenceInMs = deadlineDate.getTime() - now.getTime();
    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    return differenceInHours >= 0 && differenceInHours <= hours;
  }

  getDaysRemaining() {
    const deadlineDate = new Date(this.deadline);
    const d1 = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
    const now = new Date();
    const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = d1.getTime() - d2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      deadline: this.deadline,
      createdAt: this.createdAt,
      completedAt: this.completedAt
    };
  }
}
