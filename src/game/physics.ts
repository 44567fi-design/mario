import { Player, Block, Enemy, Projectile, CoinItem, Particle, WeaponType, MathQuestion } from '../types/game';
import { sound } from '../utils/audio';
import { WEAPON_DEFINITIONS } from '../data/mathQuestions';

export interface PhysicsUpdateResult {
  triggerQuestion?: MathQuestion;
  stageCleared?: boolean;
  playerDied?: boolean;
}

// AABB collision checker
export function checkAABB(
  r1: { x: number; y: number; width: number; height: number },
  r2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}

export function updatePhysics(
  player: Player,
  blocks: Block[],
  enemies: Enemy[],
  projectiles: Projectile[],
  coins: CoinItem[],
  particles: Particle[],
  keys: Record<string, boolean>,
  levelWidth: number,
  levelHeight: number,
  mathQuestionsMap: Map<string, MathQuestion>,
  currentLevelId: number
): PhysicsUpdateResult {
  const result: PhysicsUpdateResult = {};

  // 1. Process Player Horizontal Movement
  const ACCEL = 0.55;
  const MAX_SPEED = 5.2;
  const FRICTION = 0.82;
  const GRAVITY = 0.48;

  let moveDir = 0;
  if (keys['ArrowLeft'] || keys['KeyA']) moveDir -= 1;
  if (keys['ArrowRight'] || keys['KeyD']) moveDir += 1;

  if (moveDir !== 0) {
    player.vx += moveDir * ACCEL;
    if (Math.abs(player.vx) > MAX_SPEED) {
      player.vx = Math.sign(player.vx) * MAX_SPEED;
    }
    player.facing = moveDir > 0 ? 'right' : 'left';
    player.runFrame = (player.runFrame + 0.2) % 4;
  } else {
    player.vx *= FRICTION;
    if (Math.abs(player.vx) < 0.1) player.vx = 0;
  }

  // Gravity
  player.vy += GRAVITY;
  if (player.vy > 12) player.vy = 12; // Terminal velocity

  // Horizontal collision with solid blocks
  player.x += player.vx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > levelWidth) player.x = levelWidth - player.width;

  for (const b of blocks) {
    if (b.type === 'SPIKE' || b.type === 'LAVA' || b.type === 'PORTAL_FLAG') continue;
    if (checkAABB(player, b)) {
      if (player.vx > 0) {
        player.x = b.x - player.width;
      } else if (player.vx < 0) {
        player.x = b.x + b.width;
      }
      player.vx = 0;
    }
  }

  // Vertical collision with solid blocks
  player.y += player.vy;
  player.isGrounded = false;

  for (const b of blocks) {
    if (b.type === 'PORTAL_FLAG') {
      // Check level clear
      if (checkAABB(player, b)) {
        // If boss level, boss must be defeated
        const bossAlive = enemies.some(e => e.type === 'BOSS_TITAN' && e.hp > 0);
        if (!bossAlive) {
          result.stageCleared = true;
          return result;
        }
      }
      continue;
    }

    if (b.type === 'SPIKE' || b.type === 'LAVA') {
      if (checkAABB(player, b)) {
        hurtPlayer(player, 1, particles);
        player.vy = -7.5;
        // Lava splash particles
        if (b.type === 'LAVA') {
          spawnHitParticles(particles, player.x + player.width / 2, b.y, '#f97316', 10);
        }
      }
      continue;
    }

    if (b.type === 'MATH_GATE' && !b.activated) {
      if (checkAABB(player, b)) {
        // Block player and trigger math question
        player.x = b.x - player.width;
        if (b.mathQuestionId && mathQuestionsMap.has(b.mathQuestionId)) {
          b.activated = true;
          result.triggerQuestion = mathQuestionsMap.get(b.mathQuestionId);
          sound.playQuestionOpen();
          return result;
        }
      }
      continue;
    }

    if (checkAABB(player, b)) {
      if (player.vy > 0) {
        // Landing on top of block
        player.y = b.y - player.height;
        player.vy = 0;
        player.isGrounded = true;
        player.doubleJumpAvailable = true;

        // Spring check
        if (b.type === 'SPRING') {
          player.vy = -14.8;
          sound.playSpring();
          b.bumpOffset = 10;
          particles.push({
            x: b.x + b.width / 2,
            y: b.y,
            vx: 0,
            vy: -2,
            color: '#38bdf8',
            size: 6,
            alpha: 1,
            life: 20,
            maxLife: 20,
            type: 'SHOCKWAVE',
            radius: 4,
            maxRadius: 28
          });
        }
      } else if (player.vy < 0) {
        // Hitting block from below (Mario question block bonk!)
        player.y = b.y + b.height;
        player.vy = 0;

        if (b.type === 'QUESTION' && !b.activated) {
          b.bumpOffset = -8;
          b.activated = true;
          sound.playBlockBump();

          if (b.content === 'MATH_QUESTION' && b.mathQuestionId) {
            const q = mathQuestionsMap.get(b.mathQuestionId);
            if (q) {
              result.triggerQuestion = q;
              sound.playQuestionOpen();
            }
          } else if (b.content === 'STAR') {
            player.starPowerTimer = 600; // 10 seconds
            sound.playCorrect();
            particles.push({
              x: b.x + 20,
              y: b.y - 10,
              vx: 0,
              vy: -2,
              color: '#facc15',
              size: 8,
              alpha: 1,
              life: 30,
              maxLife: 30,
              text: '★STAR!'
            });
          } else if (b.content === 'HEART') {
            player.hp = Math.min(player.maxHp, player.hp + 2);
            sound.playCoin();
            particles.push({
              x: b.x + 20,
              y: b.y - 10,
              vx: 0,
              vy: -2,
              color: '#ef4444',
              size: 8,
              alpha: 1,
              life: 30,
              maxLife: 30,
              text: '+HP'
            });
          } else {
            // Coin
            player.coins += 100;
            player.score += 200;
            sound.playCoin();
            particles.push({
              x: b.x + 20,
              y: b.y - 10,
              vx: 0,
              vy: -3,
              color: '#fbbf24',
              size: 8,
              alpha: 1,
              life: 30,
              maxLife: 30,
              text: '+100 π'
            });
          }
        } else if (b.type === 'BRICK') {
          sound.playBlockBump();
          b.bumpOffset = -4;
        }
      }
    }
  }

  // Update moving platforms & block animations
  for (const b of blocks) {
    if (b.bumpOffset && Math.abs(b.bumpOffset) > 0.1) {
      b.bumpOffset *= 0.75;
    } else {
      b.bumpOffset = 0;
    }

    if (b.moving) {
      b.moving.offset += b.moving.speed;
      if (Math.abs(b.moving.offset) > b.moving.range) {
        b.moving.speed = -b.moving.speed;
      }
      if (b.moving.axis === 'x') {
        b.x = b.moving.base + b.moving.offset;
      } else {
        b.y = b.moving.base + b.moving.offset;
      }
    }
  }

  // Pit death check
  if (player.y > levelHeight + 80) {
    player.hp = 0;
    player.lives -= 1;
    sound.playHurt();
    result.playerDied = true;
    return result;
  }

  // Timers
  if (player.invincibleTimer > 0) player.invincibleTimer--;
  if (player.shootCooldown > 0) player.shootCooldown--;
  if (player.starPowerTimer > 0) {
    player.starPowerTimer--;
    // Sparkle trail
    if (Math.random() < 0.4) {
      particles.push({
        x: player.x + Math.random() * player.width,
        y: player.y + Math.random() * player.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.5,
        color: ['#facc15', '#38bdf8', '#a855f7', '#ec4899'][Math.floor(Math.random() * 4)],
        size: 4,
        alpha: 1,
        life: 25,
        maxLife: 25,
        type: 'STAR'
      });
    }
  }

  // 3. Process Shooting
  const shootPressed = keys['KeyZ'] || keys['KeyJ'] || keys['ControlLeft'];
  if (shootPressed && player.shootCooldown === 0) {
    firePlayerWeapon(player, projectiles);
  }

  // 4. Update Projectiles & Danmaku Motion
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.age = (p.age || 0) + 1;
    p.lifeTime--;
    if (p.lifeTime <= 0) {
      projectiles.splice(i, 1);
      continue;
    }

    // Record trail position for gorgeous danmaku tail effects
    if (!p.trail) p.trail = [];
    p.trail.unshift({ x: p.x, y: p.y, alpha: 0.75 });
    if (p.trail.length > 7) p.trail.pop();
    for (const tr of p.trail) {
      tr.alpha *= 0.82;
    }

    // Sine-wave trajectory for wave danmaku
    if (p.type === 'DANMAKU_WAVE') {
      if (p.baseY === undefined) p.baseY = p.y;
      p.x += p.vx;
      p.baseY += p.vy;
      p.y = p.baseY + Math.sin(p.age * (p.waveFreq || 0.18)) * (p.waveAmp || 22);
    } else if (p.type === 'HOMING_ORB') {
      if (p.isPlayer) {
        // Player homing orb
        let nearestDist = 550;
        let target: Enemy | null = null;
        for (const e of enemies) {
          if (e.hp <= 0) continue;
          const dist = Math.hypot((e.x + e.width / 2) - p.x, (e.y + e.height / 2) - p.y);
          if (dist < nearestDist) {
            nearestDist = dist;
            target = e;
          }
        }
        if (target) {
          const tx = target.x + target.width / 2;
          const ty = target.y + target.height / 2;
          const angle = Math.atan2(ty - p.y, tx - p.x);
          p.vx = Math.cos(angle) * 7.5;
          p.vy = Math.sin(angle) * 7.5;
        }
      } else {
        // Enemy homing orb (Boss singularity missile)
        const tx = player.x + player.width / 2;
        const ty = player.y + player.height / 2;
        const angle = Math.atan2(ty - p.y, tx - p.x);
        p.vx = Math.cos(angle) * 3.5;
        p.vy = Math.sin(angle) * 3.5;
      }
      p.x += p.vx;
      p.y += p.vy;
    } else {
      p.x += p.vx;
      p.y += p.vy;
    }

    // Check collision with solid blocks
    let hitBlock = false;
    for (const b of blocks) {
      if (b.type === 'PORTAL_FLAG' || b.type === 'SPIKE' || b.type === 'LAVA') continue;
      if (
        p.x > b.x &&
        p.x < b.x + b.width &&
        p.y > b.y &&
        p.y < b.y + b.height
      ) {
        // Trigger question block with projectile!
        if (b.type === 'QUESTION' && !b.activated && p.isPlayer) {
          b.activated = true;
          b.bumpOffset = -6;
          sound.playBlockBump();
          if (b.content === 'MATH_QUESTION' && b.mathQuestionId) {
            const q = mathQuestionsMap.get(b.mathQuestionId);
            if (q) {
              result.triggerQuestion = q;
              sound.playQuestionOpen();
            }
          }
        }
        hitBlock = true;
        break;
      }
    }

    if (hitBlock && !p.piercing) {
      spawnHitParticles(particles, p.x, p.y, p.color, 4);
      projectiles.splice(i, 1);
      continue;
    }

    // Player projectile hits enemies
    if (p.isPlayer) {
      for (const enemy of enemies) {
        if (enemy.hp <= 0) continue;
        if (
          p.x > enemy.x &&
          p.x < enemy.x + enemy.width &&
          p.y > enemy.y &&
          p.y < enemy.y + enemy.height
        ) {
          enemy.hp -= p.damage;
          sound.playStomp();
          spawnHitParticles(particles, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, p.color, 8);

          if (enemy.hp <= 0) {
            defeatEnemy(enemy, player, particles);
          }

          if (!p.piercing) {
            projectiles.splice(i, 1);
            break;
          }
        }
      }
    } else {
      // Enemy danmaku projectile hits player
      if (
        p.x > player.x &&
        p.x < player.x + player.width &&
        p.y > player.y &&
        p.y < player.y + player.height
      ) {
        hurtPlayer(player, p.damage, particles);
        projectiles.splice(i, 1);
      }
    }
  }

  // 5. Update Enemies & Danmaku Attack Engines
  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue;

    // Movement & Danmaku by enemy type
    if (enemy.type === 'EXPONENTIAL_BAT') {
      enemy.stateTimer = (enemy.stateTimer ?? 0) + 0.05;
      enemy.x += enemy.vx;
      enemy.y += Math.sin(enemy.stateTimer) * 2;
      if (enemy.x < enemy.patrolMinX || enemy.x > enemy.patrolMaxX) {
        enemy.vx = -enemy.vx;
        enemy.facing = enemy.vx > 0 ? 'right' : 'left';
      }
    } else if (enemy.type === 'MATRIX_DRONE') {
      // Floating Drone with hover bobbing
      enemy.stateTimer = (enemy.stateTimer ?? 0) + 0.04;
      enemy.x += enemy.vx;
      enemy.y += Math.sin(enemy.stateTimer * 2) * 1.2;
      if (enemy.x < enemy.patrolMinX || enemy.x > enemy.patrolMaxX) {
        enemy.vx = -enemy.vx;
        enemy.facing = enemy.vx > 0 ? 'right' : 'left';
      }

      // Drone Danmaku: 3-way spread fan
      enemy.shootTimer--;
      if (enemy.shootTimer <= 0) {
        enemy.shootTimer = 90;
        const baseAng = Math.atan2(
          (player.y + player.height / 2) - (enemy.y + enemy.height / 2),
          (player.x + player.width / 2) - (enemy.x + enemy.width / 2)
        );
        [-0.32, 0, 0.32].forEach((offset, idx) => {
          projectiles.push({
            id: `drn_${Date.now()}_${idx}`,
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            vx: Math.cos(baseAng + offset) * 4.2,
            vy: Math.sin(baseAng + offset) * 4.2,
            radius: 6,
            damage: 1,
            isPlayer: false,
            type: 'ENEMY_BULLET',
            lifeTime: 160,
            color: '#10b981',
            symbol: ['A', 'v', 'λ'][idx],
            shape: 'DIAMOND'
          });
        });
      }
    } else if (enemy.type === 'PROBABILITY_GOLEM') {
      // Heavy Golem that fires 8-way ring danmaku
      enemy.x += enemy.vx;
      if (enemy.x < enemy.patrolMinX || enemy.x > enemy.patrolMaxX) {
        enemy.vx = -enemy.vx;
        enemy.facing = enemy.vx > 0 ? 'right' : 'left';
      }

      enemy.shootTimer--;
      if (enemy.shootTimer <= 0) {
        enemy.shootTimer = 110;
        // Shockwave effect
        particles.push({
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height,
          vx: 0,
          vy: 0,
          color: '#f97316',
          size: 6,
          alpha: 1,
          life: 25,
          maxLife: 25,
          type: 'SHOCKWAVE',
          radius: 6,
          maxRadius: 40
        });

        // 8-way Ring Danmaku burst!
        const runes = ['P', 'C', '!', 'Ω', 'E', 'X', 'n', 'k'];
        for (let k = 0; k < 8; k++) {
          const ang = (Math.PI * 2 * k) / 8;
          projectiles.push({
            id: `gol_${Date.now()}_${k}`,
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            vx: Math.cos(ang) * 3.6,
            vy: Math.sin(ang) * 3.6,
            radius: 7,
            damage: 1,
            isPlayer: false,
            type: 'DANMAKU_RING',
            lifeTime: 170,
            color: '#f97316',
            symbol: runes[k],
            shape: 'STAR'
          });
        }
      }
    } else if (enemy.type === 'CALCULUS_WIZARD') {
      // Wizard fires undulating wave bullets
      enemy.shootTimer--;
      if (enemy.shootTimer <= 0) {
        enemy.shootTimer = 95;
        const dir = player.x < enemy.x ? -1 : 1;
        // Fire dual wave bullets in opposite phases
        [1, -1].forEach((phase, idx) => {
          projectiles.push({
            id: `wiz_${Date.now()}_${idx}`,
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            vx: dir * 4.0,
            vy: 0,
            baseY: enemy.y + enemy.height / 2,
            waveAmp: 24 * phase,
            waveFreq: 0.16,
            radius: 6,
            damage: 1,
            isPlayer: false,
            type: 'DANMAKU_WAVE',
            lifeTime: 180,
            color: '#c084fc',
            symbol: '∫',
            shape: 'ORB'
          });
        });
      }
    } else if (enemy.type === 'BOSS_TITAN') {
      // FINAL BOSS TITAN MULTI-PHASE BULLET HELL
      enemy.stateTimer = (enemy.stateTimer ?? 0) + 1;
      enemy.x += enemy.vx;
      if (enemy.x < enemy.patrolMinX || enemy.x > enemy.patrolMaxX) {
        enemy.vx = -enemy.vx;
        enemy.facing = enemy.vx > 0 ? 'right' : 'left';
      }

      // Jump periodically
      if (enemy.stateTimer % 160 === 0) {
        enemy.vy = -8.5;
      }
      enemy.vy = (enemy.vy ?? 0) + GRAVITY;
      enemy.y += enemy.vy;
      if (enemy.y > 412) {
        enemy.y = 412;
        enemy.vy = 0;
      }

      const hpRatio = enemy.hp / enemy.maxHp;
      enemy.shootTimer--;

      if (enemy.shootTimer <= 0) {
        if (hpRatio > 0.66) {
          // --- PHASE 1: Aimed 5-Way Fan Barrage ---
          enemy.shootTimer = 85;
          const baseAng = Math.atan2(
            (player.y + player.height / 2) - (enemy.y + 35),
            (player.x + player.width / 2) - (enemy.x + 35)
          );
          [-0.4, -0.2, 0, 0.2, 0.4].forEach((angOff, k) => {
            projectiles.push({
              id: `boss1_${Date.now()}_${k}`,
              x: enemy.x + 35,
              y: enemy.y + 35,
              vx: Math.cos(baseAng + angOff) * 4.6,
              vy: Math.sin(baseAng + angOff) * 4.6,
              radius: 7,
              damage: 1,
              isPlayer: false,
              type: 'ENEMY_BULLET',
              lifeTime: 180,
              color: '#38bdf8',
              symbol: ['lim', 'dx', 'f\'', '∫', '∞'][k],
              shape: 'ORB'
            });
          });
        } else if (hpRatio > 0.33) {
          // --- PHASE 2: Rotating Spiral Danmaku Vortex ---
          enemy.shootTimer = 45;
          enemy.danmakuAngle = (enemy.danmakuAngle ?? 0) + 0.38;
          // Emit 3 spiral arms simultaneously
          for (let arm = 0; arm < 3; arm++) {
            const ang = enemy.danmakuAngle + (Math.PI * 2 * arm) / 3;
            projectiles.push({
              id: `boss2_${Date.now()}_${arm}`,
              x: enemy.x + 35,
              y: enemy.y + 35,
              vx: Math.cos(ang) * 4.2,
              vy: Math.sin(ang) * 4.2,
              radius: 8,
              damage: 1,
              isPlayer: false,
              type: 'DANMAKU_SPIRAL',
              lifeTime: 200,
              color: '#a855f7',
              symbol: '🌀',
              shape: 'STAR'
            });
          }
        } else {
          // --- PHASE 3: ENRAGED! 12-Way Nova Burst + Homing Singularity Orbs ---
          enemy.shootTimer = 55;
          // Shockwave
          particles.push({
            x: enemy.x + 35,
            y: enemy.y + 35,
            vx: 0,
            vy: 0,
            color: '#ef4444',
            size: 8,
            alpha: 1,
            life: 30,
            maxLife: 30,
            type: 'SHOCKWAVE',
            radius: 10,
            maxRadius: 65
          });

          // 12-Way Ring
          for (let k = 0; k < 12; k++) {
            const ang = (Math.PI * 2 * k) / 12 + (enemy.stateTimer * 0.05);
            projectiles.push({
              id: `boss3_${Date.now()}_${k}`,
              x: enemy.x + 35,
              y: enemy.y + 35,
              vx: Math.cos(ang) * 4.0,
              vy: Math.sin(ang) * 4.0,
              radius: 8,
              damage: 1,
              isPlayer: false,
              type: 'DANMAKU_RING',
              lifeTime: 180,
              color: '#ef4444',
              symbol: '∞',
              shape: 'STAR'
            });
          }

          // Slow homing singularity orb
          if (enemy.stateTimer % 110 === 0) {
            projectiles.push({
              id: `singularity_${Date.now()}`,
              x: enemy.x + 35,
              y: enemy.y + 35,
              vx: 0,
              vy: 0,
              radius: 12,
              damage: 2,
              isPlayer: false,
              type: 'HOMING_ORB',
              lifeTime: 260,
              color: '#fbbf24',
              symbol: 'Ω',
              shape: 'ORB'
            });
          }
        }
      }
    } else {
      // Standard ground walkers (POLYNOMIAL_SLIME, TRIG_TURTLE, VECTOR_HEDGEHOG)
      enemy.x += enemy.vx;
      if (enemy.x < enemy.patrolMinX || enemy.x > enemy.patrolMaxX) {
        enemy.vx = -enemy.vx;
        enemy.facing = enemy.vx > 0 ? 'right' : 'left';
      }
    }

    // Player vs Enemy collision
    if (checkAABB(player, enemy)) {
      if (player.starPowerTimer > 0) {
        // Star power obliterates enemy!
        enemy.hp = 0;
        sound.playStomp();
        defeatEnemy(enemy, player, particles);
        continue;
      }

      // Stomp check: player is falling and player's feet are above enemy's middle
      const playerFeet = player.y + player.height;
      const isStomp = player.vy > 0 && playerFeet <= enemy.y + enemy.height * 0.5;

      if (isStomp) {
        if (enemy.type === 'VECTOR_HEDGEHOG') {
          // Cannot stomp spike hedgehog!
          hurtPlayer(player, 1, particles);
          player.vy = -6;
        } else {
          // Successful stomp!
          player.vy = -9.2; // Stomp bounce
          sound.playStomp();
          enemy.hp -= 1;
          spawnHitParticles(particles, enemy.x + enemy.width / 2, enemy.y, '#f59e0b', 8);

          if (enemy.hp <= 0) {
            defeatEnemy(enemy, player, particles);
          }
        }
      } else {
        // Player takes contact damage
        hurtPlayer(player, 1, particles);
      }
    }
  }

  // 6. Coins Pickup
  for (const c of coins) {
    if (c.collected) continue;
    c.sparkleFrame = (c.sparkleFrame + 1) % 60;
    if (checkAABB(player, c)) {
      c.collected = true;
      player.coins += c.value;
      player.score += c.value * 2;
      sound.playCoin();
      particles.push({
        x: c.x,
        y: c.y - 12,
        vx: 0,
        vy: -2,
        color: '#facc15',
        size: 7,
        alpha: 1,
        life: 30,
        maxLife: 30,
        text: `+${c.symbol}`
      });
    }
  }

  // 7. Update Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life--;
    pt.alpha = pt.life / pt.maxLife;

    if (pt.type === 'SHOCKWAVE' && pt.radius !== undefined && pt.maxRadius !== undefined) {
      pt.radius += (pt.maxRadius - pt.radius) * 0.15;
    }

    if (pt.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Check death
  if (player.hp <= 0) {
    player.lives -= 1;
    result.playerDied = true;
  }

  return result;
}

