import React, { useState, useEffect } from 'react';
import { html } from '../utils/html.js';
import { 
  LogOut, Moon, Sun, Plus, Search, 
  ListTodo, PieChart, AlertCircle, 
  CheckCircle2, ListChecks, Hourglass, 
  Bell, ChevronUp, ChevronDown 
} from 'lucide-react';
import { TaskService } from '../services/TaskService.js';
import { ReportService } from '../services/ReportService.js';
import { TaskCard } from './TaskCard.js';
import { TaskModal } from './TaskModal.js';
import { ReportsPanel } from './ReportsPanel.js';

export const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('TAREFAS');
  const [theme, setTheme] = useState('dark');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  // Lista total de tarefas sem filtros (para métricas e lembretes)
  const [rawTasks, setRawTasks] = useState([]);
  // Lista de tarefas filtradas e ordenadas (para exibição)
  const [tasks, setTasks] = useState([]);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODAS');
  const [priorityFilter, setPriorityFilter] = useState('TODAS');
  const [sortBy, setSortBy] = useState('DATA_LIMITE');
  const [sortOrder, setSortOrder] = useState('ASC');

  const [reminders, setReminders] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });

  // Tema inicial
  useEffect(() => {
    const savedTheme = localStorage.getItem('task_manager_theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, []);

  // Carrega todas as tarefas do banco de dados relacional (asíncrono)
  const loadTasksFromDb = async () => {
    try {
      const list = await TaskService.getUserTasks(user.id);
      setRawTasks(list);
    } catch (err) {
      console.error("Erro ao carregar dados do SQLite:", err);
    }
  };

  // Carrega inicialmente as tarefas ao montar o componente
  useEffect(() => {
    loadTasksFromDb();
  }, []);

  // Processa filtros locais, métricas e lembretes sempre que a lista bruta ou filtros mudarem
  useEffect(() => {
    // 1. Processa tarefas para exibição
    const queried = TaskService.queryTasks(
      rawTasks,
      { search, status: statusFilter, priority: priorityFilter },
      sortBy,
      sortOrder
    );
    setTasks(queried);

    // 2. Processa lembretes das próximas 48h
    const nearDeadline = TaskService.getNearDeadlineTasks(rawTasks, 48);
    setReminders(nearDeadline);

    // 3. Processa métricas rápidas
    const globalMetrics = ReportService.getSummaryMetrics(rawTasks);
    setMetrics({
      total: globalMetrics.total,
      completed: globalMetrics.completed,
      inProgress: globalMetrics.inProgress,
      overdue: globalMetrics.overdue
    });
  }, [rawTasks, search, statusFilter, priorityFilter, sortBy, sortOrder]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('task_manager_theme', nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  // Lida com adição ou edição (Assíncrono)
  const handleCreateOrUpdateTask = async (data) => {
    try {
      if (taskToEdit) {
        await TaskService.updateTask(user.id, taskToEdit.id, data);
      } else {
        await TaskService.createTask(user.id, data.title, data.description, data.priority, data.deadline);
      }
      await loadTasksFromDb();
    } catch (err) {
      alert("Erro ao salvar tarefa: " + err.message);
    } finally {
      setTaskToEdit(null);
    }
  };

  // Exclui uma tarefa no banco (Assíncrono)
  const handleDeleteTask = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await TaskService.deleteTask(user.id, id);
        await loadTasksFromDb();
      } catch (err) {
        alert("Erro ao excluir tarefa: " + err.message);
      }
    }
  };

  // Altera status de uma tarefa no banco (Assíncrono)
  const handleStatusChange = async (id, status) => {
    try {
      await TaskService.updateTask(user.id, id, { status });
      await loadTasksFromDb();
    } catch (err) {
      alert("Erro ao alterar status: " + err.message);
    }
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const getUserInitials = () => {
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return html`
    <div class="dashboard-layout animate-fade-in">
      <!-- Cabeçalho -->
      <header class="header">
        <div class="header-brand">
          <div class="auth-logo" style=${{ width: '36px', height: '36px', marginBottom: 0 }}>
            <${ListTodo} size=${18} />
          </div>
          <span class="header-title">Tarefas Pessoais</span>
        </div>

        <div class="header-actions">
          <div style=${{ display: 'flex', gap: '8px', marginRight: '16px' }}>
            <button 
              class=${`btn ${activeTab === 'TAREFAS' ? 'btn-primary' : 'btn-secondary'}`}
              style=${{ padding: '8px 16px', fontSize: '13px', width: 'auto' }}
              onClick=${() => setActiveTab('TAREFAS')}
              id="tab-tasks-btn"
            >
              <${ListChecks} size=${15} />
              Minhas Tarefas
            </button>
            <button 
              class=${`btn ${activeTab === 'RELATORIOS' ? 'btn-primary' : 'btn-secondary'}`}
              style=${{ padding: '8px 16px', fontSize: '13px', width: 'auto' }}
              onClick=${() => setActiveTab('RELATORIOS')}
              id="tab-reports-btn"
            >
              <${PieChart} size=${15} />
              Produtividade
            </button>
          </div>

          <button 
            class="theme-toggle" 
            onClick=${toggleTheme} 
            title=${theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
            id="theme-toggle-btn"
          >
            ${theme === 'dark' ? html`<${Sun} size=${20} />` : html`<${Moon} size=${20} />`}
          </button>

          <div class="user-profile">
            <div class="user-avatar" title=${user.name}>
              ${getUserInitials()}
            </div>
            <span class="user-name" title=${user.name}>${user.name}</span>
          </div>

          <button 
            class="logout-btn" 
            onClick=${onLogout} 
            title="Sair da Conta"
            id="logout-btn"
          >
            <${LogOut} size=${20} />
          </button>
        </div>
      </header>

      <!-- Conteúdo Principal -->
      <main class="dashboard-content">
        ${activeTab === 'TAREFAS' ? html`
          <!-- Seção de Tarefas -->
          <div class="main-panel">
            <!-- Métricas Rápidas -->
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-icon" style=${{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
                  <${ListTodo} size=${20} />
                </div>
                <div>
                  <div class="metric-value">${metrics.total}</div>
                  <div class="metric-label">Total Cadastrado</div>
                </div>
              </div>

              <div class="metric-card">
                <div class="metric-icon" style=${{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                  <${CheckCircle2} size=${20} />
                </div>
                <div>
                  <div class="metric-value">${metrics.completed}</div>
                  <div class="metric-label">Concluídas</div>
                </div>
              </div>

              <div class="metric-card">
                <div class="metric-icon" style=${{ backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
                  <${Hourglass} size=${20} />
                </div>
                <div>
                  <div class="metric-value">${metrics.inProgress}</div>
                  <div class="metric-label">Em Progresso</div>
                </div>
              </div>

              <div class="metric-card">
                <div class="metric-icon" style=${{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
                  <${AlertCircle} size=${20} />
                </div>
                <div>
                  <div class="metric-value">${metrics.overdue}</div>
                  <div class="metric-label">Atrasadas</div>
                </div>
              </div>
            </div>

            <!-- Filtros e Busca -->
            <div class="control-bar">
              <div class="search-box">
                <${Search} class="search-icon" size=${18} />
                <input
                  type="text"
                  class="search-input"
                  placeholder="Pesquisar por título ou descrição..."
                  value=${search}
                  onChange=${e => setSearch(e.target.value)}
                />
              </div>

              <div class="filter-actions">
                <select
                  class="select-filter"
                  value=${statusFilter}
                  onChange=${e => setStatusFilter(e.target.value)}
                >
                  <option value="TODAS">Todos os Status</option>
                  <option value="PENDENTE">Pendentes</option>
                  <option value="EM_ANDAMENTO">Em Progresso</option>
                  <option value="CONCLUIDA">Concluídas</option>
                  <option value="ATRASADA">Atrasadas</option>
                </select>

                <select
                  class="select-filter"
                  value=${priorityFilter}
                  onChange=${e => setPriorityFilter(e.target.value)}
                >
                  <option value="TODAS">Todas Prioridades</option>
                  <option value="BAIXA">Prioridade Baixa</option>
                  <option value="MEDIA">Prioridade Média</option>
                  <option value="ALTA">Prioridade Alta</option>
                </select>

                <div style=${{ display: 'flex', gap: '4px' }}>
                  <select
                    class="select-filter"
                    value=${sortBy}
                    onChange=${e => setSortBy(e.target.value)}
                  >
                    <option value="DATA_LIMITE">Ordenar por Prazo</option>
                    <option value="PRIORIDADE">Ordenar por Prioridade</option>
                    <option value="CRIACAO">Ordenar por Criação</option>
                  </select>

                  <button 
                    class="btn btn-secondary"
                    style=${{ padding: '10px 12px', width: 'auto' }}
                    onClick=${() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                    title=${sortOrder === 'ASC' ? 'Ordem Crescente' : 'Ordem Decrescente'}
                  >
                    ${sortOrder === 'ASC' ? html`<${ChevronUp} size=${16} />` : html`<${ChevronDown} size=${16} />`}
                  </button>
                </div>

                <button 
                  class="btn btn-primary" 
                  style=${{ width: 'auto' }} 
                  onClick=${openCreateModal}
                  id="add-task-btn"
                >
                  <${Plus} size=${16} />
                  Nova Tarefa
                </button>
              </div>
            </div>

            <!-- Listagem de Tarefas -->
            <div class="task-grid">
              ${tasks.length === 0 ? html`
                <div class="no-tasks">
                  <${ListTodo} class="no-tasks-icon" size=${48} style=${{ display: 'inline' }} />
                  <h3 style=${{ marginTop: '16px', fontWeight: 600 }}>Nenhuma tarefa encontrada</h3>
                  <p style=${{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                    Crie uma nova tarefa para começar ou ajuste seus filtros.
                  </p>
                </div>
              ` : tasks.map(task => html`
                <${TaskCard}
                  key=${task.id}
                  task=${task}
                  onDelete=${handleDeleteTask}
                  onStatusChange=${handleStatusChange}
                  onEdit=${openEditModal}
                />
              `)}
            </div>
          </div>

          <!-- Barra Lateral com Lembretes -->
          <div class="sidebar-panel">
            <div class="panel-card">
              <h3 class="panel-title">
                <${Bell} size=${18} style=${{ color: 'var(--warning)' }} />
                Lembretes e Alertas
              </h3>
              
              <div class="reminder-list">
                ${reminders.length === 0 ? html`
                  <p class="no-reminders">Tudo sob controle! Sem prazos urgentes.</p>
                ` : reminders.map(task => {
                  const isOverdue = task.isOverdue();
                  return html`
                    <div 
                      class=${`reminder-item ${isOverdue ? 'overdue' : ''}`} 
                      key=${task.id}
                    >
                      <${AlertCircle} class="reminder-icon" size=${16} />
                      <div class="reminder-content">
                        <span class="reminder-title">${task.title}</span>
                        <span class="reminder-desc">
                          ${isOverdue 
                            ? 'Já passou do prazo limite!' 
                            : `Vence em breve: ${new Date(task.deadline).toLocaleDateString('pt-BR')}`
                          }
                        </span>
                      </div>
                    </div>
                  `;
                })}
              </div>
            </div>
          </div>
        ` : html`
          <!-- Relatório de Produtividade -->
          <div style=${{ gridColumn: 'span 2' }}>
            <${ReportsPanel} 
              user=${user} 
              tasks=${rawTasks} 
              onRefresh=${loadTasksFromDb}
            />
          </div>
        `}
      </main>

      <${TaskModal}
        isOpen=${isModalOpen}
        onClose=${() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave=${handleCreateOrUpdateTask}
        taskToEdit=${taskToEdit}
      />
    </div>
  `;
};
