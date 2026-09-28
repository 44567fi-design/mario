import { useState } from 'react';
import { MathQuestion, Player } from '../types/game';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, Award, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { WEAPON_DEFINITIONS } from '../data/mathQuestions';

interface MathDialogProps {
  question: MathQuestion;
  player: Player;
  onAnswerComplete: (isCorrect: boolean, question: MathQuestion, selectedOption: number) => void;
}

export function MathDialog({ question, player, onAnswerComplete }: MathDialogProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectOption = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    setShowExplanation(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      // Apply rewards
      if (question.rewardType === 'WEAPON') {
        // Upgrade weapon cycling
        if (player.weapon === 'NORMAL') {
          player.weapon = 'TRIPLE_SPREAD';
        } else if (player.weapon === 'TRIPLE_SPREAD') {
          player.weapon = 'PIERCE_LASER';
        } else {
          player.weapon = 'HOMING_ORB';
        }
      } else if (question.rewardType === 'STAR') {
        player.starPowerTimer = 600; // 10s invincible
      } else if (question.rewardType === 'HEART') {
        player.hp = player.maxHp;
      } else if (question.rewardType === 'COINS') {
        player.coins += 500;
        player.score += 1000;
      }
      player.score += 500;
    } else {
      sound.playWrong();
      // Small penalty or reassurance
      player.score = Math.max(0, player.score - 50);
    }
  };

  const handleContinue = () => {
    if (selectedIdx !== null) {
      onAnswerComplete(selectedIdx === question.correctIndex, question, selectedIdx);
    }
  };

  const isCorrect = selectedIdx === question.correctIndex;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              ?
            </div>
            <div>
              <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase block">
                高中數學問答關卡 · {question.grade}
              </span>
              <h3 className="text-base font-bold text-slate-100">
                {question.category}
              </h3>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            難度：{'★'.repeat(question.difficulty)}{'☆'.repeat(3 - question.difficulty)}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Question Text */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
            <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              let btnClass = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700/80 hover:border-slate-500';

              if (answered) {
                if (idx === question.correctIndex) {
                  btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                } else if (idx === selectedIdx) {
                  btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                } else {
                  btnClass = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={answered}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-150 cursor-pointer disabled:cursor-default ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/40 flex items-center justify-center text-sm font-bold shrink-0">
                    {letter}
                  </span>
                  <span className="font-semibold text-base pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Answer Feedback & Reward */}
          {answered && (
            <div className={`p-4 rounded-xl border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              isCorrect 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-base">回答完全正確！</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span className="font-bold text-base">回答錯誤，正確答案為 ({['A', 'B', 'C', 'D'][question.correctIndex]})</span>
                  </>
                )}
              </div>

              {isCorrect && (
                <div className="flex items-center gap-2 text-sm text-amber-300 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>獎勵解鎖：{question.rewardDescription}</span>
                </div>
              )}
            </div>
          )}

          {/* Educational Explanation */}
          {showExplanation && (
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>觀念詳解與推導過程</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-700/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {answered ? '觀看完詳解後點擊右方按鈕繼續闖關' : '請選擇正確選項以獲得能力升級'}
          </div>
          {answered && (
            <button
              onClick={handleContinue}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <span>繼續冒險</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
