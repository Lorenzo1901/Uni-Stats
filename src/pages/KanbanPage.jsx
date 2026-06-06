import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function KanbanPage() {
  const { t } = useTranslation();
  const INITIAL_COLUMNS = [t('colToStudy'), t('colReviewing'), t('colDone')];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('uniStats_kanban');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('uniStats_kanban', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, targetCol) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    setTasks(tasks.map(t => 
      t.id.toString() === taskId ? { ...t, column: targetCol } : t
    ));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTaskTitle.trim(), column: t('colToStudy') }]);
    setNewTaskTitle('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ animation: 'contentFadeIn 0.3s ease' }}>
      <div className="liquid-glass panel" style={{ marginBottom: '2rem' }}>
        <h2><Plus size={24} /> {t('addStudyTask')}</h2>
        <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder={t('addTaskPlaceholder')}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button type="submit" className="liquid-glass btn-inner" style={{ width: 'auto', padding: '0 2rem', borderRadius: '12px' }}>
            {t('add')}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {INITIAL_COLUMNS.map(col => (
          <div 
            key={col}
            onDrop={(e) => handleDrop(e, col)}
            onDragOver={handleDragOver}
            className="liquid-glass"
            style={{ 
              flex: 1, 
              minWidth: '300px', 
              padding: '1.5rem', 
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(0,0,0,0.2)'
            }}
          >
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {col}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '100px' }}>
              {tasks.filter(t => t.column === col).map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'grab',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onDragEnd={(e) => e.target.style.opacity = '1'}
                >
                  <GripVertical size={16} color="rgba(255,255,255,0.3)" style={{ cursor: 'grab' }} />
                  <span style={{ flex: 1, fontSize: '0.95rem', wordBreak: 'break-word' }}>{task.title}</span>
                  <button onClick={() => deleteTask(task.id)} className="btn-icon delete-btn" style={{ padding: '0.25rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {tasks.filter(t => t.column === col).length === 0 && (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', padding: '2rem 0', fontStyle: 'italic' }}>
                  {t('noTasksHere')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
