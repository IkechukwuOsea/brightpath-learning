import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Brain, CheckCircle2, ChevronRight, CircleHelp, ClipboardList, GraduationCap, LayoutDashboard, Menu, Settings, ShieldCheck, Sparkles, Users, X, ArrowLeft, RotateCcw, Globe2, Clock3, Trophy, Search } from "lucide-react";
import { countries, grades, lessons, initialProgress } from "./data.js";
import { evaluateAttempt, getNextStep } from "./adaptive.js";
import { normalizeProgress } from "./progress.js";

const read = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The app remains usable when storage is blocked or full; persistence is best-effort.
  }
};
const readProgress = () => normalizeProgress(read("bp_progress", {}), lessons, initialProgress);
const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "learn", label: "Learning room", icon: BookOpen },
  { id: "progress", label: "Progress report", icon: ClipboardList },
  { id: "classroom", label: "Classroom", icon: Users },
  { id: "curriculum", label: "Curriculum", icon: Globe2 }
];

export default function App() {
  const [page, setPage] = useState("overview");
  const [role, setRole] = useState("Student");
  const [studentName, setStudentName] = useState(() => {
    const saved = read("bp_name", "Alex");
    return typeof saved === "string" ? saved : "Alex";
  });
  const [country, setCountry] = useState(() => {
    const saved = read("bp_country", "NG");
    return countries.some((item) => item.code === saved) ? saved : countries[0].code;
  });
  const [curriculum, setCurriculum] = useState(() => {
    const savedCountry = read("bp_country", "NG");
    const selectedCountry = countries.find((item) => item.code === savedCountry) || countries[0];
    const savedCurriculum = read("bp_curriculum", selectedCountry.curricula[0]);
    return selectedCountry.curricula.includes(savedCurriculum) ? savedCurriculum : selectedCountry.curricula[0];
  });
  const [grade, setGrade] = useState(() => {
    const saved = read("bp_grade", "Primary 4");
    return grades.includes(saved) ? saved : "Primary 4";
  });
  const [progress, setProgress] = useState(readProgress);
  const [activeLesson, setActiveLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const countryInfo = countries.find(c => c.code === country) || countries[0];
  const displayName = studentName.trim() || "Alex";

  useEffect(() => write("bp_progress", progress), [progress]);
  useEffect(() => write("bp_name", studentName), [studentName]);
  useEffect(() => write("bp_country", country), [country]);
  useEffect(() => write("bp_curriculum", curriculum), [curriculum]);
  useEffect(() => write("bp_grade", grade), [grade]);

  const completed = lessons.filter(l => (progress[l.id]?.attempts || 0) > 0).length;
  const attemptedScores = lessons
    .filter((lesson) => (progress[lesson.id]?.attempts || 0) > 0)
    .map((lesson) => progress[lesson.id]?.lastScore)
    .filter((score) => Number.isFinite(score));
  const average = attemptedScores.length
    ? Math.round(attemptedScores.reduce((sum, score) => sum + score, 0) / attemptedScores.length)
    : 0;
  const filteredLessons = useMemo(() => lessons.filter(l => `${l.title} ${l.subject}`.toLowerCase().includes(search.toLowerCase())), [search]);

  function startLesson(lesson) { setActiveLesson(lesson); setAnswers({}); setResult(null); setPage("learn"); setMenuOpen(false); }
  function submitQuiz() {
    if (!activeLesson || activeLesson.questions.some((_, i) => answers[i] === undefined)) return;
    const updated = evaluateAttempt(activeLesson, answers, progress[activeLesson.id]);
    setProgress(prev => ({ ...prev, [activeLesson.id]: { ...prev[activeLesson.id], ...updated, best: Math.max(prev[activeLesson.id]?.best || 0, updated.score), lastScore: updated.score } }));
    setResult(updated);
  }
  function resetDemo() { if (confirm("Reset all demo progress on this device?")) { setProgress(initialProgress); setPage("overview"); setActiveLesson(null); setResult(null); } }

  const Header = () => <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button><div className="breadcrumb">School workspace <ChevronRight size={15}/> <strong>{nav.find(n => n.id === page)?.label || "Learning room"}</strong></div><div className="top-actions"><span className="curriculum-pill"><Globe2 size={15}/>{countryInfo.name}</span><div className="avatar">{(displayName || "A").slice(0,1).toUpperCase()}</div></div></header>;
  const Sidebar = () => <aside className={`sidebar ${menuOpen ? "open" : ""}`}><div className="brand"><div className="brand-mark"><GraduationCap size={23}/></div><div><b>BrightPath</b><small>Learning together</small></div></div><div className="workspace-label">WORKSPACE</div><nav>{nav.map(item => <button key={item.id} className={`nav-item ${page === item.id ? "selected" : ""}`} onClick={() => {setPage(item.id); setActiveLesson(null); setMenuOpen(false);}}><item.icon size={18}/><span>{item.label}</span>{item.id === "progress" && completed > 0 && <em>{completed}</em>}</button>)}</nav><div className="sidebar-bottom"><div className="safety-note"><ShieldCheck size={18}/><div><b>Safe learning space</b><small>Demo mode · No account login</small></div></div><button className="nav-item" onClick={() => {setPage("settings"); setMenuOpen(false);}}><Settings size={18}/><span>Profile & settings</span></button><div className="profile-mini"><div className="avatar"> {(displayName || "A").slice(0,1).toUpperCase()}</div><div><b>{displayName}</b><small>{role} · {grade}</small></div><button className="more-button" onClick={() => {setPage("settings"); setMenuOpen(false);}} aria-label="Open profile settings">···</button></div></div></aside>;

  return <div className="app-shell"><Sidebar/><main className="main-area"><Header/><div className="page-content">
    {page === "overview" && <><section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR LEARNING JOURNEY</div><h1>Good day, {displayName} <span className="wave">✦</span></h1><p className="muted">Small steps every day lead to big discoveries.</p></div><button className="primary-button" onClick={() => startLesson(lessons.find(l => (progress[l.id]?.lastScore ?? -1) < 80) || lessons[0])}><BookOpen size={17}/> Continue learning</button></section>
      <section className="stats-grid"><Stat icon={BookOpen} label="Lessons explored" value={`${completed} / ${lessons.length}`} sub="Keep your curiosity going" tone="mint"/><Stat icon={Trophy} label="Average score" value={`${completed ? average : 0}%`} sub="Based on attempted lessons" tone="yellow"/><Stat icon={Brain} label="Topics practised" value={completed} sub="Lessons with a quiz attempt" tone="lavender"/></section>
      <div className="section-heading"><div><h2>Pick up where you left off</h2><p className="muted">Lessons selected for your current learning level.</p></div><button className="text-button" onClick={() => setPage("learn")}>All lessons <ChevronRight size={16}/></button></div>
      <section className="lesson-grid">{lessons.map((lesson, i) => <LessonCard key={lesson.id} lesson={lesson} progress={progress[lesson.id]} index={i} onClick={() => startLesson(lesson)}/>)}</section>
      <section className="bottom-grid"><div className="panel tip-panel"><div className="tip-icon"><Sparkles size={19}/></div><div><h3>Your learning tip</h3><p>Learning something new can take a few tries. Mistakes are clues that help you figure things out. Take your time and ask questions.</p></div></div><div className="panel curriculum-summary"><div className="panel-title"><Globe2 size={18}/><h3>Your learning pathway</h3></div><p><b>{countryInfo.name}</b><br/><span className="muted">{curriculum}</span></p><p className="small-muted">{grade} · Demo curriculum content</p><button className="text-button" onClick={() => setPage("curriculum")}>Review pathway <ChevronRight size={15}/></button></div></section></>}

    {page === "learn" && !activeLesson && <><PageTitle eyebrow="LEARNING ROOM" title="What would you like to learn?" subtitle="Choose a lesson and work at a pace that suits you."/><div className="search-box"><Search size={17}/><input aria-label="Search subjects or lessons" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects or lessons"/></div><section className="lesson-grid">{filteredLessons.map((lesson, i) => <LessonCard key={lesson.id} lesson={lesson} progress={progress[lesson.id]} index={i} onClick={() => startLesson(lesson)}/>)}</section>{filteredLessons.length === 0 && <Empty title="No lessons found" body="Try another subject or search term."/>}</>}
    {page === "learn" && activeLesson && <LessonView lesson={activeLesson} answers={answers} setAnswers={setAnswers} result={result} onSubmit={submitQuiz} onBack={() => {setActiveLesson(null);setResult(null);}} onRetry={() => {setAnswers({});setResult(null);}} progress={progress[activeLesson.id]}/>}
    {page === "progress" && <><PageTitle eyebrow="GROWTH & ACHIEVEMENT" title="Your progress report" subtitle="See what you have practised and what to work on next."/><section className="stats-grid"><Stat icon={CheckCircle2} label="Lessons attempted" value={`${completed}`} sub={`Out of ${lessons.length} demo lessons`} tone="mint"/><Stat icon={Trophy} label="Average score" value={`${completed ? average : 0}%`} sub="Across attempted lessons" tone="yellow"/><Stat icon={Brain} label="Mastery status" value={lessons.filter(l => progress[l.id]?.status === "Mastered").length} sub="Topics marked mastered" tone="lavender"/></section><div className="panel progress-panel"><div className="table-head"><h3>Topic-by-topic progress</h3><span className="small-muted">Saved on this device</span></div>{lessons.map(l => {const p = progress[l.id] || {};return <div className="progress-row" key={l.id}><div className="subject-icon"><BookOpen size={18}/></div><div className="progress-info"><b>{l.title}</b><small>{l.subject} · {p.attempts || 0} attempts</small><div className="progress-track"><span style={{width:`${p.mastery || 0}%`}}/></div></div><div className="progress-score"><b>{p.lastScore == null ? "—" : `${p.lastScore}%`}</b><small>{p.status || "New"}</small></div><button className="icon-button" onClick={() => startLesson(l)} aria-label={`Practise ${l.title}`}><ChevronRight size={18}/></button></div>})}</div><div className="panel next-step"><Sparkles size={19}/><div><b>Suggested next step</b><p>{lessons.find(l => (progress[l.id]?.lastScore ?? -1) < 80) ? `${lessons.find(l => (progress[l.id]?.lastScore ?? -1) < 80).title}: ${getNextStep(progress, lessons.find(l => (progress[l.id]?.lastScore ?? -1) < 80).id)}` : "Try a review of each topic to keep your knowledge fresh."}</p></div></div></>}
    {page === "classroom" && <><PageTitle eyebrow="SCHOOL WORKSPACE" title="Classroom overview" subtitle="A starter view for teachers and school administrators."/><div className="notice"><ShieldCheck size={20}/><div><b>Prototype classroom</b><p>This starter includes a demo student profile and learning records stored in this browser. Real multi-user classrooms require authentication, a server database and access controls.</p></div></div><section className="stats-grid"><Stat icon={Users} label="Demo learners" value="1" sub="Local sample profile" tone="mint"/><Stat icon={ClipboardList} label="Available lessons" value={lessons.length} sub="Sample content only" tone="yellow"/><Stat icon={Globe2} label="Curriculum options" value={countries.length} sub="Country selectors included" tone="lavender"/></section><div className="panel"><h3>Role preview</h3><p className="muted">Switch roles to preview navigation context. This is not a security boundary; production roles must be enforced by the backend.</p><div className="role-switch">{["Student","Parent","Teacher","School admin"].map(r => <button key={r} onClick={() => setRole(r)} className={role === r ? "role-active" : ""}>{r}</button>)}</div><div className="role-description"><b>{role}</b><p>{role === "Student" ? "Access lessons, quizzes and personal learning feedback." : role === "Parent" ? "In production, view linked children's progress and teacher notes." : role === "Teacher" ? "In production, manage assigned classes, review learner progress and assign lessons." : "In production, manage school accounts, curriculum mappings and permissions."}</p></div></div></>}
    {page === "curriculum" && <><PageTitle eyebrow="CURRICULUM SETTINGS" title="Build your learning pathway" subtitle="Choose a country, curriculum and learning level for this demo profile."/><div className="settings-layout"><div className="panel settings-panel"><h3>Academic pathway</h3><label>Country or education system<select value={country} onChange={e => {const c = countries.find(x => x.code === e.target.value);setCountry(e.target.value);setCurriculum(c.curricula[0]);}}>{countries.map(c => <option value={c.code} key={c.code}>{c.name}</option>)}</select></label><label>Curriculum<select value={curriculum} onChange={e => setCurriculum(e.target.value)}>{countryInfo.curricula.map(c => <option key={c}>{c}</option>)}</select></label><label>Grade or year<select value={grade} onChange={e => setGrade(e.target.value)}>{grades.map(g => <option key={g}>{g}</option>)}</select></label><div className="notice compact"><CircleHelp size={18}/><p>Country and curriculum selections are saved locally. The lesson content in this prototype is sample content and is not yet validated against each selected curriculum.</p></div></div><div className="panel pathway-panel"><div className="pathway-illustration"><Globe2 size={36}/><span>Learn without borders</span></div><h3>Curriculum coverage</h3><p className="muted">This prototype demonstrates the country-selection experience. Before launch, curriculum experts should map each lesson to official standards, grade outcomes and local terminology.</p><ul><li>Verified learning objectives</li><li>Country-specific grade progression</li><li>Teacher review and content versioning</li><li>Curriculum source and licensing records</li></ul></div></div></>}
    {page === "settings" && <><PageTitle eyebrow="PROFILE & PREFERENCES" title="Learning profile" subtitle="Set the details used by this demo on this device."/><div className="panel settings-panel profile-settings"><h3>Profile details</h3><label>Child's display name<input value={studentName} maxLength={40} onChange={e => setStudentName(e.target.value)} placeholder="Enter a first name or nickname"/></label><label>Current role preview<select value={role} onChange={e => setRole(e.target.value)}>{["Student","Parent","Teacher","School admin"].map(r => <option key={r}>{r}</option>)}</select></label><label>Learning level<select value={grade} onChange={e => setGrade(e.target.value)}>{grades.map(g => <option key={g}>{g}</option>)}</select></label><div className="button-row"><button className="primary-button" onClick={() => setPage("overview")}>Save profile</button><button className="secondary-button" onClick={resetDemo}><RotateCcw size={15}/> Reset demo progress</button></div><p className="small-muted">Demo data is saved in local browser storage. It is not synced between devices and should not be used for sensitive real student records.</p></div></>}
  </div><footer className="footer"><span>© 2026 BrightPath Learning · Prototype</span><span><ShieldCheck size={13}/> Designed with child safety in mind</span></footer></main></div>;
}

function Stat({icon: Icon, label, value, sub, tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-sub">{sub}</div></div>; }
function PageTitle({eyebrow,title,subtitle}) {return <div className="page-title"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="muted">{subtitle}</p></div>;}
function LessonCard({lesson,progress={},index,onClick}) {const themes=["mint","lavender","yellow"];return <button className="lesson-card" onClick={onClick}><div className={`lesson-art ${themes[index%3]}`}><span className="lesson-art-icon">{lesson.subject==="Mathematics"?"∑":lesson.subject==="English"?"Aa":"✿"}</span><span className="lesson-time"><Clock3 size={13}/>{lesson.minutes} min</span></div><div className="lesson-card-body"><div className="lesson-subject">{lesson.subject}</div><h3>{lesson.title}</h3><p>{lesson.objective}</p><div className="lesson-card-bottom"><span className={`status status-${(progress.status||"New").toLowerCase().replace(" ","-")}`}>{progress.status||"New"}</span><span className="open-lesson">Open lesson <ChevronRight size={15}/></span></div></div></button>;}
function LessonView({lesson,answers,setAnswers,result,onSubmit,onBack,onRetry,progress}) {const allAnswered=lesson.questions.every((_,i)=>answers[i]!==undefined);return <><button className="back-button" onClick={onBack}><ArrowLeft size={16}/> Back to lessons</button><div className="lesson-header"><div className="eyebrow">{lesson.subject.toUpperCase()} · {lesson.grade}</div><h1>{lesson.title}</h1><p className="muted">{lesson.objective}</p><div className="lesson-meta"><span><Clock3 size={15}/>{lesson.minutes} minutes</span><span><ClipboardList size={15}/>{lesson.questions.length} questions</span></div></div><div className="lesson-layout"><article className="panel lesson-content"><div className="content-label"><BookOpen size={17}/> LET'S LEARN</div><p className="lesson-explanation">{lesson.explanation}</p><div className="example-box"><Sparkles size={18}/><div><b>Remember</b><p>Take your time. Read each question carefully. You can learn from every attempt.</p></div></div><div className="quiz-heading"><h2>Check your understanding</h2><p className="muted">Choose one answer for each question.</p></div>{lesson.questions.map((q,i)=><div className="question-block" key={q.q}><div className="question-number">QUESTION {i+1} OF {lesson.questions.length}</div><h3>{q.q}</h3><div className="answer-options">{q.options.map((o,j)=><button key={o} disabled={!!result} className={`answer-option ${answers[i]===j?"chosen":""} ${result && j===q.answer?"correct":result && answers[i]===j && j!==q.answer?"incorrect":""}`} onClick={()=>setAnswers(a=>({...a,[i]:j}))}><span className="option-letter">{String.fromCharCode(65+j)}</span>{o}{result && j===q.answer && <CheckCircle2 size={17}/>}</button>)}</div>{result && <p className="answer-explanation">{q.explain}</p>}</div>)}{!result ? <button className="primary-button submit-quiz" disabled={!allAnswered} onClick={onSubmit}>Check my answers <ChevronRight size={17}/></button> : <div className="result-card"><div className="result-score">{result.score}%</div><div className="result-copy"><h3>{result.score>=80?"Wonderful effort!":result.score>=50?"Good progress!":"Keep practising — you can do it!"}</h3><p>{result.correct} out of {lesson.questions.length} correct. {result.recommendation}</p><small>Current topic status: {result.status}</small></div><button className="secondary-button" onClick={onRetry}><RotateCcw size={15}/> Try again</button></div>}</article><aside className="lesson-aside"><div className="panel"><div className="panel-title"><Brain size={18}/><h3>Adaptive learning</h3></div><p className="muted">This demo uses quiz results to recommend revision or further practice.</p><div className="aside-rule"/><b>Current topic</b><p className="small-muted">{lesson.title}</p><div className="mastery-track"><span style={{width:`${progress?.mastery||0}%`}}/></div><div className="mastery-caption"><span>Mastery estimate</span><b>{progress?.mastery||0}%</b></div><div className="aside-rule"/><b>How it adapts</b><ul className="adaptive-list"><li>80%+ — review and consider moving on</li><li>50–79% — practise again</li><li>Below 50% — revisit guided examples</li></ul></div><div className="panel encouragement"><Sparkles size={20}/><b>Curiosity counts</b><p>Every question is a chance to learn something new.</p></div></aside></div></>;}
function Empty({title,body}) {return <div className="empty-state"><Search size={28}/><h3>{title}</h3><p>{body}</p></div>;}