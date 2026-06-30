import React from 'react';
import { html } from '../utils/html.js';
import { FileText, Award, CalendarDays, TrendingUp, ShieldCheck } from 'lucide-react';
import { ReportService } from '../services/ReportService.js';
import { PdfExporter } from '../services/PdfExporter.js';

export const ReportsPanel = ({ user, tasks, onRefresh }) => {
  const metrics = ReportService.getSummaryMetrics(tasks);
  const completedPerDay = ReportService.getCompletedTasksPerDay(tasks);
  const priorityMetrics = ReportService.getPriorityMetrics(tasks);

  const maxCompleted = Math.max(...completedPerDay.map(d => d.count), 0);
  const chartMax = maxCompleted > 0 ? maxCompleted : 5;

  const handleExportPdf = () => {
    PdfExporter.exportTasks(user.name, tasks, metrics);
  };

  return html`
    <div class="reports-container animate-fade-in">
      <div 
        style=${{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style=${{ fontSize: '20px', fontWeight: 700 }}>Relatório de Produtividade</h2>
          <p style=${{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Acompanhe o andamento das suas atividades
          </p>
        </div>

        <button 
          class="btn btn-primary" 
          style=${{ width: 'auto' }}
          onClick=${handleExportPdf}
          id="export-pdf-btn"
        >
          <${FileText} size=${16} />
          Exportar PDF
        </button>
      </div>

      <div class="reports-layout">
        <!-- Metas de Conclusão -->
        <div class="panel-card" style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 class="panel-title">
              <${Award} size=${18} style=${{ color: 'var(--primary)' }} />
              Metas de Conclusão
            </h3>
            
            <div class="productivity-indicator" style=${{ marginTop: '16px' }}>
              <div class="progress-circle">
                <svg class="progress-circle-svg" width="100" height="100">
                  <circle class="progress-circle-bg" cx="50" cy="50" r="40" />
                  <circle 
                    class="progress-circle-bar" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    strokeDasharray="251.2"
                    strokeDashoffset=${251.2 - (251.2 * metrics.completionRate) / 100}
                  />
                </svg>
                <div class="progress-circle-text">${metrics.completionRate}%</div>
              </div>
              <span class="progress-label">Taxa de Conclusão Geral</span>
            </div>
          </div>

          <div>
            <h3 class="panel-title">
              <${ShieldCheck} size=${18} style=${{ color: 'var(--success)' }} />
              Conclusão por Prioridade
            </h3>
            
            <div class="priority-bar-list">
              ${priorityMetrics.map(item => html`
                <div class="priority-bar-item" key=${item.priority}>
                  <div class="priority-bar-header">
                    <span>Prioridade ${item.priority === 'ALTA' ? 'Alta' : item.priority === 'MEDIA' ? 'Média' : 'Baixa'}</span>
                    <span style=${{ color: 'var(--text-secondary)' }}>
                      ${item.completed}/${item.total} (${item.percentage}%)
                    </span>
                  </div>
                  <div class="priority-bar-outer">
                    <div 
                      class=${`priority-bar-inner priority-bar-${item.priority}`} 
                      style=${{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              `)}
            </div>
          </div>
        </div>

        <!-- Histórico Diário -->
        <div class="panel-card" style=${{ display: 'flex', flexDirection: 'column' }}>
          <h3 class="panel-title">
            <${CalendarDays} size=${18} style=${{ color: 'var(--info)' }} />
            Concluídas nos Últimos 7 Dias
          </h3>

          <div style=${{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '200px', marginTop: '16px' }}>
            ${maxCompleted === 0 ? html`
              <div style=${{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', padding: '32px 0' }}>
                <${TrendingUp} size=${24} style=${{ marginBottom: '8px', opacity: 0.5, display: 'inline-block' }} />
                <p>Nenhuma tarefa concluída no período.</p>
              </div>
            ` : html`
              <div class="chart-container">
                <div class="bar-chart">
                  ${completedPerDay.map((day, idx) => {
                    const heightPercent = chartMax > 0 ? (day.count / chartMax) * 100 : 0;
                    return html`
                      <div class="bar-chart-col" key=${idx}>
                        <div 
                          class="chart-bar-fill animate-fade-in" 
                          data-value="${day.count} concluída(s)"
                          style=${{ 
                            height: `${Math.max(heightPercent, 2)}%`,
                            backgroundColor: day.count > 0 ? 'var(--primary)' : 'var(--border-color-hover)'
                          }}
                        />
                        <div class="chart-axis-label">${day.dateLabel}</div>
                      </div>
                    `;
                  })}
                </div>
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
};
