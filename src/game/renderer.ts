import { Player, Block, Enemy, Projectile, CoinItem, Particle, LevelData } from '../types/game';

// Stable cloud definitions with fixed Y to completely eliminate twitching/jittering
const STABLE_CLOUDS = [
  { x: 120, y: 55, scale: 1.1, opacity: 0.8 },
  { x: 480, y: 90, scale: 0.9, opacity: 0.7 },
  { x: 860, y: 45, scale: 1.3, opacity: 0.85 },
  { x: 1240, y: 80, scale: 0.85, opacity: 0.75 },
  { x: 1620, y: 50, scale: 1.15, opacity: 0.8 },
  { x: 2000, y: 95, scale: 1.0, opacity: 0.7 },
  { x: 2380, y: 60, scale: 1.25, opacity: 0.85 },
  { x: 2760, y: 85, scale: 0.95, opacity: 0.75 }
];

export function renderGame(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  player: Player,
  level: LevelData,
  blocks: Block[],
  enemies: Enemy[],
  projectiles: Projectile[],
  coins: CoinItem[],
  particles: Particle[],
  cameraX: number,
  cameraY: number,
  gameTime: number
) {
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 1. Draw Parallax Background
  drawBackground(ctx, canvasWidth, canvasHeight, level, cameraX, gameTime);

  // Apply camera translation
  ctx.save();
  ctx.translate(-Math.floor(cameraX), -Math.floor(cameraY));

  // 2. Draw Mathematical Background Grid / Formulas
  drawMathMotifs(ctx, cameraX, canvasWidth, level.height, gameTime);

  // 3. Draw Blocks & Terrain
  for (const b of blocks) {
    if (b.x + b.width < cameraX - 60 || b.x > cameraX + canvasWidth + 60) continue;
    drawBlock(ctx, b, level.theme, gameTime);
  }

  // 4. Draw Collectibles (Coins)
  for (const c of coins) {
    if (c.collected) continue;
    if (c.x + c.width < cameraX - 50 || c.x > cameraX + canvasWidth + 50) continue;
    drawCoin(ctx, c, gameTime);
  }

  // 5. Draw Enemies
  for (const e of enemies) {
    if (e.hp <= 0) continue;
    if (e.x + e.width < cameraX - 90 || e.x > cameraX + canvasWidth + 90) continue;
    drawEnemy(ctx, e, gameTime);
  }

  // 6. Draw Danmaku & Projectiles (Trails + Luminous glow)
  for (const p of projectiles) {
    drawProjectile(ctx, p, gameTime);
  }

  // 7. Draw Player
  drawPlayer(ctx, player, gameTime);

  // 8. Draw Particles, Shockwaves & Formula Numbers
  drawParticles(ctx, particles);

  ctx.restore();
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  level: LevelData,
  cameraX: number,
  time: number
) {
  if (level.theme === 'grassland') {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.7, '#bae6fd');
    skyGrad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Far mountains (parallax 0.15)
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    const mtnOffset = -(cameraX * 0.15) % 400;
    for (let x = -400 + mtnOffset; x < w + 400; x += 300) {
      ctx.moveTo(x, h - 80);
      ctx.lineTo(x + 150, h - 260);
      ctx.lineTo(x + 300, h - 80);
    }
    ctx.fill();

    // Near hills (parallax 0.3)
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    const hillOffset = -(cameraX * 0.3) % 350;
    for (let x = -350 + hillOffset; x < w + 350; x += 220) {
      ctx.arc(x + 110, h - 60, 130, Math.PI, 0);
    }
    ctx.fill();

    // Smooth stable non-twitching drifting clouds
    const loopSpan = 3000;
    for (const c of STABLE_CLOUDS) {
      const screenX = ((c.x - cameraX * 0.12 + time * 0.25) % loopSpan + loopSpan) % loopSpan - 180;
      if (screenX >= -160 && screenX <= w + 160) {
        drawCloud(ctx, screenX, c.y, c.scale, c.opacity);
      }
    }
  } else if (level.theme === 'cave') {
    // Cavern dark gradient
    const caveGrad = ctx.createLinearGradient(0, 0, 0, h);
    caveGrad.addColorStop(0, '#090d16');
    caveGrad.addColorStop(0.8, '#0f172a');
    caveGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = caveGrad;
    ctx.fillRect(0, 0, w, h);

    // Cavern crystal stalactites & background rocks
    ctx.fillStyle = '#1e293b';
    const rockOffset = -(cameraX * 0.2) % 300;
    for (let x = -300 + rockOffset; x < w + 300; x += 150) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 40, 120 + Math.sin((x + 1000) * 0.05) * 40);
      ctx.lineTo(x + 80, 0);
      ctx.fill();
    }

    // Glowing crystal nodes
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 8;
    for (let i = 0; i < 8; i++) {
      const px = ((i * 180 - cameraX * 0.3) % (w + 200) + w + 200) % (w + 200) - 100;
      const py = 120 + ((i * 47) % 200);
      ctx.fillRect(px, py, 4, 8);
    }
    ctx.shadowBlur = 0;
  } else if (level.theme === 'islands') {
    // High-altitude turquoise sky gradient
    const islGrad = ctx.createLinearGradient(0, 0, 0, h);
    islGrad.addColorStop(0, '#064e3b'); // deep emerald
    islGrad.addColorStop(0.5, '#047857');
    islGrad.addColorStop(1, '#a7f3d0');
    ctx.fillStyle = islGrad;
    ctx.fillRect(0, 0, w, h);

    // Distant floating aerial islands
    ctx.fillStyle = 'rgba(6, 78, 59, 0.5)';
    const islOffset = -(cameraX * 0.15) % 450;
    for (let x = -450 + islOffset; x < w + 450; x += 280) {
      ctx.beginPath();
      ctx.arc(x + 80, 220, 60, Math.PI, 0);
      ctx.lineTo(x + 80, 260);
      ctx.fill();
    }

    // High altitude golden aura clouds
    const loopSpan = 3000;
    for (const c of STABLE_CLOUDS) {
      const screenX = ((c.x - cameraX * 0.1 + time * 0.3) % loopSpan + loopSpan) % loopSpan - 180;
      if (screenX >= -160 && screenX <= w + 160) {
        drawCloud(ctx, screenX, c.y + 20, c.scale, 0.45);
      }
    }
  } else if (level.theme === 'fortress') {
    // Molten lava fortress dark crimson gradient
    const fortGrad = ctx.createLinearGradient(0, 0, 0, h);
    fortGrad.addColorStop(0, '#1c1917');
    fortGrad.addColorStop(0.6, '#450a0a');
    fortGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = fortGrad;
    ctx.fillRect(0, 0, w, h);

    // Distant obsidian fortress battlements
    ctx.fillStyle = '#292524';
    const fortOffset = -(cameraX * 0.2) % 360;
    for (let x = -360 + fortOffset; x < w + 360; x += 180) {
      ctx.fillRect(x, h - 240, 70, 160);
      ctx.fillRect(x + 10, h - 260, 20, 20);
      ctx.fillRect(x + 40, h - 260, 20, 20);
    }

    // Rising magma sparks
    ctx.fillStyle = '#f97316';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 6;
    for (let i = 0; i < 20; i++) {
      const px = ((i * 87 - cameraX * 0.25 + time * 0.5) % (w + 100) + w + 100) % (w + 100) - 50;
      const py = (h - ((time * 1.5 + i * 45) % (h * 0.8)));
      ctx.fillRect(px, py, 3, 3);
    }
    ctx.shadowBlur = 0;
  } else {
    // Sky Citadel twilight cosmic gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(0.5, '#1e1b4b');
    skyGrad.addColorStop(1, '#4338ca');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Twinkling cosmos stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137 - cameraX * 0.05) % w + w) % w;
      const sy = (i * 89) % (h * 0.7);
      const twinkle = Math.sin(time * 0.08 + i) * 0.5 + 0.5;
      ctx.globalAlpha = twinkle * 0.8 + 0.2;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1.0;

    // Distant floating geometric temples
    ctx.fillStyle = 'rgba(79, 70, 229, 0.4)';
    const castleOffset = -(cameraX * 0.15) % 500;
    for (let x = -500 + castleOffset; x < w + 500; x += 350) {
      ctx.fillRect(x + 50, h - 220, 120, 140);
      ctx.beginPath();
      ctx.moveTo(x + 30, h - 220);
      ctx.lineTo(x + 110, h - 300);
      ctx.lineTo(x + 190, h - 220);
      ctx.fill();
    }
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number = 1.0, opacity: number = 0.8) {
  ctx.save();
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.beginPath();
  ctx.arc(x, y, 22 * scale, 0, Math.PI * 2);
  ctx.arc(x + 18 * scale, y - 10 * scale, 26 * scale, 0, Math.PI * 2);
  ctx.arc(x + 42 * scale, y, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 22 * scale, y + 10 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMathMotifs(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  canvasWidth: number,
  height: number,
  time: number
) {
  ctx.save();
  ctx.font = '12px "Press Start 2P", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  const symbols = ['f(x)=ax²+bx+c', 'sin²θ+cos²θ=1', 'det(A)=ad-bc', 'u⃗·v⃗=|u||v|cosθ', 'e^(iπ)+1=0', '∫f(x)dx', 'lim x→∞', 'P(A|B)=P(AB)/P(B)'];
  const startIdx = Math.floor(cameraX / 300);
  for (let i = startIdx - 1; i <= startIdx + Math.ceil(canvasWidth / 300) + 1; i++) {
    const sym = symbols[Math.abs(i) % symbols.length];
    const px = i * 320;
    const py = 120 + ((Math.abs(i) * 73) % (height - 240));
    ctx.fillText(sym, px, py);
  }
  ctx.restore();
}

function drawBlock(ctx: CanvasRenderingContext2D, b: Block, theme: string, time: number) {
  const bump = b.bumpOffset || 0;
  const drawY = b.y + bump;

  if (b.type === 'GROUND') {
    if (theme === 'grassland') {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(b.x, drawY, b.width, 10);
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(b.x, drawY + 10, b.width, b.height - 10);
      ctx.fillStyle = '#713f12';
      for (let x = b.x + 8; x < b.x + b.width - 8; x += 24) {
        ctx.fillRect(x, drawY + 18, 6, 6);
        ctx.fillRect(x + 12, drawY + 36, 6, 6);
      }
    } else if (theme === 'cave') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(b.x, drawY, b.width, 6);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(b.x, drawY + 6, b.width, b.height - 6);
      ctx.fillStyle = '#0f172a';
      for (let x = b.x + 10; x < b.x + b.width - 10; x += 30) {
        ctx.fillRect(x, drawY + 16, 8, 8);
      }
    } else if (theme === 'islands') {
      // Floating emerald islands
      ctx.fillStyle = '#34d399';
      ctx.fillRect(b.x, drawY, b.width, 8);
      ctx.fillStyle = '#065f46';
      ctx.fillRect(b.x, drawY + 8, b.width, b.height - 8);
    } else if (theme === 'fortress') {
      // Dark volcanic obsidian
      ctx.fillStyle = '#78350f';
      ctx.fillRect(b.x, drawY, b.width, 6);
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(b.x, drawY + 6, b.width, b.height - 6);
    } else {
      // Sky citadel golden marble
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(b.x, drawY, b.width, 6);
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(b.x, drawY + 6, b.width, b.height - 6);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(b.x, drawY, b.width, b.height);
  } else if (b.type === 'LAVA') {
    // Molten lava pool
    const bubble = Math.sin(time * 0.15 + b.x) * 3;
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(b.x, drawY, b.width, b.height);
    // Glowing lava surface
    ctx.fillStyle = '#facc15';
    ctx.fillRect(b.x, drawY, b.width, 6 + bubble);
    // Magma heat glow
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 12;
    ctx.fillRect(b.x, drawY, b.width, 4);
    ctx.shadowBlur = 0;
  } else if (b.type === 'QUESTION') {
    if (b.activated) {
      ctx.fillStyle = '#78716c';
      ctx.fillRect(b.x, drawY, b.width, b.height);
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, drawY, b.width, b.height);
      ctx.fillStyle = '#44403c';
      ctx.fillRect(b.x + 4, drawY + 4, 3, 3);
      ctx.fillRect(b.x + b.width - 7, drawY + 4, 3, 3);
      ctx.fillRect(b.x + 4, drawY + b.height - 7, 3, 3);
      ctx.fillRect(b.x + b.width - 7, drawY + b.height - 7, 3, 3);
    } else {
      const pulse = Math.sin(time * 0.1) * 0.15 + 0.85;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(b.x, drawY, b.width, b.height);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(b.x + 2, drawY + 2, b.width - 4, 4);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(b.x, drawY, b.width, b.height);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8 * pulse;
      ctx.fillText('?', b.x + b.width / 2, drawY + b.height / 2 + 1);
      ctx.shadowBlur = 0;
    }
  } else if (b.type === 'BRICK') {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(b.x, drawY, b.width, b.height);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, drawY, b.width, b.height);
    ctx.strokeStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(b.x, drawY + b.height / 2);
    ctx.lineTo(b.x + b.width, drawY + b.height / 2);
    ctx.moveTo(b.x + b.width / 2, drawY);
    ctx.lineTo(b.x + b.width / 2, drawY + b.height / 2);
    ctx.stroke();
  } else if (b.type === 'SPRING') {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(b.x + 4, drawY + b.height - 8, b.width - 8, 8);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(b.x + 2, drawY, b.width - 4, 8);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.x + 8, drawY + 8);
    ctx.lineTo(b.x + b.width - 8, drawY + 14);
    ctx.lineTo(b.x + 8, drawY + 20);
    ctx.lineTo(b.x + b.width - 8, drawY + b.height - 8);
    ctx.stroke();
  } else if (b.type === 'SPIKE') {
    ctx.fillStyle = '#ef4444';
    const spikeCount = Math.floor(b.width / 16);
    for (let i = 0; i < spikeCount; i++) {
      const sx = b.x + i * 16;
      ctx.beginPath();
      ctx.moveTo(sx, drawY + b.height);
      ctx.lineTo(sx + 8, drawY);
      ctx.lineTo(sx + 16, drawY + b.height);
      ctx.fill();
    }
  } else if (b.type === 'MATH_GATE') {
    ctx.fillStyle = b.activated ? '#10b981' : '#6366f1';
    ctx.fillRect(b.x, drawY, b.width, b.height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, drawY, b.width, b.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('門', b.x + b.width / 2, drawY + 28);
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText(b.activated ? '開' : '鎖', b.x + b.width / 2, drawY + 60);
  } else if (b.type === 'PORTAL_FLAG') {
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(b.x - 10, drawY + b.height - 30, 60, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(b.x + 16, drawY, 8, b.height - 30);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(b.x + 20, drawY, 10, 0, Math.PI * 2);
    ctx.fill();
    const wave = Math.sin(time * 0.12) * 5;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(b.x + 24, drawY + 15);
    ctx.lineTo(b.x + 75 + wave, drawY + 35);
    ctx.lineTo(b.x + 24, drawY + 55);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('π', b.x + 46 + wave / 2, drawY + 38);
  }
}

function drawCoin(ctx: CanvasRenderingContext2D, c: CoinItem, time: number) {
  const bob = Math.sin(time * 0.1 + c.x) * 3;
  const drawY = c.y + bob;

  ctx.save();
  ctx.fillStyle = '#f59e0b';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(c.x + c.width / 2, drawY + c.height / 2, c.width / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(c.x + c.width / 2, drawY + c.height / 2, c.width / 2 - 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(c.symbol, c.x + c.width / 2, drawY + c.height / 2 + 1);
  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, time: number) {
  ctx.save();

  if (e.type === 'POLYNOMIAL_SLIME') {
    const squish = Math.sin(time * 0.15 + e.x) * 2;
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.ellipse(
      e.x + e.width / 2,
      e.y + e.height / 2 + squish / 2,
      e.width / 2,
      e.height / 2 - squish / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    const eyeOffset = e.facing === 'right' ? 3 : -3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(e.x + 10 + eyeOffset, e.y + 10, 6, 8);
    ctx.fillRect(e.x + 20 + eyeOffset, e.y + 10, 6, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(e.x + 12 + eyeOffset, e.y + 12, 3, 5);
    ctx.fillRect(e.x + 22 + eyeOffset, e.y + 12, 3, 5);
  } else if (e.type === 'TRIG_TURTLE') {
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(e.x + e.width / 2, e.y + e.height / 2 + 2, e.width / 2, Math.PI, 0);
    ctx.lineTo(e.x + e.width, e.y + e.height - 4);
    ctx.lineTo(e.x, e.y + e.height - 4);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(e.x - 2, e.y + e.height - 8, e.width + 4, 6);
    const headX = e.facing === 'right' ? e.x + e.width - 4 : e.x - 8;
    ctx.fillStyle = '#34d399';
    ctx.fillRect(headX, e.y + 8, 12, 12);
    ctx.fillStyle = '#000000';
    ctx.fillRect(headX + (e.facing === 'right' ? 6 : 2), e.y + 11, 3, 3);
  } else if (e.type === 'VECTOR_HEDGEHOG') {
    ctx.fillStyle = '#f97316';
    ctx.fillRect(e.x + 4, e.y + 14, e.width - 8, e.height - 14);
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(e.x + 2, e.y + 14);
    ctx.lineTo(e.x + 8, e.y + 2);
    ctx.lineTo(e.x + 14, e.y + 14);
    ctx.lineTo(e.x + 20, e.y + 2);
    ctx.lineTo(e.x + 26, e.y + 14);
    ctx.lineTo(e.x + 32, e.y + 2);
    ctx.lineTo(e.x + 36, e.y + 14);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(e.x + (e.facing === 'right' ? 20 : 8), e.y + 18, 5, 5);
    ctx.fillStyle = '#000000';
    ctx.fillRect(e.x + (e.facing === 'right' ? 22 : 9), e.y + 19, 2, 3);
  } else if (e.type === 'EXPONENTIAL_BAT') {
    const flap = Math.sin(time * 0.25) * 8;
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(e.x + e.width / 2, e.y + e.height / 2, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(e.x + e.width / 2 - 8, e.y + e.height / 2);
    ctx.lineTo(e.x, e.y + 6 + flap);
    ctx.lineTo(e.x + 6, e.y + e.height / 2 + 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(e.x + e.width / 2 + 8, e.y + e.height / 2);
    ctx.lineTo(e.x + e.width, e.y + 6 + flap);
    ctx.lineTo(e.x + e.width - 6, e.y + e.height / 2 + 8);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(e.x + e.width / 2 - 4, e.y + e.height / 2 - 3, 3, 3);
    ctx.fillRect(e.x + e.width / 2 + 2, e.y + e.height / 2 - 3, 3, 3);
  } else if (e.type === 'MATRIX_DRONE') {
    // Sci-Fi Matrix Drone
    ctx.fillStyle = '#065f46';
    ctx.fillRect(e.x + 6, e.y + 8, e.width - 12, e.height - 16);
    // Gyro Ring
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(e.x + e.width / 2, e.y + e.height / 2, e.width / 2 + 2, 8, time * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    // Glowing Ocular Lens
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(e.x + e.width / 2, e.y + e.height / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (e.type === 'PROBABILITY_GOLEM') {
    // Volcanic Stone Golem
    ctx.fillStyle = '#44403c';
    ctx.fillRect(e.x + 6, e.y + 12, e.width - 12, e.height - 16);
    // Glowing fiery core
    ctx.fillStyle = '#f97316';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 8;
    ctx.fillRect(e.x + 14, e.y + 24, e.width - 28, 16);
    ctx.shadowBlur = 0;
    // Golem glowing eyes
    ctx.fillStyle = '#facc15';
    ctx.fillRect(e.x + 12, e.y + 16, 6, 4);
    ctx.fillRect(e.x + e.width - 18, e.y + 16, 6, 4);
  } else if (e.type === 'CALCULUS_WIZARD') {
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(e.x + 6, e.y + 14, e.width - 12, e.height - 14);
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.moveTo(e.x + 2, e.y + 14);
    ctx.lineTo(e.x + e.width / 2, e.y);
    ctx.lineTo(e.x + e.width - 2, e.y + 14);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(e.x + 10, e.y + 22, e.width - 20, 10);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(e.x + (e.facing === 'right' ? e.width - 4 : 2), e.y + 4, 4, e.height - 4);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(e.x + (e.facing === 'right' ? e.width - 2 : 4), e.y + 4, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (e.type === 'BOSS_TITAN') {
    const breath = Math.sin(time * 0.08) * 3;
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(e.x + 8, e.y + 24, e.width - 16, e.height - 24 + breath);
    ctx.fillStyle = '#6d28d9';
    ctx.fillRect(e.x, e.y + 20, 16, 20);
    ctx.fillRect(e.x + e.width - 16, e.y + 20, 16, 20);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(e.x + 16, e.y + 20);
    ctx.lineTo(e.x + 22, e.y + 4);
    ctx.lineTo(e.x + 36, e.y + 12);
    ctx.lineTo(e.x + 50, e.y + 4);
    ctx.lineTo(e.x + 56, e.y + 20);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 10;
    ctx.fillRect(e.x + 22, e.y + 34, 8, 6);
    ctx.fillRect(e.x + 42, e.y + 34, 8, 6);
    ctx.shadowBlur = 0;

    // Boss HP Bar
    const barW = e.width + 24;
    const hpRatio = Math.max(0, e.hp / e.maxHp);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(e.x - 12, e.y - 22, barW, 8);
    ctx.fillStyle = hpRatio > 0.5 ? '#10b981' : hpRatio > 0.25 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(e.x - 12, e.y - 22, barW * hpRatio, 8);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(e.x - 12, e.y - 22, barW, 8);
  }

  // Floating Math Badge above enemy
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(e.mathBadge, e.x + e.width / 2, e.y - 6);

  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, time: number) {
  if (p.invincibleTimer > 0 && Math.floor(time / 4) % 2 === 0) {
    return;
  }

  ctx.save();

  if (p.starPowerTimer > 0) {
    const rainbowHue = (time * 10) % 360;
    ctx.shadowColor = `hsl(${rainbowHue}, 100%, 50%)`;
    ctx.shadowBlur = 16;
  }

  const flip = p.facing === 'left';
  const drawX = flip ? p.x + p.width : p.x;
  const drawY = p.y;

  ctx.translate(drawX, drawY);
  if (flip) ctx.scale(-1, 1);

  // Mario-like Hero Sprite
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(4, 0, 24, 8);
  ctx.fillRect(8, 0, 24, 6);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(10, 2, 5, 4);

  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(8, 8, 18, 10);
  ctx.fillRect(22, 10, 6, 6);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(16, 9, 3, 4);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(14, 14, 12, 4);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(6, 18, 20, 10);

  ctx.fillStyle = '#2563eb';
  ctx.fillRect(8, 22, 16, 10);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(9, 23, 3, 3);
  ctx.fillRect(19, 23, 3, 3);

  const legOffset = p.isGrounded ? Math.sin(p.runFrame * Math.PI) * 4 : 2;
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(6, 32, 7, 6 + legOffset);
  ctx.fillRect(17, 32, 7, 6 - legOffset);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(4, 38 + legOffset, 10, 4);
  ctx.fillRect(16, 38 - legOffset, 10, 4);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(flip ? 2 : 24, 20, 6, 6);

  ctx.restore();
}

function drawProjectile(ctx: CanvasRenderingContext2D, p: Projectile, time: number) {
  ctx.save();

  // 1. Draw Danmaku Trailing Ghost Stream
  if (p.trail && p.trail.length > 0) {
    for (let i = 0; i < p.trail.length; i++) {
      const tr = p.trail[i];
      ctx.globalAlpha = Math.max(0, tr.alpha * 0.6);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const trRadius = p.radius * (1 - i / p.trail.length);
      ctx.arc(tr.x, tr.y, trRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Projectile Main Body with Radiant Danmaku Aura
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 12;

  if (p.shape === 'BEAM' || p.piercing) {
    // High-energy laser beam
    ctx.fillRect(p.x - 16, p.y - 3, 32, 6);
    // White-hot core
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x - 14, p.y - 1.5, 28, 3);
  } else if (p.shape === 'STAR') {
    // Rotating Danmaku Star / Diamond
    ctx.translate(p.x, p.y);
    ctx.rotate(time * 0.15 + (p.age || 0) * 0.05);
    ctx.beginPath();
    const r = p.radius;
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.5, -r * 0.5);
    ctx.lineTo(r, 0);
    ctx.lineTo(r * 0.5, r * 0.5);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.5, r * 0.5);
    ctx.lineTo(-r, 0);
    ctx.lineTo(-r * 0.5, -r * 0.5);
    ctx.closePath();
    ctx.fill();
    // Inner core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Glowing Energy Orb with inner core
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Mathematical Formula Rune inside Danmaku
  if (p.symbol && p.radius >= 6) {
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.symbol, p.x, p.y);
  }

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const pt of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, pt.alpha);

    if (pt.type === 'SHOCKWAVE' && pt.radius !== undefined) {
      // Expanding energy shockwave ring
      ctx.strokeStyle = pt.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (pt.text) {
      // Floating math score / formula feedback
      ctx.fillStyle = pt.color;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(pt.text, pt.x, pt.y);
    } else if (pt.type === 'STAR') {
      // Sparkling star particle
      ctx.fillStyle = pt.color;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 6;
      ctx.fillRect(pt.x - 2, pt.y - 2, pt.size, pt.size);
    } else {
      // Standard particle
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    }

    ctx.restore();
  }
}
