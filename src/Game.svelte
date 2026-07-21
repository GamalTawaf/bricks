<script>
  import { onMount } from 'svelte'
  import {
    createPaddle,
    createBall,
    circleRectCollision,
    bounceBallOffRect,
    rowReachedLine,
  } from './lib/game/entities.js'
  import { createClassicWave, classicBallSpeed } from './lib/game/classic.js'
  import { createEndlessRow, endlessDifficulty, randomSpawnInterval } from './lib/game/endless.js'

  let { mode, onGameOver, onExit } = $props()

  const WIDTH = 480
  const HEIGHT = 640
  const PADDLE_Y = HEIGHT - 40
  const MAX_BOUNCE_ANGLE = Math.PI / 3
  const ENDLESS_BALL_SPEED = 300

  let score = $state(0)
  let lives = $state(3)
  let wave = $state(1)
  let paused = $state(false)
  let launched = $state(false)

  let canvasEl
  let ctx
  let paddle
  let ball
  let bricks = []
  let keys = { left: false, right: false }
  let animationId
  let lastTime
  let running = true
  let elapsed = 0
  let spawnTimer = 0

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function brickColor(brick) {
    if (brick.maxHits >= 2) return brick.hits >= 2 ? '#f97316' : '#fbbf24'
    return '#4ade80'
  }

  function currentBallSpeed() {
    return mode === 'classic' ? classicBallSpeed(wave) : ENDLESS_BALL_SPEED
  }

  function spawnBall(speed) {
    ball = createBall(WIDTH, HEIGHT, speed)
    launched = false
  }

  function launchBall() {
    if (launched || paused || !running) return
    launched = true
  }

  function togglePause() {
    if (!running) return
    paused = !paused
  }

  function updateClassic() {
    if (bricks.every((brick) => !brick.alive)) {
      wave += 1
      bricks = createClassicWave(WIDTH, wave)
      spawnBall(classicBallSpeed(wave))
    }
  }

  function updateEndless(dt) {
    elapsed += dt
    spawnTimer -= dt
    const difficulty = endlessDifficulty(elapsed)

    for (const brick of bricks) {
      if (brick.alive) brick.y += difficulty.driftSpeed * dt
    }

    if (spawnTimer <= 0) {
      bricks.push(...createEndlessRow(WIDTH))
      spawnTimer = randomSpawnInterval()
    }

    bricks = bricks.filter((brick) => brick.alive)

    if (rowReachedLine(bricks, PADDLE_Y)) {
      endGame()
    }
  }

  function endGame() {
    running = false
    onGameOver(score)
  }

  function update(dt) {
    if (keys.left) paddle.x -= paddle.speed * dt
    if (keys.right) paddle.x += paddle.speed * dt
    paddle.x = clamp(paddle.x, 0, WIDTH - paddle.width)

    if (!launched) {
      ball.x = paddle.x + paddle.width / 2
      ball.y = PADDLE_Y - ball.radius
    } else {
      ball.x += ball.dx * dt
      ball.y += ball.dy * dt

      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius
        ball.dx *= -1
      }
      if (ball.x + ball.radius > WIDTH) {
        ball.x = WIDTH - ball.radius
        ball.dx *= -1
      }
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius
        ball.dy *= -1
      }

      const paddleRect = { x: paddle.x, y: PADDLE_Y, width: paddle.width, height: paddle.height }
      if (ball.dy > 0 && circleRectCollision(ball, paddleRect)) {
        const speed = Math.hypot(ball.dx, ball.dy)
        const hitPos = clamp((ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2), -1, 1)
        const angle = hitPos * MAX_BOUNCE_ANGLE
        ball.dx = speed * Math.sin(angle)
        ball.dy = -Math.abs(speed * Math.cos(angle))
        ball.y = PADDLE_Y - ball.radius
      }

      for (const brick of bricks) {
        if (!brick.alive) continue
        if (circleRectCollision(ball, brick)) {
          bounceBallOffRect(ball, brick)
          brick.hits -= 1
          score += 10
          if (brick.hits <= 0) {
            brick.alive = false
            score += 10
          }
          break
        }
      }
    }

    if (mode === 'classic') updateClassic()
    else updateEndless(dt)

    if (!running) return

    if (launched && ball.y - ball.radius > HEIGHT) {
      lives -= 1
      if (lives <= 0) {
        endGame()
        return
      }
      spawnBall(currentBallSpeed())
    }
  }

  function draw() {
    ctx.fillStyle = '#1c1d27'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    for (const brick of bricks) {
      if (!brick.alive) continue
      ctx.fillStyle = brickColor(brick)
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
    }

    ctx.fillStyle = '#6c5ce7'
    ctx.fillRect(paddle.x, PADDLE_Y, paddle.width, paddle.height)

    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#e8e8ef'
    ctx.fill()
  }

  function loop(timestamp) {
    if (!running) return
    if (paused) {
      lastTime = timestamp
      animationId = requestAnimationFrame(loop)
      return
    }
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
    lastTime = timestamp
    update(dt)
    if (!running) return
    draw()
    animationId = requestAnimationFrame(loop)
  }

  onMount(() => {
    ctx = canvasEl.getContext('2d')
    paddle = createPaddle(WIDTH)

    if (mode === 'classic') {
      bricks = createClassicWave(WIDTH, wave)
      spawnBall(classicBallSpeed(wave))
    } else {
      bricks = createEndlessRow(WIDTH)
      spawnTimer = randomSpawnInterval()
      spawnBall(ENDLESS_BALL_SPEED)
    }

    function handlePointerMove(event) {
      const rect = canvasEl.getBoundingClientRect()
      const scaleX = WIDTH / rect.width
      const x = (event.clientX - rect.left) * scaleX
      paddle.x = clamp(x - paddle.width / 2, 0, WIDTH - paddle.width)
    }

    function handlePointerDown() {
      launchBall()
    }

    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') keys.left = true
      if (event.key === 'ArrowRight') keys.right = true
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault()
        launchBall()
      }
      if (event.key === 'Escape') togglePause()
    }

    function handleKeyUp(event) {
      if (event.key === 'ArrowLeft') keys.left = false
      if (event.key === 'ArrowRight') keys.right = false
    }

    canvasEl.addEventListener('pointermove', handlePointerMove)
    canvasEl.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    lastTime = performance.now()
    animationId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationId)
      canvasEl.removeEventListener('pointermove', handlePointerMove)
      canvasEl.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  })
