import React, { useState } from 'react';
import { questions } from './questions';

const App = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index) => {
    if (index === questions[current].answer) setScore(score + 1);
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) return <div style={{padding: '40px', textAlign: 'center'}}><h1>完了！スコア: {score} / {questions.length}</h1></div>;

  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <div style={{fontSize: '14px', color: '#666'}}>問題 {current + 1} / {questions.length}</div>
      <h2 style={{fontSize: '20px', margin: '20px 0'}}>{questions[current].question}</h2>
      <div style={{display: 'grid', gap: '10px'}}>
        {questions[current].options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} style={{padding: '15px', textAlign: 'left', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer'}}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
