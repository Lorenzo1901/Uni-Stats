import { useState } from 'react';
import Navbar from './components/Navbar';
import StatsPage from './pages/StatsPage';
import KanbanPage from './pages/KanbanPage';
import CustomSelect from './components/CustomSelect';
import { TranslationProvider, useTranslation } from './i18n';
import './index.css';

function LanguageSelector() {
  const { lang, setLang } = useTranslation();
  return (
    <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '120px' }}>
      <CustomSelect 
        value={lang} 
        onChange={(e) => setLang(e.target.value)} 
        options={[
          { value: 'en', label: 'English' },
          { value: 'it', label: 'Italiano' }
        ]} 
      />
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('stats');
  const { t } = useTranslation();

  return (
    <div className="container">
      <LanguageSelector />
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <h1>Uni Stats</h1>
        <p>{t('appSubtitle')}</p>
      </header>

      <Navbar currentPage={currentPage} setPage={setCurrentPage} />

      {currentPage === 'stats' ? <StatsPage /> : <KanbanPage />}
    </div>
  );
}

function App() {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
}

export default App;
