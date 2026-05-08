import React, { useState } from 'react';
import { questions } from './questions';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (selectedIndex) => {
    if (showResult) return;
    setSelectedAnswer(selectedIndex);
    setShowResult(true);
    if (selectedIndex === questions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      setIsQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setIsQuizFinished(false);
    setSelectedAnswer(null);
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

  const question = questions[currentQuestion];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>問題 {currentQuestion + 1} / {questions.length}</span>
        <span>正解数: {score}</span>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>{question.question}</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {question.options.map((option, index) => {
            let bgColor = '#f8f9fa';
            if (showResult) {
              if (index === question.answer) bgColor = '#d4edda'; // 正解は緑
              else if (index === selectedAnswer) bgColor = '#f8d7da'; // 選んだ不正解は赤
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
                  border: '1px solid #ddd',
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
          <p style={{ fontWeight: 'bold', color: selectedAnswer === question.answer ? '#155724' : '#721c24' }}>
            {selectedAnswer === question.answer ? '○ 正解！' : '× 不正解...'}
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