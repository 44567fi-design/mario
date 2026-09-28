import { Player, LevelData } from '../types/game';
import { WEAPON_DEFINITIONS } from '../data/mathQuestions';
import { Volume2, VolumeX, BookOpen, Heart, Sparkles, Pause, Play } from 'lucide-react';

interface GameHUDProps {
  player: Player;
  level: LevelData;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenNotebook: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export function GameHUD({
  player,
  level,
  isMuted,
  onToggleMute,
  onOpenNotebook,
  isPaused,
  onTogglePause
}: GameHUDProps) {
  const currentWeapon = WEAPON_DEFINITIONS[player.weapon];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md px-4 py-2 flex items-center justify-between text-slate-200">
      {/* Zone 1: Single Wordmark */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm tracking-tight text-sky-400 font-mono">
          MATH ADVENTURE
        </span>
      </div>

      {/* Zone 2: Game Metrics (Unboxed metadata, tabular-nums) */}
      <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
        {/* Stage Name */}
        <span className="hidden sm:inline text-slate-400">
          {level.name}
        </span>
        <span className="hidden sm:inline text-slate-600">·</span>

        {/* HP Hearts */}
        <div className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span className="font-mono tabular-nums">
            {player.hp}/{player.maxHp}
          </span>
        </div>
        <span className="text-slate-600">·</span>

        {/* Math Coins (π) */}
        <div className="flex items-center gap-1">
          <span className="font-bold text-amber-400">π</span>
          <span className="font-mono tabular-nums text-amber-200">
            {player.coins}
          </span>
        </div>
        <span className="text-slate-600">·</span>

        {/* Score */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">得分</span>
          <span className="font-mono tabular-nums text-emerald-400 font-semibold">
            {player.score}
          </span>
        </div>

        {/* Star Power Status */}
        {player.starPowerTimer > 0 && (
          <>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1 text-amber-300 font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>無敵星 {Math.ceil(player.starPowerTimer / 60)}s</span>
            </div>
          </>
        )}

        {/* Current Weapon */}
        <span className="hidden md:inline text-slate-600">·</span>
        <div className="hidden md:flex items-center gap-1.5">
          <span
            className="w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center"
            style={{ backgroundColor: currentWeapon.color, color: '#0f172a' }}
          >
            {currentWeapon.symbol}
          </span>
          <span className="text-slate-300">{currentWeapon.name}</span>
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenNotebook}
          className="px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          title="開啟數學秘笈與錯題本"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">數學秘笈</span>
        </button>

        <button
          onClick={onTogglePause}
          className="p-1.5 text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          title={isPaused ? '繼續遊戲' : '暫停遊戲'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onToggleMute}
          className="p-1.5 text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          title={isMuted ? '取消靜音' : '靜音'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>
    </header>
  );
}
