import React, { useState, useEffect } from 'react';
import { questions as originalQuestions } from './questions';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizMode, setQuizMode] = useState(null); // 'fixed' or 'random'

  // モードが選択されたらクイズをセットアップ
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

  // 1. モード選択画面
  if (!quizMode) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>AWS認定 Generative AI<br/>試験対策クイズ</h1>
        <div style={{ display: 'grid', gap: '20px' }}>
          <button 
            onClick={() => startQuiz('fixed')}
            style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', borderRadius: '12px', border: '2px solid #3b82f6', background: '#eff6ff', color: '#1d4ed8', fontWeight: 'bold' }}
          >
            固定順で開始 (問1〜)
          </button>
          <button 
            onClick={() => startQuiz('random')}
            style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', borderRadius: '12px', border: '2px solid #d946ef', background: '#fdf4ff', color: '#a21caf', fontWeight: 'bold' }}
          >
            ランダム順で開始
          </button>
        </div>
        <p style={{ marginTop: '20px', color: '#64748b', fontSize: '14px' }}>全 {originalQuestions.length} 問が収録されています</p>
      </div>
    );
  }

  // 2. 完了画面
  if (isQuizFinished) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h2>クイズ完了！</h2>
        <p style={{ fontSize: '24px' }}>スコア: {score} / {questions.length}</p>
        <button onClick={resetQuiz} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '8px' }}>モード選択に戻る</button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isMultipleChoice = Array.isArray(question.answer);
  const requiredCount = isMultipleChoice ? question.answer.length : 1;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#64748b' }}>
        <span>問題 {currentQuestion + 1} / {questions.length} ({quizMode === 'random' ? 'ランダム' : '固定'})</span>
        <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>正解数: {score}</span>
      </div>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '25px', lineHeight: '1.6', color: '#1e293b' }}>
          {question.question}
          {isMultipleChoice && <span style={{ color: '#d946ef', marginLeft: '10px', fontSize: '14px' }}>（{requiredCount}つ選択）</span>}
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
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  backgroundColor: bgColor,
                  cursor: showResult ? 'default' : 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.2s'
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
            {(isMultipleChoice ? question.answer.every(a => selectedAnswers.includes(a)) : selectedAnswers[0] === question.answer) 
              ? <span style={{ color: '#16a34a' }}>○ 正解！</span> 
              : <span style={{ color: '#dc2626' }}>× 不正解...</span>}
          </p>
          <div style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: '1.6', padding: '12px', background: '#fff', borderRadius: '8px' }}>
            {question.explanation}
          </div>
          <button
            onClick={nextQuestion}
            style={{ width: '100%', padding: '16px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            {currentQuestion + 1 === questions.length ? '結果を見る' : '次の問題へ'}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;