</script>

<div class="game-wrap">
  <div class="toolbar">
    <button class="secondary" onclick={onExit}>Exit</button>
    <button class="secondary" onclick={togglePause}>{paused ? 'Resume' : 'Pause'}</button>
  </div>
  <canvas bind:this={canvasEl} width={WIDTH} height={HEIGHT}></canvas>
  <div class="hud">
    <span>Score: {score}</span>
    {#if mode === 'classic'}<span>Wave: {wave}</span>{/if}
    <span>Lives: {lives}</span>
  </div>
  {#if !launched && !paused}
    <div class="launch-hint">Click, tap, or press Space to launch</div>
  {/if}
  {#if paused}
    <div class="pause-overlay">Paused</div>
  {/if}
</div>

<style>
  .game-wrap {
    position: relative;
    width: 100%;
    max-width: 480px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .toolbar button {
    padding: 6px 14px;
    font-size: 13px;
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
    touch-action: none;
    border-radius: 12px;
  }

  .hud {
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    font-size: 14px;
    color: #e8e8ef;
    pointer-events: none;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  .launch-hint {
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 13px;
    color: #e8e8ef;
    pointer-events: none;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  .pause-overlay {
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #e8e8ef;
    background: rgba(20, 21, 28, 0.85);
    border-radius: 12px;
  }
</style>