function firePlayerWeapon(player: Player, projectiles: Projectile[]) {
  const dir = player.facing === 'right' ? 1 : -1;
  const startX = player.x + (player.facing === 'right' ? player.width + 4 : -12);
  const startY = player.y + player.height / 2 - 4;
  const wep = WEAPON_DEFINITIONS[player.weapon];

  player.shootCooldown = wep.cooldown;
  sound.playShoot(player.weapon);

  if (player.weapon === 'TRIPLE_SPREAD') {
    // 3 bullets: angled up, straight, angled down
    [-0.26, 0, 0.26].forEach((ang, idx) => {
      projectiles.push({
        id: `p_${Date.now()}_${idx}`,
        x: startX,
        y: startY,
        vx: Math.cos(ang) * wep.speed * dir,
        vy: Math.sin(ang) * wep.speed,
        radius: 6,
        damage: wep.damage,
        isPlayer: true,
        type: player.weapon,
        lifeTime: 70,
        color: wep.color,
        symbol: 'Δ',
        shape: 'STAR'
      });
    });
  } else if (player.weapon === 'PIERCE_LASER') {
    projectiles.push({
      id: `p_${Date.now()}_${Math.random()}`,
      x: startX,
      y: startY,
      vx: wep.speed * dir,
      vy: 0,
      radius: 7,
      damage: wep.damage,
      isPlayer: true,
      type: player.weapon,
      lifeTime: 80,
      piercing: true,
      color: wep.color,
      symbol: '∫',
      shape: 'BEAM'
    });
  } else if (player.weapon === 'HOMING_ORB') {
    projectiles.push({
      id: `p_${Date.now()}_${Math.random()}`,
      x: startX,
      y: startY,
      vx: 6 * dir,
      vy: (Math.random() - 0.5) * 3,
      radius: 6,
      damage: wep.damage,
      isPlayer: true,
      type: player.weapon,
      lifeTime: 120,
      color: wep.color,
      symbol: 'v⃗',
      shape: 'ORB'
    });
  } else {
    projectiles.push({
      id: `p_${Date.now()}_${Math.random()}`,
      x: startX,
      y: startY,
      vx: wep.speed * dir,
      vy: 0,
      radius: 5.5,
      damage: wep.damage,
      isPlayer: true,
      type: player.weapon,
      lifeTime: 75,
      color: wep.color,
      symbol: 'Σ',
      shape: 'ORB'
    });
  }
}

