import React, { useState, useEffect, useMemo } from 'react';
import { questions as originalQuestions } from './questions';

const clean = (s) => s.replace(/^[A-D]\.\s*/, '');
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function shuffleQuestion(q) {
  const isMulti = Array.isArray(q.answer);
  const correctSet = new Set(isMulti ? q.answer : [q.answer]);
  const indexed = q.options.map((opt, i) => ({ opt, isCorrect: correctSet.has(i) }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const newAnswers = indexed.map((x, i) => x.isCorrect ? i : -1).filter(i => i !== -1);
  return {
    ...q,
    options: indexed.map(x => x.opt),
    answer: isMulti ? newAnswers : newAnswers[0],
  };
}

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizMode, setQuizMode] = useState(null);

  if (!originalQuestions || !Array.isArray(originalQuestions) || originalQuestions.length === 0) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Ambient />
        <div className="panel" style={{ padding: '32px', maxWidth: 480, textAlign: 'center' }}>
          <div className="label" style={{ color: 'var(--danger)' }}>ERROR</div>
          <h2 style={{ marginTop: 12, fontSize: 20 }}>問題データを読み込めませんでした</h2>
          <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 14 }}>
            <code>src/questions.js</code> の形式を確認してください。
          </p>
        </div>
      </div>
    );
  }

  const startQuiz = (mode) => {
    try {
      let qList = [...originalQuestions];
      if (mode === 'random') {
        qList = qList.sort(() => Math.random() - 0.5);
      }
      qList = qList.map(shuffleQuestion);
      setQuestions(qList);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setIsQuizFinished(false);
      setSelectedAnswers([]);
      setQuizMode(mode);
    } catch (e) {
      console.error(e);
      alert('クイズの開始中にエラーが発生しました。');
    }
  };

  const handleAnswer = (index) => {
    if (showResult || selectedAnswers.includes(index)) return;
    const question = questions[currentQuestion];
    if (!question) return;

    const isMulti = Array.isArray(question.answer);
    const requiredCount = isMulti ? question.answer.length : 1;

    const newSelections = [...selectedAnswers, index];
    setSelectedAnswers(newSelections);

    if (newSelections.length === requiredCount) {
      setShowResult(true);
      const isCorrect = isMulti
        ? question.answer.every(ans => newSelections.includes(ans))
        : index === question.answer;
      if (isCorrect) setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
      setShowResult(false);
      setSelectedAnswers([]);
    } else {
      setIsQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizMode(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setIsQuizFinished(false);
    setSelectedAnswers([]);
  };

  if (!quizMode) {
    return <TitleScreen total={originalQuestions.length} onStart={startQuiz} />;
  }

  if (isQuizFinished) {
    return <ResultScreen score={score} total={questions.length} onBack={resetQuiz} />;
  }

  const question = questions[currentQuestion];
  if (!question) return null;

  return (
    <QuizScreen
      question={question}
      currentIndex={currentQuestion}
      total={questions.length}
      score={score}
      selectedAnswers={selectedAnswers}
      showResult={showResult}
      onAnswer={handleAnswer}
      onNext={nextQuestion}
      onExit={resetQuiz}
    />
  );
};

function Ambient() {
  return (
    <>
      <div className="bg-ambient" />
      <div className="bg-grid" />
    </>
  );
}

function TitleScreen({ total, onStart }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <Ambient />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div className="chip fade-in">
          <span className="chip-dot" />
          <span>AWS Certified · Generative AI Developer</span>
        </div>

        <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: '#0f172a',
          }}>
            模擬試験で<br />実力を確かめよう
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
            Generative AI Developer Professional 試験対策。
            実践的な問題で知識を深め、自信を持って本番に臨もう。
          </p>
        </div>

        <div className="panel slide-up" style={{ animationDelay: '0.05s', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Stat label="QUESTIONS" value={String(total)} color="var(--cyan)" />
          <Divider />
          <Stat label="LEVEL" value="PRO" color="var(--aws-light)" />
          <Divider />
          <Stat label="FORMAT" value="MCQ" color="var(--violet)" />
        </div>

        <div className="panel slide-up" style={{ animationDelay: '0.1s', width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => onStart('random')} style={{ width: '100%', padding: '18px 24px', fontSize: 16 }}>
            <span>ランダム順で開始</span>
            <ArrowRight />
          </button>
          <button className="btn btn-secondary" onClick={() => onStart('fixed')} style={{ width: '100%', padding: '18px 24px', fontSize: 16 }}>
            <span>固定順で開始</span>
            <ArrowRight />
          </button>
        </div>

        <div className="label fade-in-slow" style={{ marginTop: 4 }}>
          ALL {total} QUESTIONS · MULTIPLE CHOICE
        </div>
      </div>
    </div>
  );
}

function QuizScreen({ question, currentIndex, total, score, selectedAnswers, showResult, onAnswer, onNext, onExit }) {
  const progressPct = ((currentIndex + (showResult ? 1 : 0)) / total) * 100;
  const isMulti = Array.isArray(question.answer);
  const requiredCount = isMulti ? question.answer.length : 1;
  const remaining = Math.max(0, requiredCount - selectedAnswers.length);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Ambient />

      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '14px 24px',
        background: 'rgba(250, 251, 255, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button className="btn btn-ghost" onClick={onExit} style={{ padding: '8px 14px', fontSize: 13 }}>
              <ChevronLeft /><span>戻る</span>
            </button>
            <div className="chip" style={{ padding: '4px 10px', fontSize: 10 }}>
              <span className="chip-dot" style={{ width: 5, height: 5 }} />
              <span>AWS GEN AI PRO</span>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="label mono" style={{ color: 'var(--text-muted)' }}>
              {String(currentIndex + 1).padStart(3, '0')} <span style={{ color: 'var(--text-faint)' }}>/ {String(total).padStart(3, '0')}</span>
            </span>
            <div style={{
              flex: 1, height: 6,
              background: 'var(--surface-3)',
              borderRadius: 999,
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}>
              <div style={{
                height: '100%',
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, var(--cyan) 0%, var(--aws) 100%)',
                boxShadow: '0 0 10px rgba(14, 165, 233, 0.45)',
                borderRadius: 999,
                transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="label">CORRECT</span>
            <span className="mono" style={{
              fontSize: 15, fontWeight: 700, color: 'var(--success)',
            }}>
              {String(score).padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      <main style={{
        position: 'relative', zIndex: 1, flex: 1,
        padding: '32px 20px 48px',
      }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <section key={`q-${currentIndex}`} className="panel panel-hl slide-up" style={{ padding: '28px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="label mono" style={{ color: 'var(--aws-light)' }}>
                  QUESTION {String(currentIndex + 1).padStart(3, '0')}
                </span>
                {isMulti && (
                  <span className="label" style={{
                    padding: '3px 8px',
                    background: 'rgba(124, 58, 237, 0.08)',
                    border: '1px solid rgba(124, 58, 237, 0.35)',
                    borderRadius: 6,
                    color: 'var(--violet)',
                    fontSize: 10,
                  }}>
                    複数選択 · {requiredCount}つ
                  </span>
                )}
              </div>
              {!showResult && selectedAnswers.length > 0 && (
                <span className="label" style={{ color: 'var(--cyan-deep)' }}>
                  あと {remaining} つ
                </span>
              )}
            </div>
            <p style={{
              fontSize: 17,
              fontWeight: 500,
              lineHeight: 1.85,
              color: 'var(--text)',
              letterSpacing: 0.01,
            }}>
              {question.question}
            </p>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map((opt, i) => {
              const isSelected = selectedAnswers.includes(i);
              const isCorrect = Array.isArray(question.answer) ? question.answer.includes(i) : i === question.answer;

              let cls = 'option';
              let marker = LETTERS[i];
              if (showResult) {
                if (isCorrect) { cls += ' option-correct'; marker = '✓'; }
                else if (isSelected) { cls += ' option-wrong'; marker = '✕'; }
                else cls += ' option-muted option-disabled';
              } else if (isSelected) {
                cls += ' option-selected';
              }

              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => onAnswer(i)}
                  disabled={showResult}
                  style={{ animation: `slide-up 0.4s ${0.05 * i}s cubic-bezier(0.16, 1, 0.3, 1) both` }}
                >
                  <span className="option-marker">{marker}</span>
                  <span className="option-text">{clean(opt)}</span>
                </button>
              );
            })}
          </section>

          {showResult && (
            <section className="panel slide-up" style={{
              padding: 24,
              borderColor: 'rgba(22, 163, 74, 0.30)',
              boxShadow: '0 16px 40px rgba(22, 163, 74, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <ExplainIcon />
                <span className="label" style={{ color: 'var(--success)' }}>解説</span>
              </div>
              <p style={{
                fontSize: 14.5,
                lineHeight: 1.85,
                color: 'var(--text-muted)',
                letterSpacing: 0.01,
              }}>
                {question.explanation}
              </p>
              <button className="btn btn-primary" onClick={onNext} style={{ marginTop: 20, width: '100%', padding: '16px 24px' }}>
                <span>{currentIndex + 1 === total ? '結果を見る' : '次の問題へ'}</span>
                <ArrowRight />
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function ResultScreen({ score, total, onBack }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = pct >= 70;
  const accent = passed ? 'var(--success)' : 'var(--aws)';
  const accentRGB = passed ? '34, 197, 94' : '255, 153, 0';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <Ambient />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
        <div className="chip slide-up" style={{
          background: `rgba(${accentRGB}, 0.1)`,
          borderColor: `rgba(${accentRGB}, 0.5)`,
          color: accent,
        }}>
          <span className="chip-dot" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span>{passed ? 'GREAT WORK' : 'KEEP GOING'}</span>
        </div>

        <h1 className="slide-up" style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          color: '#0f172a',
        }}>
          {passed ? 'お見事！' : 'お疲れさまでした'}
        </h1>

        <div className="panel slide-up" style={{
          width: '100%',
          padding: '32px 28px',
          display: 'flex', flexDirection: 'column', gap: 20,
          boxShadow: `0 20px 50px rgba(${accentRGB}, 0.18), 0 4px 12px rgba(15, 23, 42, 0.04)`,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span className="label">SCORE</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="mono" style={{
                fontSize: 64,
                fontWeight: 700,
                color: accent,
                lineHeight: 1,
              }}>{score}</span>
              <span className="mono" style={{ fontSize: 24, color: 'var(--text-dim)' }}>/ {total}</span>
            </div>
          </div>

          <div style={{
            height: 10,
            background: 'var(--surface-3)',
            borderRadius: 999,
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${accent} 0%, ${passed ? 'var(--cyan)' : 'var(--aws-light)'} 100%)`,
              boxShadow: `0 0 12px ${accent}55`,
              borderRadius: 999,
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label">ACCURACY</span>
            <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: accent }}>{pct}%</span>
          </div>
        </div>

        <button className="btn btn-secondary slide-up" onClick={onBack} style={{ width: '100%', padding: '16px 24px' }}>
          <ChevronLeft /><span>タイトルに戻る</span>
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span className="label">{label}</span>
      <span className="mono" style={{
        fontSize: 22, fontWeight: 700, color,
      }}>{value}</span>
    </div>
  );
}

function Divider() {
  return <span style={{ width: 1, height: 28, background: 'var(--border)' }} />;
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ExplainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success)' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default App;
