import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Player, LevelData, Projectile, Particle, MathQuestion, AnswerHistory } from './types/game';
import { LEVELS } from './game/levels';
import { MATH_QUESTIONS } from './data/mathQuestions';
import { updatePhysics } from './game/physics';
import { renderGame } from './game/renderer';
import { sound } from './utils/audio';
import { GameHUD } from './components/GameHUD';
import { MathDialog } from './components/MathDialog';
import { NotebookModal } from './components/NotebookModal';
import { VirtualPad } from './components/VirtualPad';
import { Play, RotateCcw, Award, BookOpen, Trophy, Sparkles, ChevronRight, Zap } from 'lucide-react';

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<MathQuestion | null>(null);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);
  const [showNotebook, setShowNotebook] = useState<boolean>(false);

  // References for mutable game loop state to guarantee 60fps without react lag
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const animFrameIdRef = useRef<number | null>(null);
  const mathQuestionsMapRef = useRef<Map<string, MathQuestion>>(new Map());

  // Mutable Game Entities
  const playerRef = useRef<Player>({
    x: 100,
    y: 420,
    vx: 0,
    vy: 0,
    width: 32,
    height: 42,
    isGrounded: false,
    facing: 'right',
    hp: 5,
    maxHp: 5,
    score: 0,
    coins: 0,
    lives: 3,
    invincibleTimer: 0,
    shootCooldown: 0,
    weapon: 'NORMAL',
    doubleJumpAvailable: true,
    starPowerTimer: 0,
    runFrame: 0
  });

  // Current level entities clone
  const levelRef = useRef<LevelData>(JSON.parse(JSON.stringify(LEVELS[0])));
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cameraRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const gameTimeRef = useRef<number>(0);

  // Initialize Question Map
  useEffect(() => {
    const map = new Map<string, MathQuestion>();
    MATH_QUESTIONS.forEach(q => map.set(q.id, q));
    mathQuestionsMapRef.current = map;
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.code] = true;

      // Double jump trigger on keydown
      if (['ArrowUp', 'KeyW', 'Space', 'KeyK'].includes(e.code)) {
        const p = playerRef.current;
        if (p.isGrounded) {
          p.vy = -11.0;
          p.isGrounded = false;
          sound.playJump();
        } else if (p.doubleJumpAvailable) {
          p.vy = -9.2;
          p.doubleJumpAvailable = false;
          sound.playJump();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Load Level Helper
  const loadLevel = useCallback((levelIdx: number) => {
    const rawLevel = LEVELS[levelIdx] || LEVELS[0];
    levelRef.current = JSON.parse(JSON.stringify(rawLevel));
    projectilesRef.current = [];
    particlesRef.current = [];
    cameraRef.current = { x: 0, y: 0 };

    const p = playerRef.current;
    p.x = levelRef.current.startX;
    p.y = levelRef.current.startY;
    p.vx = 0;
    p.vy = 0;
    p.hp = p.maxHp;
    p.invincibleTimer = 30;
    setCurrentLevelIdx(levelIdx);
  }, []);

  // Start Game
  const handleStartGame = () => {
    playerRef.current = {
      x: 100,
      y: 420,
      vx: 0,
      vy: 0,
      width: 32,
      height: 42,
      isGrounded: false,
      facing: 'right',
      hp: 5,
      maxHp: 5,
      score: 0,
      coins: 0,
      lives: 3,
      invincibleTimer: 0,
      shootCooldown: 0,
      weapon: 'NORMAL',
      doubleJumpAvailable: true,
      starPowerTimer: 0,
      runFrame: 0
    };
    loadLevel(0);
    setGameState('PLAYING');
    sound.startBGM();
  };

  const handleStartAtLevel = (levelIndex: number) => {
    playerRef.current = {
      x: 100,
      y: 420,
      vx: 0,
      vy: 0,
      width: 32,
      height: 42,
      isGrounded: false,
      facing: 'right',
      hp: 5,
      maxHp: 5,
      score: levelIndex * 2000,
      coins: levelIndex * 500,
      lives: 3,
      invincibleTimer: 0,
      shootCooldown: 0,
      weapon: levelIndex >= 4 ? 'PIERCE_LASER' : levelIndex >= 2 ? 'TRIPLE_SPREAD' : 'NORMAL',
      doubleJumpAvailable: true,
      starPowerTimer: 0,
      runFrame: 0
    };
    loadLevel(levelIndex);
    setGameState('PLAYING');
    sound.startBGM();
  };

  // Next Level
  const handleNextStage = () => {
    const nextIdx = currentLevelIdx + 1;
    if (nextIdx < LEVELS.length) {
      loadLevel(nextIdx);
      setGameState('PLAYING');
      sound.playJump();
    } else {
      setGameState('VICTORY');
      sound.playStageClear();
    }
  };

  // Answer Complete Callback from MathDialog
  const handleAnswerComplete = (isCorrect: boolean, question: MathQuestion, selectedOption: number) => {
    setAnswerHistory(prev => [
      {
        questionId: question.id,
        question,
        selectedOption,
        isCorrect,
        timestamp: Date.now()
      },
      ...prev
    ]);
    setActiveQuestion(null);
    setGameState('PLAYING');
  };

  // Main 60FPS Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const gameLoop = () => {
      if (!isMounted) return;

      gameTimeRef.current++;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const player = playerRef.current;
      const level = levelRef.current;

      // 1. Run Physics Simulation
      const result = updatePhysics(
        player,
        level.blocks,
        level.enemies,
        projectilesRef.current,
        level.coins,
        particlesRef.current,
        keysRef.current,
        level.width,
        level.height,
        mathQuestionsMapRef.current,
        level.id
      );

      // Handle Math Question Trigger
      if (result.triggerQuestion) {
        setActiveQuestion(result.triggerQuestion);
        setGameState('MATH_MODAL');
        return;
      }

      // Handle Stage Clear
      if (result.stageCleared) {
        sound.playStageClear();
        if (currentLevelIdx >= LEVELS.length - 1) {
          setGameState('VICTORY');
        } else {
          setGameState('STAGE_CLEAR');
        }
        return;
      }

      // Handle Player Death
      if (result.playerDied) {
        if (player.lives <= 0) {
          setGameState('GAME_OVER');
          sound.playHurt();
          return;
        } else {
          // Respawn at level start
          player.x = level.startX;
          player.y = level.startY;
          player.vx = 0;
          player.vy = 0;
          player.hp = player.maxHp;
          player.invincibleTimer = 90;
        }
      }

      // 2. Camera Tracking (Smooth horizontal follow with clamping)
      const targetCamX = player.x - CANVAS_WIDTH / 2.5;
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.1;
      cameraRef.current.x = Math.max(0, Math.min(level.width - CANVAS_WIDTH, cameraRef.current.x));

      // 3. Render Canvas
      if (ctx && canvas) {
        renderGame(
          ctx,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          player,
          level,
          level.blocks,
          level.enemies,
          projectilesRef.current,
          level.coins,
          particlesRef.current,
          cameraRef.current.x,
          0,
          gameTimeRef.current
        );
      }

      animFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [gameState, isPaused, currentLevelIdx]);

  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Top Navigation HUD (Zone 1 - Wordmark, Zone 2 - Metadata, Zone 3 - Actions) */}
      <GameHUD
        player={playerRef.current}
        level={levelRef.current}
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = sound.toggleMute();
          setIsMuted(muted);
        }}
        onOpenNotebook={() => setShowNotebook(true)}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(p => !p)}
      />

      {/* Main Game Screen Canvas Container */}
      <div className="relative w-full max-w-[1080px] aspect-[16/9] max-h-[85vh] flex items-center justify-center p-2 sm:p-4 mt-10">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full object-contain rounded-2xl shadow-2xl border border-slate-800 bg-slate-950"
        />

        {/* 1. TITLE MENU OVERLAY */}
        {gameState === 'TITLE_MENU' && (
          <div className="absolute inset-2 sm:inset-4 rounded-2xl bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            {/* Title Lockup */}
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>高中數學素養教育 · 2D 射擊闖關</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 tracking-tight">
                數算勇者：2D冒險射擊
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
                跳躍踩踏多項式怪獸、發射希格瑪能量彈！頂擊問號箱解答高中數學題（三角函數、向量、微積分），升級三向散射光波與無敵星光環！
              </p>
            </div>

            {/* Controls Guide */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 max-w-md w-full grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-amber-400 font-bold block mb-1">🎮 移動與跳躍</span>
                <span>鍵盤 [A/D] 或 [←/→] 移動</span>
                <span className="block">[W] / [Space] / [K] 跳躍（二段跳）</span>
              </div>
              <div>
                <span className="text-sky-400 font-bold block mb-1">⚡ 射擊與彈幕</span>
                <span>鍵盤 [Z] 或 [J] 發射武器</span>
                <span className="block">頂擊/射擊 [ ? ] 箱解鎖數學升級</span>
              </div>
            </div>

            {/* Level Quick Select */}
            <div className="mt-4 max-w-lg w-full">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2 text-center">
                選擇冒險關卡（共 5 大主題）
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {LEVELS.map((lvl, idx) => (
                  <button
                    key={lvl.id}
                    onClick={() => handleStartAtLevel(idx)}
                    className="p-2 rounded-lg bg-slate-800/90 hover:bg-sky-600/80 border border-slate-700 hover:border-sky-400 text-center transition-all cursor-pointer group"
                    title={lvl.name}
                  >
                    <span className="text-xs font-bold text-sky-400 group-hover:text-white block">
                      第 {idx + 1} 關
                    </span>
                    <span className="text-[9px] text-slate-400 group-hover:text-slate-200 line-clamp-1 truncate block">
                      {lvl.theme === 'grassland' && '平原'}
                      {lvl.theme === 'cave' && '地窟'}
                      {lvl.theme === 'islands' && '浮島'}
                      {lvl.theme === 'fortress' && '熔岩'}
                      {lvl.theme === 'sky' && '泰坦'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleStartGame}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>從頭開始闖關</span>
              </button>
              <button
                onClick={() => setShowNotebook(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>數學公式秘笈</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. STAGE CLEAR OVERLAY */}
        {gameState === 'STAGE_CLEAR' && (
          <div className="absolute inset-2 sm:inset-4 rounded-2xl bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              關卡突破成功！
            </h2>
            <p className="text-sm text-slate-300 max-w-sm mb-6">
              成功抵達終點城堡旗桿！數學知識已化為強大的勇者力量！
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-xs w-full space-y-2 mb-6 text-left">
              <div className="flex justify-between">
                <span>目前得分：</span>
                <span className="font-mono text-emerald-400 font-bold">{playerRef.current.score}</span>
              </div>
              <div className="flex justify-between">
                <span>數學金幣：</span>
                <span className="font-mono text-amber-400 font-bold">{playerRef.current.coins} π</span>
              </div>
              <div className="flex justify-between">
                <span>已解答題數：</span>
                <span className="font-mono text-sky-400 font-bold">{answerHistory.length} 題</span>
              </div>
            </div>

            <button
              onClick={handleNextStage}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <span>前往下一關</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 3. VICTORY OVERLAY (All Stages Cleared) */}
        {gameState === 'VICTORY' && (
          <div className="absolute inset-2 sm:inset-4 rounded-2xl bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white mb-4 shadow-xl shadow-amber-500/30">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 mb-2">
              冒險大獲全勝！數學傳奇誕生！
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-md mb-6 leading-relaxed">
              恭喜你徹底擊潰奇異點泰坦，解開了所有高深的高中數學謎題！你已經成為數理邏輯與敏捷操作兼具的終極數算勇者！
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-sm w-full space-y-2 mb-6 text-left">
              <div className="flex justify-between">
                <span>最終總分：</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{playerRef.current.score}</span>
              </div>
              <div className="flex justify-between">
                <span>收集數學金幣：</span>
                <span className="font-mono text-amber-400 font-bold text-sm">{playerRef.current.coins} π</span>
              </div>
              <div className="flex justify-between">
                <span>解題正確率：</span>
                <span className="font-mono text-sky-400 font-bold text-sm">
                  {answerHistory.length > 0 
                    ? `${Math.round((answerHistory.filter(h => h.isCorrect).length / answerHistory.length) * 100)}% (${answerHistory.filter(h => h.isCorrect).length}/${answerHistory.length})` 
                    : '100%'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartGame}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>再次挑戰</span>
              </button>
              <button
                onClick={() => setShowNotebook(true)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>檢視作答錯題筆記</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. GAME OVER OVERLAY */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-2 sm:inset-4 rounded-2xl bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-rose-500 mb-2">
              GAME OVER
            </h2>
            <p className="text-sm text-slate-300 max-w-sm mb-6">
              別氣餒！數學的真諦在於從錯誤中學習。回顧公式秘笈，再次挑戰！
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartGame}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重新挑戰</span>
              </button>
              <button
                onClick={() => setShowNotebook(true)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>查看數學秘笈</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch Screen Virtual Pad (Active during playing) */}
      {gameState === 'PLAYING' && (
        <VirtualPad
          onKeyDown={(key) => {
            keysRef.current[key] = true;
            if (key === 'ArrowUp') {
              const p = playerRef.current;
              if (p.isGrounded) {
                p.vy = -11.0;
                p.isGrounded = false;
                sound.playJump();
              } else if (p.doubleJumpAvailable) {
                p.vy = -9.2;
                p.doubleJumpAvailable = false;
                sound.playJump();
              }
            }
          }}
          onKeyUp={(key) => {
            keysRef.current[key] = false;
          }}
        />
      )}

      {/* Math Question Interactive Dialog */}
      {activeQuestion && gameState === 'MATH_MODAL' && (
        <MathDialog
          question={activeQuestion}
          player={playerRef.current}
          onAnswerComplete={handleAnswerComplete}
        />
      )}

      {/* Math Cheatsheet & Review Notebook Modal */}
      {showNotebook && (
        <NotebookModal
          history={answerHistory}
          onClose={() => setShowNotebook(false)}
        />
      )}
    </div>
  );
}
