import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, GraduationCap, TrendingUp, BookOpen, CheckCircle, XCircle, BarChart2, Edit2, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.css';

const DEFAULT_EXAMS = [
  { id: 1, name: 'Analisi I', grade: 28, credits: 9, date: '2025-01-17', semester: 'a1s1', excluded: false },
];

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (val) => {
    onChange({ target: { value: val } });
    setIsOpen(false);
  };
  const selectedLabel = options.find(o => o.value === value)?.label || 'Select...';
  return (
    <>
      {isOpen && <div style={{position: 'fixed', inset: 0, zIndex: 99}} onClick={() => setIsOpen(false)} />}
      <div style={{ position: 'relative', zIndex: isOpen ? 100 : 1, width: '100%' }}>
        <div 
          className="input-field" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{selectedLabel}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        {isOpen && (
          <div 
            className="liquid-glass" 
            style={{ 
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
              maxHeight: '200px', overflowY: 'auto', borderRadius: '0.75rem', padding: '0.5rem',
              background: 'rgba(20, 20, 20, 0.85)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {options.map(opt => {
              const isSelected = value === opt.value;
              return (
                <div 
                  key={opt.value} 
                  className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '0.5rem',
                    transition: 'background 0.2s', marginBottom: '0.25rem'
                  }}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const CustomDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    return value ? new Date(value) : new Date();
  });

  const handleSelect = (day) => {
    const y = currentMonth.getFullYear();
    const m = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange({ target: { value: `${y}-${m}-${d}` } });
    setIsOpen(false);
  };

  const handleToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    onChange({ target: { value: `${y}-${m}-${d}` } });
    setCurrentMonth(new Date(y, now.getMonth(), 1));
    setIsOpen(false);
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // 0 is Sunday
  
  const prevMonth = (e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); };
  const nextMonth = (e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const displayValue = value ? value.split('-').reverse().join('/') : 'Select Date';
  const [selY, selM, selD] = value ? value.split('-').map(Number) : [null, null, null];

  return (
    <>
      {isOpen && <div style={{position: 'fixed', inset: 0, zIndex: 99}} onClick={() => setIsOpen(false)} />}
      <div style={{ position: 'relative', zIndex: isOpen ? 100 : 1, width: '100%' }}>
        <div 
          className="input-field" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{displayValue}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        {isOpen && (
          <div 
            className="liquid-glass" 
            style={{ 
              position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem',
              borderRadius: '0.75rem', padding: '1rem', width: '310px',
              background: 'rgba(20, 20, 20, 0.85)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button type="button" onClick={prevMonth} className="btn-icon" style={{padding: '0.25rem', display: 'flex', alignItems: 'center'}}><ChevronLeft size={20} strokeWidth={2.5} /></button>
              <span style={{fontWeight: 500}}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
              <button type="button" onClick={nextMonth} className="btn-icon" style={{padding: '0.25rem', display: 'flex', alignItems: 'center'}}><ChevronRight size={20} strokeWidth={2.5} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#ccc' }}>
              {dayNames.map(d => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', textAlign: 'center' }}>
              {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selY === currentMonth.getFullYear() && selM === currentMonth.getMonth() + 1 && selD === day;
                return (
                  <div 
                    key={day}
                    className={`custom-calendar-day ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(day)}
                    style={{
                      padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={handleToday}
                style={{ 
                  background: 'transparent', color: 'rgba(255,255,255,0.8)', border: 'none', 
                  cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, padding: '0.25rem 1rem', borderRadius: '0.375rem',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};function App() {
  // Exams arrays
  const [existingExams, setExistingExams] = useState(() => {
    const saved = localStorage.getItem('uniStats_exams');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_EXAMS; }
    }
    return DEFAULT_EXAMS;
  });

  useEffect(() => {
    localStorage.setItem('uniStats_exams', JSON.stringify(existingExams));
  }, [existingExams]);

  const [simulatedExams, setSimulatedExams] = useState([]);
  
  // Modal State for Real Exams
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [modalName, setModalName] = useState('');
  const [modalGrade, setModalGrade] = useState('');
  const [modalCredits, setModalCredits] = useState('');
  const [modalDate, setModalDate] = useState('');
  const [modalSemester, setModalSemester] = useState('a1s1');
  
  // Plot view state
  const [plotView, setPlotView] = useState('exam');

  // Form states
  const [simName, setSimName] = useState('');
  const [simGrade, setSimGrade] = useState('');
  const [simCredits, setSimCredits] = useState('');

  const toggleExclude = (id) => {
    setExistingExams(existingExams.map(exam => 
      exam.id === id ? { ...exam, excluded: !exam.excluded } : exam
    ));
  };

  const formatExamName = (name) => {
    return name
      .replace(/a'/g, 'à')
      .replace(/e'/g, 'è')
      .replace(/i'/g, 'ì')
      .replace(/o'/g, 'ò')
      .replace(/u'/g, 'ù')
      .replace(/A'/g, 'À')
      .replace(/E'/g, 'È')
      .replace(/I'/g, 'Ì')
      .replace(/O'/g, 'Ò')
      .replace(/U'/g, 'Ù');
  };

  const addSimulatedExam = (e) => {
    e.preventDefault();
    if (!simGrade || !simCredits) return;
    
    const formattedName = simName ? formatExamName(simName) : `Esame Simulato ${simulatedExams.length + 1}`;
    
    setSimulatedExams([...simulatedExams, { 
      id: Date.now(), 
      name: formattedName,
      grade: parseFloat(simGrade), 
      credits: parseInt(simCredits) 
    }]);
    setSimName('');
    setSimGrade('');
    setSimCredits('');
  };

  const removeSimulatedExam = (id) => {
    setSimulatedExams(simulatedExams.filter(exam => exam.id !== id));
  };

  const openAddModal = () => {
    setEditingExamId(null);
    setModalName('');
    setModalGrade('');
    setModalCredits('');
    setModalDate(new Date().toISOString().split('T')[0]);
    setModalSemester('a1s1');
    setIsModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExamId(exam.id);
    setModalName(exam.name);
    setModalGrade(exam.grade);
    setModalCredits(exam.credits);
    setModalDate(exam.date);
    setModalSemester(exam.semester);
    setIsModalOpen(true);
  };

  const deleteExam = (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setExistingExams(existingExams.filter(e => e.id !== id));
    }
  };

  const saveModalExam = (e) => {
    e.preventDefault();
    if (!modalGrade || !modalCredits || !modalDate || !modalName) return;
    
    const formattedName = formatExamName(modalName);
    
    if (editingExamId) {
      setExistingExams(existingExams.map(exam => 
        exam.id === editingExamId 
          ? { ...exam, name: formattedName, grade: parseFloat(modalGrade), credits: parseInt(modalCredits), date: modalDate, semester: modalSemester } 
          : exam
      ));
    } else {
      setExistingExams([...existingExams, {
        id: Date.now(),
        name: formattedName,
        grade: parseFloat(modalGrade),
        credits: parseInt(modalCredits),
        date: modalDate,
        semester: modalSemester,
        excluded: false
      }]);
    }
    setIsModalOpen(false);
  };

  const results = useMemo(() => {
    let currentSumWeighted = 0;
    let currentSumArithmetic = 0;
    let currentCredits = 0;
    let currentNumExams = 0;

    existingExams.forEach(exam => {
      if (!exam.excluded) {
        currentSumWeighted += exam.grade * exam.credits;
        currentSumArithmetic += exam.grade;
        currentCredits += exam.credits;
        currentNumExams += 1;
      }
    });

    simulatedExams.forEach(exam => {
      currentSumWeighted += exam.grade * exam.credits;
      currentSumArithmetic += exam.grade;
      currentCredits += exam.credits;
      currentNumExams += 1;
    });

    const newWeightedAvg = currentCredits > 0 ? currentSumWeighted / currentCredits : 0;
    const newArithmeticAvg = currentNumExams > 0 ? currentSumArithmetic / currentNumExams : 0;
    const startingGrade = (newWeightedAvg / 30) * 110;

    return {
      weightedAvg: newWeightedAvg.toFixed(4),
      arithmeticAvg: newArithmeticAvg.toFixed(4),
      totalCredits: currentCredits,
      totalExams: currentNumExams,
      startingGrade: startingGrade.toFixed(2)
    };
  }, [existingExams, simulatedExams]);

  const chartData = useMemo(() => {
    let sortedExams = [...existingExams.filter(e => !e.excluded)];
    sortedExams.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (plotView === 'exam') {
      let sumW = 0, sumA = 0, cred = 0, count = 0;
      return sortedExams.map(exam => {
        sumW += exam.grade * exam.credits;
        sumA += exam.grade;
        cred += exam.credits;
        count += 1;
        return {
          name: exam.name.substring(0, 15) + (exam.name.length > 15 ? '...' : ''),
          'Weighted Average': parseFloat((sumW / cred).toFixed(2)),
          'Arithmetic Average': parseFloat((sumA / count).toFixed(2)),
        };
      });
    } else {
      const semesters = ['a1s1', 'a1s2', 'a2s1'];
      let sumW = 0, sumA = 0, cred = 0, count = 0;
      const data = [];
      
      semesters.forEach(sem => {
        const semExams = sortedExams.filter(e => e.semester === sem);
        if (semExams.length > 0) {
          semExams.forEach(exam => {
            sumW += exam.grade * exam.credits;
            sumA += exam.grade;
            cred += exam.credits;
            count += 1;
          });
          data.push({
            name: sem.toUpperCase(),
            'Weighted Average': parseFloat((sumW / cred).toFixed(2)),
            'Arithmetic Average': parseFloat((sumA / count).toFixed(2)),
          });
        }
      });
      return data;
    }
  }, [existingExams, plotView]);

  const renderSemesterGroup = (semesterId, title) => {
    const examsInSemester = existingExams.filter(e => e.semester === semesterId);
    if (examsInSemester.length === 0) return null;

    return (
      <div key={semesterId} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.75rem', paddingBottom: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          {title}
        </h3>
        <div className="exam-list" style={{ marginTop: '0' }}>
          {examsInSemester.map(exam => (
            <div key={exam.id} className={`exam-item ${exam.excluded ? 'excluded' : ''}`} style={{ opacity: exam.excluded ? 0.4 : 1, transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '1rem' }}>
                <span style={{ fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{exam.name}</span>
                <div className="exam-info" style={{ gap: '1rem' }}>
                  <div className="exam-stat">
                    <span className="exam-stat-label">Grade</span>
                    <span className="exam-stat-value" style={{ fontSize: '0.9rem' }}>{exam.grade}</span>
                  </div>
                  <div className="exam-stat">
                    <span className="exam-stat-label">Credits</span>
                    <span className="exam-stat-value" style={{ fontSize: '0.9rem' }}>{exam.credits} CFU</span>
                  </div>
                  <div className="exam-stat">
                    <span className="exam-stat-label">Date</span>
                    <span className="exam-stat-value" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                      {new Date(exam.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={() => openEditModal(exam)} 
                  className="btn-icon edit-btn"
                  title="Edit exam"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  type="button" 
                  onClick={() => deleteExam(exam.id)} 
                  className="btn-icon delete-btn"
                  title="Delete exam"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <Trash2 size={20} />
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 0.25rem' }}></div>
                <button 
                  type="button" 
                  onClick={() => toggleExclude(exam.id)} 
                  className="btn-icon"
                  title={exam.excluded ? "Include exam" : "Exclude exam"}
                  style={{ color: exam.excluded ? 'rgba(255,255,255,0.5)' : '#fff' }}
                >
                  {exam.excluded ? <CheckCircle size={24} /> : <XCircle size={24} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [20, 30];
    let min = 30;
    let max = 0;
    chartData.forEach(d => {
      min = Math.min(min, d['Weighted Average'], d['Arithmetic Average']);
      max = Math.max(max, d['Weighted Average'], d['Arithmetic Average']);
    });
    return [Math.floor(min) - 1, Math.ceil(max) + 1];
  }, [chartData]);

  const yTicks = useMemo(() => {
    const ticks = [];
    for (let i = yDomain[0]; i <= yDomain[1]; i++) {
      ticks.push(i);
    }
    return ticks;
  }, [yDomain]);

  return (
    <div className="container">
      <header className="header">
        <h1>Uni Stats</h1>
        <p>Calculate your averages and discover your graduation starting grade with exactness.</p>
      </header>

      <div className="grid">
        {/* Left Column - Inputs */}
        <div className="input-section">
          
          <div className="liquid-glass panel" style={{ marginBottom: '2rem' }}>
            <h2><BookOpen size={24} /> Your Exams</h2>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
              Exams are grouped by semester and sorted chronologically. Click the toggle to exclude an exam.
            </p>
            
            {renderSemesterGroup('a1s1', 'Year 1 - Semester 1')}
            {renderSemesterGroup('a1s2', 'Year 1 - Semester 2')}
            {renderSemesterGroup('a2s1', 'Year 2 - Semester 1')}
            {renderSemesterGroup('a2s2', 'Year 2 - Semester 2')}
            {renderSemesterGroup('a3s1', 'Year 3 - Semester 1')}
            {renderSemesterGroup('a3s2', 'Year 3 - Semester 2')}
            {renderSemesterGroup('a4s1', 'Year 4 - Semester 1')}
            {renderSemesterGroup('a4s2', 'Year 4 - Semester 2')}
            {renderSemesterGroup('a5s1', 'Year 5 - Semester 1')}
            {renderSemesterGroup('a5s2', 'Year 5 - Semester 2')}
            
            <button 
              type="button" 
              className="liquid-glass btn-inner" 
              onClick={openAddModal}
              style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '12px' }}
            >
              <Plus size={20} /> Add New Exam
            </button>
          </div>

          <div className="liquid-glass panel" style={{ marginBottom: '2rem' }}>
            <h2><TrendingUp size={24} /> Simulate New Exams</h2>
              <form onSubmit={addSimulatedExam} className="input-row" style={{ flexWrap: 'wrap', marginBottom: 0 }}>
                <div className="form-group" style={{ minWidth: '100%', marginBottom: '0.5rem' }}>
                  <label>Exam Name (Optional)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Thesis"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Expected Grade</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="e.g. 28"
                    value={simGrade}
                    onChange={(e) => setSimGrade(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Credits (CFU)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="e.g. 6"
                    value={simCredits}
                    onChange={(e) => setSimCredits(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', minWidth: '100%', marginBottom: 0 }}>
                  <button type="submit" className="liquid-glass btn-inner" style={{ padding: '0.75rem', borderRadius: '12px' }}>
                    <Plus size={20} /> Add Simulated Exam
                  </button>
                </div>
              </form>

              {simulatedExams.length > 0 && (
                <div className="exam-list">
                  {simulatedExams.map(exam => (
                    <div key={exam.id} className="exam-item">
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{exam.name}</span>
                        <div className="exam-info" style={{ gap: '1rem' }}>
                          <div className="exam-stat">
                            <span className="exam-stat-label">Grade</span>
                            <span className="exam-stat-value" style={{ fontSize: '0.9rem' }}>{exam.grade}</span>
                          </div>
                          <div className="exam-stat">
                            <span className="exam-stat-label">Credits</span>
                            <span className="exam-stat-value" style={{ fontSize: '0.9rem' }}>{exam.credits} CFU</span>
                          </div>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeSimulatedExam(exam.id)} className="btn-icon">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </div>

        </div>

        {/* Right Column - Results and Charts */}
        <div className="results-section">
          
          <div className="liquid-glass panel results-panel" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}><GraduationCap size={28} /> Final Projections</h2>
              <div className="info-tooltip-container">
                <Info size={20} color="rgba(255,255,255,0.6)" />
                <div className="info-tooltip-text">
                  <strong>Note:</strong> The graduation starting grade is calculated as <code>(Weighted Average / 30) × 110</code>. This is the exact base score before any additional points for your thesis or graduation defense are applied.
                </div>
              </div>
            </div>
              
              <div className="results-grid">
                <div className="result-card highlight">
                  <div className="result-label">Graduation Starting Grade</div>
                  <div className="result-value">{results.startingGrade} <span style={{fontSize: '1rem', color: 'rgba(255,255,255,0.7)'}}>/ 110</span></div>
                </div>
                
                <div className="result-card">
                  <div className="result-label">Weighted Avg</div>
                  <div className="result-value">{results.weightedAvg}</div>
                </div>
                
                <div className="result-card">
                  <div className="result-label">Arithmetic Avg</div>
                  <div className="result-value">{results.arithmeticAvg}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Valid Credits</div>
                  <div className="result-value">{results.totalCredits}</div>
                </div>
                
                <div className="result-card">
                  <div className="result-label">Valid Exams</div>
                  <div className="result-value">{results.totalExams}</div>
                </div>
              </div>
          </div>

          {/* Chart Panel */}
          <div className="liquid-glass panel" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}><BarChart2 size={24} /> Performance Trend</h2>
                
                {/* Toggle Buttons */}
                <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '0.5rem', padding: '0.25rem' }}>
                  <div style={{ display: 'flex', position: 'relative', width: '220px' }}>
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.375rem',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        transform: plotView === 'exam' ? 'translateX(0)' : 'translateX(100%)'
                      }}
                    />
                    <button 
                      onClick={() => setPlotView('exam')}
                      style={{
                        flex: 1, position: 'relative', zIndex: 1,
                        background: 'transparent', color: '#fff',
                        border: 'none', padding: '0.5rem 0', borderRadius: '0.375rem', cursor: 'pointer',
                        fontSize: '0.875rem', fontWeight: 500
                      }}
                    >
                      By Exam
                    </button>
                    <button 
                      onClick={() => setPlotView('semester')}
                      style={{
                        flex: 1, position: 'relative', zIndex: 1,
                        background: 'transparent', color: '#fff',
                        border: 'none', padding: '0.5rem 0', borderRadius: '0.375rem', cursor: 'pointer',
                        fontSize: '0.875rem', fontWeight: 500
                      }}
                    >
                      By Semester
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#fff" 
                      fontSize={12}
                      tickMargin={10}
                    />
                    <YAxis 
                      domain={yDomain}
                      stroke="#fff" 
                      fontSize={12}
                      ticks={yTicks}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem', color: '#fff', backdropFilter: 'blur(10px)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="Weighted Average" 
                      stroke="#fff" 
                      strokeWidth={3}
                      dot={{ fill: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Arithmetic Average" 
                      stroke="rgba(255,255,255,0.6)" 
                      strokeWidth={3}
                      dot={{ fill: 'rgba(255,255,255,0.6)', strokeWidth: 2 }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                *This chart plots the running average up to each {plotView === 'exam' ? 'exam' : 'semester'}. Simulated exams are excluded.
              </p>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Real Exams */}
      {isModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content liquid-glass">
            <h2>{editingExamId ? 'Edit Exam' : 'Add New Exam'}</h2>
            <form onSubmit={saveModalExam}>
              <div className="form-group">
                <label>Exam Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                />
              </div>
              <div className="input-row" style={{ marginTop: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Grade</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    required
                    min="18"
                    max="31"
                    value={modalGrade}
                    onChange={(e) => setModalGrade(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Credits (CFU)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    required
                    min="1"
                    value={modalCredits}
                    onChange={(e) => setModalCredits(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-row" style={{ marginTop: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Date</label>
                  <CustomDatePicker 
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1, position: 'relative' }}>
                  <label>Semester</label>
                  <CustomSelect 
                    value={modalSemester}
                    onChange={(e) => setModalSemester(e.target.value)}
                    options={[
                      {value: "a1s1", label: "Year 1 - Semester 1"},
                      {value: "a1s2", label: "Year 1 - Semester 2"},
                      {value: "a2s1", label: "Year 2 - Semester 1"},
                      {value: "a2s2", label: "Year 2 - Semester 2"},
                      {value: "a3s1", label: "Year 3 - Semester 1"},
                      {value: "a3s2", label: "Year 3 - Semester 2"},
                      {value: "a4s1", label: "Year 4 - Semester 1"},
                      {value: "a4s2", label: "Year 4 - Semester 2"},
                      {value: "a5s1", label: "Year 5 - Semester 1"},
                      {value: "a5s2", label: "Year 5 - Semester 2"}
                    ]}
                  />
                </div>
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary static-btn" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn static-btn" style={{ flex: 1 }}>{editingExamId ? 'Save Changes' : 'Add Exam'}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default App;
