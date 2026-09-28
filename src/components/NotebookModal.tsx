import { useState } from 'react';
import { AnswerHistory, MathCategory } from '../types/game';
import { MATH_QUESTIONS } from '../data/mathQuestions';
import { BookOpen, CheckCircle, XCircle, X, Award, Lightbulb, Sigma } from 'lucide-react';

interface NotebookModalProps {
  history: AnswerHistory[];
  onClose: () => void;
}

export function NotebookModal({ history, onClose }: NotebookModalProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'cheatsheet' | 'bank'>('history');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const totalAnswered = history.length;
  const correctCount = history.filter(h => h.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const filteredHistory = history.filter(h => 
    categoryFilter === 'all' ? true : h.question.category === categoryFilter
  );

  const categories: MathCategory[] = [
    '三角函數',
    '多項式與方程',
    '指數與對數',
    '數列與級數',
    '平面與空間向量',
    '矩陣與變換',
    '排列組合與機率',
    '微積分與極限'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                高中數學秘笈與錯題筆記
              </h2>
              <p className="text-xs text-slate-400">
                統計：共答 {totalAnswered} 題 · 正確 {correctCount} 題 · 正答率 {accuracy}%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-850 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'history'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            我的作答歷程 ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'cheatsheet'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            常用核心公式卡
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'bank'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            題庫總覽 ({MATH_QUESTIONS.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'history' && (
            <>
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Sigma className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
                  <p className="text-sm font-medium">尚未觸發任何數學問答</p>
                  <p className="text-xs text-slate-500">在關卡中頂擊或射擊「[?] 問號箱」或穿越數學封印門即可作答！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">
                          {item.question.category} · {item.question.grade}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {item.isCorrect ? (
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> 正確
                            </span>
                          ) : (
                            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> 錯誤
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-slate-200">
                        {item.question.question}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`p-2 rounded border ${
                          item.isCorrect 
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                        }`}>
                          你的選擇：({['A', 'B', 'C', 'D'][item.selectedOption]}) {item.question.options[item.selectedOption]}
                        </div>
                        <div className="p-2 rounded border bg-slate-900 border-slate-700 text-slate-300">
                          正確解答：({['A', 'B', 'C', 'D'][item.question.correctIndex]}) {item.question.options[item.question.correctIndex]}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/80 rounded-lg text-xs text-slate-300 space-y-1">
                        <div className="font-semibold text-sky-400 flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5" /> 詳解
                        </div>
                        <p>{item.question.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'cheatsheet' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-sky-400 text-sm">1. 常用三角恆等式</h4>
                <ul className="text-xs text-slate-300 space-y-1 font-mono">
                  <li>• sin²θ + cos²θ = 1</li>
                  <li>• tan θ = sin θ / cos θ</li>
                  <li>• 餘弦定理：c² = a² + b² - 2ab·cos C</li>
                  <li>• 正弦定理：a/sin A = b/sin B = c/sin C = 2R</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-amber-400 text-sm">2. 二次多項式與韋達定理</h4>
                <ul className="text-xs text-slate-300 space-y-1 font-mono">
                  <li>• 判別式 Δ = b² - 4ac</li>
                  <li>• 兩根之和 α + β = -b / a</li>
                  <li>• 兩根之積 αβ = c / a</li>
                  <li>• 餘式定理：f(x) 除以 (x-c) 之餘式為 f(c)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-emerald-400 text-sm">3. 指數律與對數律</h4>
                <ul className="text-xs text-slate-300 space-y-1 font-mono">
                  <li>• logₐ(xy) = logₐ x + logₐ y</li>
                  <li>• logₐ(x/y) = logₐ x - logₐ y</li>
                  <li>• logₐ(xᵏ) = k·logₐ x</li>
                  <li>• 換底公式：logₐ b = log b / log a</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-purple-400 text-sm">4. 平面向量與內積</h4>
                <ul className="text-xs text-slate-300 space-y-1 font-mono">
                  <li>• a·b = |a||b| cos θ = a₁b₁ + a₂b₂</li>
                  <li>• 垂直條件：a · b = 0</li>
                  <li>• 向量長度：|a| = √(a₁² + a₂²)</li>
                  <li>• 柯西不等式：(a₁b₁+a₂b₂)² ≤ (a₁²+a₂²)(b₁²+b₂²)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-rose-400 text-sm">5. 數列與級數求和</h4>
                <ul className="text-xs text-slate-300 space-y-1 font-mono">
                  <li>• 等差第 n 項：aₙ = a₁ + (n - 1)d</li>
                  <li>• 等差前 n 項和：Sₙ = n(a₁ + aₙ) / 2</li>
                  <li>• 等比第 n 項：aₙ = a₁·rⁿ⁻¹</li>
                  <li>• 等比前 n 項和：Sₙ = a₁(1 - rⁿ) / (1 - r)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">6. 導數與微積分入門</h4>
                <ul className="text-xs text-slate-300 space-y-1 font-mono">
                  <li>• 冪次微分：(xⁿ)' = n·xⁿ⁻¹</li>
                  <li>• 微積分基本定理：∫ₐᵇ f(x)dx = F(b) - F(a)</li>
                  <li>• 常數法則：(cf(x))' = c·f'(x)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-teal-400 text-sm">7. 矩陣乘法與二階行列式</h4>
                <ul className="text-xs text-slate-300 space-y-1 font-mono">
                  <li>• 行列式 det([[a,b],[c,d]]) = ad - bc</li>
                  <li>• 旋轉矩陣 R(θ) = [[cosθ,-sinθ],[sinθ,cosθ]]</li>
                  <li>• 逆矩陣 A⁻¹ = (1/det A)·[[d,-b],[-c,a]]</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-orange-400 text-sm">8. 空間向量與距離公式</h4>
                <ul className="text-xs text-slate-300 space-y-1 font-mono">
                  <li>• 空間兩點距離：d = √[(Δx)²+(Δy)²+(Δz)²]</li>
                  <li>• 空間內積：u·v = u₁v₁ + u₂v₂ + u₃v₃</li>
                  <li>• 點到平面距離：d = |ax₀+by₀+cz₀-d| / √(a²+b²+c²)</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-3">
              {MATH_QUESTIONS.map((q) => (
                <div key={q.id} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sky-400 font-semibold">{q.category} · {q.grade}</span>
                    <span className="text-amber-400">獎勵：{q.rewardDescription}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200">{q.question}</p>
                  <p className="text-xs text-slate-400">解答：({['A', 'B', 'C', 'D'][q.correctIndex]}) {q.options[q.correctIndex]}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            關閉筆記
          </button>
        </div>
      </div>
    </div>
  );
}
