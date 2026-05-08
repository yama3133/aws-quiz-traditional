import React, { useState } from 'react';
import { questions } from './questions';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Award } from 'lucide-react';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false); // その問題の正解・解説を表示するフラグ
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // 回答を選択した時の処理
  const handleAnswer = (selectedIndex) => {
    if (showResult) return; // 回答済みなら何もしない

    setSelectedAnswer(selectedIndex);
    setShowResult(true);

    // 正誤判定
    if (selectedIndex === questions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
  };

  // 次の問題へ進む時の処理
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

  // クイズをリセットする処理
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setIsQuizFinished(false);
    setSelectedAnswer(null);
  };

  // 完了画面
  if (isQuizFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Award className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">クイズ完了！</h2>
          <p className="text-slate-600 mb-6">
            あなたのスコア: <span className="text-3xl font-bold text-blue-600">{score}</span> / {questions.length}
          </p>
          <button
            onClick={resetQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            最初から挑戦する
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー情報 */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <span className="text-sm font-medium text-slate-500">
            問題 {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            正解数: {score}
          </span>
        </div>

        {/* 問題文カード */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
            {question.question}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option, index) => {
              // 回答後のスタイル判定
              let buttonStyle = "border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50";
              if (showResult) {
                if (index === question.answer) {
                  buttonStyle = "border-green-500 bg-green-50 text-green-700";
                } else if (index === selectedAnswer) {
                  buttonStyle = "border-red-500 bg-red-50 text-red-700";
                } else {
                  buttonStyle = "border-slate-100 text-slate-400 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl font-medium transition-all flex justify-between items-center ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {showResult && index === question.answer && <CheckCircle2 className="text-green-500" />}
                  {showResult && index === selectedAnswer && index !== question.answer && <XCircle className="text-red-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 解説と次へボタン */}
        {showResult && (
          <div className="bg-white rounded-2xl shadow-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className={`flex items-center gap-2 mb-3 font-bold ${selectedAnswer === question.answer ? 'text-green-600' : 'text-red-600'}`}>
              {selectedAnswer === question.answer ? (
                <><CheckCircle2 />正解！</>
              ) : (
                <><XCircle />不正解...</>
              )}
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed bg-slate-50 p-4 rounded-lg border-l-4 border-blue-400">
              {question.explanation}
            </p>
            <button
              onClick={nextQuestion}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {currentQuestion + 1 === questions.length ? '結果を見る' : '次の問題へ'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;