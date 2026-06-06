import re

with open('src/pages/StatsPage.jsx', 'r') as f:
    content = f.read()

replacements = {
    r'<h2><BookOpen size={24} /> Your Exams</h2>': r'<h2><BookOpen size={24} /> {t("yourExams")}</h2>',
    r'Exams are grouped by semester and sorted chronologically\. Click the toggle to exclude an exam\.': r'{t("yourExamsDesc")}',
    r"renderSemesterGroup\('a1s1', 'Year 1 - Semester 1'\)": r"renderSemesterGroup('a1s1', t('semesterA1S1'))",
    r"renderSemesterGroup\('a1s2', 'Year 1 - Semester 2'\)": r"renderSemesterGroup('a1s2', t('semesterA1S2'))",
    r"renderSemesterGroup\('a2s1', 'Year 2 - Semester 1'\)": r"renderSemesterGroup('a2s1', t('semesterA2S1'))",
    r"renderSemesterGroup\('a2s2', 'Year 2 - Semester 2'\)": r"renderSemesterGroup('a2s2', t('semesterA2S2'))",
    r"renderSemesterGroup\('a3s1', 'Year 3 - Semester 1'\)": r"renderSemesterGroup('a3s1', t('semesterA3S1'))",
    r"renderSemesterGroup\('a3s2', 'Year 3 - Semester 2'\)": r"renderSemesterGroup('a3s2', t('semesterA3S2'))",
    r"renderSemesterGroup\('a4s1', 'Year 4 - Semester 1'\)": r"renderSemesterGroup('a4s1', t('semesterA4S1'))",
    r"renderSemesterGroup\('a4s2', 'Year 4 - Semester 2'\)": r"renderSemesterGroup('a4s2', t('semesterA4S2'))",
    r"renderSemesterGroup\('a5s1', 'Year 5 - Semester 1'\)": r"renderSemesterGroup('a5s1', t('semesterA5S1'))",
    r"renderSemesterGroup\('a5s2', 'Year 5 - Semester 2'\)": r"renderSemesterGroup('a5s2', t('semesterA5S2'))",
    r'<Plus size={20} /> Add New Exam': r'<Plus size={20} /> {t("addNewExam")}',
    r'<h2><TrendingUp size={24} /> Simulate New Exams</h2>': r'<h2><TrendingUp size={24} /> {t("simulateNewExams")}</h2>',
    r'<label>Exam Name \(Optional\)</label>': r'<label>{t("examNameOptional")}</label>',
    r'placeholder="e\.g\. Thesis"': r'placeholder={t("examNameOptional")}',
    r'<label>Expected Grade</label>': r'<label>{t("expectedGrade")}</label>',
    r'<label>Credits \(CFU\)</label>': r'<label>{t("credits")}</label>',
    r'<Plus size={20} /> Add Simulated Exam': r'<Plus size={20} /> {t("addSimulatedExam")}',
    r'<h2><GraduationCap size={28} /> Final Projections</h2>': r'<h2><GraduationCap size={28} /> {t("finalProjections")}</h2>',
    r'<div className="result-label">Graduation Starting Grade</div>': r'<div className="result-label">{t("graduationStartingGrade")}</div>',
    r'<div className="result-label">Weighted Avg</div>': r'<div className="result-label">{t("weightedAvg")}</div>',
    r'<div className="result-label">Arithmetic Avg</div>': r'<div className="result-label">{t("arithmeticAvg")}</div>',
    r'<div className="result-label">Valid Credits</div>': r'<div className="result-label">{t("validCredits")}</div>',
    r'<div className="result-label">Valid Exams</div>': r'<div className="result-label">{t("validExams")}</div>',
    r'<h2><Target size={24} /> Goal: Graduation Grade</h2>': r'<h2><Target size={24} /> {t("goalGraduationGrade")}</h2>',
    r'<label>Target Grade</label>': r'<label>{t("targetGrade")}</label>',
    r'<label>Total Degree Credits</label>': r'<label>{t("totalDegreeCredits")}</label>',
    r'<h2><Activity size={24} /> Study Heatmap</h2>': r'<h2><Activity size={24} /> {t("studyHeatmap")}</h2>',
    r'Log\n *</button>': r'{t("log")}\n                </button>',
    r'<h2><BarChart2 size={24} /> Performance Trend</h2>': r'<h2><BarChart2 size={24} /> {t("performanceTrend")}</h2>',
    r'<strong>Note:</strong> The graduation starting grade is calculated as <code>\(Weighted Average / 30\) × 110</code>\. This is the exact base score before any additional points for your thesis or graduation defense are applied\.': r'{t("noteStartingGrade")}',
    r'No credits remaining\.': r'{t("noCreditsRemaining")}',
    r'Mathematically impossible': r'{t("mathematicallyImpossible")}',
    r'Easily achievable': r'{t("easilyAchievable")}',
    r'You need a \$\{requiredAvg\.toFixed\(2\)\} average in your remaining \$\{remainingCredits\} CFU\.': r'`${t("youNeedAvg", { avg: requiredAvg.toFixed(2), cred: remainingCredits })}`',
    r'\(requires \$\{requiredAvg\.toFixed\(2\)\} > 30\)': r'(${t("requiresAvg", { avg: requiredAvg.toFixed(2) })} > 30)',
    r'\(requires only \$\{requiredAvg\.toFixed\(2\)\}\)': r'(${t("requiresAvg", { avg: requiredAvg.toFixed(2) })})',
    r'<span className="exam-stat-label">Grade</span>': r'<span className="exam-stat-label">{t("grade")}</span>',
    r'<span className="exam-stat-label">Credits</span>': r'<span className="exam-stat-label">{t("credits")}</span>',
    r'<h2>{editingExamId \? \'Edit Exam\' : \'Add New Exam\'}</h2>': r'<h2>{editingExamId ? t("editExam") : t("addNewExam")}</h2>',
    r'<label>Exam Name</label>': r'<label>{t("examName")}</label>',
    r'<label>Grade</label>': r'<label>{t("grade")}</label>',
    r'<label>Date</label>': r'<label>{t("date")}</label>',
    r'<label>Semester</label>': r'<label>{t("semester")}</label>',
    r'>Save Changes<': r'>{t("saveChanges")}<',
    r'>Cancel<': r'>{t("cancel")}<'
}

for pattern, replacement in replacements.items():
    content = re.sub(pattern, replacement, content)

with open('src/pages/StatsPage.jsx', 'w') as f:
    f.write(content)
