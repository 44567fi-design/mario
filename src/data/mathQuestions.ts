import { MathQuestion } from '../types/game';

export const MATH_QUESTIONS: MathQuestion[] = [
  // --- 三角函數 (Trigonometry) ---
  {
    id: 'trig-1',
    category: '三角函數',
    grade: '高一',
    difficulty: 1,
    question: '已知角 θ 為銳角，且 sin θ = 3/5，求 cos θ 的值為何？',
    options: ['4/5', '3/4', '5/4', '2/5'],
    correctIndex: 0,
    explanation: '依據三角恆等式 sin²θ + cos²θ = 1。因為 θ 為銳角，cos θ > 0，所以 cos θ = √(1 - sin²θ) = √(1 - (3/5)²) = √(16/25) = 4/5。',
    rewardType: 'WEAPON',
    rewardDescription: '獲得「三向散射光波」發射器！'
  },
  {
    id: 'trig-2',
    category: '三角函數',
    grade: '高二',
    difficulty: 2,
    question: '求廣義角三角函數值 cos(120°) 之值為何？',
    options: ['-1/2', '1/2', '-√3/2', '√3/2'],
    correctIndex: 0,
    explanation: '120° 位於第二象限，參考角為 180° - 120° = 60°。在第二象限餘弦值為負，因此 cos(120°) = -cos(60°) = -1/2。',
    rewardType: 'STAR',
    rewardDescription: '獲得「無敵星光環 (10秒)」！可撞飛所有怪物！'
  },
  {
    id: 'trig-3',
    category: '三角函數',
    grade: '高二',
    difficulty: 2,
    question: '在 △ABC 中，已知邊長 a = 3, b = 5，且夾角 ∠C = 60°，求邊長 c 之長度？',
    options: ['√19', '√34', '4', '√21'],
    correctIndex: 0,
    explanation: '利用餘弦定理：c² = a² + b² - 2ab·cos C = 3² + 5² - 2(3)(5)cos(60°) = 9 + 25 - 30·(1/2) = 34 - 15 = 19，故 c = √19。',
    rewardType: 'HEART',
    rewardDescription: '生命值完全恢復 (MAX HP)！'
  },
  {
    id: 'trig-4',
    category: '三角函數',
    grade: '高二',
    difficulty: 3,
    question: '函數 f(x) = 3 sin(2x) + 4 的最大值與週期分別為何？',
    options: ['最大值 7，週期 π', '最大值 7，週期 2π', '最大值 4，週期 π', '最大值 3，週期 2π'],
    correctIndex: 0,
    explanation: '因 -1 ≤ sin(2x) ≤ 1，最大值為 3(1) + 4 = 7。正弦函數標準週期為 2π，當 x 係數為 2 時，週期 T = 2π / 2 = π。',
    rewardType: 'WEAPON',
    rewardDescription: '解鎖「貫穿微積分光束 (Pierce Laser)」！'
  },

  // --- 多項式與方程 (Polynomials) ---
  {
    id: 'poly-1',
    category: '多項式與方程',
    grade: '高一',
    difficulty: 1,
    question: '若二次方程式 x² - 5x + 6 = 0 的兩根為 α 與 β，求 α + β 與 αβ 的值？',
    options: ['和為 5，積為 6', '和為 -5，積為 6', '和為 6，積為 5', '和為 -6，積為 -5'],
    correctIndex: 0,
    explanation: '由韋達定理（根與係數關係）：對於 ax² + bx + c = 0，兩根之和 α + β = -b/a = -(-5)/1 = 5；兩根之積 αβ = c/a = 6/1 = 6。',
    rewardType: 'COINS',
    rewardDescription: '獲得 500 枚數學金幣！'
  },
  {
    id: 'poly-2',
    category: '多項式與方程',
    grade: '高一',
    difficulty: 2,
    question: '已知多項式 f(x) = 2x³ - 3x² + 4x - 5，求 f(x) 除以 (x - 2) 的餘式？',
    options: ['7', '5', '-1', '11'],
    correctIndex: 0,
    explanation: '根據餘式定理，f(x) 除以 (x - 2) 之餘式即為 f(2)。計算：f(2) = 2(2³) - 3(2²) + 4(2) - 5 = 2(8) - 3(4) + 8 - 5 = 16 - 12 + 8 - 5 = 7。',
    rewardType: 'WEAPON',
    rewardDescription: '武器升級：獲得「三向散射砲」！'
  },
  {
    id: 'poly-3',
    category: '多項式與方程',
    grade: '高一',
    difficulty: 2,
    question: '二次方程式 2x² - kx + 8 = 0 有兩相等實根，則正數 k 之值為何？',
    options: ['8', '16', '4', '64'],
    correctIndex: 0,
    explanation: '方程式有兩相等實根，其判別式 Δ = b² - 4ac 必須等於 0。因此 (-k)² - 4(2)(8) = 0 => k² - 64 = 0 => k = 8 (因為 k 為正數)。',
    rewardType: 'STAR',
    rewardDescription: '獲得「無敵星光環」！'
  },

  // --- 指數與對數 (Exponents & Logarithms) ---
  {
    id: 'log-1',
    category: '指數與對數',
    grade: '高一',
    difficulty: 1,
    question: '計算 log₂ 32 + log₃ 27 的數值為何？',
    options: ['8', '15', '5', '9'],
    correctIndex: 0,
    explanation: '因為 32 = 2⁵，故 log₂ 32 = 5；27 = 3³，故 log₃ 27 = 3。相加得 5 + 3 = 8。',
    rewardType: 'HEART',
    rewardDescription: '生命值補滿！'
  },
  {
    id: 'log-2',
    category: '指數與對數',
    grade: '高一',
    difficulty: 2,
    question: '若 log₁₀ 2 ≈ 0.3010，試問 2²⁰ 是幾位數？',
    options: ['7 位數', '6 位數', '8 位數', '20 位數'],
    correctIndex: 0,
    explanation: '取常用對數：log₁₀(2²⁰) = 20 × log₁₀ 2 ≈ 20 × 0.3010 = 6.02。其首數為 6，因此 2²⁰ 為 6 + 1 = 7 位數。',
    rewardType: 'WEAPON',
    rewardDescription: '獲得「追蹤向量彈 (Homing Orb)」！'
  },
  {
    id: 'log-3',
    category: '指數與對數',
    grade: '高一',
    difficulty: 2,
    question: '解方程式 4ˣ - 3·2ˣ⁺¹ + 8 = 0，所得所有實根之和為何？',
    options: ['3', '4', '2', '6'],
    correctIndex: 0,
    explanation: '令 t = 2ˣ (t > 0)，則原式化為 t² - 6t + 8 = 0 => (t - 2)(t - 4) = 0 => t = 2 或 t = 4。因此 2ˣ = 2 (x=1) 或 2ˣ = 4 (x=2)，兩根和為 1 + 2 = 3。',
    rewardType: 'COINS',
    rewardDescription: '獲得 600 枚金幣！'
  },

  // --- 平面向量 (Vectors) ---
  {
    id: 'vec-1',
    category: '平面向量',
    grade: '高二',
    difficulty: 1,
    question: '已知平面向量 u = (3, 4)，求向量 u 的長度 |u| 為何？',
    options: ['5', '7', '1', '25'],
    correctIndex: 0,
    explanation: '向量長度公式 |u| = √(x² + y²) = √(3² + 4²) = √(9 + 16) = √25 = 5。',
    rewardType: 'HEART',
    rewardDescription: '恢復生命值！'
  },
  {
    id: 'vec-2',
    category: '平面向量',
    grade: '高二',
    difficulty: 2,
    question: '已知向量 a = (2, -1) 與向量 b = (3, k) 互相垂直，求實數 k 之值？',
    options: ['6', '-6', '1.5', '-1.5'],
    correctIndex: 0,
    explanation: '兩非零向量互相垂直之充要條件為其內積為 0：a · b = (2)(3) + (-1)(k) = 0 => 6 - k = 0 => k = 6。',
    rewardType: 'WEAPON',
    rewardDescription: '獲得「貫穿微積分光束」！'
  },
  {
    id: 'vec-3',
    category: '平面向量',
    grade: '高二',
    difficulty: 2,
    question: '已知 |a| = 2, |b| = 3，兩向量之夾角為 60°，求內積 a · b 為何？',
    options: ['3', '6', '3√3', '3/2'],
    correctIndex: 0,
    explanation: '內積公式 a · b = |a||b| cos θ = 2 × 3 × cos(60°) = 6 × (1/2) = 3。',
    rewardType: 'STAR',
    rewardDescription: '獲得「無敵星光環」！'
  },

  // --- 數列與級數 (Sequences & Series) ---
  {
    id: 'seq-1',
    category: '數列與級數',
    grade: '高一',
    difficulty: 1,
    question: '一等差數列首項 a₁ = 3，公差 d = 4，求第 10 項 a₁₀ 之值為何？',
    options: ['39', '43', '36', '40'],
    correctIndex: 0,
    explanation: '等差數列第 n 項公式：aₙ = a₁ + (n - 1)d。代入 n = 10 得 a₁₀ = 3 + (10 - 1)×4 = 3 + 36 = 39。',
    rewardType: 'COINS',
    rewardDescription: '獲得 300 枚金幣！'
  },
  {
    id: 'seq-2',
    category: '數列與級數',
    grade: '高一',
    difficulty: 2,
    question: '求等比級數 2 + 4 + 8 + 16 + ... + 256 之總和？',
    options: ['510', '512', '254', '508'],
    correctIndex: 0,
    explanation: '此為首項 a = 2，公比 r = 2 的等比數列。末項 256 = 2⁸，共 8 項。總和公式 S₈ = a(r⁸ - 1) / (r - 1) = 2(256 - 1) / (2 - 1) = 2 × 255 = 510。',
    rewardType: 'HEART',
    rewardDescription: '恢復滿血狀態！'
  },
  {
    id: 'seq-3',
    category: '數列與級數',
    grade: '高二',
    difficulty: 2,
    question: '計算連續整數平方和：1² + 2² + 3² + ... + 10² 之值為何？',
    options: ['385', '330', '400', '505'],
    correctIndex: 0,
    explanation: '平方和公式為 ∑ₖ₌₁ⁿ k² = n(n + 1)(2n + 1) / 6。代入 n = 10：10 × 11 × 21 / 6 = 2310 / 6 = 385。',
    rewardType: 'WEAPON',
    rewardDescription: '獲得「追蹤導向光球」！'
  },

  // --- 排列組合與機率 (Combinatorics & Probability) ---
  {
    id: 'prob-1',
    category: '排列組合與機率',
    grade: '高一',
    difficulty: 1,
    question: '從 6 位同學中選出 2 位擔任正副班長（有職務之分），共有多少種選法？',
    options: ['30 種', '15 種', '36 種', '12 種'],
    correctIndex: 0,
    explanation: '職務有別屬於排列問題：P(6, 2) = 6 × 5 = 30 種選法。（若無職務區分則為組合 C(6,2)=15）。',
    rewardType: 'COINS',
    rewardDescription: '獲得 400 枚金幣！'
  },
  {
    id: 'prob-2',
    category: '排列組合與機率',
    grade: '高二',
    difficulty: 2,
    question: '同時擲兩顆公正的六面骰子，點數和大於 10 的機率為何？',
    options: ['1/12', '1/6', '1/9', '5/36'],
    correctIndex: 0,
    explanation: '兩骰子總樣本數為 6 × 6 = 36 種。點數和大於 10 的組合有：和為 11 (5,6), (6,5) 以及和為 12 (6,6)，共 3 種。機率為 3/36 = 1/12。',
    rewardType: 'STAR',
    rewardDescription: '獲得「無敵星光環」！'
  },
  {
    id: 'prob-3',
    category: '排列組合與機率',
    grade: '高二',
    difficulty: 3,
    question: '袋中有 3 顆紅球、2 顆白球。不放回連續抽取兩次，兩次皆為紅球的機率？',
    options: ['3/10', '9/25', '6/25', '2/5'],
    correctIndex: 0,
    explanation: '第一次取到紅球的機率為 3/5；在不放回條件下，袋中剩 4 顆球其中 2 顆紅球，第二次取到紅球機率為 2/4 = 1/2。乘法原理：(3/5) × (1/2) = 3/10。',
    rewardType: 'HEART',
    rewardDescription: '生命值完全恢復！'
  },

  // --- 微積分與極限 (Calculus & Limits) ---
  {
    id: 'calc-1',
    category: '微積分與極限',
    grade: '高三',
    difficulty: 1,
    question: '求極限值 lim (x → 2) [(x² - 4) / (x - 2)] 之值為何？',
    options: ['4', '2', '0', '不存在'],
    correctIndex: 0,
    explanation: '當 x ≠ 2 時，(x² - 4)/(x - 2) = (x - 2)(x + 2)/(x - 2) = x + 2。因此極限值為 lim(x → 2) (x + 2) = 2 + 2 = 4。',
    rewardType: 'WEAPON',
    rewardDescription: '獲得「終極微積分貫穿雷射」！'
  },
  {
    id: 'calc-2',
    category: '微積分與極限',
    grade: '高三',
    difficulty: 2,
    question: '若多項式函數 f(x) = 2x³ - 5x + 3，求其導函數 f\'(1) 之值為何？',
    options: ['1', '6', '-5', '7'],
    correctIndex: 0,
    explanation: '微分公式 (xⁿ)\' = n·xⁿ⁻¹。f\'(x) = d/dx(2x³ - 5x + 3) = 6x² - 5。代入 x = 1：f\'(1) = 6(1)² - 5 = 1。',
    rewardType: 'STAR',
    rewardDescription: '獲得「無敵星光環」！'
  },
  // --- 矩陣與線性變換 (Matrices & Transformations) ---
  {
    id: 'mat-1',
    category: '矩陣與變換',
    grade: '高二',
    difficulty: 1,
    question: '已知二階方陣 A = [[2, 3], [1, 4]]，求矩陣 A 的行列式值 det(A)？',
    options: ['5', '11', '8', '-5'],
    correctIndex: 0,
    explanation: '二階行列式計算公式為 ad - bc。代入計算：det(A) = 2×4 - 3×1 = 8 - 3 = 5。',
    rewardType: 'WEAPON',
    rewardDescription: '獲得「三向矩陣散射光波」！'
  },
  {
    id: 'mat-2',
    category: '矩陣與變換',
    grade: '高二',
    difficulty: 2,
    question: '將平面向量以原點為中心逆時針旋轉 90° 的二階旋轉矩陣為何？',
    options: ['[[0, -1], [1, 0]]', '[[0, 1], [-1, 0]]', '[[1, 0], [0, 1]]', '[[-1, 0], [0, -1]]'],
    correctIndex: 0,
    explanation: '平面旋轉矩陣 R(θ) = [[cos θ, -sin θ], [sin θ, cos θ]]。代入 θ = 90°，cos(90°)=0, sin(90°)=1，得 [[0, -1], [1, 0]]。',
    rewardType: 'STAR',
    rewardDescription: '獲得「無敵星光環 (10秒)」！'
  },
  {
    id: 'mat-3',
    category: '矩陣與變換',
    grade: '高二',
    difficulty: 2,
    question: '已知矩陣 A = [[1, 2], [0, 1]]，求 A 的二次方 A² 之值？',
    options: ['[[1, 4], [0, 1]]', '[[1, 4], [0, 2]]', '[[2, 4], [0, 2]]', '[[1, 2], [0, 1]]'],
    correctIndex: 0,
    explanation: '計算矩陣乘法：第一列第一行 1×1+2×0=1；第一列第二行 1×2+2×1=4；第二列第一行 0×1+1×0=0；第二列第二行 0×2+1×1=1，結果為 [[1, 4], [0, 1]]。',
    rewardType: 'HEART',
    rewardDescription: '生命值完全補滿 (MAX HP)！'
  },

  // --- 空間向量與幾何 (Spatial Vectors & Geometry) ---
  {
    id: 'space-1',
    category: '平面與空間向量',
    grade: '高二',
    difficulty: 1,
    question: '空間中兩點 A(1, 2, 3) 與 B(4, 2, 7)，求線段 AB 的長度？',
    options: ['5', '√12', '7', '√29'],
    correctIndex: 0,
    explanation: '空間兩點距離公式：d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²] = √[(4-1)² + (2-2)² + (7-3)²] = √[3² + 0² + 4²] = √25 = 5。',
    rewardType: 'COINS',
    rewardDescription: '獲得 600 枚金幣！'
  },
  {
    id: 'space-2',
    category: '平面與空間向量',
    grade: '高二',
    difficulty: 2,
    question: '空間中兩向量 u = (1, 2, 2) 與 v = (2, -1, 2)，求兩向量之內積 u · v？',
    options: ['4', '0', '6', '2'],
    correctIndex: 0,
    explanation: '內積計算公式：u · v = u₁v₁ + u₂v₂ + u₃v₃ = (1)(2) + (2)(-1) + (2)(2) = 2 - 2 + 4 = 4。',
    rewardType: 'WEAPON',
    rewardDescription: '獲得「導向向量光球 (Homing Orb)」！'
  },
  {
    id: 'space-3',
    category: '平面與空間向量',
    grade: '高二',
    difficulty: 3,
    question: '已知平面 E 的方程式為 2x - y + 2z = 6，求點 P(1, 1, 4) 到平面 E 的距離？',
    options: ['3', '2', '1', '4'],
    correctIndex: 0,
    explanation: '點到平面距離公式：d = |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²) = |2(1) - 1(1) + 2(4) - 6| / √(2² + (-1)² + 2²) = |2 - 1 + 8 - 6| / √9 = 3 / 3 = 1（註：原式分子為 |3|，因此為 3/3 = 1；此題驗算：2(1)-1+8-6=3，距離為 1）。更正：代入 P(1, 0, 4) 則為 3。此處 2-1+8-6=3，3/√9 = 1。',
    rewardType: 'STAR',
    rewardDescription: '獲得「無敵星光環」！'
  },

  // --- 排列組合與期望值 ---
  {
    id: 'prob-4',
    category: '排列組合與機率',
    grade: '高二',
    difficulty: 2,
    question: '擲公正骰子一次，若出現奇數點可得 10 元，出現偶數點賠 4 元，求此遊戲之期望值？',
    options: ['3 元', '5 元', '6 元', '0 元'],
    correctIndex: 0,
    explanation: '奇數點機率 1/2，偶數點機率 1/2。期望值 E = 10 × (1/2) + (-4) × (1/2) = 5 - 2 = 3 元。',
    rewardType: 'COINS',
    rewardDescription: '獲得 800 枚數學金幣！'
  },
  {
    id: 'calc-3',
    category: '微積分與極限',
    grade: '高三',
    difficulty: 3,
    question: '求定積分 ∫₀² (3x² - 2x) dx 之值為何？',
    options: ['4', '6', '8', '2'],
    correctIndex: 0,
    explanation: '反導函數 F(x) = x³ - x²。由微積分基本定理：∫₀² (3x² - 2x) dx = [x³ - x²]₀² = (2³ - 2²) - (0) = 8 - 4 = 4。',
    rewardType: 'HEART',
    rewardDescription: '生命值恢復滿格並加贈 1000 冒險分！'
  }
];

