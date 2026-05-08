import React, { useState } from 'react';
import { questions } from './questions';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]); // 複数選択のために配列に変更

  const question = questions[currentQuestion];
  // 正解が配列（複数）か単一数値かを判定
  const isMultipleChoice = Array.isArray(question.answer);
  const requiredCount = isMultipleChoice ? question.answer.length : 1;

  const handleAnswer = (index) => {
    if (showResult || selectedAnswers.includes(index)) return;

    const newSelections = [...selectedAnswers, index];
    setSelectedAnswers(newSelections);

    // 必要な数だけ選び終わったら判定
    if (newSelections.length === requiredCount) {
      setShowResult(true);
      
      let isCorrect = false;
      if (isMultipleChoice) {
        // 全ての正解が含まれているかチェック
        isCorrect = question.answer.every(ans => newSelections.includes(ans));
      } else {
        isCorrect = index === question.answer;
      }

      if (isCorrect) {
        setScore(prev => prev + 1);
      }
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
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setIsQuizFinished(false);
    setSelectedAnswers([]);
  };

  if (isQuizFinished) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <h2>クイズ完了！</h2>
        <p style={{ fontSize: '24px' }}>スコア: {score} / {questions.length}</p>
        <button onClick={resetQuiz} style={{ padding: '10px 20px', cursor: 'pointer' }}>最初から挑戦する</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>問題 {currentQuestion + 1} / {questions.length}</span>
        <span>正解数: {score}</span>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>
          {question.question}
          {isMultipleChoice && <span style={{ color: '#d946ef', marginLeft: '10px', fontSize: '14px' }}>（{requiredCount}つ選択）</span>}
        </h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {question.options.map((option, index) => {
            let bgColor = '#f8f9fa';
            const isSelected = selectedAnswers.includes(index);
            
            if (showResult) {
              const isRightAnswer = isMultipleChoice ? question.answer.includes(index) : index === question.answer;
              if (isRightAnswer) bgColor = '#d4edda'; // 正解は緑
              else if (isSelected) bgColor = '#f8d7da'; // 選んだ不正解は赤
            } else if (isSelected) {
              bgColor = '#e2e8f0'; // 選択中の色
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                style={{
                  textAlign: 'left',
                  padding: '15px',
                  borderRadius: '5px',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #ddd',
                  backgroundColor: bgColor,
                  cursor: showResult ? 'default' : 'pointer'
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#e9ecef', borderRadius: '10px' }}>
          <p style={{ fontWeight: 'bold' }}>
            {/* 全正解チェック */}
            {(isMultipleChoice ? question.answer.every(a => selectedAnswers.includes(a)) : selectedAnswers[0] === question.answer) 
              ? '○ 正解！' : '× 不正解...'}
          </p>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>{question.explanation}</p>
          <button
            onClick={nextQuestion}
            style={{ width: '100%', padding: '15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {currentQuestion + 1 === questions.length ? '結果を見る' : '次の問題へ'}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;