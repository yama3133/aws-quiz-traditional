import React, { useState, useEffect } from 'react';
import { questions as originalQuestions } from './questions';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizMode, setQuizMode] = useState(null);

  // データが正しく読み込めているかチェック
  if (!originalQuestions || !Array.isArray(originalQuestions) || originalQuestions.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>エラー: 問題データ (questions.js) を読み込めませんでした。</h2>
        <p>ファイルの記述形式（export const questions = [...];）を確認してください。</p>
      </div>
    );
  }

  const startQuiz = (mode) => {
    try {
      let qList = [...originalQuestions];
if (mode === 'random') {
  qList = qList.sort(() => Math.random() - 0.5);
}
// 選択肢をシャッフルして正答位置を均等化
　qList = qList.map(q => {
  const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.answer }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    ...q,
    options: indexed.map(x => x.opt),
    answer: indexed.findIndex(x => x.isCorrect),
  };
});
setQuestions(qList);
      setQuizMode(mode);
    } catch (e) {
      console.error(e);
      alert("クイズの開始中にエラーが発生しました。");
    }
  };

  const handleAnswer = (index) => {
    if (showResult || selectedAnswers.includes(index)) return;

    const question = questions[currentQuestion];
    if (!question) return;

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

  if (!quizMode) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', background: '#fff', padding: '50px 30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '0.1em' }}>EXAM PREPARATION</div>
          <h1 style={{ color: '#0f172a', fontSize: '28px', marginBottom: '16px', lineHeight: '1.3' }}>
            AWS Certified<br/>Generative AI Developer - Professional
          </h1>
          <p style={{ color: '#64748b', marginBottom: '40px', lineHeight: '1.5' }}>
            全 {originalQuestions.length} 問収録
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            <button onClick={() => startQuiz('fixed')} style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 'bold' }}>固定順で開始</button>
            <button onClick={() => startQuiz('random')} style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', borderRadius: '16px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold' }}>ランダム順で開始</button>
          </div>
        </div>
      </div>
    );
  }

  if (isQuizFinished) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '24px', fontFamily: 'sans-serif' }}>
          <h2>クイズ完了！</h2>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2563eb' }}>{score} / {questions.length}</div>
          <button onClick={resetQuiz} style={{ width: '100%', padding: '16px', background: '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}>戻る</button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  if (!question) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#64748b' }}>
          <span>問題 {currentQuestion + 1} / {questions.length}</span>
          <span style={{ fontWeight: 'bold', color: '#2563eb' }}>正解数: {score}</span>
        </div>

        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '24px', lineHeight: '1.6' }}>{question.question}</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers.includes(index);
              let bgColor = isSelected ? '#f1f5f9' : '#fff';
              if (showResult) {
                const isRight = Array.isArray(question.answer) ? question.answer.includes(index) : index === question.answer;
                if (isRight) bgColor = '#dcfce7';
                else if (isSelected) bgColor = '#fee2e2';
              }
              return (
                <button key={index} onClick={() => handleAnswer(index)} disabled={showResult} style={{ textAlign: 'left', padding: '16px', borderRadius: '12px', border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0', backgroundColor: bgColor, cursor: showResult ? 'default' : 'pointer' }}>
                  {['A', 'B', 'C', 'D'][index]}. {option.replace(/^[A-D]\.\s*/, '')}
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div style={{ marginTop: '20px', padding: '24px', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>結果表示</p>
            <div style={{ fontSize: '14px', color: '#475569', marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              {question.explanation}
            </div>
            <button onClick={nextQuestion} style={{ width: '100%', padding: '18px', background: '#0f172a', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>次の問題へ</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;