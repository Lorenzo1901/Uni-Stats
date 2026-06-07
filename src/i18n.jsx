import React, { createContext, useContext, useState, useEffect } from 'react';
import customStorage from './storage';

const translations = {
  en: {
    appSubtitle: "Your all-in-one university hub for grades, tracking, and planning.",
    navStats: "Stats & Projections",
    navKanban: "Study Kanban",
    // Stats Page
    yourExams: "Your Exams",
    yourExamsDesc: "Exams are grouped by semester and sorted chronologically. Click the toggle to exclude an exam.",
    year: "Year",
    semester: "Semester",
    grade: "Grade",
    credits: "Credits (CFU)",
    date: "Date",
    addNewExam: "Add New Exam",
    simulateNewExams: "Simulate New Exams",
    examNameOptional: "Exam Name (Optional)",
    expectedGrade: "Expected Grade",
    addSimulatedExam: "Add Simulated Exam",
    finalProjections: "Final Projections",
    graduationStartingGrade: "Graduation Starting Grade",
    weightedAvg: "Weighted Avg",
    arithmeticAvg: "Arithmetic Avg",
    validCredits: "Valid Credits",
    validExams: "Valid Exams",
    goalGraduationGrade: "Goal: Graduation Grade",
    targetGrade: "Target Grade",
    totalDegreeCredits: "Total Degree Credits",
    studyHeatmap: "Study Heatmap",
    log: "Log",
    performanceTrend: "Performance Trend",
    byExam: "By Exam",
    bySemester: "By Semester",
    chartDisclaimerExam: "*This chart plots the running average up to each exam. Simulated exams are excluded.",
    chartDisclaimerSemester: "*This chart plots the running average up to each semester. Simulated exams are excluded.",
    noteStartingGrade: "Note: The graduation starting grade is calculated as (Weighted Average / 30) × 110. This is the exact base score before any additional points for your thesis or graduation defense are applied.",
    noCreditsRemaining: "No credits remaining.",
    mathematicallyImpossible: "Mathematically impossible",
    easilyAchievable: "Easily achievable",
    youNeedAvg: "You need a {avg} average in your remaining {cred} CFU.",
    requiresAvg: "requires {avg}",
    // Modal
    editExam: "Edit Exam",
    examName: "Exam Name",
    semesterA1S1: "Year 1 - Semester 1",
    semesterA1S2: "Year 1 - Semester 2",
    semesterA2S1: "Year 2 - Semester 1",
    semesterA2S2: "Year 2 - Semester 2",
    semesterA3S1: "Year 3 - Semester 1",
    semesterA3S2: "Year 3 - Semester 2",
    semesterA4S1: "Year 4 - Semester 1",
    semesterA4S2: "Year 4 - Semester 2",
    semesterA5S1: "Year 5 - Semester 1",
    semesterA5S2: "Year 5 - Semester 2",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    // Kanban
    addStudyTask: "Add Study Task",
    addTaskPlaceholder: "E.g., Read chapter 4 of Algorithms",
    add: "Add",
    noTasksHere: "No tasks here",
    colToStudy: "Da studiare",
    colReviewing: "In ripasso",
    colDone: "Fatto",
    // Heatmap
    less: "Less",
    more: "More",
    examPassed: "Exam Passed",
    studyHours: "study hours",
    passed: "Passed",
    // CustomDatePicker
    selectDate: "Select Date",
    today: "Today"
  },
  it: {
    appSubtitle: "Il tuo hub universitario per voti, tracciamento e pianificazione.",
    navStats: "Statistiche e Proiezioni",
    navKanban: "Kanban di Studio",
    // Stats Page
    yourExams: "I tuoi Esami",
    yourExamsDesc: "Gli esami sono raggruppati per semestre e ordinati cronologicamente. Clicca sull'icona per escludere un esame.",
    year: "Anno",
    semester: "Semestre",
    grade: "Voto",
    credits: "Crediti (CFU)",
    date: "Data",
    addNewExam: "Aggiungi Esame",
    simulateNewExams: "Simula Nuovi Esami",
    examNameOptional: "Nome Esame (Opzionale)",
    expectedGrade: "Voto Atteso",
    addSimulatedExam: "Aggiungi Esame Simulato",
    finalProjections: "Proiezioni Finali",
    graduationStartingGrade: "Voto di Partenza",
    weightedAvg: "Media Ponderata",
    arithmeticAvg: "Media Aritmetica",
    validCredits: "Crediti Validi",
    validExams: "Esami Validi",
    goalGraduationGrade: "Obiettivo: Voto di Laurea",
    targetGrade: "Voto Obiettivo",
    totalDegreeCredits: "Crediti Totali Corso",
    studyHeatmap: "Heatmap di Studio",
    log: "Registra",
    performanceTrend: "Rendimento",
    byExam: "Per Esame",
    bySemester: "Per Semestre",
    chartDisclaimerExam: "*Questo grafico mostra l'andamento della media fino ad ogni esame. Gli esami simulati sono esclusi.",
    chartDisclaimerSemester: "*Questo grafico mostra l'andamento della media fino ad ogni semestre. Gli esami simulati sono esclusi.",
    noteStartingGrade: "Nota: Il voto di partenza è calcolato come (Media Ponderata / 30) × 110. Questo è il punteggio esatto prima di qualsiasi punto aggiuntivo per la prova finale.",
    noCreditsRemaining: "Nessun credito rimanente.",
    mathematicallyImpossible: "Matematicamente impossibile",
    easilyAchievable: "Facilmente raggiungibile",
    youNeedAvg: "Hai bisogno di una media del {avg} nei restanti {cred} CFU.",
    requiresAvg: "richiede {avg}",
    // Modal
    editExam: "Modifica Esame",
    examName: "Nome Esame",
    semesterA1S1: "Anno 1 - Semestre 1",
    semesterA1S2: "Anno 1 - Semestre 2",
    semesterA2S1: "Anno 2 - Semestre 1",
    semesterA2S2: "Anno 2 - Semestre 2",
    semesterA3S1: "Anno 3 - Semestre 1",
    semesterA3S2: "Anno 3 - Semestre 2",
    semesterA4S1: "Anno 4 - Semestre 1",
    semesterA4S2: "Anno 4 - Semestre 2",
    semesterA5S1: "Anno 5 - Semestre 1",
    semesterA5S2: "Anno 5 - Semestre 2",
    saveChanges: "Salva Modifiche",
    cancel: "Annulla",
    // Kanban
    addStudyTask: "Aggiungi Task",
    addTaskPlaceholder: "Es. Leggere cap. 4 di Algoritmi",
    add: "Aggiungi",
    noTasksHere: "Nessun task qui",
    colToStudy: "Da studiare",
    colReviewing: "In ripasso",
    colDone: "Fatto",
    // Heatmap
    less: "Meno",
    more: "Di più",
    examPassed: "Esame Superato",
    studyHours: "ore di studio",
    passed: "Superato",
    // CustomDatePicker
    selectDate: "Seleziona Data",
    today: "Oggi"
  }
};

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = customStorage.getItem('uniStats_lang');
    return saved ? saved : 'en';
  });

  useEffect(() => {
    customStorage.setItem('uniStats_lang', lang);
  }, [lang]);

  const t = (key, params = {}) => {
    let str = translations[lang]?.[key] || translations['en'][key] || key;
    Object.keys(params).forEach(k => {
      str = str.replace(`{${k}}`, params[k]);
    });
    return str;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
