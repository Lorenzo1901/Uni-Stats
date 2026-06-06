import { useMemo } from 'react';

export default function StudyHeatmap({ studyLogs, exams, onCellClick }) {
  const weeksCount = 14;
  
  const { weeks, months } = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const weeksData = [];
    const monthsData = [];
    let currentMonth = -1;
    
    for (let w = weeksCount - 1; w >= 0; w--) {
      const weekDays = [];
      let monthAddedForWeek = false;
      
      for (let d = 6; d >= 0; d--) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + d));
        
        const dateStr = date.toISOString().split('T')[0];
        
        if (!monthAddedForWeek && date.getMonth() !== currentMonth) {
          currentMonth = date.getMonth();
          monthsData.push({ weekIndex: weeksCount - 1 - w, label: date.toLocaleString('default', { month: 'short' }) });
          monthAddedForWeek = true;
        }
        
        const log = studyLogs.find(l => l.date === dateStr);
        const hours = log ? log.hours : 0;
        
        const passedExam = exams.find(e => !e.excluded && e.date === dateStr);
        
        let intensity = 0;
        if (passedExam) {
          intensity = 4;
        } else if (hours > 0) {
          if (hours <= 2) intensity = 1;
          else if (hours <= 4) intensity = 2;
          else intensity = 3;
        }
        
        weekDays.push({
          date: dateStr,
          hours,
          passedExam: !!passedExam,
          examName: passedExam ? passedExam.name : null,
          intensity
        });
      }
      weeksData.push(weekDays);
    }
    
    return { weeks: weeksData, months: monthsData };
  }, [studyLogs, exams]);

  const getColor = (intensity) => {
    switch(intensity) {
      case 4: return '#39d353'; // Bright green for passed exam
      case 3: return '#26a641';
      case 2: return '#006d32';
      case 1: return '#0e4429';
      case 0: 
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  const cellSize = 14;
  const cellGap = 4;
  const colWidth = cellSize + cellGap;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', overflowX: 'auto', padding: '0.5rem' }}>
        {/* Months Header */}
        <div style={{ display: 'flex', position: 'relative', height: '20px' }}>
          {months.map((m, i) => (
            <span 
              key={i} 
              style={{ 
                position: 'absolute', 
                left: `${m.weekIndex * colWidth}px`, 
                fontSize: '0.8rem', 
                color: 'rgba(255,255,255,0.6)' 
              }}
            >
              {m.label}
            </span>
          ))}
        </div>
        
        {/* Grid */}
        <div style={{ display: 'flex', gap: `${cellGap}px`, paddingBottom: '0.5rem' }}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: `${cellGap}px` }}>
              {week.map((cell) => (
                <div 
                  key={cell.date}
                  title={`${cell.date}: ${cell.passedExam ? 'Passed ' + cell.examName : cell.hours + ' study hours'}`}
                  onClick={() => onCellClick && onCellClick(cell)}
                  style={{
                    width: `${cellSize}px`, 
                    height: `${cellSize}px`, 
                    backgroundColor: getColor(cell.intensity),
                    borderRadius: '3px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap' }}>
        <span>Less</span>
        <div style={{width: cellSize, height: cellSize, backgroundColor: getColor(0), borderRadius: 3}}></div>
        <div style={{width: cellSize, height: cellSize, backgroundColor: getColor(1), borderRadius: 3}}></div>
        <div style={{width: cellSize, height: cellSize, backgroundColor: getColor(2), borderRadius: 3}}></div>
        <div style={{width: cellSize, height: cellSize, backgroundColor: getColor(3), borderRadius: 3}}></div>
        <span>More</span>
        <span style={{marginLeft: '0.5rem', marginRight: '0.5rem'}}>|</span>
        <div style={{width: cellSize, height: cellSize, backgroundColor: getColor(4), borderRadius: 3}}></div>
        <span>Exam Passed</span>
      </div>
    </div>
  );
}
