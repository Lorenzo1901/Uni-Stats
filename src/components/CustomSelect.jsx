import { useState } from 'react';

export default function CustomSelect({ value, onChange, options }) {
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
              background: '#000000',
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
}
