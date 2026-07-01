import React from 'react';
import { html } from '../utils/html.js';
import { Edit2, Trash2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const TaskCard = ({
  task,
  onDelete,
  onStatusChange,
  onEdit,
}) => {
  const isOverdue = task.isOverdue();
  const daysRemaining = task.getDaysRemaining();

  const priorityLabels = {
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta',
  };

  const priorityBadgeClasses = {
    BAIXA: 'badge-low',
    MEDIA: 'badge-medium',
    ALTA: 'badge-high',
  };

  const getDeadlineLabel = () => {
    const deadlineDate = new Date(task.deadline);
    const dateFormatted = deadlineDate.toLocaleDateString('pt-BR');

    if (task.status === 'CONCLUIDA') {
      return `Concluída em: ${task.completedAt ? new Date(task.completedAt).toLocaleDateString('pt-BR') : '-'}`;
    }

    if (isOverdue) {
      const delay = Math.abs(daysRemaining);
      return `Atrasada há ${delay} ${delay === 1 ? 'dia' : 'dias'} (${dateFormatted})`;
    }

    if (daysRemaining === 0) {
      return `Vence hoje (${dateFormatted})`;
    }

    if (daysRemaining === 1) {
      return `Vence amanhã (${dateFormatted})`;
    }

    return `Vence em ${daysRemaining} dias (${dateFormatted})`;
  };

  return html`
    <div 
      className=${`task-card priority-${task.priority} status-${task.status} ${isOverdue ? 'overdue-card' : ''}`}
      id=${`task-card-${task.id}`}
    >
      <div class="task-card-header">
        <div style=${{ flex: 1 }}>
          <h3 class="task-title">${task.title}</h3>
          
          <div class="task-badges" style=${{ marginTop: '8px' }}>
            <span class=${`badge ${priorityBadgeClasses[task.priority]}`}>
              Prioridade ${priorityLabels[task.priority]}
            </span>
            
            ${task.status === 'CONCLUIDA' && html`
              <span class="badge" style=${{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
                Concluída
              </span>
            `}
            
            ${task.status === 'EM_ANDAMENTO' && html`
              <span class="badge" style=${{ backgroundColor: 'var(--info-bg)', color: 'var(--info)', border: '1px solid var(--info-border)' }}>
                Em Progresso
              </span>
            `}
            
            ${task.status === 'PENDENTE' && html`
              <span class="badge" style=${{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                Pendente
              </span>
            `}

            ${isOverdue && html`
              <span class="badge badge-overdue">
                <${AlertTriangle} size=${10} style=${{ marginRight: '4px', display: 'inline' }} />
                Atrasada
              </span>
            `}
          </div>
        </div>

        <div class="task-actions">
          <button 
            class="action-btn" 
            onClick=${() => onEdit(task)} 
            title="Editar Tarefa"
            id=${`task-edit-btn-${task.id}`}
          >
            <${Edit2} size=${16} />
          </button>
          <button 
            class="action-btn btn-delete" 
            onClick=${() => onDelete(task.id)} 
            title="Remover Tarefa"
            id=${`task-delete-btn-${task.id}`}
          >
            <${Trash2} size=${16} />
          </button>
        </div>
      </div>

      ${task.description && html`
        <p class="task-description">${task.description}</p>
      `}

      <div class="task-meta">
        <div class=${`task-due-date ${isOverdue ? 'overdue' : ''}`}>
          ${task.status === 'CONCLUIDA' 
            ? html`<${CheckCircle2} size=${15} style=${{ color: 'var(--success)' }} />` 
            : isOverdue 
              ? html`<${AlertTriangle} size=${15} />` 
              : html`<${Clock} size=${15} />`}
          <span>${getDeadlineLabel()}</span>
        </div>

        <div>
          <select
            class="select-filter"
            style=${{ padding: '6px 12px', fontSize: '12px' }}
            value=${task.status}
            onChange=${e => onStatusChange(task.id, e.target.value)}
            id=${`task-status-select-${task.id}`}
          >
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em Progresso</option>
            <option value="CONCLUIDA">Concluída</option>
          </select>
        </div>
      </div>
    </div>
  `;
};