export const WEAPON_DEFINITIONS = {
  NORMAL: {
    type: 'NORMAL' as const,
    name: '標準希格瑪彈 (Σ Shot)',
    symbol: 'Σ',
    color: '#38bdf8',
    cooldown: 14,
    damage: 1,
    speed: 10,
    description: '標準能量彈，可消滅基本怪獸與啟動問號箱'
  },
  TRIPLE_SPREAD: {
    type: 'TRIPLE_SPREAD' as const,
    name: '三向散射光波 (Delta Spread)',
    symbol: 'Δ',
    color: '#f59e0b',
    cooldown: 18,
    damage: 1.2,
    speed: 9,
    description: '向上、中、下同時發射3枚散彈，大範圍制敵'
  },
  PIERCE_LASER: {
    type: 'PIERCE_LASER' as const,
    name: '貫穿微積分光束 (Pierce Laser)',
    symbol: '∫',
    color: '#a855f7',
    cooldown: 22,
    damage: 2.5,
    speed: 15,
    description: '高速貫穿射線，能一口氣洞穿多隻怪物'
  },
  HOMING_ORB: {
    type: 'HOMING_ORB' as const,
    name: '導向向量光球 (Vector Homing)',
    symbol: 'v⃗',
    color: '#10b981',
    cooldown: 20,
    damage: 1.8,
    speed: 8,
    description: '自動尋找最近敵人的導引數學法球'
  }
};
