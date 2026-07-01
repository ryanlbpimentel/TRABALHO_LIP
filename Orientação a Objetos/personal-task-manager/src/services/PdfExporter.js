import { jsPDF } from 'jspdf';

export class PdfExporter {
  static exportTasks(userName, tasks, metrics) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const nowStr = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Relatório de Tarefas Pessoais', 15, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Usuário: ${userName}  |  Gerado em: ${nowStr}`, 15, 30);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Resumo de Produtividade', 15, 52);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 55, 195, 55);

    const cols = [
      { label: 'Total', val: metrics.total.toString(), x: 15 },
      { label: 'Concluídas', val: metrics.completed.toString(), x: 50 },
      { label: 'Em Andamento', val: metrics.inProgress.toString(), x: 88 },
      { label: 'Pendentes', val: metrics.pending.toString(), x: 130 },
      { label: 'Atrasadas', val: metrics.overdue.toString(), x: 165 }
    ];

    cols.forEach(col => {
      doc.setFillColor(248, 250, 252);
      doc.rect(col.x, 60, 30, 22, 'F');
      
      doc.setDrawColor(226, 232, 240);
      doc.rect(col.x, 60, 30, 22, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text(col.val, col.x + 15, 70, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(col.label, col.x + 15, 77, { align: 'center' });
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Taxa Geral de Conclusão: ${metrics.completionRate}%`, 15, 90);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Lista de Atividades', 15, 105);

    doc.line(15, 108, 195, 108);

    let y = 115;
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, 180, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Tarefa', 17, y + 5);
    doc.text('Prioridade', 75, y + 5);
    doc.text('Data Limite', 105, y + 5);
    doc.text('Status', 135, y + 5);
    doc.text('Conclusão', 165, y + 5);

    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);

    if (tasks.length === 0) {
      doc.text('Nenhuma tarefa cadastrada.', 17, y + 8);
    } else {
      tasks.forEach((task, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;

          doc.setFillColor(241, 245, 249);
          doc.rect(15, y, 180, 8, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(71, 85, 105);
          doc.text('Tarefa', 17, y + 5);
          doc.text('Prioridade', 75, y + 5);
          doc.text('Data Limite', 105, y + 5);
          doc.text('Status', 135, y + 5);
          doc.text('Conclusão', 165, y + 5);
          y += 8;
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
        }

        if (idx % 2 === 0) {
          doc.setFillColor(255, 255, 255);
        } else {
          doc.setFillColor(248, 250, 252);
        }
        doc.rect(15, y, 180, 10, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(15, y + 10, 195, y + 10);

        let title = task.title;
        if (title.length > 25) {
          title = title.substring(0, 22) + '...';
        }
        doc.text(title, 17, y + 6);

        doc.text(task.priority, 75, y + 6);

        const deadlineStr = new Date(task.deadline).toLocaleDateString('pt-BR');
        doc.text(deadlineStr, 105, y + 6);

        let statusLabel = 'Pendente';
        if (task.status === 'EM_ANDAMENTO') statusLabel = 'Em Progresso';
        if (task.status === 'CONCLUIDA') statusLabel = 'Concluída';
        doc.text(statusLabel, 135, y + 6);

        const completedStr = task.completedAt 
          ? new Date(task.completedAt).toLocaleDateString('pt-BR') 
          : '-';
        doc.text(completedStr, 165, y + 6);

        y += 10;
      });
    }

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Gerado automaticamente pelo Sistema de Gerenciamento de Tarefas Pessoais.', 15, 287);

    doc.save(`relatorio-tarefas-${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
