import { useState } from 'react';
import Navbar from './components/Navbar';
import StatsPage from './pages/StatsPage';
import KanbanPage from './pages/KanbanPage';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('stats');

  return (
    <div className="container">
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <h1>Uni Stats</h1>
        <p>Your all-in-one university hub for grades, tracking, and planning.</p>
      </header>

      <Navbar currentPage={currentPage} setPage={setCurrentPage} />

      {currentPage === 'stats' ? <StatsPage /> : <KanbanPage />}
    </div>
  );
}

export default App;
