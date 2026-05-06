import { useState, useEffect } from "react";
import { quizData } from './questions.js';

const QUESTIONS = quizData || [];

const DOMAIN_COLORS = {
  "生成AIの基礎": { bg: "#5624d0", light: "#a78bfa", badge: "#7c3aed" },
  "データ準備": { bg: "#1e7e34", light: "#6ee7b7", badge: "#059669" },
  "アプリ開発": { bg: "#b45309", light: "#fcd34d", badge: "#d97706" },
  "評価と最適化": { bg: "#9d174d", light: "#f9a8d4", badge: "#db2777" },
  "セキュリティ": { bg: "#1e40af", light: "#93c5fd", badge: "#2563eb" },
};

export default function UdemyQuiz() {
  const [screen, setScreen] = useState("home"); // home, quiz, result
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[qIndex];
  const domainInfo = q ? DOMAIN_COLORS[q.domain] : null;
  const progress = questions.length > 0 ? ((qIndex) / questions.length) * 100 : 0;

  const startQuiz = (domain) => {
    const qs = domain ? QUESTIONS.filter(q => q.domain === domain) : [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(qs);
    setSelectedDomain(domain);
    setQIndex(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setAnswers([]);
    setShowExplanation(false);
    setScreen("quiz");
  };

  const handleSelect = (i) => {
    if (confirmed) return;
    setSelected(i);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const correct = selected === q.correct;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { q, selected, correct }]);
    setConfirmed(true);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (qIndex + 1 >= questions.length) {
      setScreen("result");
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setConfirmed(false);
      setShowExplanation(false);
    }
  };

  const domains = Object.keys(DOMAIN_COLORS);

  // ===== ホーム画面 =====
  if (screen === "home") {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f8fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {/* ヘッダー */}
        <div style={{ background: "#1c1d1f", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Udemy</div>
          <div style={{ fontSize: 11, color: "#a1a1a1", marginLeft: 4 }}>風　AWS模擬試験</div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
          {/* タイトル */}
          <div style={{
            background: "linear-gradient(135deg, #5624d0 0%, #8710d8 100%)",
            borderRadius: 12, padding: "32px 36px", marginBottom: 32, color: "#fff",
          }}>
            <div style={{ fontSize: 11, color: "#c4b5fd", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
              AWS Certified Generative AI Developer Professional
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>
              完全攻略　模擬試験
            </div>
            <div style={{ fontSize: 14, color: "#ddd6fe", marginBottom: 20 }}>
              全{QUESTIONS.length}問　解説付き　ドメイン別に学習できます
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { icon: "📝", label: `${QUESTIONS.length}問` },
                { icon: "💡", label: "全問解説付き" },
                { icon: "🎯", label: "ドメイン別対応" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#e9d5ff" }}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ランダム20問 */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1c1d1f", marginBottom: 14 }}>
              すぐに始める
            </h2>
            <button onClick={() => startQuiz(null)} style={{
              width: "100%", background: "#5624d0", color: "#fff",
              border: "none", borderRadius: 8, padding: "16px 24px",
              fontSize: 16, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(86,36,208,0.3)",
            }}>
              <span>🎲 ランダム20問に挑戦</span>
              <span style={{ fontSize: 20 }}>→</span>
            </button>
          </div>

          {/* ドメイン別 */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1c1d1f", marginBottom: 14 }}>
              ドメイン別に学習する
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {domains.map(domain => {
                const count = QUESTIONS.filter(q => q.domain === domain).length;
                const info = DOMAIN_COLORS[domain];
                return (
                  <button key={domain} onClick={() => startQuiz(domain)} style={{
                    background: "#fff", border: "1px solid #e2e8f0",
                    borderRadius: 10, padding: "18px 20px",
                    cursor: "pointer", textAlign: "left",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"}
                  >
                    <div style={{
                      display: "inline-block", background: info.badge,
                      color: "#fff", fontSize: 9, fontWeight: 700,
                      padding: "3px 8px", borderRadius: 4, marginBottom: 10,
                      letterSpacing: 0.5,
                    }}>
                      {count}問
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1d1f", marginBottom: 4 }}>
                      {domain}
                    </div>
                    <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${(count / QUESTIONS.length) * 100}%`, background: info.bg, borderRadius: 2 }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== クイズ画面 =====
  if (screen === "quiz" && q) {
    const info = DOMAIN_COLORS[q.domain] || DOMAIN_COLORS["生成AIの基礎"];
    return (
      <div style={{ minHeight: "100vh", background: "#f7f8fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {/* ヘッダー */}
        <div style={{ background: "#1c1d1f", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Udemy風　AWS模擬試験</div>
          <button onClick={() => setScreen("home")} style={{
            background: "transparent", border: "1px solid #6b7280",
            borderRadius: 4, color: "#9ca3af", fontSize: 12, padding: "4px 12px", cursor: "pointer",
          }}>終了</button>
        </div>

        {/* プログレスバー */}
        <div style={{ height: 4, background: "#e2e8f0" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: info.bg, transition: "width 0.4s ease",
          }} />
        </div>

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 16px" }}>
          {/* 問題番号・ドメイン */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
              問題 {qIndex + 1} / {questions.length}
            </div>
            <div style={{
              background: info.badge, color: "#fff",
              fontSize: 10, fontWeight: 700, padding: "3px 10px",
              borderRadius: 20, letterSpacing: 0.5,
            }}>
              {q.domain}
            </div>
          </div>

          {/* 問題カード */}
          <div style={{
            background: "#fff", borderRadius: 12,
            padding: "28px 32px", marginBottom: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1c1d1f", lineHeight: 1.7, marginBottom: 24 }}>
              {q.question}
            </div>

            {/* 選択肢 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.choices.map((choice, i) => {
                let bg = "#fff", border = "2px solid #e2e8f0", color = "#1c1d1f", icon = null;
                if (confirmed) {
                  if (i === q.correct) { bg = "#f0fdf4"; border = "2px solid #22c55e"; color = "#15803d"; icon = "✓"; }
                  else if (i === selected) { bg = "#fef2f2"; border = "2px solid #ef4444"; color = "#dc2626"; icon = "✗"; }
                  else { color = "#9ca3af"; border = "2px solid #f1f5f9"; }
                } else if (i === selected) {
                  bg = "#f5f3ff"; border = `2px solid ${info.bg}`; color = info.bg;
                }

                return (
                  <button key={i} onClick={() => handleSelect(i)} style={{
                    background: bg, border, borderRadius: 8,
                    padding: "14px 18px", cursor: confirmed ? "default" : "pointer",
                    textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                    transition: "all 0.15s", color,
                  }}
                    onMouseEnter={e => { if (!confirmed && i !== selected) e.currentTarget.style.background = "#fafafa"; }}
                    onMouseLeave={e => { if (!confirmed && i !== selected) e.currentTarget.style.background = "#fff"; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: confirmed && i === q.correct ? "#22c55e" : confirmed && i === selected ? "#ef4444" : i === selected ? info.bg : "#f1f5f9",
                      color: (confirmed && (i === q.correct || i === selected)) || i === selected ? "#fff" : "#6b7280",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {icon || ["A", "B", "C", "D"][i]}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: i === selected ? 600 : 400, lineHeight: 1.5 }}>
                      {choice}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 解説 */}
          {showExplanation && q.explanation && (
            <div style={{
              background: "#fff", borderRadius: 12,
              border: `1px solid ${confirmed && selected === q.correct ? "#bbf7d0" : "#fecaca"}`,
              padding: "20px 24px", marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{selected === q.correct ? "🎉" : "📖"}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: selected === q.correct ? "#15803d" : "#dc2626" }}>
                  {selected === q.correct ? "正解！" : "不正解"}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                {q.explanation}
              </div>
            </div>
          )}

          {/* ボタン */}
          <div style={{ display: "flex", gap: 10 }}>
            {!confirmed ? (
              <button onClick={handleConfirm} disabled={selected === null} style={{
                flex: 1, background: selected === null ? "#e5e7eb" : info.bg,
                color: selected === null ? "#9ca3af" : "#fff",
                border: "none", borderRadius: 8, padding: "14px",
                fontSize: 15, fontWeight: 700, cursor: selected === null ? "default" : "pointer",
                transition: "all 0.2s",
              }}>
                回答を確定する
              </button>
            ) : (
              <button onClick={handleNext} style={{
                flex: 1, background: info.bg, color: "#fff",
                border: "none", borderRadius: 8, padding: "14px",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}>
                {qIndex + 1 >= questions.length ? "結果を見る 🏆" : "次の問題へ →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== 結果画面 =====
  if (screen === "result") {
    const pct = Math.round((score / questions.length) * 100);
    const pass = pct >= 70;
    return (
      <div style={{ minHeight: "100vh", background: "#f7f8fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ background: "#1c1d1f", padding: "14px 24px" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Udemy風　AWS模擬試験</div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px" }}>
          {/* スコアカード */}
          <div style={{
            background: pass ? "linear-gradient(135deg, #052e16, #14532d)" : "linear-gradient(135deg, #450a0a, #7f1d1d)",
            borderRadius: 16, padding: "36px", textAlign: "center", marginBottom: 24, color: "#fff",
          }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>{pass ? "🏆" : "📚"}</div>
            <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 4 }}>{pct}%</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: pass ? "#86efac" : "#fca5a5" }}>
              {pass ? "合格ライン突破！" : "もう少し！"}
            </div>
            <div style={{ fontSize: 14, color: "#d1d5db" }}>
              {score} / {questions.length} 問正解
            </div>
          </div>

          {/* ドメイン別スコア */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "24px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c1d1f", marginBottom: 16 }}>ドメイン別スコア</h3>
            {Object.keys(DOMAIN_COLORS).map(domain => {
              const domainAnswers = answers.filter(a => a.q.domain === domain);
              if (domainAnswers.length === 0) return null;
              const correct = domainAnswers.filter(a => a.correct).length;
              const total = domainAnswers.length;
              const dpct = Math.round((correct / total) * 100);
              const info = DOMAIN_COLORS[domain];
              return (
                <div key={domain} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{domain}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: info.bg }}>{correct}/{total}問 ({dpct}%)</span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${dpct}%`, background: info.bg, borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 間違い一覧 */}
          {answers.filter(a => !a.correct).length > 0 && (
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c1d1f", marginBottom: 16 }}>
                ❌ 間違えた問題（{answers.filter(a => !a.correct).length}問）
              </h3>
              {answers.filter(a => !a.correct).map((a, i) => (
                <div key={i} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: DOMAIN_COLORS[a.q.domain]?.badge || "#6b7280", fontWeight: 600, marginBottom: 4 }}>{a.q.domain}</div>
                  <div style={{ fontSize: 13, color: "#374151", marginBottom: 6, lineHeight: 1.6 }}>{a.q.question}</div>
                  <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 2 }}>あなたの回答: {a.q.choices[a.selected]}</div>
                  <div style={{ fontSize: 12, color: "#22c55e", marginBottom: 6 }}>正解: {a.q.choices[a.q.correct]}</div>
                  {a.q.explanation && (
                    <div style={{ fontSize: 12, color: "#6b7280", background: "#f9fafb", padding: "8px 12px", borderRadius: 6, lineHeight: 1.6 }}>
                      💡 {a.q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ボタン */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => startQuiz(selectedDomain)} style={{
              flex: 1, background: "#5624d0", color: "#fff",
              border: "none", borderRadius: 8, padding: "14px",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>もう一度挑戦</button>
            <button onClick={() => setScreen("home")} style={{
              flex: 1, background: "#fff", color: "#1c1d1f",
              border: "2px solid #e2e8f0", borderRadius: 8, padding: "14px",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>トップへ戻る</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
