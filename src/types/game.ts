export type WeaponType = 'NORMAL' | 'TRIPLE_SPREAD' | 'PIERCE_LASER' | 'HOMING_ORB';

export interface WeaponInfo {
  type: WeaponType;
  name: string;
  symbol: string;
  color: string;
  cooldown: number; // in frames (60fps)
  damage: number;
  speed: number;
  description: string;
}

export type EnemyType = 
  | 'POLYNOMIAL_SLIME'   // Ground walker, can be stomped or shot
  | 'TRIG_TURTLE'         // Ground walker with shell, moves faster after stomp
  | 'EXPONENTIAL_BAT'     // Flies in sine/cosine wave
  | 'VECTOR_HEDGEHOG'     // Spiky top, cannot stomp, must shoot
  | 'CALCULUS_WIZARD'     // Shoots projectiles
  | 'MATRIX_DRONE'        // Floating drone that shoots 3-way danmaku
  | 'PROBABILITY_GOLEM'   // Ground heavy unit that fires 8-way ring danmaku
  | 'BOSS_TITAN';         // Stage 5 final boss with multi-phase danmaku

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  hp: number;
  maxHp: number;
  score: number;
  coins: number;
  lives: number;
  invincibleTimer: number; // frames
  shootCooldown: number;   // frames
  weapon: WeaponType;
  doubleJumpAvailable: boolean;
  starPowerTimer: number;  // frames of star power (rainbow, kills on touch)
  runFrame: number;
}

export interface ProjectileTrailPoint {
  x: number;
  y: number;
  alpha: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isPlayer: boolean;
  type: WeaponType | 'ENEMY_BULLET' | 'DANMAKU_RING' | 'DANMAKU_SPIRAL' | 'DANMAKU_WAVE';
  lifeTime: number; // frames
  piercing?: boolean;
  color: string;
  symbol?: string;
  shape?: 'CIRCLE' | 'DIAMOND' | 'STAR' | 'BEAM' | 'ORB';
  trail?: ProjectileTrailPoint[];
  waveAmp?: number;
  waveFreq?: number;
  baseY?: number;
  age?: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  facing: 'left' | 'right';
  patrolMinX: number;
  patrolMaxX: number;
  shootTimer: number;
  isShell?: boolean;
  shellMoving?: boolean;
  stateTimer?: number;
  mathBadge: string;
  danmakuAngle?: number;
}

export type BlockType = 
  | 'GROUND' 
  | 'BRICK' 
  | 'QUESTION' 
  | 'USED_BLOCK' 
  | 'SPIKE' 
  | 'SPRING' 
  | 'PORTAL_FLAG'
  | 'MATH_GATE'
  | 'LAVA';

export interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: BlockType;
  bumpOffset?: number; // visual bump animation
  content?: 'MATH_QUESTION' | 'COIN' | 'WEAPON' | 'HEART' | 'STAR';
  mathQuestionId?: string;
  activated?: boolean;
  moving?: {
    axis: 'x' | 'y';
    range: number;
    speed: number;
    base: number;
    offset: number;
  };
}

export interface CoinItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  symbol: string; // 'π' | 'Σ' | '√' | 'e' | '∫'
  value: number;
  collected?: boolean;
  sparkleFrame: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  text?: string;
  type?: 'SPARK' | 'RING' | 'STAR' | 'SHOCKWAVE';
  radius?: number;
  maxRadius?: number;
}

export type MathCategory = 
  | '三角函數' 
  | '多項式與方程' 
  | '指數與對數' 
  | '數列與級數' 
  | '平面向量'
  | '平面與空間向量' 
  | '矩陣與變換' 
  | '排列組合與機率' 
  | '微積分與極限';

export interface MathQuestion {
  id: string;
  category: MathCategory;
  grade: '高一' | '高二' | '高三';
  difficulty: 1 | 2 | 3;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  rewardType: 'WEAPON' | 'HEART' | 'STAR' | 'COINS';
  rewardDescription: string;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  theme: 'grassland' | 'cave' | 'islands' | 'fortress' | 'sky';
  width: number;
  height: number;
  startX: number;
  startY: number;
  portalX: number;
  portalY: number;
  blocks: Block[];
  enemies: Enemy[];
  coins: CoinItem[];
  backgroundColor: string;
}

export type GameState = 
  | 'TITLE_MENU' 
  | 'PLAYING' 
  | 'MATH_MODAL' 
  | 'STAGE_CLEAR' 
  | 'GAME_OVER' 
  | 'VICTORY'
  | 'NOTEBOOK_MODAL';

export interface AnswerHistory {
  questionId: string;
  question: MathQuestion;
  selectedOption: number;
  isCorrect: boolean;
  timestamp: number;
}