function hurtPlayer(player: Player, damage: number, particles: Particle[]) {
  if (player.invincibleTimer > 0 || player.starPowerTimer > 0) return;
  player.hp = Math.max(0, player.hp - damage);
  player.invincibleTimer = 90; // 1.5s invulnerability frames
  sound.playHurt();

  particles.push({
    x: player.x + player.width / 2,
    y: player.y,
    vx: 0,
    vy: -2,
    color: '#ef4444',
    size: 7,
    alpha: 1,
    life: 30,
    maxLife: 30,
    text: '-1 HP'
  });
}

function defeatEnemy(enemy: Enemy, player: Player, particles: Particle[]) {
  player.score += enemy.type === 'BOSS_TITAN' ? 5000 : 300;
  spawnHitParticles(particles, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#38bdf8', 14);

  // Shockwave ring on defeat
  particles.push({
    x: enemy.x + enemy.width / 2,
    y: enemy.y + enemy.height / 2,
    vx: 0,
    vy: 0,
    color: '#38bdf8',
    size: 4,
    alpha: 1,
    life: 25,
    maxLife: 25,
    type: 'SHOCKWAVE',
    radius: 4,
    maxRadius: 50
  });

  particles.push({
    x: enemy.x + enemy.width / 2,
    y: enemy.y - 10,
    vx: 0,
    vy: -2,
    color: '#34d399',
    size: 7,
    alpha: 1,
    life: 35,
    maxLife: 35,
    text: enemy.type === 'BOSS_TITAN' ? '奇異點泰坦擊破! +5000' : `+300 [${enemy.mathBadge}]`
  });
}

function spawnHitParticles(particles: Particle[], x: number, y: number, color: string, count: number = 8) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 1.5 + Math.random() * 3.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      color,
      size: 3 + Math.random() * 4,
      alpha: 1,
      life: 20 + Math.floor(Math.random() * 15),
      maxLife: 35
    });
  }
}
