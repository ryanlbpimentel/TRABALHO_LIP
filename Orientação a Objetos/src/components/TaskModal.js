import React, { useState, useEffect } from 'react';
import { html } from '../utils/html.js';
import { X, Save } from 'lucide-react';

export const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIA');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('PENDENTE');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setDeadline(taskToEdit.deadline.split('T')[0]);
      setStatus(taskToEdit.status);
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIA');
      setDeadline(new Date().toISOString().split('T')[0]);
      setStatus('PENDENTE');
    }
    setError(null);
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('O título da tarefa é obrigatório.');
      return;
    }

    if (!deadline) {
      setError('A data limite é obrigatória.');
      return;
    }

    onSave({
      title,
      description,
      priority,
      deadline: new Date(deadline + 'T23:59:59').toISOString(),
      status: taskToEdit ? status : undefined
    });

    onClose();
  };

  return html`
    <div class="modal-overlay" onClick=${onClose}>
      <div class="modal-content" onClick=${e => e.stopPropagation()}>
        <div class="modal-header">
          <h2 class="modal-title">
            ${taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button class="modal-close" onClick=${onClose} title="Fechar">
            <${X} size=${20} />
          </button>
        </div>

        <form onSubmit=${handleSubmit}>
          <div class="modal-body">
            ${error && html`
              <div class="alert-message alert-error" style=${{ marginBottom: '16px' }}>
                <span>${error}</span>
              </div>
            `}

            <div class="form-group">
              <label class="form-label" for="task-title">Título *</label>
              <input
                id="task-title"
                type="text"
                class="form-input"
                placeholder="Ex: Estudar para a prova de POO"
                value=${title}
                onChange=${e => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="task-desc">Descrição</label>
              <textarea
                id="task-desc"
                class="form-input"
                placeholder="Detalhes sobre o que precisa ser feito..."
                rows="3"
                style=${{ resize: 'vertical' }}
                value=${description}
                onChange=${e => setDescription(e.target.value)}
              />
            </div>

            <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div class="form-group">
                <label class="form-label" for="task-priority">Prioridade</label>
                <select
                  id="task-priority"
                  class="select-filter"
                  style=${{ width: '100%' }}
                  value=${priority}
                  onChange=${e => setPriority(e.target.value)}
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="task-deadline">Data Limite *</label>
                <input
                  id="task-deadline"
                  type="date"
                  class="form-input"
                  value=${deadline}
                  onChange=${e => setDeadline(e.target.value)}
                />
              </div>
            </div>

            ${taskToEdit && html`
              <div class="form-group">
                <label class="form-label" for="task-status">Status</label>
                <select
                  id="task-status"
                  class="select-filter"
                  style=${{ width: '100%' }}
                  value=${status}
                  onChange=${e => setStatus(e.target.value)}
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Progresso</option>
                  <option value="CONCLUIDA">Concluída</option>
                </select>
              </div>
            `}
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onClick=${onClose}>
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" id="modal-submit-btn">
              <${Save} size=${16} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
};
