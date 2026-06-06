import { LayoutDashboard, KanbanSquare } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function Navbar({ currentPage, setPage }) {
  const { t } = useTranslation();

  return (
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <button 
        className={`btn-inner liquid-glass ${currentPage === 'stats' ? 'active-nav' : ''}`}
        onClick={() => setPage('stats')}
        style={{ 
          padding: '0.75rem 1.5rem', 
          width: 'auto', 
          borderRadius: '12px', 
          background: currentPage === 'stats' ? 'rgba(131, 9, 43, 0.8)' : 'rgba(255, 255, 255, 0.05)',
          borderColor: currentPage === 'stats' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1.05rem', fontWeight: 500 }}>
          <LayoutDashboard size={20} /> {t('navStats')}
        </div>
      </button>
      <button 
        className={`btn-inner liquid-glass ${currentPage === 'kanban' ? 'active-nav' : ''}`}
        onClick={() => setPage('kanban')}
        style={{ 
          padding: '0.75rem 1.5rem', 
          width: 'auto', 
          borderRadius: '12px', 
          background: currentPage === 'kanban' ? 'rgba(131, 9, 43, 0.8)' : 'rgba(255, 255, 255, 0.05)',
          borderColor: currentPage === 'kanban' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1.05rem', fontWeight: 500 }}>
          <KanbanSquare size={20} /> {t('navKanban')}
        </div>
      </button>
    </nav>
  );
}
