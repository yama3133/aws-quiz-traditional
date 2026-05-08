import React, { useState } from 'react';
import { questions as originalQuestions } from './questions';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizMode, setQuizMode] = useState(null);

  const startQuiz = (mode) => {
    let qList = [...originalQuestions];
    if (mode === 'random') {
      qList = qList.sort(() => Math.random() - 0.5);
    }
    setQuestions(qList);
    setQuizMode(mode);
  };

  const handleAnswer = (index) => {
    if (showResult || selectedAnswers.includes(index)) return;

    const question = questions[currentQuestion];
    const isMultipleChoice = Array.isArray(question.answer);
    const requiredCount = isMultipleChoice ? question.answer.length : 1;

    const newSelections = [...selectedAnswers, index];
    setSelectedAnswers(newSelections);

    if (newSelections.length === requiredCount) {
      setShowResult(true);
      const isCorrect = isMultipleChoice 
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

  // 1. タイトル・モード選択画面
  if (!quizMode) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', background: '#fff', padding: '50px 30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '0.1em' }}>EXAM PREPARATION</div>
          <h1 style={{ color: '#0f172a', fontSize: '28px', marginBottom: '16px', lineHeight: '1.3' }}>
            AWS Certified<br/>Generative AI Developer - Professional
          </h1>
          <p style={{ color: '#64748b', marginBottom: '40px', lineHeight: '1.5' }}>
            本番試験に準拠した全 {originalQuestions.length} 問を収録。<br/>
            学習スタイルに合わせてモードを選択してください。
          </p>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <button 
              onClick={() => startQuiz('fixed')}
              style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', fontWeight: 'bold', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.target.style.background = '#fff'}
            >
              <span>固定順で開始 (問1〜)</span>
            </button>
            <button 
              onClick={() => startQuiz('random')}
              style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', borderRadius: '16px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.background = '#2563eb'}
            >
              ランダム順で開始
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. 完了画面
  if (isQuizFinished) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '24px', shadow: '0 4px 6px rgba(0,0,0,0.05)', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '10px' }}>クイズ完了！</h2>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2563eb', marginBottom: '10px' }}>{score} <span style={{ fontSize: '20px', color: '#94a3b8' }}>/ {questions.length}</span></div>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>お疲れ様でした！</p>
          <button onClick={resetQuiz} style={{ width: '100%', padding: '16px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>モード選択に戻る</button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isMultipleChoice = Array.isArray(question.answer);
  const requiredCount = isMultipleChoice ? question.answer.length : 1;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#64748b', fontSize: '14px' }}>
          <span>問題 {currentQuestion + 1} / {questions.length} ({quizMode === 'random' ? 'ランダム' : '固定'})</span>
          <span style={{ fontWeight: 'bold', color: '#2563eb' }}>正解数: {score}</span>
        </div>

        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '24px', lineHeight: '1.6', color: '#0f172a' }}>
            {question.question}
            {isMultipleChoice && <span style={{ color: '#d946ef', marginLeft: '10px', fontSize: '14px', background: '#fdf4ff', padding: '2px 8px', borderRadius: '4px' }}>{requiredCount}つ選択</span>}
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {question.options.map((option, index) => {
              let bgColor = '#fff';
              const isSelected = selectedAnswers.includes(index);
              
              if (showResult) {
                const isRightAnswer = isMultipleChoice ? question.answer.includes(index) : index === question.answer;
                if (isRightAnswer) bgColor = '#dcfce7'; 
                else if (isSelected) bgColor = '#fee2e2'; 
              } else if (isSelected) {
                bgColor = '#f1f5f9';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  style={{
                    textAlign: 'left',
                    padding: '16px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: bgColor,
                    cursor: showResult ? 'default' : 'pointer',
                    fontSize: '15px',
                    transition: 'all 0.15s',
                    color: showResult && !isMultipleChoice && index !== question.answer && index !== selectedAnswer ? '#94a3b8' : '#334155'
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div style={{ marginTop: '20px', padding: '24px', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>
              {(isMultipleChoice ? question.answer.every(a => selectedAnswers.includes(a)) : selectedAnswers[0] === question.answer) 
                ? <span style={{ color: '#16a34a' }}>○ 正解！</span> 
                : <span style={{ color: '#dc2626' }}>× 不正解...</span>}
            </p>
            <div style={{ fontSize: '14px', color: '#475569', marginBottom: '24px', lineHeight: '1.7', padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              {question.explanation}
            </div>
            <button
              onClick={nextQuestion}
              style={{ width: '100%', padding: '18px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
              {currentQuestion + 1 === questions.length ? '結果を見る' : '次の問題へ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;