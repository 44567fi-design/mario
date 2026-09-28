import { LevelData, Block, Enemy, CoinItem } from '../types/game';

// Helper to generate IDs
let idCounter = 1;
const uid = (prefix: string) => `${prefix}_${idCounter++}`;

export const LEVELS: LevelData[] = [
  // ==========================================
  // LEVEL 1: 幾何與多項式平原 (Function Plains)
  // ==========================================
  {
    id: 1,
    name: '第 1 關：函數與幾何平原',
    subtitle: '熟悉跳躍、射擊與啟動數學問號箱',
    theme: 'grassland',
    width: 2800,
    height: 600,
    startX: 100,
    startY: 420,
    portalX: 2600,
    portalY: 420,
    backgroundColor: '#0284c7', // Sky blue
    blocks: [
      // Ground segment 1: x 0 to 850
      { id: uid('blk'), x: 0, y: 500, width: 850, height: 100, type: 'GROUND' },
      
      // Question blocks and bricks at x: 220~380
      { id: uid('blk'), x: 220, y: 350, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'poly-1' },
      { id: uid('blk'), x: 260, y: 350, width: 40, height: 40, type: 'BRICK' },
      { id: uid('blk'), x: 300, y: 350, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'trig-1' },
      { id: uid('blk'), x: 340, y: 350, width: 40, height: 40, type: 'BRICK' },

      // High platform with math question
      { id: uid('blk'), x: 480, y: 280, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'seq-1' },
      { id: uid('blk'), x: 520, y: 280, width: 40, height: 40, type: 'BRICK' },
      { id: uid('blk'), x: 560, y: 280, width: 40, height: 40, type: 'QUESTION', content: 'COIN' },

      // Pipe obstacle
      { id: uid('blk'), x: 720, y: 430, width: 60, height: 70, type: 'GROUND' },

      // Ground segment 2: x 950 to 1800
      { id: uid('blk'), x: 950, y: 500, width: 850, height: 100, type: 'GROUND' },
      
      // Stepping stones
      { id: uid('blk'), x: 1050, y: 380, width: 70, height: 25, type: 'GROUND' },
      { id: uid('blk'), x: 1180, y: 310, width: 70, height: 25, type: 'GROUND' },
      { id: uid('blk'), x: 1280, y: 310, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'poly-2' },
      { id: uid('blk'), x: 1320, y: 310, width: 40, height: 40, type: 'QUESTION', content: 'STAR' },

      // Spring to reach high secret
      { id: uid('blk'), x: 1480, y: 470, width: 36, height: 30, type: 'SPRING' },
      { id: uid('blk'), x: 1540, y: 200, width: 120, height: 25, type: 'GROUND' },
      { id: uid('blk'), x: 1580, y: 150, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'trig-2' },

      // Ground segment 3: x 1920 to 2800 (Castle finish line)
      { id: uid('blk'), x: 1920, y: 500, width: 880, height: 100, type: 'GROUND' },

      // Staircase steps towards goal
      { id: uid('blk'), x: 2100, y: 460, width: 40, height: 40, type: 'GROUND' },
      { id: uid('blk'), x: 2140, y: 420, width: 40, height: 80, type: 'GROUND' },
      { id: uid('blk'), x: 2180, y: 380, width: 40, height: 120, type: 'GROUND' },
      { id: uid('blk'), x: 2220, y: 340, width: 40, height: 160, type: 'GROUND' },
      
      // Question block on staircase
      { id: uid('blk'), x: 2220, y: 220, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'prob-1' },

      // Final Math Gate before flagpole
      { id: uid('blk'), x: 2420, y: 380, width: 40, height: 120, type: 'MATH_GATE', mathQuestionId: 'poly-3' },

      // Flagpole / Portal Goal
      { id: uid('blk'), x: 2600, y: 220, width: 40, height: 280, type: 'PORTAL_FLAG' },
    ],
    enemies: [
      {
        id: uid('enm'),
        type: 'POLYNOMIAL_SLIME',
        x: 400,
        y: 460,
        vx: -1.2,
        vy: 0,
        width: 36,
        height: 36,
        hp: 1,
        maxHp: 1,
        facing: 'left',
        patrolMinX: 200,
        patrolMaxX: 680,
        shootTimer: 0,
        mathBadge: 'f(x)'
      },
      {
        id: uid('enm'),
        type: 'POLYNOMIAL_SLIME',
        x: 620,
        y: 460,
        vx: 1.2,
        vy: 0,
        width: 36,
        height: 36,
        hp: 1,
        maxHp: 1,
        facing: 'right',
        patrolMinX: 350,
        patrolMaxX: 700,
        shootTimer: 0,
        mathBadge: 'x²'
      },
      {
        id: uid('enm'),
        type: 'TRIG_TURTLE',
        x: 1100,
        y: 460,
        vx: -1.4,
        vy: 0,
        width: 36,
        height: 40,
        hp: 2,
        maxHp: 2,
        facing: 'left',
        patrolMinX: 980,
        patrolMaxX: 1400,
        shootTimer: 0,
        mathBadge: 'sin θ'
      },
      {
        id: uid('enm'),
        type: 'POLYNOMIAL_SLIME',
        x: 1350,
        y: 460,
        vx: 1.5,
        vy: 0,
        width: 36,
        height: 36,
        hp: 1,
        maxHp: 1,
        facing: 'right',
        patrolMinX: 1200,
        patrolMaxX: 1600,
        shootTimer: 0,
        mathBadge: '2x'
      },
      {
        id: uid('enm'),
        type: 'TRIG_TURTLE',
        x: 2000,
        y: 460,
        vx: -1.5,
        vy: 0,
        width: 36,
        height: 40,
        hp: 2,
        maxHp: 2,
        facing: 'left',
        patrolMinX: 1940,
        patrolMaxX: 2100,
        shootTimer: 0,
        mathBadge: 'cos θ'
      }
    ],
    coins: [
      { id: uid('coin'), x: 220, y: 440, width: 24, height: 24, symbol: 'π', value: 100, sparkleFrame: 0 },
      { id: uid('coin'), x: 280, y: 440, width: 24, height: 24, symbol: 'Σ', value: 100, sparkleFrame: 10 },
      { id: uid('coin'), x: 340, y: 440, width: 24, height: 24, symbol: '√', value: 100, sparkleFrame: 20 },
      { id: uid('coin'), x: 1070, y: 340, width: 24, height: 24, symbol: 'π', value: 100, sparkleFrame: 5 },
      { id: uid('coin'), x: 1200, y: 270, width: 24, height: 24, symbol: 'e', value: 150, sparkleFrame: 15 },
      { id: uid('coin'), x: 1560, y: 160, width: 24, height: 24, symbol: '∫', value: 200, sparkleFrame: 25 },
      { id: uid('coin'), x: 1620, y: 160, width: 24, height: 24, symbol: 'π', value: 100, sparkleFrame: 30 }
    ]
  },

  // ==========================================
  // LEVEL 2: 指數與向量地窟 (Vector & Exponential Cavern)
  // ==========================================
  {
    id: 2,
    name: '第 2 關：指數與向量地窟',
    subtitle: '小心尖刺刺蝟與波浪蝙蝠，善用微積分光束射擊',
    theme: 'cave',
    width: 3200,
    height: 600,
    startX: 100,
    startY: 420,
    portalX: 3000,
    portalY: 420,
    backgroundColor: '#0f172a', // Deep cavern dark slate
    blocks: [
      // Ground segment 1
      { id: uid('blk'), x: 0, y: 500, width: 700, height: 100, type: 'GROUND' },

      // High cavern platforms
      { id: uid('blk'), x: 200, y: 340, width: 120, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 240, y: 280, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'vec-1' },

      // Moving platform over chasm
      {
        id: uid('blk'),
        x: 750,
        y: 430,
        width: 100,
        height: 24,
        type: 'GROUND',
        moving: { axis: 'x', range: 180, speed: 1.5, base: 750, offset: 0 }
      },

      // Ground segment 2
      { id: uid('blk'), x: 1050, y: 500, width: 800, height: 100, type: 'GROUND' },
      
      // Question block cluster
      { id: uid('blk'), x: 1200, y: 360, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'log-1' },
      { id: uid('blk'), x: 1240, y: 360, width: 40, height: 40, type: 'BRICK' },
      { id: uid('blk'), x: 1280, y: 360, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'vec-2' },
      { id: uid('blk'), x: 1320, y: 360, width: 40, height: 40, type: 'QUESTION', content: 'STAR' },

      // Vertical moving platform
      {
        id: uid('blk'),
        x: 1920,
        y: 400,
        width: 90,
        height: 24,
        type: 'GROUND',
        moving: { axis: 'y', range: 140, speed: 1.2, base: 400, offset: 0 }
      },

      // Floating ceiling platform
      { id: uid('blk'), x: 2080, y: 240, width: 220, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 2150, y: 180, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'log-2' },
      { id: uid('blk'), x: 2200, y: 180, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'trig-3' },

      // Ground segment 3 (to end)
      { id: uid('blk'), x: 2350, y: 500, width: 850, height: 100, type: 'GROUND' },
      
      // Spikes on ground (player must jump onto safe block)
      { id: uid('blk'), x: 2500, y: 476, width: 80, height: 24, type: 'SPIKE' },
      { id: uid('blk'), x: 2510, y: 370, width: 60, height: 24, type: 'GROUND' },

      // Question block before exit
      { id: uid('blk'), x: 2750, y: 360, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'vec-3' },
      { id: uid('blk'), x: 2800, y: 360, width: 40, height: 40, type: 'BRICK' },

      // Flagpole Goal
      { id: uid('blk'), x: 3000, y: 220, width: 40, height: 280, type: 'PORTAL_FLAG' }
    ],
    enemies: [
      {
        id: uid('enm'),
        type: 'VECTOR_HEDGEHOG', // Cannot stomp! Spiky top!
        x: 450,
        y: 460,
        vx: -1.3,
        vy: 0,
        width: 36,
        height: 36,
        hp: 2,
        maxHp: 2,
        facing: 'left',
        patrolMinX: 300,
        patrolMaxX: 620,
        shootTimer: 0,
        mathBadge: 'u⃗·v⃗'
      },
      {
        id: uid('enm'),
        type: 'EXPONENTIAL_BAT', // Flying sine wave
        x: 820,
        y: 280,
        vx: -1.6,
        vy: 0,
        width: 38,
        height: 30,
        hp: 1,
        maxHp: 1,
        facing: 'left',
        patrolMinX: 650,
        patrolMaxX: 1100,
        shootTimer: 0,
        stateTimer: 0,
        mathBadge: 'eˣ'
      },
      {
        id: uid('enm'),
        type: 'VECTOR_HEDGEHOG',
        x: 1400,
        y: 460,
        vx: 1.3,
        vy: 0,
        width: 36,
        height: 36,
        hp: 2,
        maxHp: 2,
        facing: 'right',
        patrolMinX: 1100,
        patrolMaxX: 1700,
        shootTimer: 0,
        mathBadge: '|v⃗|'
      },
      {
        id: uid('enm'),
        type: 'EXPONENTIAL_BAT',
        x: 1650,
        y: 260,
        vx: -1.5,
        vy: 0,
        width: 38,
        height: 30,
        hp: 1,
        maxHp: 1,
        facing: 'left',
        patrolMinX: 1400,
        patrolMaxX: 1850,
        shootTimer: 0,
        stateTimer: 2,
        mathBadge: 'log x'
      },
      {
        id: uid('enm'),
        type: 'CALCULUS_WIZARD', // Shoots magic bullets
        x: 2680,
        y: 450,
        vx: 0,
        vy: 0,
        width: 36,
        height: 44,
        hp: 3,
        maxHp: 3,
        facing: 'left',
        patrolMinX: 2650,
        patrolMaxX: 2750,
        shootTimer: 60,
        mathBadge: 'd/dx'
      }
    ],
    coins: [
      { id: uid('coin'), x: 250, y: 440, width: 24, height: 24, symbol: 'v⃗', value: 120, sparkleFrame: 0 },
      { id: uid('coin'), x: 800, y: 360, width: 24, height: 24, symbol: 'e', value: 150, sparkleFrame: 10 },
      { id: uid('coin'), x: 1220, y: 440, width: 24, height: 24, symbol: 'log', value: 150, sparkleFrame: 20 },
      { id: uid('coin'), x: 1940, y: 320, width: 24, height: 24, symbol: '∫', value: 200, sparkleFrame: 5 },
      { id: uid('coin'), x: 2120, y: 190, width: 24, height: 24, symbol: 'Σ', value: 180, sparkleFrame: 15 }
    ]
  },

  // ==========================================
  // LEVEL 3: 矩陣與空間向量浮空群島 (Matrix Sky Archipelago) [NEW]
  // ==========================================
  {
    id: 3,
    name: '第 3 關：矩陣與空間向量浮島',
    subtitle: '迎戰空中矩陣浮游機！閃避扇形彈幕與深淵跳躍',
    theme: 'islands',
    width: 3300,
    height: 600,
    startX: 100,
    startY: 420,
    portalX: 3100,
    portalY: 420,
    backgroundColor: '#064e3b', // Emerald sky mist
    blocks: [
      // Floating Island 1
      { id: uid('blk'), x: 0, y: 480, width: 550, height: 120, type: 'GROUND' },
      
      // Floating matrix question blocks
      { id: uid('blk'), x: 200, y: 320, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'mat-1' },
      { id: uid('blk'), x: 240, y: 320, width: 40, height: 40, type: 'BRICK' },
      { id: uid('blk'), x: 280, y: 320, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'space-1' },

      // Spring to upper airway
      { id: uid('blk'), x: 480, y: 450, width: 36, height: 30, type: 'SPRING' },

      // Upper Cloud Stepping Stones
      { id: uid('blk'), x: 580, y: 340, width: 90, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 740, y: 270, width: 100, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 770, y: 210, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'mat-2' },

      // Floating Island 2
      { id: uid('blk'), x: 920, y: 460, width: 650, height: 140, type: 'GROUND' },

      // Moving platform (horizontal shuttle)
      {
        id: uid('blk'),
        x: 1650,
        y: 390,
        width: 100,
        height: 24,
        type: 'GROUND',
        moving: { axis: 'x', range: 140, speed: 1.8, base: 1650, offset: 0 }
      },

      // Floating Island 3 (with vertical elevator)
      { id: uid('blk'), x: 1880, y: 450, width: 500, height: 150, type: 'GROUND' },
      { id: uid('blk'), x: 2000, y: 300, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'mat-3' },
      { id: uid('blk'), x: 2040, y: 300, width: 40, height: 40, type: 'QUESTION', content: 'STAR' },

      // High aerial elevator
      {
        id: uid('blk'),
        x: 2440,
        y: 350,
        width: 80,
        height: 24,
        type: 'GROUND',
        moving: { axis: 'y', range: 120, speed: 1.4, base: 350, offset: 0 }
      },

      // Final Sky Terrace to Flag
      { id: uid('blk'), x: 2600, y: 480, width: 700, height: 120, type: 'GROUND' },
      { id: uid('blk'), x: 2780, y: 340, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'space-2' },
      { id: uid('blk'), x: 2950, y: 360, width: 40, height: 120, type: 'MATH_GATE', mathQuestionId: 'space-3' },

      // Flagpole
      { id: uid('blk'), x: 3100, y: 200, width: 40, height: 280, type: 'PORTAL_FLAG' }
    ],
    enemies: [
      {
        id: uid('enm'),
        type: 'MATRIX_DRONE', // Shoots 3-way danmaku
        x: 650,
        y: 200,
        vx: 1.2,
        vy: 0,
        width: 40,
        height: 34,
        hp: 2,
        maxHp: 2,
        facing: 'right',
        patrolMinX: 580,
        patrolMaxX: 850,
        shootTimer: 75,
        mathBadge: 'det(A)'
      },
      {
        id: uid('enm'),
        type: 'VECTOR_HEDGEHOG',
        x: 1100,
        y: 424,
        vx: -1.4,
        vy: 0,
        width: 36,
        height: 36,
        hp: 2,
        maxHp: 2,
        facing: 'left',
        patrolMinX: 960,
        patrolMaxX: 1350,
        shootTimer: 0,
        mathBadge: 'A·v'
      },
      {
        id: uid('enm'),
        type: 'MATRIX_DRONE',
        x: 1720,
        y: 250,
        vx: -1.3,
        vy: 0,
        width: 40,
        height: 34,
        hp: 3,
        maxHp: 3,
        facing: 'left',
        patrolMinX: 1600,
        patrolMaxX: 1850,
        shootTimer: 60,
        mathBadge: 'R(θ)'
      },
      {
        id: uid('enm'),
        type: 'CALCULUS_WIZARD',
        x: 2150,
        y: 406,
        vx: 0,
        vy: 0,
        width: 36,
        height: 44,
        hp: 3,
        maxHp: 3,
        facing: 'left',
        patrolMinX: 2050,
        patrolMaxX: 2280,
        shootTimer: 50,
        mathBadge: 'λ·I'
      },
      {
        id: uid('enm'),
        type: 'MATRIX_DRONE',
        x: 2800,
        y: 260,
        vx: 1.5,
        vy: 0,
        width: 40,
        height: 34,
        hp: 3,
        maxHp: 3,
        facing: 'right',
        patrolMinX: 2650,
        patrolMaxX: 2980,
        shootTimer: 70,
        mathBadge: 'A⁻¹'
      }
    ],
    coins: [
      { id: uid('coin'), x: 260, y: 400, width: 24, height: 24, symbol: 'A', value: 150, sparkleFrame: 0 },
      { id: uid('coin'), x: 620, y: 290, width: 24, height: 24, symbol: 'det', value: 180, sparkleFrame: 10 },
      { id: uid('coin'), x: 1200, y: 390, width: 24, height: 24, symbol: 'v⃗', value: 200, sparkleFrame: 20 },
      { id: uid('coin'), x: 1950, y: 380, width: 24, height: 24, symbol: 'λ', value: 220, sparkleFrame: 15 },
      { id: uid('coin'), x: 2750, y: 410, width: 24, height: 24, symbol: 'R', value: 250, sparkleFrame: 30 }
    ]
  },

  // ==========================================
  // LEVEL 4: 機率與排列組合熔岩要塞 (Probability Lava Citadel) [NEW]
  // ==========================================
  {
    id: 4,
    name: '第 4 關：機率與組合熔岩要塞',
    subtitle: '小心熔岩池與機率石魔的 8 向環狀彈幕！',
    theme: 'fortress',
    width: 3400,
    height: 600,
    startX: 100,
    startY: 420,
    portalX: 3200,
    portalY: 420,
    backgroundColor: '#450a0a', // Deep molten magma red
    blocks: [
      // Fortress Entrance Ground
      { id: uid('blk'), x: 0, y: 500, width: 650, height: 100, type: 'GROUND' },
      
      // Question blocks
      { id: uid('blk'), x: 240, y: 360, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'prob-2' },
      { id: uid('blk'), x: 280, y: 360, width: 40, height: 40, type: 'BRICK' },
      { id: uid('blk'), x: 320, y: 360, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'prob-3' },

      // Lava Pit 1 (Hazard)
      { id: uid('blk'), x: 650, y: 520, width: 220, height: 80, type: 'LAVA' },
      { id: uid('blk'), x: 700, y: 380, width: 100, height: 24, type: 'GROUND' }, // Safe bridge

      // Mid Fortress ground
      { id: uid('blk'), x: 870, y: 500, width: 750, height: 100, type: 'GROUND' },
      
      // Obsidian pillars
      { id: uid('blk'), x: 1050, y: 380, width: 40, height: 120, type: 'GROUND' },
      { id: uid('blk'), x: 1220, y: 300, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'prob-4' },
      { id: uid('blk'), x: 1260, y: 300, width: 40, height: 40, type: 'QUESTION', content: 'STAR' },

      // Lava Pit 2 with moving platform
      { id: uid('blk'), x: 1620, y: 520, width: 300, height: 80, type: 'LAVA' },
      {
        id: uid('blk'),
        x: 1700,
        y: 410,
        width: 100,
        height: 24,
        type: 'GROUND',
        moving: { axis: 'x', range: 100, speed: 1.6, base: 1700, offset: 0 }
      },

      // High Tower section
      { id: uid('blk'), x: 1920, y: 500, width: 700, height: 100, type: 'GROUND' },
      { id: uid('blk'), x: 2100, y: 440, width: 36, height: 30, type: 'SPRING' },
      { id: uid('blk'), x: 2160, y: 250, width: 140, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 2200, y: 190, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'calc-1' },

      // Spikes & final bridge
      { id: uid('blk'), x: 2620, y: 520, width: 200, height: 80, type: 'LAVA' },
      { id: uid('blk'), x: 2660, y: 390, width: 110, height: 24, type: 'GROUND' },

      // Goal Fortress Gate
      { id: uid('blk'), x: 2820, y: 500, width: 580, height: 100, type: 'GROUND' },
      { id: uid('blk'), x: 3020, y: 380, width: 40, height: 120, type: 'MATH_GATE', mathQuestionId: 'seq-3' },

      // Flagpole
      { id: uid('blk'), x: 3200, y: 220, width: 40, height: 280, type: 'PORTAL_FLAG' }
    ],
    enemies: [
      {
        id: uid('enm'),
        type: 'PROBABILITY_GOLEM', // Emits 8-way ring danmaku!
        x: 500,
        y: 436,
        vx: -1.0,
        vy: 0,
        width: 48,
        height: 64,
        hp: 4,
        maxHp: 4,
        facing: 'left',
        patrolMinX: 350,
        patrolMaxX: 620,
        shootTimer: 80,
        mathBadge: 'P(A∩B)'
      },
      {
        id: uid('enm'),
        type: 'EXPONENTIAL_BAT',
        x: 1000,
        y: 280,
        vx: 1.8,
        vy: 0,
        width: 38,
        height: 30,
        hp: 2,
        maxHp: 2,
        facing: 'right',
        patrolMinX: 920,
        patrolMaxX: 1300,
        shootTimer: 0,
        mathBadge: 'C(n,k)'
      },
      {
        id: uid('enm'),
        type: 'PROBABILITY_GOLEM',
        x: 1400,
        y: 436,
        vx: 1.1,
        vy: 0,
        width: 48,
        height: 64,
        hp: 4,
        maxHp: 4,
        facing: 'right',
        patrolMinX: 1250,
        patrolMaxX: 1580,
        shootTimer: 75,
        mathBadge: 'E(X)'
      },
      {
        id: uid('enm'),
        type: 'CALCULUS_WIZARD',
        x: 2350,
        y: 440,
        vx: 0,
        vy: 0,
        width: 36,
        height: 44,
        hp: 3,
        maxHp: 3,
        facing: 'left',
        patrolMinX: 2250,
        patrolMaxX: 2480,
        shootTimer: 55,
        mathBadge: 'σ²'
      },
      {
        id: uid('enm'),
        type: 'PROBABILITY_GOLEM',
        x: 2920,
        y: 436,
        vx: -1.0,
        vy: 0,
        width: 48,
        height: 64,
        hp: 5,
        maxHp: 5,
        facing: 'left',
        patrolMinX: 2850,
        patrolMaxX: 3000,
        shootTimer: 70,
        mathBadge: 'P(A|B)'
      }
    ],
    coins: [
      { id: uid('coin'), x: 260, y: 440, width: 24, height: 24, symbol: 'P', value: 200, sparkleFrame: 0 },
      { id: uid('coin'), x: 740, y: 320, width: 24, height: 24, symbol: 'C', value: 220, sparkleFrame: 10 },
      { id: uid('coin'), x: 1240, y: 240, width: 24, height: 24, symbol: 'E', value: 250, sparkleFrame: 20 },
      { id: uid('coin'), x: 2180, y: 200, width: 24, height: 24, symbol: 'Ω', value: 300, sparkleFrame: 15 },
      { id: uid('coin'), x: 2700, y: 340, width: 24, height: 24, symbol: 'n!', value: 250, sparkleFrame: 25 }
    ]
  },

  // ==========================================
  // LEVEL 5: 微積分天際神殿與奇異點泰坦終極決戰 (Calculus Sky Apex & Boss)
  // ==========================================
  {
    id: 5,
    name: '第 5 關：微積分終極天際神殿',
    subtitle: '決戰奇異點泰坦！迎擊多重螺旋與環狀全彈幕爆發！',
    theme: 'sky',
    width: 3400,
    height: 600,
    startX: 100,
    startY: 420,
    portalX: 3200,
    portalY: 420,
    backgroundColor: '#1e1b4b', // Cosmic twilight
    blocks: [
      // Starting platform
      { id: uid('blk'), x: 0, y: 500, width: 500, height: 100, type: 'GROUND' },
      
      // High grade Question blocks
      { id: uid('blk'), x: 180, y: 350, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'calc-1' },
      { id: uid('blk'), x: 220, y: 350, width: 40, height: 40, type: 'QUESTION', content: 'STAR' },
      { id: uid('blk'), x: 260, y: 350, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'seq-2' },

      // Floating cloud platforms
      { id: uid('blk'), x: 550, y: 440, width: 90, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 700, y: 370, width: 90, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 860, y: 300, width: 110, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 900, y: 240, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'calc-2' },

      // Mid citadel sanctuary
      { id: uid('blk'), x: 1050, y: 480, width: 600, height: 120, type: 'GROUND' },
      { id: uid('blk'), x: 1200, y: 350, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'trig-4' },
      { id: uid('blk'), x: 1240, y: 350, width: 40, height: 40, type: 'BRICK' },
      { id: uid('blk'), x: 1280, y: 350, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'calc-3' },

      // Spring to boss arena
      { id: uid('blk'), x: 1600, y: 450, width: 36, height: 30, type: 'SPRING' },
      { id: uid('blk'), x: 1700, y: 300, width: 120, height: 24, type: 'GROUND' },
      { id: uid('blk'), x: 1740, y: 240, width: 40, height: 40, type: 'QUESTION', content: 'HEART' },

      // BOSS ARENA: x 1900 to 3400
      { id: uid('blk'), x: 1900, y: 500, width: 1500, height: 100, type: 'GROUND' },
      
      // Boss arena tactical platforms
      { id: uid('blk'), x: 2150, y: 370, width: 110, height: 20, type: 'GROUND' },
      { id: uid('blk'), x: 2420, y: 310, width: 130, height: 20, type: 'GROUND' },
      { id: uid('blk'), x: 2700, y: 370, width: 110, height: 20, type: 'GROUND' },

      // In-battle recharge question blocks!
      { id: uid('blk'), x: 2465, y: 230, width: 40, height: 40, type: 'QUESTION', content: 'MATH_QUESTION', mathQuestionId: 'calc-3' },

      // Victory Exit Flag (unlocks after defeating Boss!)
      { id: uid('blk'), x: 3200, y: 220, width: 40, height: 280, type: 'PORTAL_FLAG' }
    ],
    enemies: [
      {
        id: uid('enm'),
        type: 'EXPONENTIAL_BAT',
        x: 600,
        y: 280,
        vx: 1.5,
        vy: 0,
        width: 38,
        height: 30,
        hp: 2,
        maxHp: 2,
        facing: 'right',
        patrolMinX: 520,
        patrolMaxX: 800,
        shootTimer: 0,
        mathBadge: 'eˣ'
      },
      {
        id: uid('enm'),
        type: 'MATRIX_DRONE',
        x: 1150,
        y: 300,
        vx: -1.3,
        vy: 0,
        width: 40,
        height: 34,
        hp: 3,
        maxHp: 3,
        facing: 'left',
        patrolMinX: 1080,
        patrolMaxX: 1350,
        shootTimer: 60,
        mathBadge: '∇f'
      },
      {
        id: uid('enm'),
        type: 'CALCULUS_WIZARD',
        x: 1450,
        y: 430,
        vx: 0,
        vy: 0,
        width: 36,
        height: 44,
        hp: 4,
        maxHp: 4,
        facing: 'left',
        patrolMinX: 1400,
        patrolMaxX: 1550,
        shootTimer: 45,
        mathBadge: '∫f(x)'
      },
      // --- FINAL BOSS TITAN ---
      {
        id: 'BOSS_TITAN_FINAL',
        type: 'BOSS_TITAN',
        x: 2750,
        y: 380,
        vx: -1.8,
        vy: 0,
        width: 76,
        height: 88,
        hp: 20,
        maxHp: 20,
        facing: 'left',
        patrolMinX: 2080,
        patrolMaxX: 2950,
        shootTimer: 60,
        stateTimer: 0,
        danmakuAngle: 0,
        mathBadge: 'lim x→∞'
      }
    ],
    coins: [
      { id: uid('coin'), x: 740, y: 320, width: 24, height: 24, symbol: '∫', value: 250, sparkleFrame: 0 },
      { id: uid('coin'), x: 1240, y: 440, width: 24, height: 24, symbol: 'lim', value: 300, sparkleFrame: 10 },
      { id: uid('coin'), x: 2440, y: 440, width: 24, height: 24, symbol: '∞', value: 400, sparkleFrame: 20 },
      { id: uid('coin'), x: 2720, y: 320, width: 24, height: 24, symbol: 'Σ', value: 300, sparkleFrame: 15 }
    ]
  }
];
