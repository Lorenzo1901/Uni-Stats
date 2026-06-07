import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, GraduationCap, TrendingUp, BookOpen, CheckCircle, XCircle, BarChart2, Edit2, Info, ChevronLeft, ChevronRight, Target, Activity, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StudyHeatmap from '../components/StudyHeatmap';

const DEFAULT_EXAMS = [];

import CustomSelect from '../components/CustomSelect';
import { useTranslation } from '../i18n';
import customStorage from '../storage';

const CustomDatePicker = ({ value, onChange }) => {
  const { t } = useTranslation();
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

  const displayValue = value ? value.split('-').reverse().join('/') : t('selectDate');
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
              background: '#000000',
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
                {t('today')}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default function StatsPage() {
  const { t } = useTranslation();

  // Exams arrays
  const [existingExams, setExistingExams] = useState(() => {
    const saved = customStorage.getItem('uniStats_exams');
    if (saved) {
      try { 
        let parsed = saved;
        if (typeof saved === 'string') {
           parsed = JSON.parse(saved); 
        }
        if (parsed.length <= 1) return DEFAULT_EXAMS;
        return parsed;
      } catch { return DEFAULT_EXAMS; }
    }
    return DEFAULT_EXAMS;
  });

  useEffect(() => {
    customStorage.setItem('uniStats_exams', JSON.stringify(existingExams));
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

  // New features state
  const [targetGrade, setTargetGrade] = useState(110);
  const [totalDegreeCredits, setTotalDegreeCredits] = useState(180);
  const [studyHoursInput, setStudyHoursInput] = useState('');
  const [studyDateInput, setStudyDateInput] = useState(() => new Date().toISOString().split('T')[0]);

  // State for Study Edit Modal
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [editingStudyDate, setEditingStudyDate] = useState('');
  const [editingStudyHours, setEditingStudyHours] = useState('');

  // Expand/Collapse state for exams list
  const [isExamsListExpanded, setIsExamsListExpanded] = useState(false);
  const [expandedSemesters, setExpandedSemesters] = useState({});

  const toggleSemester = (semId) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [semId]: !prev[semId]
    }));
  };

  // Logs for heatmap
  const [studyLogs, setStudyLogs] = useState(() => {
    const saved = customStorage.getItem('uniStats_studyLogs');
    if (saved) {
      try {
        let parsed = saved;
        if (typeof saved === 'string') {
           parsed = JSON.parse(saved); 
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    customStorage.setItem('uniStats_studyLogs', JSON.stringify(studyLogs));
  }, [studyLogs]);

  const logStudyHours = (e) => {
    e.preventDefault();
    const hours = parseFloat(studyHoursInput);
    if (isNaN(hours) || hours <= 0) return;
    
    const logDate = studyDateInput || new Date().toISOString().split('T')[0];
    const newLogs = [...studyLogs];
    const existingLogIndex = newLogs.findIndex(l => l.date === logDate);
    
    if (existingLogIndex >= 0) {
      newLogs[existingLogIndex].hours += hours;
    } else {
      newLogs.push({ date: logDate, hours });
    }
    
    setStudyLogs(newLogs);
    setStudyHoursInput('');
  };

  const openStudyEditModal = (cell) => {
    setEditingStudyDate(cell.date);
    setEditingStudyHours(cell.hours > 0 ? cell.hours : '');
    setIsStudyModalOpen(true);
  };

  const saveStudyEdit = (e) => {
    e.preventDefault();
    const hours = parseFloat(editingStudyHours);
    const newLogs = [...studyLogs];
    const existingLogIndex = newLogs.findIndex(l => l.date === editingStudyDate);
    
    if (isNaN(hours) || hours <= 0) {
      // If hours is 0 or empty, remove the log for this date
      if (existingLogIndex >= 0) {
        newLogs.splice(existingLogIndex, 1);
      }
    } else {
      // Update or add log
      if (existingLogIndex >= 0) {
        newLogs[existingLogIndex].hours = hours;
      } else {
        newLogs.push({ date: editingStudyDate, hours });
      }
    }
    
    setStudyLogs(newLogs);
    setIsStudyModalOpen(false);
  };

  const deleteStudyEdit = () => {
    const newLogs = studyLogs.filter(l => l.date !== editingStudyDate);
    setStudyLogs(newLogs);
    setIsStudyModalOpen(false);
  };

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

  const reverseEng = useMemo(() => {
    const currentWeightedSum = results.weightedAvg * results.totalCredits;
    const remainingCredits = totalDegreeCredits - results.totalCredits;
    
    let colorObj = { bg: 'rgba(0,0,0,0.2)', border: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.9)' };
    
    if (remainingCredits <= 0) return { feasible: false, message: t("noCreditsRemaining"), requiredAvg: null, colorObj };
    
    // (targetWeightedAvg / 30) * 110 = targetGrade
    const targetWeightedAvg = (targetGrade * 30) / 110;
    const targetWeightedSum = targetWeightedAvg * totalDegreeCredits;
    
    const requiredWeightedSumForRemaining = targetWeightedSum - currentWeightedSum;
    const requiredAvg = requiredWeightedSumForRemaining / remainingCredits;
    
    let feasible = true;
    let message = t("youNeedAvg", { avg: requiredAvg.toFixed(2), cred: remainingCredits });
    
    if (requiredAvg > 30) {
      feasible = false;
      message = `${t("mathematicallyImpossible")} (${t("requiresAvg", { avg: requiredAvg.toFixed(2) })} > 30).`;
    } else if (requiredAvg < 18) {
      message = `${t("easilyAchievable")} (${t("requiresAvg", { avg: requiredAvg.toFixed(2) })}).`;
    }

    if (!feasible) {
       colorObj = { bg: 'rgba(255, 50, 50, 0.2)', border: 'rgba(255, 50, 50, 0.5)', text: '#ff6b6b' };
    } else {
       const req = requiredAvg;
       const curr = parseFloat(results.weightedAvg);
       if (req <= curr) {
         colorObj = { bg: 'rgba(50, 255, 50, 0.2)', border: 'rgba(50, 255, 50, 0.5)', text: '#6bff6b' };
       } else {
         const ratio = (req - curr) / (30 - curr);
         const hue = Math.max(0, 60 * (1 - ratio)); 
         colorObj = { 
           bg: `hsla(${hue}, 100%, 50%, 0.2)`, 
           border: `hsla(${hue}, 100%, 50%, 0.5)`, 
           text: `hsl(${hue}, 100%, 70%)` 
         };
       }
    }
    
    return {
      remainingCredits,
      requiredAvg: requiredAvg.toFixed(2),
      feasible,
      message,
      colorObj
    };
  }, [results, targetGrade, totalDegreeCredits, t]);

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
          [t('weightedAvg')]: parseFloat((sumW / cred).toFixed(2)),
          [t('arithmeticAvg')]: parseFloat((sumA / count).toFixed(2)),
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
            [t('weightedAvg')]: parseFloat((sumW / cred).toFixed(2)),
            [t('arithmeticAvg')]: parseFloat((sumA / count).toFixed(2)),
          });
        }
      });
      return data;
    }
  }, [existingExams, plotView, t]);

  const renderSemesterGroup = (semesterId, title) => {
    const examsInSemester = existingExams.filter(e => e.semester === semesterId);
    if (examsInSemester.length === 0) return null;

    const isExpanded = expandedSemesters[semesterId] === true;

    return (
      <div key={semesterId} style={{ marginBottom: '1.5rem' }}>
        <h3 
          onClick={() => toggleSemester(semesterId)}
          style={{ 
            fontSize: '1rem', 
            color: 'rgba(255,255,255,0.9)', 
            marginBottom: '0.75rem', 
            paddingBottom: '0.25rem', 
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          {title}
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </h3>
        {isExpanded && (
          <div className="exam-list" style={{ marginTop: '0' }}>
          {examsInSemester.map((exam, index) => (
            <div key={exam.id} className={`exam-item stagger-item ${exam.excluded ? 'excluded' : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '1rem' }}>
                <span style={{ fontWeight: 600, color: exam.excluded ? 'rgba(255,255,255,0.5)' : '#fff', marginBottom: '0.25rem', transition: 'color 0.3s' }}>{exam.name}</span>
                <div className="exam-info" style={{ gap: '1rem' }}>
                  <div className="exam-stat">
                    <span className="exam-stat-label">{t("grade")}</span>
                    <span className="exam-stat-value font-mono" style={{ fontSize: '0.9rem', color: exam.excluded ? 'rgba(255,255,255,0.5)' : undefined, transition: 'color 0.3s' }}>{exam.grade}</span>
                  </div>
                  <div className="exam-stat">
                    <span className="exam-stat-label">{t("credits")}</span>
                    <span className="exam-stat-value font-mono" style={{ fontSize: '0.9rem', color: exam.excluded ? 'rgba(255,255,255,0.5)' : undefined, transition: 'color 0.3s' }}>{exam.credits} CFU</span>
                  </div>
                  <div className="exam-stat">
                    <span className="exam-stat-label">{t('date')}</span>
                    <span className="exam-stat-value font-mono" style={{ fontSize: '0.9rem', color: exam.excluded ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)', transition: 'color 0.3s' }}>
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
        )}
      </div>
    );
  };

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [20, 30];
    let min = 30;
    let max = 0;
    chartData.forEach(d => {
      min = Math.min(min, d[t('weightedAvg')], d[t('arithmeticAvg')]);
      max = Math.max(max, d[t('weightedAvg')], d[t('arithmeticAvg')]);
    });
    return [Math.floor(min) - 1, Math.ceil(max) + 1];
  }, [chartData, t]);

  const yTicks = useMemo(() => {
    const ticks = [];
    for (let i = yDomain[0]; i <= yDomain[1]; i++) {
      ticks.push(i);
    }
    return ticks;
  }, [yDomain]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'rgba(10, 8, 9, 0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '10px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <p style={{ color: '#fff', marginBottom: '5px', fontWeight: 600, fontFamily: 'system-ui, -apple-system, sans-serif' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color, display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{entry.name}:</span>
              <span style={{ fontFamily: 'Roboto Mono, monospace' }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ animation: 'contentFadeIn 0.3s ease' }}>
      <div className="grid">
        {/* Left Column - Inputs */}
        <div className="input-section">
          
          <div className="liquid-glass panel" style={{ marginBottom: '1rem' }}>
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: isExamsListExpanded ? '1.5rem' : '0' }}
              onClick={() => setIsExamsListExpanded(!isExamsListExpanded)}
            >
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={24} /> {t("yourExams")}</h2>
              {isExamsListExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
            </div>
            
            {isExamsListExpanded && (
              <>
                <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                  {t("yourExamsDesc")}
                </p>
                
                {renderSemesterGroup('a1s1', t('semesterA1S1'))}
                {renderSemesterGroup('a1s2', t('semesterA1S2'))}
                {renderSemesterGroup('a2s1', t('semesterA2S1'))}
                {renderSemesterGroup('a2s2', t('semesterA2S2'))}
                {renderSemesterGroup('a3s1', t('semesterA3S1'))}
                {renderSemesterGroup('a3s2', t('semesterA3S2'))}
                {renderSemesterGroup('a4s1', t('semesterA4S1'))}
                {renderSemesterGroup('a4s2', t('semesterA4S2'))}
                {renderSemesterGroup('a5s1', t('semesterA5S1'))}
                {renderSemesterGroup('a5s2', t('semesterA5S2'))}
                
                <button 
                  type="button" 
                  className="liquid-glass btn-inner" 
                  onClick={openAddModal}
                  style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '12px', width: '100%' }}
                >
                  <Plus size={20} /> {t('addNewExam')}
                </button>
              </>
            )}
          </div>

          <div className="liquid-glass panel" style={{ marginBottom: '1rem' }}>
            <h2><TrendingUp size={24} /> {t("simulateNewExams")}</h2>
              <form onSubmit={addSimulatedExam} className="input-row" style={{ flexWrap: 'wrap', marginBottom: 0 }}>
                <div className="form-group" style={{ minWidth: '100%', marginBottom: '0.5rem' }}>
                  <label>{t("examNameOptional")}</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={t("examNameOptional")}
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>{t("expectedGrade")}</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="e.g. 28"
                    value={simGrade}
                    onChange={(e) => setSimGrade(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>{t("credits")}</label>
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
                            <span className="exam-stat-label">{t("grade")}</span>
                            <span className="exam-stat-value" style={{ fontSize: '0.9rem' }}>{exam.grade}</span>
                          </div>
                          <div className="exam-stat">
                            <span className="exam-stat-label">{t("credits")}</span>
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
          
          <div className="liquid-glass panel results-panel" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}><GraduationCap size={28} /> {t("finalProjections")}</h2>
              <div className="info-tooltip-container">
                <Info size={20} color="rgba(255,255,255,0.6)" />
                <div className="info-tooltip-text">
                  {t("noteStartingGrade")}
                </div>
              </div>
            </div>
              
              <div className="results-grid" style={{ marginBottom: '0.5rem' }}>
                <div className="result-card highlight stagger-item" style={{ animationDelay: '0.1s' }}>
                  <div className="result-label">{t("graduationStartingGrade")}</div>
                  <div className="result-value font-mono">{results.startingGrade} <span style={{fontSize: '1rem', color: 'rgba(255,255,255,0.7)'}}>/ 110</span></div>
                </div>
                
                <div className="result-card stagger-item" style={{ animationDelay: '0.2s' }}>
                  <div className="result-label">{t("weightedAvg")}</div>
                  <div className="result-value font-mono">{results.weightedAvg}</div>
                </div>
                
                <div className="result-card stagger-item" style={{ animationDelay: '0.3s' }}>
                  <div className="result-label">{t("arithmeticAvg")}</div>
                  <div className="result-value font-mono">{results.arithmeticAvg}</div>
                </div>

                <div className="result-card stagger-item" style={{ animationDelay: '0.4s' }}>
                  <div className="result-label">{t("validCredits")}</div>
                  <div className="result-value font-mono">{results.totalCredits}</div>
                  <div style={{ width: '100%', maxWidth: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', margin: '0.75rem auto 0', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(results.totalCredits / totalDegreeCredits * 100, 100)}%`, 
                      background: 'linear-gradient(90deg, #ff0844 0%, #ffb199 100%)',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }} />
                  </div>
                </div>
                
                <div className="result-card stagger-item" style={{ animationDelay: '0.5s', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="result-label">{t("validExams")}</div>
                  <div className="result-value font-mono" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {results.totalExams}
                  </div>
                </div>
              </div>
          </div>

          {/* Reverse Engineering Panel */}
          <div className="liquid-glass panel" style={{ marginBottom: '1rem' }}>
            <h2><Target size={24} /> {t("goalGraduationGrade")}</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>{t("targetGrade")}</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(Number(e.target.value))}
                  min="66" max="110"
                />
              </div>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>{t("totalDegreeCredits")}</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={totalDegreeCredits}
                  onChange={(e) => setTotalDegreeCredits(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              borderRadius: '12px', 
              backgroundColor: reverseEng.colorObj.bg,
              border: `1px solid ${reverseEng.colorObj.border}`
            }}>
              <p style={{ margin: 0, fontWeight: 500, color: reverseEng.colorObj.text }}>
                {reverseEng.message}
              </p>
            </div>
          </div>

          {/* Study Heatmap Panel */}
          <div className="liquid-glass panel" style={{ marginBottom: '1rem' }}>
            <h2><Activity size={24} /> {t('studyHeatmap')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', gap: '1.25rem' }}>
              <form onSubmit={logStudyHours} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '160px' }}>
                  <CustomDatePicker 
                    value={studyDateInput}
                    onChange={(e) => setStudyDateInput(e.target.value)}
                  />
                </div>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Hours"
                  value={studyHoursInput}
                  onChange={(e) => setStudyHoursInput(e.target.value)}
                  style={{ width: '100px' }}
                  step="0.5"
                  min="0.5"
                />
                <button type="submit" className="liquid-glass btn-inner" style={{ padding: '0.85rem 1.25rem', width: 'auto', borderRadius: '0.75rem' }}>
                  {t("log")}
                </button>
              </form>
            </div>
            <StudyHeatmap studyLogs={studyLogs} exams={existingExams} onCellClick={openStudyEditModal} />
          </div>

          {/* Chart Panel */}
          <div className="liquid-glass panel" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}><BarChart2 size={24} /> {t("performanceTrend")}</h2>
                
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
                      {t("byExam")}
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
                      {t("bySemester")}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart key={plotView} data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={12}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={yDomain}
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={12}
                      ticks={yTicks}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => val.toFixed(0)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                    <Line 
                      type="monotone" 
                      dataKey={t('weightedAvg')}
                      stroke="#ffffff" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#ffffff', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#ffffff', strokeWidth: 0, style: { filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' } }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey={t('arithmeticAvg')}
                      stroke="rgba(255,255,255,0.5)" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: 'rgba(255,255,255,0.5)', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: 'rgba(255,255,255,0.8)', strokeWidth: 0 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                {t(plotView === 'exam' ? 'chartDisclaimerExam' : 'chartDisclaimerSemester')}
              </p>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Real Exams */}
      {isModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content liquid-glass">
            <h2>{editingExamId ? t("editExam") : t("addNewExam")}</h2>
            <form onSubmit={saveModalExam}>
              <div className="form-group">
                <label>{t("examName")}</label>
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
                  <label>{t("grade")}</label>
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
                  <label>{t("credits")}</label>
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
                  <label>{t("date")}</label>
                  <CustomDatePicker 
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1, position: 'relative' }}>
                  <label>{t("semester")}</label>
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
                <button type="button" className="btn btn-secondary static-btn" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} onClick={() => setIsModalOpen(false)}>{t("cancel")}</button>
                <button type="submit" className="btn static-btn" style={{ flex: 1 }}>{editingExamId ? 'Save Changes' : 'Add Exam'}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal for Edit Study Log */}
      {isStudyModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content liquid-glass">
            <h2>Edit Study Hours</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Modifying log for: <strong>{editingStudyDate.split('-').reverse().join('/')}</strong>
            </p>
            <form onSubmit={saveStudyEdit}>
              <div className="form-group">
                <label>Study Hours</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="E.g., 4"
                  value={editingStudyHours}
                  onChange={(e) => setEditingStudyHours(e.target.value)}
                  step="0.5"
                  min="0"
                />
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-icon delete-btn" style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={deleteStudyEdit} title="Clear hours for this day">
                  <Trash2 size={24} />
                </button>
                <button type="button" className="btn btn-secondary static-btn" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} onClick={() => setIsStudyModalOpen(false)}>{t("cancel")}</button>
                <button type="submit" className="btn static-btn" style={{ flex: 1 }}>{t("saveChanges")}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
